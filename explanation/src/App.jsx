import { useEffect, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "motion/react";
import { i18n } from "./i18n.js";

const terminalSnippet = `$ wtl run
> Enter your request: explain the repo contract

[turn 1] running...
policy returns continue

[turn 2] running...
policy returns complete

Done: your request was completed successfully.`;

function Reveal({ children, className = "", delay = 0, amount = 0.25 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionIntro({ eyebrow, title, body }) {
  return (
    <Reveal className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-copy">{body}</p>
    </Reveal>
  );
}

// Hero: start, outcome, policy, directive, final exit
const HERO_DELAYS = [850, 950, 850, 950, 900];
const DEMO_TURN_DIRECTIVES = ["continue", "continue", "complete"];

function HeroDiagram({ t }) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (reduceMotion || completed) return;
    const directive = DEMO_TURN_DIRECTIVES[turnIndex];
    const tid = setTimeout(() => {
      if (phase === 4) {
        setCompleted(true);
        return;
      }

      if (phase === 3) {
        if (directive === "complete") {
          setPhase(4);
          return;
        }
        setTurnIndex((index) => Math.min(index + 1, DEMO_TURN_DIRECTIVES.length - 1));
        setPhase(0);
        return;
      }
      setPhase((current) => current + 1);
    }, HERO_DELAYS[phase]);
    return () => clearTimeout(tid);
  }, [completed, phase, reduceMotion, turnIndex]);

  const directive = DEMO_TURN_DIRECTIVES[turnIndex];
  const turnNum = turnIndex + 1;
  const ui = t.ui;

  // viewBox 540×540 (1:1 square)
  // Engine card:  left=36  top=70  w=158 h=82  → right=194, center=(115,111)
  // Policy card:  left=346 top=70  w=158 h=82  → left=346,  center=(425,111)
  // Horizontal lines at y=98 (outcome →) and y=124 (← directive), x: 194↔346
  // Observer card: centered x=270, top=390, w=170, h=80 → center=(270,430)
  // Diagonals: Engine(115,152)→Observer(220,390) and Policy(425,152)→Observer(320,390)

  const connOutcome = (t.loopMap.connOutcome || "outcome →").toUpperCase();
  const connDirective = (t.loopMap.connDirective || "← directive").toUpperCase();

  return (
    <div className="hero-diagram">
      <svg viewBox="0 0 540 540" className="wtl-track-svg" aria-hidden="true">
        <rect x="24" y="24" width="492" height="492" className="wtl-loop-frame" />

        {/* Loop start -> engine */}
        <line x1="123" y1="110" x2="123" y2="186" className="wtl-line-backbone" />
        <line x1="123" y1="110" x2="123" y2="186" className="wtl-line-accent wtl-line-start" />
        <polygon points="117,180 123,192 129,180" className="wtl-arrow wtl-arrow-start" />

        {/* Engine -> policy / policy -> engine */}
        <line x1="218" y1="228" x2="322" y2="228" className="wtl-line-backbone" />
        <line x1="218" y1="228" x2="322" y2="228" className="wtl-line-accent wtl-line-outcome" />
        <polygon points="314,221 328,228 314,235" className="wtl-arrow wtl-arrow-outcome" />

        <line x1="322" y1="252" x2="218" y2="252" className="wtl-line-backbone" />
        <line x1="322" y1="252" x2="218" y2="252" className="wtl-line-accent wtl-line-directive" />
        <polygon points="226,245 212,252 226,259" className="wtl-arrow wtl-arrow-directive" />

        {/* Labels */}
        <text x="270" y="214" textAnchor="middle"
          className="wtl-track-label wtl-track-label-outcome">
          {connOutcome}
        </text>
        <text x="270" y="270" textAnchor="middle"
          className="wtl-track-label wtl-track-label-directive">
          {connDirective}
        </text>

        {/* Engine -> observer */}
        <polyline points="118,288 118,380 192,380" className="wtl-line-backbone wtl-line-event-backbone" />
        <polyline points="118,288 118,380 192,380" className="wtl-line-accent wtl-line-event" />
        <polygon points="184,375 196,380 184,385" className="wtl-arrow wtl-arrow-event" />

        {/* Policy -> observer */}
        <polyline points="422,288 422,380 348,380" className="wtl-line-backbone wtl-line-event-backbone" />
        <polyline points="422,288 422,380 348,380" className="wtl-line-accent wtl-line-event" />
        <polygon points="356,375 344,380 356,385" className="wtl-arrow wtl-arrow-event" />

        <text x="166" y="366" textAnchor="middle"
          className="wtl-track-label wtl-track-label-event"
          transform="rotate(0,166,366)">
          events
        </text>
        <text x="374" y="366" textAnchor="middle"
          className="wtl-track-label wtl-track-label-event"
          transform="rotate(0,374,366)">
          events
        </text>

        {/* Start dot: Loop Start -> Engine */}
        {!reduceMotion && turnIndex === 0 && phase === 0 && (
          <motion.circle
            key="start-run"
            r="8" fill="var(--sky)" stroke="var(--ink)" strokeWidth="3"
            initial={{ x: 123, y: 110 }}
            animate={{ x: 123, y: 186 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}

        {/* Outcome dot: Engine→Policy */}
        {!reduceMotion && phase === 1 && (
          <motion.circle
            key={`fwd-${turnIndex}`}
            r="8" fill="var(--coral)" stroke="var(--ink)" strokeWidth="3"
            initial={{ x: 218, y: 228 }}
            animate={{ x: 322 }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
          />
        )}

        {/* Directive dot: Policy→Engine */}
        {!reduceMotion && phase === 3 && (
          <motion.circle
            key={`back-${turnIndex}`}
            r="8" fill="var(--teal)" stroke="var(--ink)" strokeWidth="3"
            initial={{ x: 322, y: 252 }}
            animate={{ x: 218 }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
          />
        )}

        {/* Event pulse: Engine→Observer */}
        {!reduceMotion && (phase === 1 || phase === 3) && (
          <motion.circle
            key={`obs-l-${phase}-${turnIndex}`}
            r="5" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5"
            initial={{ x: 118, y: 288 }}
            animate={{ x: 192, y: 380, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.35 }}
          />
        )}

        {/* Event pulse: Policy→Observer */}
        {!reduceMotion && (phase === 1 || phase === 3) && (
          <motion.circle
            key={`obs-r-${phase}-${turnIndex}`}
            r="5" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5"
            initial={{ x: 422, y: 288 }}
            animate={{ x: 348, y: 380, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.45 }}
          />
        )}

        {/* Engine -> loop end */}
        <line x1="123" y1="288" x2="123" y2="420" className="wtl-line-backbone" />
        <line x1="123" y1="288" x2="123" y2="420" className="wtl-line-accent wtl-line-end" />
        <polygon points="117,414 123,426 129,414" className="wtl-arrow wtl-arrow-end" />

        {/* Final dot: Engine -> Loop End */}
        {!reduceMotion && phase === 4 && (
          <motion.circle
            key="finish-run"
            r="8" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3"
            initial={{ x: 123, y: 288 }}
            animate={{ x: 123, y: 420 }}
            transition={{ duration: 0.82, ease: "easeInOut" }}
          />
        )}
      </svg>

      <div className={`wtl-flow-box wtl-flow-box-start${phase === 0 ? " wtl-flow-box-active" : ""}`}>
        <span className="wtl-flow-label">Loop Start</span>
        <strong>{ui.turnBadge.replace("{n}", turnNum)}</strong>
      </div>

      <div
        className={`wtl-flow-box wtl-flow-box-end${directive === "complete" ? " wtl-flow-box-active" : ""}`}
      >
        <span className="wtl-flow-label">Loop End</span>
        <strong>{directive === "complete" ? "policy: complete" : "await policy: complete"}</strong>
      </div>

      {/* Engine node — top-left */}
      <motion.div
        className={`wtl-node wtl-node-engine${phase === 0 ? " wtl-node-active" : ""}`}
        animate={!reduceMotion && phase === 0 ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 0.65 }}
      >
        <span className="wtl-role">Engine</span>
        <span className="wtl-sub">
          {phase === 0 ? ui.engineRunning
            : phase === 1 ? ui.sendingOutcome
            : phase === 3 ? ui.gotDirective
            : phase === 4 ? ui.endingRun
            : ui.idle}
        </span>
      </motion.div>

      {/* Policy node — top-right */}
      <motion.div
        className={`wtl-node wtl-node-policy${phase === 2 ? " wtl-node-active" : ""}`}
        animate={!reduceMotion && phase === 2 ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 0.65 }}
      >
        <span className="wtl-role">Policy</span>
        <span className="wtl-sub">
          {phase === 2 ? ui.interpreting
            : phase === 3 ? ui.gotDirective
            : ui.waiting}
        </span>
        <motion.span
          className={`wtl-chip wtl-chip-inline wtl-chip-${directive}`}
          animate={!reduceMotion ? { opacity: phase >= 2 ? 1 : 0.18 } : undefined}
          transition={{ duration: 0.3 }}
        >
          {directive}
        </motion.span>
      </motion.div>

      {/* Observer — bottom-center */}
      <div className="wtl-node wtl-node-observer">
        <span className="wtl-role">Observer</span>
        <span className="wtl-sub">
          {phase === 1 ? `↗ ${ui.logStart}`
            : phase >= 3 ? `↗ ${ui.logComplete}`
            : ui.observing}
        </span>
      </div>

    </div>
  );
}

function ProblemCard({ item, index }) {
  return (
    <Reveal delay={index * 0.06} amount={0.15}>
      <div className="problem-card" style={{ "--prob-accent": `var(--${item.accent})` }}>
        <div className="problem-num">
          <span className="problem-num-dot" />
          <span>{item.id}</span>
        </div>
        <h3 className="problem-title">{item.title}</h3>
        <p className="problem-body">{item.body}</p>
        <div className="problem-q">{item.question}</div>
      </div>
    </Reveal>
  );
}

function RoleCard({ role, index }) {
  return (
    <Reveal className="panel role-card" delay={index * 0.08}>
      <div className="card-topline" style={{ "--card-accent": role.accent }}>
        <span className="role-chip">{role.name}</span>
        <p>{role.tag}</p>
      </div>
      <ul>
        {role.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </Reveal>
  );
}

function DirectiveCard({ directive, index }) {
  return (
    <Reveal className="directive-card" delay={index * 0.05} amount={0.15}>
      <p>{directive[0]}</p>
      <span>{directive[1]}</span>
    </Reveal>
  );
}

function LifecycleRail({ steps }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="lifecycle-rail">
      {steps.map((item, index) => (
        <Reveal className="lifecycle-step" key={item.step} delay={index * 0.08}>
          <div className="lifecycle-index">0{index + 1}</div>
          <div>
            <h3>{item.step}</h3>
            <p>{item.body}</p>
          </div>
          {index < steps.length - 1 ? (
            <motion.div
              className="lifecycle-connector"
              animate={reduceMotion ? undefined : { scaleX: [0.75, 1, 0.75], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
            />
          ) : null}
        </Reveal>
      ))}
    </div>
  );
}

let explorerLogId = 0;
const EXPLORER_DEFAULT_CONTROLS = {
  needsInput: false,
  recoverableFailure: false,
  contextOverflow: false,
  phaseGoalMet: false,
  completionApproved: false,
  observerOnline: true
};
const EXPLORER_SCENARIOS = [
  { id: "continue", phaseIndex: 0, accent: "coral", controls: {} },
  { id: "wait", phaseIndex: 1, accent: "gold", controls: { needsInput: true } },
  { id: "retry", phaseIndex: 1, accent: "gold", controls: { recoverableFailure: true } },
  { id: "compact", phaseIndex: 1, accent: "coral", controls: { contextOverflow: true } },
  { id: "advance_phase", phaseIndex: 0, accent: "teal", controls: { phaseGoalMet: true } },
  {
    id: "complete",
    phaseIndex: 2,
    accent: "teal",
    controls: { phaseGoalMet: true, completionApproved: true }
  }
];

function nextExplorerLogId() {
  explorerLogId += 1;
  return explorerLogId;
}

function getExplorerScenarioState(scenarioId, observerOnline = true) {
  const scenario = EXPLORER_SCENARIOS.find((item) => item.id === scenarioId) || EXPLORER_SCENARIOS[0];

  return {
    phaseIndex: scenario.phaseIndex,
    controls: {
      ...EXPLORER_DEFAULT_CONTROLS,
      ...scenario.controls,
      observerOnline
    }
  };
}

function getExplorerDecision({
  needsInput,
  recoverableFailure,
  contextOverflow,
  phaseGoalMet,
  completionApproved,
  phaseIndex,
  phaseCount
}) {
  const inFinalPhase = phaseIndex === phaseCount - 1;

  if (needsInput) {
    return { directive: "wait", tone: "gold", reasonKey: "wait" };
  }

  if (recoverableFailure) {
    return { directive: "retry", tone: "gold", reasonKey: "retry" };
  }

  if (contextOverflow) {
    return { directive: "compact", tone: "coral", reasonKey: "compact" };
  }

  if (phaseGoalMet && !inFinalPhase) {
    return { directive: "advance_phase", tone: "teal", reasonKey: "advance_phase" };
  }

  if (phaseGoalMet && inFinalPhase && completionApproved) {
    return { directive: "complete", tone: "teal", reasonKey: "complete" };
  }

  if (phaseGoalMet && inFinalPhase && !completionApproved) {
    return { directive: "continue", tone: "coral", reasonKey: "gate_closed" };
  }

  return { directive: "continue", tone: "coral", reasonKey: "continue" };
}

function ExploreScenarioButton({ label, body, directive, active, accent, onClick }) {
  return (
    <button
      type="button"
      className={`explore-scenario explore-toggle-${accent}${active ? " is-active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <div className="explore-scenario-top">
        <strong>{label}</strong>
        <span className={`explore-directive-chip explore-directive-chip-${directive}`}>{directive}</span>
      </div>
      <span>{body}</span>
    </button>
  );
}

function ExplorableLoop({ t }) {
  const reduceMotion = useReducedMotion();
  const explore = t.explore;
  const phaseNames = explore.phaseNames;
  const initialState = getExplorerScenarioState("continue");
  const [selectedScenario, setSelectedScenario] = useState("continue");
  const [phaseIndex, setPhaseIndex] = useState(initialState.phaseIndex);
  const [turnCount, setTurnCount] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [compactCount, setCompactCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [lastDirective, setLastDirective] = useState("continue");
  const [logEntries, setLogEntries] = useState(() => [
    {
      id: nextExplorerLogId(),
      actor: "observer",
      tone: "teal",
      text: explore.log.boot
    }
  ]);
  const [controls, setControls] = useState({
    ...initialState.controls
  });

  const decision = getExplorerDecision({
    ...controls,
    phaseIndex,
    phaseCount: phaseNames.length
  });
  const isFinalPhase = phaseIndex === phaseNames.length - 1;
  const activeScenario = explore.scenarios[selectedScenario];
  const runState = completed
    ? explore.runStates.completed
    : decision.directive === "wait"
      ? explore.runStates.waiting
      : explore.runStates.live;
  const engineStatus = completed
    ? explore.engineStatus.completed
    : controls.needsInput
      ? explore.engineStatus.waiting
      : explore.engineStatus.ready;
  const observerStatus = controls.observerOnline
    ? explore.status.online
    : explore.status.offline;

  function selectScenario(scenarioId) {
    const nextState = getExplorerScenarioState(scenarioId, controls.observerOnline);
    setSelectedScenario(scenarioId);
    setPhaseIndex(nextState.phaseIndex);
    setControls(nextState.controls);
    setCompleted(false);
  }

  function toggleObserver() {
    setControls((current) => ({ ...current, observerOnline: !current.observerOnline }));
  }

  function resetExplorer() {
    const nextState = getExplorerScenarioState("continue");
    setSelectedScenario("continue");
    setPhaseIndex(nextState.phaseIndex);
    setTurnCount(1);
    setRetryCount(0);
    setCompactCount(0);
    setCompleted(false);
    setPulseCount(0);
    setLastDirective("continue");
    setControls(nextState.controls);
    setLogEntries([
      {
        id: nextExplorerLogId(),
        actor: "observer",
        tone: "teal",
        text: explore.log.boot
      }
    ]);
  }

  function pushLogBatch(items) {
    setLogEntries((current) => [...items, ...current].slice(0, 8));
  }

  function applyDirective() {
    if (completed) {
      return;
    }

    const logs = [];
    const currentTurn = turnCount;
    const currentPhase = phaseNames[phaseIndex];

    logs.push({
      id: nextExplorerLogId(),
      actor: "policy",
      tone: decision.tone,
      text: explore.log[`policy_${decision.directive}`]
    });

    switch (decision.directive) {
      case "wait":
        logs.push({
          id: nextExplorerLogId(),
          actor: "engine",
          tone: "gold",
          text: explore.log.engine_wait
        });
        break;
      case "retry":
        logs.push({
          id: nextExplorerLogId(),
          actor: "engine",
          tone: "gold",
          text: explore.log.engine_retry.replace("{n}", currentTurn)
        });
        setRetryCount((count) => count + 1);
        setControls((current) => ({ ...current, recoverableFailure: false }));
        setSelectedScenario("continue");
        break;
      case "compact":
        logs.push({
          id: nextExplorerLogId(),
          actor: "engine",
          tone: "coral",
          text: explore.log.engine_compact
        });
        setCompactCount((count) => count + 1);
        setControls((current) => ({ ...current, contextOverflow: false }));
        setSelectedScenario("continue");
        break;
      case "advance_phase":
        logs.push({
          id: nextExplorerLogId(),
          actor: "engine",
          tone: "teal",
          text: explore.log.engine_advance
            .replace("{from}", currentPhase)
            .replace("{to}", phaseNames[Math.min(phaseIndex + 1, phaseNames.length - 1)])
        });
        setPhaseIndex((index) => Math.min(index + 1, phaseNames.length - 1));
        setControls((current) => ({
          ...current,
          phaseGoalMet: false,
          completionApproved: false
        }));
        setSelectedScenario("continue");
        break;
      case "complete":
        logs.push({
          id: nextExplorerLogId(),
          actor: "engine",
          tone: "teal",
          text: explore.log.engine_complete
        });
        setCompleted(true);
        break;
      default:
        logs.push({
          id: nextExplorerLogId(),
          actor: "engine",
          tone: "coral",
          text: explore.log.engine_continue.replace("{n}", currentTurn + 1)
        });
        setTurnCount((count) => count + 1);
        break;
    }

    logs.push({
      id: nextExplorerLogId(),
      actor: "observer",
      tone: controls.observerOnline ? "teal" : "muted",
      text: controls.observerOnline
        ? explore.log.observer_seen.replace("{directive}", decision.directive)
        : explore.log.observer_dropped
    });

    setLastDirective(decision.directive);
    setPulseCount((count) => count + 1);
    pushLogBatch(logs);
  }

  return (
    <section className="section explore-section" id="explore">
      <SectionIntro
        eyebrow={explore.eyebrow}
        title={explore.title}
        body={explore.body}
      />

      <div className="explore-shell">
        <Reveal className="panel explore-controls" amount={0.15}>
          <div className="explore-block">
            <div className="explore-block-head">
              <h3>{explore.controlsTitle}</h3>
              <p>{explore.controlsBody}</p>
            </div>

            <div className="explore-step-strip">
              {explore.steps.map((step) => (
                <div key={step} className="explore-step-card">
                  {step}
                </div>
              ))}
            </div>

            <div className="explore-scenario-grid">
              {EXPLORER_SCENARIOS.map((scenario) => (
                <ExploreScenarioButton
                  key={scenario.id}
                  label={explore.scenarios[scenario.id].label}
                  body={explore.scenarios[scenario.id].body}
                  directive={scenario.id}
                  active={selectedScenario === scenario.id}
                  accent={scenario.accent}
                  onClick={() => selectScenario(scenario.id)}
                />
              ))}
            </div>

            <div className="explore-helper-row">
              <div className="explore-helper-card">
                <span>{explore.phaseLabel}</span>
                <strong>
                  {phaseNames[phaseIndex]}
                  {isFinalPhase ? ` · ${explore.finalPhase}` : ""}
                </strong>
              </div>
              <button
                type="button"
                className={`explore-mini-toggle${controls.observerOnline ? " is-active" : ""}`}
                aria-pressed={controls.observerOnline}
                onClick={toggleObserver}
              >
                <span>{explore.observerTitle}</span>
                <strong>
                  {controls.observerOnline ? explore.observerBodyOn : explore.observerBodyOff}
                </strong>
              </button>
            </div>

            <div className="explore-phase-guide">
              <p className="explore-subhead">{explore.phaseGuide.label}</p>
              <strong>{explore.phaseGuide.title}</strong>
              <p>{explore.phaseGuide.body}</p>
              <ul className="explore-phase-list">
                {explore.phaseGuide.points.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="explore-action-row">
            <button
              type="button"
              className="button button-primary"
              onClick={applyDirective}
              disabled={completed}
            >
              {completed ? explore.buttons.completed : explore.buttons.apply}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={resetExplorer}
            >
              {explore.buttons.reset}
            </button>
          </div>
        </Reveal>

        <Reveal className="explore-stage" amount={0.12} delay={0.06}>
          <div className="explore-status-grid">
            <div className="explore-stat">
              <span>{explore.status.phase}</span>
              <strong>{phaseNames[phaseIndex]}</strong>
            </div>
            <div className="explore-stat">
              <span>{explore.status.turn}</span>
              <strong>{turnCount}</strong>
            </div>
            <div className="explore-stat">
              <span>{explore.status.retries}</span>
              <strong>{retryCount}</strong>
            </div>
            <div className="explore-stat">
              <span>{explore.status.compactions}</span>
              <strong>{compactCount}</strong>
            </div>
            <div className="explore-stat">
              <span>{explore.status.observer}</span>
              <strong>{observerStatus}</strong>
            </div>
            <div className="explore-stat">
              <span>{explore.status.run}</span>
              <strong>{runState}</strong>
            </div>
          </div>

          <div className="explore-main-grid">
            <motion.div
              className={`explore-preview explore-preview-${decision.tone}`}
              animate={reduceMotion ? undefined : { scale: pulseCount ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="explore-preview-top">
                <p>{explore.preview.policy}</p>
                <span className={`explore-directive-chip explore-directive-chip-${decision.directive}`}>
                  {decision.directive}
                </span>
              </div>
              <h3>{explore.reasonTitles[decision.reasonKey]}</h3>
              <p className="explore-preview-body">{explore.preview.help}</p>

              <div className="explore-summary-grid">
                <div className="explore-role-card">
                  <span className="explore-role-name">{explore.preview.situation}</span>
                  <strong>{activeScenario.label}</strong>
                  <p>{activeScenario.body}</p>
                </div>
                <div className="explore-role-card explore-role-policy">
                  <span className="explore-role-name">{explore.preview.policy}</span>
                  <strong>{decision.directive}</strong>
                  <p>{explore.engineActions[decision.directive]}</p>
                </div>
                <div className="explore-role-card explore-role-engine">
                  <span className="explore-role-name">{explore.preview.engine}</span>
                  <strong>{engineStatus}</strong>
                  <p>{explore.engineDetails[decision.directive]}</p>
                </div>
                <div className="explore-role-card explore-role-observer">
                  <span className="explore-role-name">{explore.preview.observer}</span>
                  <strong>{observerStatus}</strong>
                  <p>
                    {controls.observerOnline
                      ? explore.observerStates.online
                      : explore.observerStates.offline}
                  </p>
                </div>
              </div>

              <div className="explore-rule-box">
                <p className="explore-subhead">{explore.preview.why}</p>
                <strong>{explore.ruleTitles[decision.reasonKey]}</strong>
                <p className="explore-preview-body">{explore.ruleBodies[decision.reasonKey]}</p>
              </div>
            </motion.div>

            <div className="explore-log-shell">
              <div className="explore-log-head">
                <p>{explore.preview.eventLog}</p>
                <span>{explore.status.lastDirective}: {lastDirective}</span>
              </div>
              <div className="explore-log-list" role="log" aria-live="polite">
                <AnimatePresence initial={false}>
                  {logEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      className={`explore-log-entry explore-log-${entry.tone}`}
                      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.24 }}
                    >
                      <span>{entry.actor}</span>
                      <strong>{entry.text}</strong>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.22
  });
  const heroShift = useTransform(scrollYProgress, [0, 0.25], [0, reduceMotion ? 0 : -84]);
  const heroRotate = useTransform(scrollYProgress, [0, 0.3], [0, reduceMotion ? 0 : -2]);

  const [lang] = useState(() =>
    window.location.pathname.startsWith("/ko") ? "ko" : "en"
  );
  const t = i18n[lang];

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <motion.div className="scroll-progress" style={{ scaleX: progressScale }} />

        <header className="hero">
          <div className="nav-row">
            <div className="brand-lockup">
              <span className="brand-dot" />
              <span>WhatTheLoop</span>
            </div>
            <nav>
              <a href="#explore">{t.nav.explore}</a>
              <a href="#problems">{t.nav.problems}</a>
              <a href="#roles">{t.nav.roles}</a>
              <a href="#directives">{t.nav.directives}</a>
              <a href="#lifecycle">{t.nav.lifecycle}</a>
              <a href="#cli">{t.nav.cli}</a>
              <button
                className="lang-toggle"
                onClick={() => { window.location.href = lang === "en" ? "/ko/" : "/"; }}
              >
                {t.langToggle}
              </button>
            </nav>
          </div>

          <div className="hero-grid">
            <motion.div className="hero-copy" style={{ y: heroShift }}>
              <Reveal className="hero-inner" amount={0.1}>
                <p className="eyebrow">{t.hero.eyebrow}</p>
                <h1>{t.hero.h1}</h1>
                <p className="hero-text">{t.hero.body}</p>
                <div className="hero-actions">
                  <a href="#roles" className="button button-primary">
                    {t.hero.btnSplit}
                  </a>
                  <a href="#lifecycle" className="button button-secondary">
                    {t.hero.btnLoop}
                  </a>
                </div>
                <div className="hero-facts">
                  {t.hero.facts.map(f => (
                    <div key={f.strong}>
                      <strong>{f.strong}</strong>
                      <span>{f.span}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </motion.div>

            <motion.div className="hero-visual" style={{ rotate: heroRotate }}>
              <Reveal className="hero-visual-inner" amount={0.1} delay={0.15}>
                <HeroDiagram t={t} />
              </Reveal>
            </motion.div>
          </div>
        </header>

        <main>
          <ExplorableLoop t={t} />

          <section className="section problems-section" id="problems">
            <SectionIntro
              eyebrow={t.problems.eyebrow}
              title={t.problems.h2}
              body={t.problems.body}
            />
            <div className="problems-grid">
              {t.problems.items.map((item, i) => (
                <ProblemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </section>

          <section className="section band">
            <Reveal className="band-grid" amount={0.2}>
              <div className="band-lead">
                <p className="eyebrow">{t.band.eyebrow}</p>
                <h2>{t.band.h2}</h2>
              </div>
              <div className="band-points">
                {t.band.points.map(p => <p key={p}>{p}</p>)}
              </div>
            </Reveal>
          </section>

          <section className="section" id="roles">
            <SectionIntro
              eyebrow={t.roles.eyebrow}
              title={t.roles.title}
              body={t.roles.body}
            />

            <div className="roles-grid">
              {t.roles.items.map((role, index) => (
                <RoleCard key={role.name} role={role} index={index} />
              ))}
            </div>
          </section>

          <section className="section accent-section" id="directives">
            <SectionIntro
              eyebrow={t.directives.eyebrow}
              title={t.directives.title}
              body={t.directives.body}
            />

            <div className="directive-grid">
              {t.directives.items.map((directive, index) => (
                <DirectiveCard key={directive[0]} directive={directive} index={index} />
              ))}
            </div>
          </section>

          <section className="section" id="lifecycle">
            <SectionIntro
              eyebrow={t.lifecycle.eyebrow}
              title={t.lifecycle.title}
              body={t.lifecycle.body}
            />

            <LifecycleRail steps={t.lifecycle.steps} />
          </section>

          <section className="section split-section">
            <Reveal className="panel guarantee-panel">
              <p className="eyebrow">{t.guarantees.eyebrow}</p>
              <h2>{t.guarantees.h2}</h2>
              <ul className="guarantee-list">
                {t.guarantees.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="panel ownership-panel" delay={0.12}>
              <p className="eyebrow">{t.ownership.eyebrow}</p>
              <h2>{t.ownership.h2}</h2>
              <div className="ownership-grid">
                {t.ownership.items.map(item => (
                  <div key={item.name}>
                    <span>{item.name}</span>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          <section className="section terminal-section" id="cli">
            <SectionIntro
              eyebrow={t.cli.eyebrow}
              title={t.cli.title}
              body={t.cli.body}
            />

            <Reveal className="terminal-shell" delay={0.08}>
              <div className="terminal-header">
                <span />
                <span />
                <span />
              </div>
              <pre>{terminalSnippet}</pre>
            </Reveal>
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
