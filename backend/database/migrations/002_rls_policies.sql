-- =====================================================================
-- Migration 002: Row Level Security (RLS) Policies (Consolidated)
-- =====================================================================

-- Helper function to get current officer record
CREATE OR REPLACE FUNCTION get_current_officer()
RETURNS TABLE (
    id VARCHAR(50),
    role VARCHAR(50),
    village_code VARCHAR(20),
    tehsil_code VARCHAR(20),
    district_code VARCHAR(20)
) SECURITY DEFINER STABLE AS $$
BEGIN
    RETURN QUERY
    SELECT o.id, o.role, o.village_code, o.tehsil_code, o.district_code
    FROM government_users o
    WHERE o.auth_user_id = auth.uid() AND o.active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Helper function to get current citizen ID
CREATE OR REPLACE FUNCTION get_current_citizen_id()
RETURNS VARCHAR(50) SECURITY DEFINER STABLE AS $$
DECLARE
    c_id VARCHAR(50);
BEGIN
    SELECT id INTO c_id FROM citizens WHERE auth_user_id = auth.uid();
    RETURN c_id;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- 1. CITIZENS TABLE
-- ---------------------------------------------------------------------
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Citizens can read their own profile"
ON citizens FOR SELECT
TO authenticated
USING (auth.uid() = auth_user_id);

CREATE POLICY "Citizens can update their own profile"
ON citizens FOR UPDATE
TO authenticated
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Officers can view citizens for official duties"
ON citizens FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM government_users WHERE auth_user_id = auth.uid()));

-- ---------------------------------------------------------------------
-- 2. GOVERNMENT_USERS TABLE
-- ---------------------------------------------------------------------
ALTER TABLE government_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view officer directory"
ON government_users FOR SELECT
TO authenticated
USING (active = TRUE);

CREATE POLICY "Officers can update own active context"
ON government_users FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 3. PARCELS TABLE
-- ---------------------------------------------------------------------
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public parcel summary"
ON parcels FOR SELECT
TO anon, authenticated
USING (TRUE);

-- ---------------------------------------------------------------------
-- 4. MUTATIONS TABLE
-- ---------------------------------------------------------------------
ALTER TABLE mutations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Citizens can view their own mutation applications"
ON mutations FOR SELECT
TO authenticated
USING (applicant_id = get_current_citizen_id());

CREATE POLICY "Citizens can initiate mutation applications"
ON mutations FOR INSERT
TO authenticated
WITH CHECK (applicant_id = get_current_citizen_id());

CREATE POLICY "Officers can view mutations in their jurisdiction"
ON mutations FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM get_current_officer() o
        WHERE 
            (o.role = 'TALATHI' AND o.village_code = mutations.village_code)
            OR (o.role = 'TAHSILDAR' AND o.tehsil_code = mutations.tehsil_code)
            OR (o.role IN ('SDO', 'COLLECTOR', 'ADMIN'))
    )
);

CREATE POLICY "Officers can update mutations within their jurisdiction"
ON mutations FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM get_current_officer() o
        WHERE 
            (o.role = 'TALATHI' AND o.village_code = mutations.village_code)
            OR (o.role = 'TAHSILDAR' AND o.tehsil_code = mutations.tehsil_code)
            OR (o.role IN ('SDO', 'COLLECTOR'))
    )
);

-- ---------------------------------------------------------------------
-- 5. APPLICATIONS TABLE
-- ---------------------------------------------------------------------
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Citizens can view their own applications"
ON applications FOR SELECT
TO authenticated
USING (citizen_id = get_current_citizen_id());

CREATE POLICY "Citizens can submit applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (citizen_id = get_current_citizen_id());

CREATE POLICY "Officers can view all applications"
ON applications FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM government_users WHERE auth_user_id = auth.uid()));

-- ---------------------------------------------------------------------
-- 6. NOTIFICATIONS TABLE
-- ---------------------------------------------------------------------
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = get_current_citizen_id() OR user_id = (SELECT id FROM government_users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can mark their own notifications as read"
ON notifications FOR UPDATE
TO authenticated
USING (user_id = get_current_citizen_id() OR user_id = (SELECT id FROM government_users WHERE auth_user_id = auth.uid()));

-- ---------------------------------------------------------------------
-- 7. AUDIT EVENTS TABLE (APPEND-ONLY)
-- ---------------------------------------------------------------------
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Officers can view audit logs"
ON audit_events FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM government_users WHERE auth_user_id = auth.uid()));

CREATE POLICY "System and users can insert audit logs"
ON audit_events FOR INSERT
TO authenticated
WITH CHECK (TRUE);

-- STRICT ENFORCEMENT: Never allow updates or deletes on audit events
REVOKE UPDATE, DELETE, TRUNCATE ON audit_events FROM authenticated, anon, public;
