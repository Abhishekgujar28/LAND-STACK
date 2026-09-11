# Phase 4 — Workflows & Events

**Goal**: Implement the 12-state mutation lifecycle engine, event-driven triggers (registration → mutation), SLA tracking, and the notification pipeline that keeps citizens and officers informed.

**Why Now**: Workflows are the heart of government operations. After we know who the user is (Phase 2) and which parcel we're talking about (Phase 3), the next question is: "What's happening with this parcel's legal status?" — and that's workflows.

---

## What Gets Built

### 12-State Mutation Workflow Engine
The mutation lifecycle is the most important workflow in Indian land governance. When a property is sold and registered, the ownership in the Record of Rights must be updated (mutated). This is a statutory process with multiple steps, each involving different government officers.

The 12 states of the mutation lifecycle:
1. **INITIATED** — Registration event received from SRO / NGDRS; mutation case created
2. **DOCUMENTS_PENDING** — Waiting for supporting documents or party confirmations
3. **VERIFICATION_ASSIGNED** — Survey/GIS Officer assigned for spatial boundary and field verification
4. **FIELD_VERIFIED** — Survey/GIS Officer completed spatial analysis, boundary overlay, and site recommendation
5. **REVIEWED** — CRO/Tehsildar (rural) or ULB Officer (urban) reviewed case dossier and spatial report
6. **NOTICE_PERIOD** — Mandatory public notice period (typically 15–30 days)
7. **OBJECTION_RECEIVED** — If anyone objects during notice period
8. **HEARING_SCHEDULED** — CRO/Tehsildar schedules formal hearing for objected rural cases
9. **APPROVED** — CRO/Tehsildar sanctions rural mutation (or ULB Officer for urban) with statutory digital order (requires MFA)
10. **REJECTED** — Sanction authority rejects mutation with recorded grounds
11. **ROR_UPDATE_TRIGGERED** — RoR / Property Tax update event published to State system
12. **CLOSED** — Mutation complete; RoR / Urban property register reflects new ownership

The workflow engine manages state transitions, validates that only authorized roles can trigger each transition (e.g., only CRO_TEHSILDAR can transition rural cases to APPROVED), and records every transition in the audit trail.

### Event-Driven Triggers
- **Registration → Mutation**: When SRO completes registered deed verification (or NGDRS webhook arrives), the system automatically creates a mutation case (state: INITIATED), routes it to the appropriate sanction authority (CRO/Tehsildar for rural, ULB for urban), and assigns spatial verification to the Survey/GIS Officer.
- **Mutation Approval → RoR Update**: When CRO/Tehsildar approves a mutation, an event fires that triggers the RoR update process via State Adapters (or urban property register update).
- **Status Change → Notification**: Every mutation state transition generates a notification event consumed by the notification pipeline.

### SLA Engine
- Each mutation state has a configurable SLA duration (from `state_config`): e.g., spatial verification must complete within 15 days, sanction within 30 days
- SLA timer starts when a case enters a state
- SLA status: GREEN (on track), YELLOW (approaching deadline), RED (breached)
- Automatic escalation: if verification exceeds SLA, the case auto-escalates to CRO/Tehsildar; if sanction exceeds SLA, it escalates to the State Authority governance console

### Notification Pipeline
- SMS notifications to citizens at each mutation state change
- In-app notifications via Supabase Realtime (WebSocket push)
- Officer notifications: new task assigned, SLA approaching, escalation received
- Notification preferences: citizens can configure language and channel preferences

### Supporting Tables
- `mutation_case` — workflow state, assigned officer, SLA deadline, related parcel and deed
- `mutation_timeline` — chronological log of every state transition with actor, timestamp, and notes
- `case_assignment` — links cases to officers with role and jurisdiction context
- `notification` — queued and delivered notifications with status tracking

## Stakeholders Served
- **Citizen**: Tracks mutation status in real-time, receives SMS at each step
- **SRO**: Triggers and forwards mutation workflow from deed registration
- **Survey/GIS Officer**: Receives spatial and boundary verification assignments
- **CRO/Tehsildar**: Reviews rural cases, conducts hearings, sanctions/rejects mutations
- **ULB/Municipal Officer**: Reviews and approves urban property mutations
- **State Authority & DoLR**: Monitors SLA compliance and receives systemic escalations

## Key Decisions
- **State machine, not free-form**: Mutation states can only transition along defined edges. No skipping steps, no going backwards without explicit "return for clarification" transitions.
- **SLA from state_config**: Different states have different citizen charter timelines. The SLA engine reads durations from state_config, not hardcoded values.
- **Supabase Realtime for push**: Instead of polling for mutation status changes, the frontend subscribes to Realtime and gets instant updates.

## Dependencies
- Phase 2 (Auth) — role enforcement for state transitions
- Phase 3 (Parcel Core) — mutation cases link to parcels via ULPIN

## Exit Criteria
- A simulated NGDRS webhook creates a mutation case automatically
- The case flows through all 12 states with appropriate role enforcement
- SLA timers calculate and display correctly
- Escalation triggers when SLA is breached
- Citizen receives real-time status updates via Supabase Realtime
- Every state transition is recorded in audit trail

## Risks
- **Webhook reliability**: NGDRS webhooks may not always arrive. Mitigated by periodic polling as fallback and dead-letter queue for failed events.
- **State transition conflicts**: Two officers acting on the same case simultaneously. Mitigated by optimistic locking (version column) on mutation_case.

## References
- [workflows.md](../../docs/workflows.md) — Full workflow documentation (15 workflows)
- [architecture.md](../../docs/architecture.md) Section 7 — Event Architecture
- [phases.md](../../docs/phases.md) Phase 6 — Event Mesh & State Workflow Engine
- [DEPARTMENT_INTEGRATION_MATRIX.md](../../docs/DEPARTMENT_INTEGRATION_MATRIX.md) Section 2.2 — NGDRS integration
