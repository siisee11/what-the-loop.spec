module wtl_policy {
  pure val MAX_ITERATIONS = 4

  var policy_kind: str
  var engine_directive: str

  var policy_state: str
  var completion_requested: bool
  var completion_approved: bool
  var blocked_on_input: bool

  var phase: str
  var iteration: int
  var worktree_ready: bool
  var plan_exists: bool
  var delivery_complete: bool
  var review_complete: bool
  var commit_count: int
  var recovery_pending: bool

  action init_interactive_completion = all {
    policy_kind' = "interactive_completion",
    engine_directive' = "continue",
    policy_state' = "active",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = false,
    phase' = "idle",
    iteration' = 0,
    worktree_ready' = false,
    plan_exists' = false,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = 0,
    recovery_pending' = false,
  }

  action init_phased_delivery = all {
    policy_kind' = "phased_delivery",
    engine_directive' = "continue",
    policy_state' = "active",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = false,
    phase' = "idle",
    iteration' = 0,
    worktree_ready' = false,
    plan_exists' = false,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = 0,
    recovery_pending' = false,
  }

  action init = any {
    init_interactive_completion,
    init_phased_delivery,
  }

  action turn_requests_continue = all {
    policy_kind == "interactive_completion",
    policy_state == "active",
    policy_kind' = policy_kind,
    policy_state' = "active",
    engine_directive' = "continue",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action turn_requests_user_input = all {
    policy_kind == "interactive_completion",
    policy_state == "active",
    policy_kind' = policy_kind,
    policy_state' = "waiting_user_input",
    engine_directive' = "wait",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = false,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action user_input_received = all {
    policy_kind == "interactive_completion",
    policy_state == "waiting_user_input",
    policy_kind' = policy_kind,
    policy_state' = "active",
    engine_directive' = "continue",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = false,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action turn_requests_login = all {
    policy_kind == "interactive_completion",
    policy_state == "active",
    policy_kind' = policy_kind,
    policy_state' = "waiting_login",
    engine_directive' = "wait",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action login_done = all {
    policy_kind == "interactive_completion",
    policy_state == "waiting_login",
    policy_kind' = policy_kind,
    policy_state' = "active",
    engine_directive' = "continue",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action completion_rejected_missing_input = all {
    policy_kind == "interactive_completion",
    policy_state == "active",
    policy_kind' = policy_kind,
    policy_state' = "completion_rejected",
    engine_directive' = "wait",
    completion_requested' = true,
    completion_approved' = false,
    blocked_on_input' = true,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action completion_rejected = all {
    policy_kind == "interactive_completion",
    policy_state == "active",
    policy_kind' = policy_kind,
    policy_state' = "completion_rejected",
    engine_directive' = "continue",
    completion_requested' = true,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action recovery_after_rejection = all {
    policy_kind == "interactive_completion",
    policy_state == "completion_rejected",
    policy_kind' = policy_kind,
    policy_state' = "active",
    engine_directive' = "continue",
    completion_requested' = false,
    completion_approved' = false,
    blocked_on_input' = blocked_on_input,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action completion_approved_now = all {
    policy_kind == "interactive_completion",
    policy_state == "active",
    not(blocked_on_input),
    policy_kind' = policy_kind,
    policy_state' = "completed",
    engine_directive' = "complete",
    completion_requested' = true,
    completion_approved' = true,
    blocked_on_input' = blocked_on_input,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action interactive_policy_failed = all {
    policy_kind == "interactive_completion",
    Set("active", "completion_rejected").contains(policy_state),
    policy_kind' = policy_kind,
    policy_state' = "failed",
    engine_directive' = "fail",
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = phase,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action start_init = all {
    policy_kind == "phased_delivery",
    phase == "idle",
    policy_kind' = policy_kind,
    engine_directive' = "advance_phase",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "init",
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action init_succeeds = all {
    policy_kind == "phased_delivery",
    phase == "init",
    policy_kind' = policy_kind,
    engine_directive' = "advance_phase",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "planning",
    iteration' = iteration,
    worktree_ready' = true,
    plan_exists' = false,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = commit_count,
    recovery_pending' = false,
  }

  action planning_completed = all {
    policy_kind == "phased_delivery",
    phase == "planning",
    worktree_ready,
    policy_kind' = policy_kind,
    engine_directive' = "advance_phase",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "implementing",
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = true,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = commit_count,
    recovery_pending' = false,
  }

  action implementation_continues = all {
    policy_kind == "phased_delivery",
    phase == "implementing",
    plan_exists,
    iteration < MAX_ITERATIONS,
    policy_kind' = policy_kind,
    engine_directive' = "continue",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "implementing",
    iteration' = iteration + 1,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = commit_count + 1,
    recovery_pending' = false,
  }

  action implementation_failed = all {
    policy_kind == "phased_delivery",
    phase == "implementing",
    plan_exists,
    iteration < MAX_ITERATIONS,
    policy_kind' = policy_kind,
    engine_directive' = "retry",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "implementing",
    iteration' = iteration + 1,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = commit_count,
    recovery_pending' = true,
  }

  action implementation_ready_for_review = all {
    policy_kind == "phased_delivery",
    phase == "implementing",
    plan_exists,
    iteration < MAX_ITERATIONS,
    policy_kind' = policy_kind,
    engine_directive' = "advance_phase",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "review",
    iteration' = iteration + 1,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = true,
    review_complete' = false,
    commit_count' = commit_count + 1,
    recovery_pending' = false,
  }

  action phased_exhausted = all {
    policy_kind == "phased_delivery",
    phase == "implementing",
    iteration >= MAX_ITERATIONS,
    policy_kind' = policy_kind,
    engine_directive' = "fail",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "failed",
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action review_completed = all {
    policy_kind == "phased_delivery",
    phase == "review",
    delivery_complete,
    policy_kind' = policy_kind,
    engine_directive' = "complete",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "completed",
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = true,
    commit_count' = commit_count,
    recovery_pending' = false,
  }

  action phased_workflow_failed = all {
    policy_kind == "phased_delivery",
    Set("planning", "review").contains(phase),
    policy_kind' = policy_kind,
    engine_directive' = "fail",
    policy_state' = policy_state,
    completion_requested' = completion_requested,
    completion_approved' = completion_approved,
    blocked_on_input' = blocked_on_input,
    phase' = "failed",
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
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
    interactive_policy_failed,
    start_init,
    init_succeeds,
    planning_completed,
    implementation_continues,
    implementation_failed,
    implementation_ready_for_review,
    phased_exhausted,
    review_completed,
    phased_workflow_failed,
  }

  val valid_kind =
    Set("interactive_completion", "phased_delivery").contains(policy_kind)

  val validated_completion_only =
    policy_kind != "interactive_completion"
      or policy_state != "completed"
      or completion_approved

  val blocked_input_prevents_completion =
    policy_kind != "interactive_completion"
      or not(blocked_on_input)
      or policy_state != "completed"

  val waiting_states_use_wait_directive =
    policy_kind != "interactive_completion"
      or not(Set("waiting_user_input", "waiting_login").contains(policy_state))
      or engine_directive == "wait"

  val phase_order =
    policy_kind != "phased_delivery"
      or (
        (phase != "planning" or worktree_ready)
          and (phase != "implementing" or (worktree_ready and plan_exists))
          and (phase != "review" or (worktree_ready and plan_exists and delivery_complete))
          and (phase != "completed" or (worktree_ready and plan_exists and delivery_complete and review_complete))
      )

  val review_requires_delivery_completion =
    policy_kind != "phased_delivery"
      or phase != "review"
      or delivery_complete

  val terminal_completion_uses_complete_directive =
    policy_kind != "phased_delivery"
      or phase != "completed"
      or engine_directive == "complete"

  val valid_interactive_state =
    policy_kind != "interactive_completion"
      or Set(
        "active",
        "waiting_user_input",
        "waiting_login",
        "completion_rejected",
        "completed",
        "failed",
      ).contains(policy_state)

  val valid_phase =
    policy_kind != "phased_delivery"
      or Set(
        "idle",
        "init",
        "planning",
        "implementing",
        "review",
        "completed",
        "failed",
      ).contains(phase)
}
