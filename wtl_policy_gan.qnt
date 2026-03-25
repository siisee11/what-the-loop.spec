// GAN Policy — Generative Adversarial Network-inspired harness
//
// Separates generation from evaluation across three adversarial phases:
//
//   idle → planning → generating ⇄ evaluating → completed
//                         ↑______________|
//                       (evaluation_failed, generation_count < MAX_GENERATIONS)
//
// Planner   : expands a brief prompt into a detailed spec (new thread)
// Generator : produces output from the spec (new thread each attempt)
// Evaluator : scores the output and decides pass or fail (new thread)
//
// If the Evaluator fails the output, the Generator runs again with the
// Evaluator's critique injected into the next prompt. This adversarial
// loop continues until the Evaluator passes the output or MAX_GENERATIONS
// is reached.

module wtl_policy_gan {
  pure val MAX_GENERATIONS = 3

  var phase: str
  var engine_directive: str
  var thread_mode: str
  var prompt_kind: str
  var generation_count: int
  var plan_exists: bool
  var score_passed: bool

  action init = all {
    phase' = "idle",
    engine_directive' = "continue",
    thread_mode' = "start_new",
    prompt_kind' = "bootstrap",
    generation_count' = 0,
    plan_exists' = false,
    score_passed' = false,
  }

  // ── Planner phase ────────────────────────────────────────────────────────

  action start_planning = all {
    phase == "idle",
    phase' = "planning",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "planning_prompt",
    generation_count' = generation_count,
    plan_exists' = plan_exists,
    score_passed' = score_passed,
  }

  action planning_completed = all {
    phase == "planning",
    phase' = "generating",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "generation_prompt",
    generation_count' = generation_count,
    plan_exists' = true,
    score_passed' = score_passed,
  }

  action planning_failed = all {
    phase == "planning",
    phase' = "failed",
    engine_directive' = "fail",
    thread_mode' = thread_mode,
    prompt_kind' = "none",
    generation_count' = generation_count,
    plan_exists' = plan_exists,
    score_passed' = score_passed,
  }

  // ── Generator phase ──────────────────────────────────────────────────────

  // Generator finishes a candidate output; hand off to Evaluator.
  // generation_count increments here to track how many candidates were produced.
  action generating_completed = all {
    phase == "generating",
    plan_exists,
    phase' = "evaluating",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "evaluation_prompt",
    generation_count' = generation_count + 1,
    plan_exists' = plan_exists,
    score_passed' = score_passed,
  }

  // Generator encountered a recoverable error; retry within the same thread.
  // The engine handles consecutive failure limits via MAX_FAILURES.
  action generating_failed = all {
    phase == "generating",
    plan_exists,
    phase' = "generating",
    engine_directive' = "retry",
    thread_mode' = "reuse_current",
    prompt_kind' = "generation_prompt",
    generation_count' = generation_count,
    plan_exists' = plan_exists,
    score_passed' = score_passed,
  }

  // ── Evaluator phase ──────────────────────────────────────────────────────

  // Evaluator scores the output above threshold — run is complete.
  action evaluation_passed = all {
    phase == "evaluating",
    plan_exists,
    generation_count > 0,
    phase' = "completed",
    engine_directive' = "complete",
    thread_mode' = thread_mode,
    prompt_kind' = "none",
    generation_count' = generation_count,
    plan_exists' = plan_exists,
    score_passed' = true,
  }

  // Evaluator scores below threshold and budget remains — feed critique back
  // to Generator. A fresh thread ensures no context bleed from prior attempt.
  // prompt_kind is "generation_prompt_with_feedback" so the Engine injects
  // the Evaluator's critique into the next generation prompt.
  action evaluation_failed_retry = all {
    phase == "evaluating",
    plan_exists,
    generation_count > 0,
    generation_count < MAX_GENERATIONS,
    phase' = "generating",
    engine_directive' = "advance_phase",
    thread_mode' = "start_new",
    prompt_kind' = "generation_prompt_with_feedback",
    generation_count' = generation_count,
    plan_exists' = plan_exists,
    score_passed' = false,
  }

  // Evaluator scored below threshold and generation budget is exhausted.
  action generation_exhausted = all {
    phase == "evaluating",
    plan_exists,
    generation_count >= MAX_GENERATIONS,
    phase' = "failed",
    engine_directive' = "fail",
    thread_mode' = thread_mode,
    prompt_kind' = "none",
    generation_count' = generation_count,
    plan_exists' = plan_exists,
    score_passed' = false,
  }

  // Evaluator itself errored (tool failure, timeout, etc.).
  action evaluating_errored = all {
    phase == "evaluating",
    plan_exists,
    phase' = "failed",
    engine_directive' = "fail",
    thread_mode' = thread_mode,
    prompt_kind' = "none",
    generation_count' = generation_count,
    plan_exists' = plan_exists,
    score_passed' = score_passed,
  }

  action step = any {
    start_planning,
    planning_completed,
    planning_failed,
    generating_completed,
    generating_failed,
    evaluation_passed,
    evaluation_failed_retry,
    generation_exhausted,
    evaluating_errored,
  }

  // ── Invariants ───────────────────────────────────────────────────────────

  // Generation count never exceeds the configured maximum.
  val generation_count_bound =
    generation_count <= MAX_GENERATIONS

  // Generator and Evaluator phases require a plan to exist.
  val plan_required_before_generation =
    not(Set("generating", "evaluating", "completed").contains(phase))
      or plan_exists

  // Evaluating and completed phases require at least one generation attempt.
  val generation_required_before_evaluation =
    not(Set("evaluating", "completed").contains(phase))
      or generation_count > 0

  // Completion is only reached when the Evaluator explicitly passed the output.
  val completion_requires_evaluation_pass =
    phase != "completed" or score_passed

  // The engine must receive a "complete" directive when the run completes.
  val terminal_completion_uses_complete_directive =
    phase != "completed" or engine_directive == "complete"

  // Phase set is closed — no unknown phase values.
  val valid_phase =
    Set(
      "idle",
      "planning",
      "generating",
      "evaluating",
      "completed",
      "failed",
    ).contains(phase)

  val valid_thread_mode =
    Set("reuse_current", "start_new").contains(thread_mode)

  val valid_prompt_kind =
    Set(
      "none",
      "bootstrap",
      "planning_prompt",
      "generation_prompt",
      "generation_prompt_with_feedback",
      "evaluation_prompt",
    ).contains(prompt_kind)

  // Each phase uses its designated prompt kind.
  val phase_prompt_alignment =
    (phase != "idle"       or prompt_kind == "bootstrap")
      and (phase != "planning"   or prompt_kind == "planning_prompt")
      and (phase != "generating" or Set("generation_prompt", "generation_prompt_with_feedback").contains(prompt_kind))
      and (phase != "evaluating" or prompt_kind == "evaluation_prompt")
      and (phase != "completed"  or prompt_kind == "none")
      and (phase != "failed"     or prompt_kind == "none")

  // Phase ordering: prerequisites must be satisfied before advancing.
  val phase_order =
    (phase != "generating" or plan_exists)
      and (phase != "evaluating"  or (plan_exists and generation_count > 0))
      and (phase != "completed"   or (plan_exists and generation_count > 0 and score_passed))
}
