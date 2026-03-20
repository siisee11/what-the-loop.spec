module wtl_engine {
  pure val MAX_ITERATIONS = 4
  pure val MAX_FAILURES = 2
  pure val CONTEXT_WINDOW = 2

  var engine_state: str
  var iteration: int
  var consecutive_failures: int
  var context_used: int
  var thread_id: int
  var active_thread_id: int
  var pending_directive: str

  action init = all {
    engine_state' = "idle",
    iteration' = 0,
    consecutive_failures' = 0,
    context_used' = 0,
    thread_id' = 1,
    active_thread_id' = 1,
    pending_directive' = "none",
  }

  action become_ready = all {
    engine_state == "idle",
    engine_state' = "ready",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "none",
  }

  action start_turn = all {
    engine_state == "ready",
    iteration < MAX_ITERATIONS,
    engine_state' = "turn_started",
    iteration' = iteration + 1,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "running",
  }

  action turn_running = all {
    engine_state == "turn_started",
    engine_state' = "turn_running",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used + 1,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = pending_directive,
  }

  action policy_continue = all {
    engine_state == "turn_running",
    engine_state' = "ready",
    iteration' = iteration,
    consecutive_failures' = 0,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "continue",
  }

  action policy_wait = all {
    engine_state == "turn_running",
    engine_state' = "waiting_external",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "wait",
  }

  action external_resolved = all {
    engine_state == "waiting_external",
    engine_state' = "ready",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "continue",
  }

  action policy_compact = all {
    engine_state == "turn_running",
    context_used >= CONTEXT_WINDOW,
    engine_state' = "compacting",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "compact",
  }

  action compacted = all {
    engine_state == "compacting",
    engine_state' = "ready",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used / 2,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "continue",
  }

  action policy_retry = all {
    engine_state == "turn_running",
    consecutive_failures < MAX_FAILURES,
    engine_state' = "ready",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures + 1,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "retry",
  }

  action policy_complete = all {
    engine_state == "turn_running",
    engine_state' = "completed",
    iteration' = iteration,
    consecutive_failures' = 0,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "complete",
  }

  action abort_failures = all {
    engine_state == "ready",
    consecutive_failures >= MAX_FAILURES,
    engine_state' = "failed",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "fail",
  }

  action exhaust_iterations = all {
    engine_state == "ready",
    iteration >= MAX_ITERATIONS,
    engine_state' = "exhausted",
    iteration' = iteration,
    consecutive_failures' = consecutive_failures,
    context_used' = context_used,
    thread_id' = thread_id,
    active_thread_id' = active_thread_id,
    pending_directive' = "fail",
  }

  action step = any {
    become_ready,
    start_turn,
    turn_running,
    policy_continue,
    policy_wait,
    external_resolved,
    policy_compact,
    compacted,
    policy_retry,
    policy_complete,
    abort_failures,
    exhaust_iterations,
  }

  val iteration_bound = iteration <= MAX_ITERATIONS

  val same_thread = active_thread_id == thread_id

  val waiting_requires_wait_directive =
    engine_state != "waiting_external" or pending_directive == "wait"

  val completion_requires_complete_directive =
    engine_state != "completed" or pending_directive == "complete"

  val valid_state =
    Set(
      "idle",
      "ready",
      "turn_started",
      "turn_running",
      "waiting_external",
      "compacting",
      "completed",
      "failed",
      "exhausted",
    ).contains(engine_state)
}
