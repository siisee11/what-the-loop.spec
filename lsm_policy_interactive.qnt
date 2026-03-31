module lsm_policy_interactive {
  var engine_directive: str
  var policy_state: str
  var completion_requested: bool
  var completion_approved: bool
  var blocked_on_input: bool

  action init = all {
    engine_directive' = "continue",
    policy_state' = "active",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = false,
  }

  action turn_requests_continue = all {
    policy_state == "active",
    policy_state' = "active",
    engine_directive' = "continue",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
  }

  action turn_requests_user_input = all {
    policy_state == "active",
    policy_state' = "waiting_user_input",
    engine_directive' = "wait",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = false,
  }

  action user_input_received = all {
    policy_state == "waiting_user_input",
    policy_state' = "active",
    engine_directive' = "continue",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = false,
  }

  action turn_requests_login = all {
    policy_state == "active",
    policy_state' = "waiting_login",
    engine_directive' = "wait",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
  }

  action login_done = all {
    policy_state == "waiting_login",
    policy_state' = "active",
    engine_directive' = "continue",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
  }

  action completion_rejected_missing_input = all {
    policy_state == "active",
    policy_state' = "completion_rejected",
    engine_directive' = "wait",
    completion_requested' = true,
    completion_approved' = false,
    blocked_on_input' = true,
  }

  action completion_rejected = all {
    policy_state == "active",
    policy_state' = "completion_rejected",
    engine_directive' = "continue",
    completion_requested' = true,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
  }

  action recovery_after_rejection = all {
    policy_state == "completion_rejected",
    policy_state' = "active",
    engine_directive' = "continue",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
  }

  action completion_approved_now = all {
    policy_state == "active",
    not(blocked_on_input),
    policy_state' = "completed",
    engine_directive' = "complete",
    completion_requested' = true,
    completion_approved' = true,
    blocked_on_input' = blocked_on_input,
  }

  action policy_failed = all {
    Set("active", "completion_rejected").contains(policy_state),
    policy_state' = "failed",
    engine_directive' = "fail",
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
  }

  action step = any {
    turn_requests_continue,
    turn_requests_user_input,
    user_input_received,
    turn_requests_login,
    login_done,
    completion_rejected_missing_input,
    completion_rejected,
    recovery_after_rejection,
    completion_approved_now,
    policy_failed,
  }

  val validated_completion_only =
    policy_state != "completed" or completion_approved

  val blocked_input_prevents_completion =
    not(blocked_on_input) or policy_state != "completed"

  val waiting_states_use_wait_directive =
    not(Set("waiting_user_input", "waiting_login").contains(policy_state))
      or engine_directive == "wait"

  val valid_state =
    Set(
      "active",
      "waiting_user_input",
      "waiting_login",
      "completion_rejected",
      "completed",
      "failed",
    ).contains(policy_state)
}
