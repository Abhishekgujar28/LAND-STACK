/**
 * Land Stack — Jurisdiction Authorization Middleware
 * 
 * Validates that the resource being accessed belongs to the officer's
 * assigned jurisdiction. This is a critical data-isolation boundary.
 * 
 * An SRO in Pune must NOT be able to see parcels in Nagpur.
 * A Tehsildar in Haveli must NOT approve mutations in Baramati.
 * 
 * Must be used AFTER requireAuth.
 */

import { Errors } from '../core/errors.js';
import { UserTypes } from '../core/permissions.js';

/**
 * Validate that the officer has jurisdiction over the resource.
 * 
 * @param {Function} getResourceJurisdiction - async (req) => { stateCode, districtCode, tehsilCode, villageCode }
 *   A function that extracts the jurisdiction of the target resource from the request.
 *   For parcel endpoints, this might query the parcel's jurisdiction.
 *   For mutation endpoints, this might query the mutation's tehsil.
 */
export function requireJurisdiction(getResourceJurisdiction) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(Errors.unauthenticated());
      }

      // Citizens don't have jurisdiction checks — they access their own resources
      // (ownership is checked by requireResourceAccess, not jurisdiction)
      if (req.user.userType === UserTypes.CITIZEN) {
        return next();
      }

      const officerJurisdiction = req.user.jurisdiction;
      if (!officerJurisdiction) {
        return next(Errors.forbiddenJurisdiction('Officer has no assigned jurisdiction.'));
      }

      // Get the target resource's jurisdiction
      const resourceJurisdiction = await getResourceJurisdiction(req);
      if (!resourceJurisdiction) {
        // If we can't determine jurisdiction, deny access as a safe default
        return next(Errors.forbiddenJurisdiction('Unable to determine resource jurisdiction.'));
      }

      // Hierarchical check: officer must match at their assigned level or above
      const matches = _jurisdictionContains(officerJurisdiction, resourceJurisdiction);

      if (!matches) {
        return next(Errors.forbiddenJurisdiction(
          'You are not authorized to access resources in this jurisdiction.'
        ));
      }

      // Also validate against assignments for multi-jurisdiction officers
      if (req.user.assignments && req.user.assignments.length > 0) {
        const hasAssignment = req.user.assignments.some(a =>
          _jurisdictionContains(_assignmentToJurisdiction(a), resourceJurisdiction)
        );

        if (!hasAssignment) {
          return next(Errors.forbiddenJurisdiction(
            'No active assignment covers this jurisdiction.'
          ));
        }
      }

      next();
    } catch (err) {
      console.error('[Jurisdiction Middleware] Error:', err.message);
      return next(Errors.forbiddenJurisdiction());
    }
  };
}

/**
 * Check if an officer's jurisdiction contains/covers a resource's jurisdiction.
 * 
 * The hierarchy is: State > District > Tehsil > Village
 * A state-level officer covers all districts within that state.
 * A district-level officer covers all tehsils within that district.
 * etc.
 */
function _jurisdictionContains(officer, resource) {
  // If officer has state-level assignment
  if (officer.stateCode && !officer.districtCode) {
    return officer.stateCode === resource.stateCode;
  }

  // If officer has district-level assignment
  if (officer.districtCode && !officer.tehsilCode) {
    return officer.districtCode === resource.districtCode;
  }

  // If officer has tehsil-level assignment
  if (officer.tehsilCode && !officer.villageCode) {
    return officer.tehsilCode === resource.tehsilCode;
  }

  // If officer has village-level assignment
  if (officer.villageCode) {
    return officer.villageCode === resource.villageCode;
  }

  // National-level officers (no specific state) can access everything
  if (!officer.stateCode && !officer.districtCode && !officer.tehsilCode) {
    return true;
  }

  return false;
}

function _assignmentToJurisdiction(assignment) {
  return {
    stateCode: assignment.state_code,
    districtCode: assignment.district_code,
    tehsilCode: assignment.tehsil_code,
    villageCode: assignment.village_code,
  };
}
