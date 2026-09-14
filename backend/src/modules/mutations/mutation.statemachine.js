/**
 * Land Stack — Mutation State Machine
 * 
 * The 12-state workflow for land mutations.
 * No arbitrary jumps. Every transition is validated.
 */

export const MutationStates = Object.freeze({
  INITIATED:              'INITIATED',
  DOCUMENTS_PENDING:      'DOCUMENTS_PENDING',
  VERIFICATION_ASSIGNED:  'VERIFICATION_ASSIGNED',
  FIELD_VERIFIED:         'FIELD_VERIFIED',
  REVIEWED:               'REVIEWED',
  NOTICE_PERIOD:          'NOTICE_PERIOD',
  OBJECTION_RECEIVED:     'OBJECTION_RECEIVED',
  HEARING_SCHEDULED:      'HEARING_SCHEDULED',
  APPROVED:               'APPROVED',
  REJECTED:               'REJECTED',
  ROR_UPDATE_TRIGGERED:   'ROR_UPDATE_TRIGGERED',
  CLOSED:                 'CLOSED',
});

/**
 * Valid state transitions: current_state → [allowed_next_states]
 * 
 * Each transition maps to an action endpoint and required permission.
 */
export const VALID_TRANSITIONS = Object.freeze({
  [MutationStates.INITIATED]: [
    MutationStates.DOCUMENTS_PENDING,
    MutationStates.VERIFICATION_ASSIGNED,
    MutationStates.REJECTED, // Can reject immediately if invalid
  ],
  [MutationStates.DOCUMENTS_PENDING]: [
    MutationStates.VERIFICATION_ASSIGNED,
    MutationStates.REJECTED,
  ],
  [MutationStates.VERIFICATION_ASSIGNED]: [
    MutationStates.FIELD_VERIFIED,
    MutationStates.DOCUMENTS_PENDING, // Return for more documents
  ],
  [MutationStates.FIELD_VERIFIED]: [
    MutationStates.REVIEWED,
    MutationStates.VERIFICATION_ASSIGNED, // Send back for re-verification
  ],
  [MutationStates.REVIEWED]: [
    MutationStates.NOTICE_PERIOD,
    MutationStates.APPROVED,  // Fast-track for uncontested cases
    MutationStates.REJECTED,
    MutationStates.DOCUMENTS_PENDING, // Return for clarification
  ],
  [MutationStates.NOTICE_PERIOD]: [
    MutationStates.OBJECTION_RECEIVED,
    MutationStates.APPROVED, // No objections after notice period
  ],
  [MutationStates.OBJECTION_RECEIVED]: [
    MutationStates.HEARING_SCHEDULED,
    MutationStates.REJECTED,
  ],
  [MutationStates.HEARING_SCHEDULED]: [
    MutationStates.APPROVED,
    MutationStates.REJECTED,
    MutationStates.NOTICE_PERIOD, // Reschedule
  ],
  [MutationStates.APPROVED]: [
    MutationStates.ROR_UPDATE_TRIGGERED,
  ],
  [MutationStates.REJECTED]: [
    MutationStates.CLOSED,
  ],
  [MutationStates.ROR_UPDATE_TRIGGERED]: [
    MutationStates.CLOSED,
  ],
  [MutationStates.CLOSED]: [], // Terminal state
});

/**
 * Actions map to state transitions and required permissions
 */
export const MutationActions = Object.freeze({
  ASSIGN_VERIFICATION:    { from: [MutationStates.INITIATED, MutationStates.DOCUMENTS_PENDING], to: MutationStates.VERIFICATION_ASSIGNED, permission: 'mutation.review' },
  SUBMIT_FIELD_VERIFY:    { from: [MutationStates.VERIFICATION_ASSIGNED], to: MutationStates.FIELD_VERIFIED, permission: 'mutation.field_verify' },
  REVIEW:                 { from: [MutationStates.FIELD_VERIFIED], to: MutationStates.REVIEWED, permission: 'mutation.review' },
  START_NOTICE:           { from: [MutationStates.REVIEWED], to: MutationStates.NOTICE_PERIOD, permission: 'mutation.notice' },
  RECORD_OBJECTION:       { from: [MutationStates.NOTICE_PERIOD], to: MutationStates.OBJECTION_RECEIVED, permission: 'mutation.review' },
  SCHEDULE_HEARING:       { from: [MutationStates.OBJECTION_RECEIVED], to: MutationStates.HEARING_SCHEDULED, permission: 'mutation.hearing' },
  APPROVE:                { from: [MutationStates.REVIEWED, MutationStates.NOTICE_PERIOD, MutationStates.HEARING_SCHEDULED], to: MutationStates.APPROVED, permission: 'mutation.approve', requiresMfa: true },
  REJECT:                 { from: [MutationStates.INITIATED, MutationStates.DOCUMENTS_PENDING, MutationStates.REVIEWED, MutationStates.OBJECTION_RECEIVED, MutationStates.HEARING_SCHEDULED], to: MutationStates.REJECTED, permission: 'mutation.reject', requiresMfa: true },
  RETURN_FOR_CLARIFICATION: { from: [MutationStates.REVIEWED, MutationStates.VERIFICATION_ASSIGNED], to: MutationStates.DOCUMENTS_PENDING, permission: 'mutation.return' },
  ISSUE_ORDER:            { from: [MutationStates.APPROVED], to: MutationStates.ROR_UPDATE_TRIGGERED, permission: 'mutation.issue_order' },
  CLOSE:                  { from: [MutationStates.REJECTED, MutationStates.ROR_UPDATE_TRIGGERED], to: MutationStates.CLOSED, permission: 'mutation.review' },
});

/**
 * Validate a state transition
 */
export function isValidTransition(currentState, nextState) {
  const allowed = VALID_TRANSITIONS[currentState];
  if (!allowed) return false;
  return allowed.includes(nextState);
}

/**
 * Get the action definition for a named action
 */
export function getActionDef(actionName) {
  return MutationActions[actionName] || null;
}

/**
 * Validate an action against the current state
 */
export function validateAction(actionName, currentState) {
  const action = MutationActions[actionName];
  if (!action) return { valid: false, reason: `Unknown action: ${actionName}` };
  if (!action.from.includes(currentState)) {
    return {
      valid: false,
      reason: `Action '${actionName}' is not valid in state '${currentState}'. Required states: ${action.from.join(', ')}.`,
    };
  }
  return { valid: true, action };
}
