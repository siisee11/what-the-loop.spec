module wtl_policy_ralph_wigum {
  pure val MAX_ITERATIONS = 4

  var engine_directive: str
  var phase: str
  var thread_mode: str
  var prompt_kind: str
  var iteration: int
  var worktree_ready: bool
  var plan_exists: bool
  var delivery_complete: bool
  var review_complete: bool
  var commit_count: int
  var recovery_pending: bool

  action init = all {
    engine_directive' = "continue",
    phase' = "idle",
    thread_mode' = "start_new",
    prompt_kind' = "bootstrap",
    iteration' = 0,
    worktree_ready' = false,
    plan_exists' = false,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = 0,
    recovery_pending' = false,
  }

  action start_init = all {
    phase == "idle",
    engine_directive' = "advance_phase",
    phase' = "init",
    thread_mode' = "start_new",
    prompt_kind' = "init_prompt",
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action init_succeeds = all {
    phase == "init",
    engine_directive' = "advance_phase",
    phase' = "planning",
    thread_mode' = "start_new",
    prompt_kind' = "planning_prompt",
    iteration' = iteration,
    worktree_ready' = true,
    plan_exists' = false,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = commit_count,
    recovery_pending' = false,
  }

  action planning_completed = all {
    phase == "planning",
    worktree_ready,
    engine_directive' = "advance_phase",
    phase' = "implementing",
    thread_mode' = "start_new",
    prompt_kind' = "implementation_prompt",
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = true,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = commit_count,
    recovery_pending' = false,
  }

  action implementation_continues = all {
    phase == "implementing",
    plan_exists,
    iteration < MAX_ITERATIONS,
    engine_directive' = "continue",
    phase' = "implementing",
    thread_mode' = "reuse_current",
    prompt_kind' = "implementation_prompt",
    iteration' = iteration + 1,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = commit_count + 1,
    recovery_pending' = false,
  }

  action implementation_failed = all {
    phase == "implementing",
    plan_exists,
    iteration < MAX_ITERATIONS,
    engine_directive' = "retry",
    phase' = "implementing",
    thread_mode' = "reuse_current",
    prompt_kind' = "recovery_prompt",
    iteration' = iteration + 1,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = false,
    review_complete' = false,
    commit_count' = commit_count,
    recovery_pending' = true,
  }

  action implementation_ready_for_review = all {
    phase == "implementing",
    plan_exists,
    iteration < MAX_ITERATIONS,
    engine_directive' = "advance_phase",
    phase' = "review",
    thread_mode' = "start_new",
    prompt_kind' = "review_prompt",
    iteration' = iteration + 1,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = true,
    review_complete' = false,
    commit_count' = commit_count + 1,
    recovery_pending' = false,
  }

  action phased_exhausted = all {
    phase == "implementing",
    iteration >= MAX_ITERATIONS,
    engine_directive' = "fail",
    phase' = "failed",
    thread_mode' = thread_mode,
    prompt_kind' = prompt_kind,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action review_completed = all {
    phase == "review",
    delivery_complete,
    engine_directive' = "complete",
    phase' = "completed",
    thread_mode' = thread_mode,
    prompt_kind' = "none",
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = true,
    commit_count' = commit_count,
    recovery_pending' = false,
  }

  action workflow_failed = all {
    Set("planning", "review").contains(phase),
    engine_directive' = "fail",
    phase' = "failed",
    thread_mode' = thread_mode,
    prompt_kind' = prompt_kind,
    iteration' = iteration,
    worktree_ready' = worktree_ready,
    plan_exists' = plan_exists,
    delivery_complete' = delivery_complete,
    review_complete' = review_complete,
    commit_count' = commit_count,
    recovery_pending' = recovery_pending,
  }

  action step = any {
    start_init,
    init_succeeds,
    planning_completed,
    implementation_continues,
    implementation_failed,
    implementation_ready_for_review,
    phased_exhausted,
    review_completed,
    workflow_failed,
  }

  val phase_order =
    (phase != "planning" or worktree_ready)
      and (phase != "implementing" or (worktree_ready and plan_exists))
      and (phase != "review" or (worktree_ready and plan_exists and delivery_complete))
      and (phase != "completed" or (worktree_ready and plan_exists and delivery_complete and review_complete))

  val review_requires_delivery_completion =
    phase != "review" or delivery_complete

  val terminal_completion_uses_complete_directive =
    phase != "completed" or engine_directive == "complete"

  val valid_phase =
    Set(
      "idle",
      "init",
      "planning",
      "implementing",
      "review",
      "completed",
      "failed",
    ).contains(phase)

  val valid_thread_mode =
    Set("reuse_current", "start_new").contains(thread_mode)

  val valid_prompt_kind =
    Set(
      "none",
      "bootstrap",
      "init_prompt",
      "planning_prompt",
      "implementation_prompt",
      "recovery_prompt",
      "review_prompt",
    ).contains(prompt_kind)

  val phase_prompt_alignment =
    (phase != "idle" or prompt_kind == "bootstrap")
      and (phase != "init" or prompt_kind == "init_prompt")
      and (phase != "planning" or prompt_kind == "planning_prompt")
      and (phase != "implementing" or Set("implementation_prompt", "recovery_prompt").contains(prompt_kind))
      and (phase != "review" or prompt_kind == "review_prompt")
      and (phase != "completed" or prompt_kind == "none")
}
