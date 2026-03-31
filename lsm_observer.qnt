module lsm_observer {
  var run_started: bool
  var phase_changes: int
  var thread_started: int
  var thread_reused: int
  var turn_started: int
  var turn_finished: int
  var wait_events: int
  var terminal_event: str
  var last_event: str

  action init = all {
    run_started' = false,
    phase_changes' = 0,
    thread_started' = 0,
    thread_reused' = 0,
    turn_started' = 0,
    turn_finished' = 0,
    wait_events' = 0,
    terminal_event' = "none",
    last_event' = "none",
  }

  action emit_run_started = all {
    not(run_started),
    run_started' = true,
    phase_changes' = phase_changes,
    thread_started' = thread_started,
    thread_reused' = thread_reused,
    turn_started' = turn_started,
    turn_finished' = turn_finished,
    wait_events' = wait_events,
    terminal_event' = terminal_event,
    last_event' = "run_started",
  }

  action emit_phase_changed = all {
    run_started,
    terminal_event == "none",
    run_started' = run_started,
    phase_changes' = phase_changes + 1,
    thread_started' = thread_started,
    thread_reused' = thread_reused,
    turn_started' = turn_started,
    turn_finished' = turn_finished,
    wait_events' = wait_events,
    terminal_event' = terminal_event,
    last_event' = "phase_changed",
  }

  action emit_thread_started = all {
    run_started,
    terminal_event == "none",
    run_started' = run_started,
    phase_changes' = phase_changes,
    thread_started' = thread_started + 1,
    thread_reused' = thread_reused,
    turn_started' = turn_started,
    turn_finished' = turn_finished,
    wait_events' = wait_events,
    terminal_event' = terminal_event,
    last_event' = "thread_started",
  }

  action emit_thread_reused = all {
    run_started,
    terminal_event == "none",
    run_started' = run_started,
    phase_changes' = phase_changes,
    thread_started' = thread_started,
    thread_reused' = thread_reused + 1,
    turn_started' = turn_started,
    turn_finished' = turn_finished,
    wait_events' = wait_events,
    terminal_event' = terminal_event,
    last_event' = "thread_reused",
  }

  action emit_turn_started = all {
    run_started,
    terminal_event == "none",
    run_started' = run_started,
    phase_changes' = phase_changes,
    thread_started' = thread_started,
    thread_reused' = thread_reused,
    turn_started' = turn_started + 1,
    turn_finished' = turn_finished,
    wait_events' = wait_events,
    terminal_event' = terminal_event,
    last_event' = "turn_started",
  }

  action emit_turn_finished = all {
    run_started,
    terminal_event == "none",
    turn_started > turn_finished,
    run_started' = run_started,
    phase_changes' = phase_changes,
    thread_started' = thread_started,
    thread_reused' = thread_reused,
    turn_started' = turn_started,
    turn_finished' = turn_finished + 1,
    wait_events' = wait_events,
    terminal_event' = terminal_event,
    last_event' = "turn_finished",
  }

  action emit_wait = all {
    run_started,
    terminal_event == "none",
    run_started' = run_started,
    phase_changes' = phase_changes,
    thread_started' = thread_started,
    thread_reused' = thread_reused,
    turn_started' = turn_started,
    turn_finished' = turn_finished,
    wait_events' = wait_events + 1,
    terminal_event' = terminal_event,
    last_event' = "wait",
  }

  action emit_completed = all {
    run_started,
    terminal_event == "none",
    run_started' = run_started,
    phase_changes' = phase_changes,
    thread_started' = thread_started,
    thread_reused' = thread_reused,
    turn_started' = turn_started,
    turn_finished' = turn_finished,
    wait_events' = wait_events,
    terminal_event' = "completed",
    last_event' = "completed",
  }

  action emit_failed = all {
    run_started,
    terminal_event == "none",
    run_started' = run_started,
    phase_changes' = phase_changes,
    thread_started' = thread_started,
    thread_reused' = thread_reused,
    turn_started' = turn_started,
    turn_finished' = turn_finished,
    wait_events' = wait_events,
    terminal_event' = "failed",
    last_event' = "failed",
  }

  action step = any {
    emit_run_started,
    emit_phase_changed,
    emit_thread_started,
    emit_thread_reused,
    emit_turn_started,
    emit_turn_finished,
    emit_wait,
    emit_completed,
    emit_failed,
  }

  val turn_finish_requires_turn_start = turn_finished <= turn_started

  val terminal_is_unique =
    Set("none", "completed", "failed").contains(terminal_event)

  val terminal_requires_run_start =
    terminal_event == "none" or run_started

  val terminal_event_stops_nonterminal_emissions =
    terminal_event == "none"
      or (last_event == "completed" or last_event == "failed")

  val valid_last_event =
    Set(
      "none",
      "run_started",
      "phase_changed",
      "thread_started",
      "thread_reused",
      "turn_started",
      "turn_finished",
      "wait",
      "completed",
      "failed",
    ).contains(last_event)
}
