// Autoresearch Policy
//
// Models the core loop described in karpathy/autoresearch:
//
//   idle -> setup -> baseline -> proposing -> running -> adjudicating -> ...
//
// The policy treats one experiment as a propose/run/adjudicate cycle.
// It records a baseline first, then keeps looping until the configured
// experiment budget is exhausted. Better candidates are "kept", regressions
// are "discarded", and recoverable crashes are retried in-place.

module lsm_policy_autoresearch {
  pure val MAX_EXPERIMENTS = 100
  pure val MAX_CRASH_RETRIES = 2

  var phase: str
  var engine_directive: str
  var thread_mode: str
  var prompt_kind: str

  var experiment_count: int
  var baseline_recorded: bool
  var setup_ready: bool
  var cache_ready: bool
  var branch_ready: bool
  var results_file_ready: bool

  var candidate_prepared: bool
  var run_succeeded: bool
  var outcome_logged: bool
  var improvement_found: bool

  var crash_retry_count: int
  var crash_recoverable: bool

  action init = all {
    phase' = "idle",
    engine_directive' = "continue",
    thread_mode' = "start_new",
    prompt_kind' = "bootstrap",

    experiment_count' = 0,
    baseline_recorded' = false,
    setup_ready' = false,
    cache_ready' = false,
    branch_ready' = false,
    results_file_ready' = false,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  // ── Setup ───────────────────────────────────────────────────────────────

  action start_setup = all {
    phase == "idle",
    phase' = "setup",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "setup_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  // Missing shards/tokenizer means the policy must block on external setup.
  action setup_waits_for_data = all {
    phase == "setup",
    not(cache_ready),
    phase' = "setup",
    engine_directive' = "wait",
    thread_mode' = "reuse_current",
    prompt_kind' = "setup_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = false,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = crash_retry_count,
    crash_recoverable' = false,
  }

  action setup_continues = all {
    phase == "setup",
    cache_ready,
    not(branch_ready and results_file_ready),
    phase' = "setup",
    engine_directive' = "continue",
    thread_mode' = "reuse_current",
    prompt_kind' = "setup_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = false,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = crash_retry_count,
    crash_recoverable' = false,
  }

  action setup_completed = all {
    phase == "setup",
    cache_ready,
    branch_ready,
    results_file_ready,
    phase' = "baseline",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "baseline_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = false,
    setup_ready' = true,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  // ── Baseline ────────────────────────────────────────────────────────────

  action baseline_succeeded = all {
    phase == "baseline",
    setup_ready,
    phase' = "proposing",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "proposal_prompt",

    experiment_count' = 0,
    baseline_recorded' = true,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = true,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  action baseline_failed = all {
    phase == "baseline",
    setup_ready,
    phase' = "failed",
    engine_directive' = "fail",
    thread_mode' = thread_mode,
    prompt_kind' = "none",

    experiment_count' = experiment_count,
    baseline_recorded' = false,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  // ── Proposal ────────────────────────────────────────────────────────────

  action proposal_completed = all {
    phase == "proposing",
    baseline_recorded,
    experiment_count < MAX_EXPERIMENTS,
    phase' = "running",
    engine_directive' = "advance_phase",
    thread_mode' = "reuse_current",
    prompt_kind' = "run_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = true,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  action proposal_requests_compaction = all {
    phase == "proposing",
    baseline_recorded,
    phase' = "proposing",
    engine_directive' = "compact",
    thread_mode' = "reuse_current",
    prompt_kind' = "proposal_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = crash_retry_count,
    crash_recoverable' = false,
  }

  action experiment_budget_exhausted = all {
    phase == "proposing",
    experiment_count >= MAX_EXPERIMENTS,
    phase' = "completed",
    engine_directive' = "complete",
    thread_mode' = thread_mode,
    prompt_kind' = "none",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = true,
    improvement_found' = improvement_found,

    crash_retry_count' = crash_retry_count,
    crash_recoverable' = false,
  }

  // ── Run ─────────────────────────────────────────────────────────────────

  action run_completed = all {
    phase == "running",
    candidate_prepared,
    phase' = "adjudicating",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "adjudication_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = candidate_prepared,
    run_succeeded' = true,
    outcome_logged' = false,
    improvement_found' = improvement_found,

    crash_retry_count' = crash_retry_count,
    crash_recoverable' = false,
  }

  action run_crashed_retry = all {
    phase == "running",
    candidate_prepared,
    crash_recoverable,
    crash_retry_count < MAX_CRASH_RETRIES,
    phase' = "running",
    engine_directive' = "retry",
    thread_mode' = "reuse_current",
    prompt_kind' = "recovery_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = candidate_prepared,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = crash_retry_count + 1,
    crash_recoverable' = crash_recoverable,
  }

  action run_crashed_discard = all {
    phase == "running",
    candidate_prepared,
    (not(crash_recoverable)) or crash_retry_count >= MAX_CRASH_RETRIES,
    phase' = "adjudicating",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "adjudication_prompt",

    experiment_count' = experiment_count,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = candidate_prepared,
    run_succeeded' = false,
    outcome_logged' = false,
    improvement_found' = false,

    crash_retry_count' = crash_retry_count,
    crash_recoverable' = false,
  }

  // ── Adjudication ────────────────────────────────────────────────────────

  action adjudication_keep_next_experiment = all {
    phase == "adjudicating",
    baseline_recorded,
    run_succeeded,
    improvement_found,
    phase' = "proposing",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "proposal_prompt",

    experiment_count' = experiment_count + 1,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = true,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  action adjudication_discard_next_experiment = all {
    phase == "adjudicating",
    baseline_recorded,
    not(improvement_found),
    phase' = "proposing",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "proposal_prompt",

    experiment_count' = experiment_count + 1,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = true,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  action adjudication_complete = all {
    phase == "adjudicating",
    baseline_recorded,
    experiment_count + 1 >= MAX_EXPERIMENTS,
    phase' = "completed",
    engine_directive' = "complete",
    thread_mode' = thread_mode,
    prompt_kind' = "none",

    experiment_count' = experiment_count + 1,
    baseline_recorded' = baseline_recorded,
    setup_ready' = setup_ready,
    cache_ready' = cache_ready,
    branch_ready' = branch_ready,
    results_file_ready' = results_file_ready,

    candidate_prepared' = false,
    run_succeeded' = false,
    outcome_logged' = true,
    improvement_found' = false,

    crash_retry_count' = 0,
    crash_recoverable' = false,
  }

  action step = any {
    start_setup,
    setup_waits_for_data,
    setup_continues,
    setup_completed,
    baseline_succeeded,
    baseline_failed,
    proposal_completed,
    proposal_requests_compaction,
    experiment_budget_exhausted,
    run_completed,
    run_crashed_retry,
    run_crashed_discard,
    adjudication_keep_next_experiment,
    adjudication_discard_next_experiment,
    adjudication_complete,
  }

  // ── Invariants ──────────────────────────────────────────────────────────

  val experiment_count_bound =
    experiment_count <= MAX_EXPERIMENTS + 1

  val crash_retry_bound =
    crash_retry_count <= MAX_CRASH_RETRIES

  val baseline_required_before_loop =
    not(Set("proposing", "running", "adjudicating", "completed").contains(phase))
      or baseline_recorded

  val setup_required_before_baseline =
    not(Set("baseline", "proposing", "running", "adjudicating", "completed").contains(phase))
      or setup_ready

  val run_requires_candidate =
    phase != "running" or candidate_prepared

  val adjudication_requires_attempt =
    phase != "adjudicating" or candidate_prepared

  val completion_requires_budget_exhaustion =
    phase != "completed" or experiment_count >= MAX_EXPERIMENTS

  val terminal_completion_uses_complete_directive =
    phase != "completed" or engine_directive == "complete"

  val valid_phase =
    Set(
      "idle",
      "setup",
      "baseline",
      "proposing",
      "running",
      "adjudicating",
      "completed",
      "failed",
    ).contains(phase)

  val valid_thread_mode =
    Set("reuse_current", "start_new").contains(thread_mode)

  val valid_prompt_kind =
    Set(
      "none",
      "bootstrap",
      "setup_prompt",
      "baseline_prompt",
      "proposal_prompt",
      "run_prompt",
      "recovery_prompt",
      "adjudication_prompt",
    ).contains(prompt_kind)

  val phase_prompt_alignment =
    (phase != "idle"         or prompt_kind == "bootstrap")
      and (phase != "setup"        or prompt_kind == "setup_prompt")
      and (phase != "baseline"     or prompt_kind == "baseline_prompt")
      and (phase != "proposing"    or prompt_kind == "proposal_prompt")
      and (phase != "running"      or Set("run_prompt", "recovery_prompt").contains(prompt_kind))
      and (phase != "adjudicating" or prompt_kind == "adjudication_prompt")
      and (phase != "completed"    or prompt_kind == "none")
      and (phase != "failed"       or prompt_kind == "none")

  val phase_order =
    (phase != "baseline"     or setup_ready)
      and (phase != "proposing"    or (setup_ready and baseline_recorded))
      and (phase != "running"      or (setup_ready and baseline_recorded and candidate_prepared))
      and (phase != "adjudicating" or (setup_ready and baseline_recorded and candidate_prepared))
      and (phase != "completed"    or (setup_ready and baseline_recorded and outcome_logged))
}
