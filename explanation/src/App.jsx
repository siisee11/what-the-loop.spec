import { useState, useEffect } from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "motion/react";

const roles = [
  {
    name: "Engine",
    tag: "Loop mechanics",
    accent: "var(--coral)",
    points: [
      "Starts turns, enforces limits, and owns thread lifecycle.",
      "Performs compaction, retry handling, and termination.",
      "Must not decide what a turn means."
    ]
  },
  {
    name: "Policy",
    tag: "Workflow meaning",
    accent: "var(--gold)",
    points: [
      "Interprets turn outcomes and returns the next directive.",
      "Owns completion gating, phase ordering, and wait states.",
      "Defines the execution plan for each runnable turn."
    ]
  },
  {
    name: "Observer",
    tag: "Read-only visibility",
    accent: "var(--teal)",
    points: [
      "Receives lifecycle events like run start, phase change, and completion.",
      "Can log, trace, or render UI without affecting correctness.",
      "Must never become a control dependency."
    ]
  }
];

const directives = [
  ["continue", "Proceed with the next turn in the current phase."],
  ["wait", "Stop launching turns until external input resolves the block."],
  ["retry", "Retry the last turn after a recoverable failure."],
  ["compact", "Compress context before the next step."],
  ["advance_phase", "Install a new execution plan for the next stage."],
  ["complete", "Terminate only after explicit policy approval."]
];

const lifecycle = [
  {
    step: "Init",
    body: "The engine initializes run state, the policy seeds its internal state, and observers get the first event."
  },
  {
    step: "Turn",
    body: "If the policy is runnable, the engine executes a turn using the current execution plan."
  },
  {
    step: "Interpret",
    body: "The policy receives the outcome and returns a directive that gives the engine meaning."
  },
  {
    step: "Handle",
    body: "The engine loops, waits, retries, compacts, changes phase, or terminates based on that directive."
  }
];

const guarantees = [
  "Completion only happens when the policy explicitly says `complete`.",
  "Waiting is a real state: no new turns may start while blocked.",
  "Thread identity remains stable when a phase asks for reuse.",
  "Observers can record everything without steering execution.",
  "Exhaustion and recoverable failure stay distinguishable in external reporting."
];

const heroChips = [
  { label: "continue", tone: "coral" },
  { label: "retry", tone: "gold" },
  { label: "complete", tone: "teal" }
];

const loopNodes = [
  {
    name: "Init",
    body: "Seed policy state and emit run start.",
    x: "11%",
    y: "18%",
    tone: "coral"
  },
  {
    name: "Turn",
    body: "The engine executes one runnable turn.",
    x: "31%",
    y: "18%",
    tone: "gold"
  },
  {
    name: "Policy",
    body: "Interpret the result and return meaning.",
    x: "57%",
    y: "18%",
    tone: "teal"
  },
  {
    name: "Directive",
    body: "continue, wait, retry, compact, advance_phase, complete",
    x: "73%",
    y: "39%",
    tone: "ink"
  },
  {
    name: "Engine",
    body: "Handle mechanics and route the next action.",
    x: "48%",
    y: "71%",
    tone: "teal"
  },
  {
    name: "Observer",
    body: "Receive events without steering execution.",
    x: "13%",
    y: "69%",
    tone: "coral"
  },
  {
    name: "Wait",
    body: "External input pauses new turns.",
    x: "73%",
    y: "8%",
    tone: "gold"
  },
  {
    name: "Complete",
    body: "Termination only with explicit approval.",
    x: "78%",
    y: "76%",
    tone: "teal"
  }
];

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

// Hero: 4 phases — engine runs, outcome travels, policy decides, directive returns
const HERO_DELAYS = [850, 950, 850, 950];
const HERO_DIRECTIVES = ["continue", "retry", "wait", "complete"];

function HeroDiagram() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let ph = 0, tid;
    const tick = () => {
      ph = (ph + 1) % 4;
      setPhase(ph);
      if (ph === 0) setCycle(c => c + 1);
      tid = setTimeout(tick, HERO_DELAYS[ph]);
    };
    tid = setTimeout(tick, HERO_DELAYS[0]);
    return () => clearTimeout(tid);
  }, [reduceMotion]);

  const directive = HERO_DIRECTIVES[cycle % 4];
  const turnNum = cycle + 1;

  // viewBox 540×540 (1:1 square)
  // Engine card:  left=36  top=70  w=158 h=82  → right=194, center=(115,111)
  // Policy card:  left=346 top=70  w=158 h=82  → left=346,  center=(425,111)
  // Horizontal lines at y=98 (outcome →) and y=124 (← directive), x: 194↔346
  // Observer card: centered x=270, top=390, w=170, h=80 → center=(270,430)
  // Diagonals: Engine(115,152)→Observer(220,390) and Policy(425,152)→Observer(320,390)

  return (
    <div className="hero-diagram">
      <svg viewBox="0 0 540 540" className="wtl-track-svg" aria-hidden="true">

        {/* ── Horizontal lines: Engine ↔ Policy ── */}
        {/* outcome line */}
        <line x1="194" y1="98" x2="346" y2="98"
          stroke="rgba(29,23,17,0.16)" strokeWidth="1.5" strokeDasharray="6 9" />
        <polygon points="341,93 349,98 341,103" fill="rgba(209,77,44,0.45)" />

        {/* directive line */}
        <line x1="346" y1="124" x2="194" y2="124"
          stroke="rgba(29,23,17,0.16)" strokeWidth="1.5" strokeDasharray="6 9" />
        <polygon points="199,119 191,124 199,129" fill="rgba(0,109,114,0.45)" />

        {/* line labels */}
        <text x="270" y="88" textAnchor="middle"
          fill="rgba(29,23,17,0.34)" fontSize="10"
          fontFamily="Space Grotesk,sans-serif" fontWeight="700" letterSpacing="1.5">
          OUTCOME →
        </text>
        <text x="270" y="144" textAnchor="middle"
          fill="rgba(29,23,17,0.34)" fontSize="10"
          fontFamily="Space Grotesk,sans-serif" fontWeight="700" letterSpacing="1.5">
          ← DIRECTIVE
        </text>

        {/* ── Diagonal lines: Engine/Policy → Observer ── */}
        <line x1="115" y1="152" x2="220" y2="390"
          stroke="rgba(29,23,17,0.1)" strokeWidth="1.5" strokeDasharray="5 7" />
        <line x1="425" y1="152" x2="320" y2="390"
          stroke="rgba(29,23,17,0.1)" strokeWidth="1.5" strokeDasharray="5 7" />

        {/* "events" labels on diagonals */}
        <text x="152" y="275" textAnchor="middle"
          fill="rgba(0,109,114,0.4)" fontSize="9"
          fontFamily="Space Grotesk,sans-serif" fontWeight="700" letterSpacing="1"
          transform="rotate(-22,152,275)">
          events
        </text>
        <text x="388" y="275" textAnchor="middle"
          fill="rgba(0,109,114,0.4)" fontSize="9"
          fontFamily="Space Grotesk,sans-serif" fontWeight="700" letterSpacing="1"
          transform="rotate(22,388,275)">
          events
        </text>

        {/* ── Animated dots ── */}

        {/* Outcome dot: Engine→Policy */}
        {!reduceMotion && phase === 1 && (
          <motion.circle
            key={`fwd-${cycle}`}
            r="7" fill="var(--coral)" stroke="rgba(255,255,255,0.7)" strokeWidth="3"
            initial={{ x: 194, y: 98 }}
            animate={{ x: 346 }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
          />
        )}

        {/* Directive dot: Policy→Engine */}
        {!reduceMotion && phase === 3 && (
          <motion.circle
            key={`back-${cycle}`}
            r="7" fill="var(--teal)" stroke="rgba(255,255,255,0.7)" strokeWidth="3"
            initial={{ x: 346, y: 124 }}
            animate={{ x: 194 }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
          />
        )}

        {/* Event pulse: Engine→Observer */}
        {!reduceMotion && (phase === 1 || phase === 3) && (
          <motion.circle
            key={`obs-l-${phase}-${cycle}`}
            r="4" fill="rgba(0,109,114,0.72)"
            initial={{ x: 115, y: 152 }}
            animate={{ x: 220, y: 390, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.35 }}
          />
        )}

        {/* Event pulse: Policy→Observer */}
        {!reduceMotion && (phase === 1 || phase === 3) && (
          <motion.circle
            key={`obs-r-${phase}-${cycle}`}
            r="4" fill="rgba(0,109,114,0.72)"
            initial={{ x: 425, y: 152 }}
            animate={{ x: 320, y: 390, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.45 }}
          />
        )}
      </svg>

      {/* Engine node — top-left */}
      <motion.div
        className={`wtl-node wtl-node-engine${phase === 0 ? " wtl-node-active" : ""}`}
        animate={!reduceMotion && phase === 0 ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 0.65 }}
      >
        <span className="wtl-role">Engine</span>
        <span className="wtl-sub">
          {phase === 0 ? `Turn ${turnNum} running…`
            : phase === 1 ? "Sending outcome"
            : phase === 3 ? "Got directive"
            : "Idle"}
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
          {phase === 2 ? "Interpreting…"
            : phase === 3 ? `→ ${directive}`
            : "Waiting"}
        </span>
      </motion.div>

      {/* Observer — bottom-center */}
      <div className="wtl-node wtl-node-observer">
        <span className="wtl-role">Observer</span>
        <span className="wtl-sub">
          {phase === 1 ? "↗ turn:start"
            : phase === 3 ? "↗ turn:complete"
            : "watching…"}
        </span>
      </div>

      {/* Directive chip */}
      <motion.span
        className={`wtl-chip wtl-chip-${directive}`}
        animate={!reduceMotion ? { opacity: phase >= 2 ? 1 : 0.18 } : undefined}
        transition={{ duration: 0.3 }}
      >
        {directive}
      </motion.span>
    </div>
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

function LifecycleRail() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="lifecycle-rail">
      {lifecycle.map((item, index) => (
        <Reveal className="lifecycle-step" key={item.step} delay={index * 0.08}>
          <div className="lifecycle-index">0{index + 1}</div>
          <div>
            <h3>{item.step}</h3>
            <p>{item.body}</p>
          </div>
          {index < lifecycle.length - 1 ? (
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

const LOOP_DIRECTIVES = ["continue", "retry", "wait", "complete"];
const LOOP_DELAYS = [900, 1000, 900, 1000];

function LoopMap() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let ph = 0, tid;
    const tick = () => {
      ph = (ph + 1) % 4;
      setPhase(ph);
      if (ph === 0) setCycle(c => c + 1);
      tid = setTimeout(tick, LOOP_DELAYS[ph]);
    };
    tid = setTimeout(tick, LOOP_DELAYS[0]);
    return () => clearTimeout(tid);
  }, [reduceMotion]);

  const directive = LOOP_DIRECTIVES[cycle % 4];
  const dirColor = { continue: "coral", retry: "gold", wait: "gold", complete: "teal" }[directive];

  return (
    <Reveal className="loop-map-shell" amount={0.2}>
      <div className="loop-map-copy">
        <p className="eyebrow">Animated system map</p>
        <h2>Signals move, responsibilities stay fixed.</h2>
        <p className="section-copy">
          The point of WTL is not that nothing moves. It is that movement has a
          contract. The engine cycles, the policy interprets, the observer
          listens, and the run stays legible even while directives branch into
          waiting or completion.
        </p>
      </div>

      <div className="loop-map-stage">
        <div className="role-diagram">

          {/* ── Top row: Engine ↔ Policy ── */}
          <div className="role-top">

            {/* Engine */}
            <motion.div
              className={`role-card role-card-engine${phase === 0 ? " role-card-active" : ""}`}
              animate={!reduceMotion && phase === 0 ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.65 }}
            >
              <div className="role-header">
                <strong>Engine</strong>
                <span className="role-tag">Mechanics</span>
              </div>
              <ul className="role-owns">
                <li>Starts and runs turns</li>
                <li>Enforces iteration limits</li>
                <li>Handles retries and waits</li>
                <li>Owns thread lifecycle</li>
              </ul>
              <div className={`role-live${phase === 0 ? " role-live-on role-live-engine" : ""}`}>
                {phase === 0 ? `Turn ${cycle + 1} running…`
                  : phase === 3 ? `Acting on: ${directive}`
                  : "—"}
              </div>
            </motion.div>

            {/* Bidirectional connector */}
            <div className="role-conn">
              <span className="role-conn-lbl">outcome →</span>
              <div className="role-conn-svg-wrap">
                <svg viewBox="0 0 72 64" className="role-conn-svg" aria-hidden="true">
                  {/* Outcome track top */}
                  <line x1="2" y1="18" x2="70" y2="18"
                    stroke="rgba(29,23,17,0.16)" strokeWidth="1.5" strokeDasharray="5 7" />
                  <polygon points="66,14 72,18 66,22" fill="rgba(209,77,44,0.45)" />
                  {/* Directive track bottom */}
                  <line x1="70" y1="46" x2="2" y2="46"
                    stroke="rgba(29,23,17,0.16)" strokeWidth="1.5" strokeDasharray="5 7" />
                  <polygon points="6,42 0,46 6,50" fill="rgba(0,109,114,0.45)" />

                  {/* Outcome dot */}
                  {!reduceMotion && phase === 1 && (
                    <motion.circle key={`lm-fwd-${cycle}`}
                      cy="18" r="6"
                      fill="var(--coral)" stroke="white" strokeWidth="3"
                      initial={{ cx: 2 }} animate={{ cx: 70 }}
                      transition={{ duration: 1.0, ease: "easeInOut" }}
                    />
                  )}
                  {/* Directive dot */}
                  {!reduceMotion && phase === 3 && (
                    <motion.circle key={`lm-back-${cycle}`}
                      cy="46" r="6"
                      fill="var(--teal)" stroke="white" strokeWidth="3"
                      initial={{ cx: 70 }} animate={{ cx: 2 }}
                      transition={{ duration: 1.0, ease: "easeInOut" }}
                    />
                  )}
                </svg>
              </div>
              <span className="role-conn-lbl">← directive</span>
            </div>

            {/* Policy */}
            <motion.div
              className={`role-card role-card-policy${phase === 2 ? " role-card-active" : ""}`}
              animate={!reduceMotion && phase === 2 ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.65 }}
            >
              <div className="role-header">
                <strong>Policy</strong>
                <span className="role-tag">Meaning</span>
              </div>
              <ul className="role-owns">
                <li>Interprets turn outcomes</li>
                <li>Returns directives</li>
                <li>Controls completion gating</li>
                <li>Owns phase ordering</li>
              </ul>
              <div className={`role-live${phase === 2 ? " role-live-on role-live-policy" : ""}`}>
                {phase === 2 ? "Interpreting…"
                  : phase === 3 ? `→ ${directive}`
                  : "—"}
              </div>
            </motion.div>
          </div>

          {/* ── Events flowing down to Observer ── */}
          <div className="role-event-bridge">
            <div className="role-event-col">
              {!reduceMotion && (phase === 1 || phase === 3) && (
                <motion.span
                  key={`ev-l-${phase}-${cycle}`}
                  className="role-event-label"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [0, 8] }}
                  transition={{ duration: 0.9 }}
                >events ↓</motion.span>
              )}
            </div>
            <div className="role-event-divider" />
            <div className="role-event-col">
              {!reduceMotion && (phase === 1 || phase === 3) && (
                <motion.span
                  key={`ev-r-${phase}-${cycle}`}
                  className="role-event-label"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [0, 8] }}
                  transition={{ duration: 0.9, delay: 0.1 }}
                >events ↓</motion.span>
              )}
            </div>
          </div>

          {/* ── Observer ── */}
          <div className="role-card role-card-observer">
            <div className="role-header">
              <strong>Observer</strong>
              <span className="role-tag">Visibility · never controls</span>
            </div>
            <div className="role-obs-body">
              <ul className="role-owns">
                <li>Receives all lifecycle events</li>
                <li>Cannot steer execution</li>
                <li>Logs · traces · UI · audit</li>
              </ul>
              <div className="role-log">
                <span className="role-log-hdr">event log</span>
                {(phase === 1 || phase === 3) ? (
                  <motion.span
                    key={`log-${phase}-${cycle}`}
                    className="role-log-entry"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {phase === 1 ? "turn:start" : "turn:complete"}
                  </motion.span>
                ) : (
                  <span className="role-log-idle">…</span>
                )}
                {phase === 3 && (
                  <motion.span
                    key={`log-dir-${cycle}`}
                    className={`role-log-directive role-log-${dirColor}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    policy:{directive}
                  </motion.span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Reveal>
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
              <a href="#roles">Roles</a>
              <a href="#directives">Directives</a>
              <a href="#lifecycle">Lifecycle</a>
              <a href="#cli">CLI</a>
            </nav>
          </div>

          <div className="hero-grid">
            <motion.div className="hero-copy" style={{ y: heroShift }}>
              <Reveal className="hero-inner" amount={0.1}>
                <p className="eyebrow">Spec-first execution contract</p>
                <h1>
                  WhatTheLoop explains how an agent run keeps moving without
                  hiding who owns what.
                </h1>
                <p className="hero-text">
                  WTL is not a framework and not a runtime. It is the shared
                  behavioral contract between the part that runs the loop, the
                  part that interprets outcomes, and the part that watches.
                </p>
                <div className="hero-actions">
                  <a href="#roles" className="button button-primary">
                    See the split
                  </a>
                  <a href="#lifecycle" className="button button-secondary">
                    Follow the loop
                  </a>
                </div>
                <div className="hero-facts">
                  <div>
                    <strong>3 roles</strong>
                    <span>Engine, Policy, Observer</span>
                  </div>
                  <div>
                    <strong>6 directives</strong>
                    <span>Meaning returned to the engine</span>
                  </div>
                  <div>
                    <strong>1 rule</strong>
                    <span>The engine never invents semantics</span>
                  </div>
                </div>
              </Reveal>
            </motion.div>

            <motion.div className="hero-visual" style={{ rotate: heroRotate }}>
              <Reveal className="hero-visual-inner" amount={0.1} delay={0.15}>
                <HeroDiagram />
              </Reveal>
            </motion.div>
          </div>
        </header>

        <main>
          <section className="section band">
            <Reveal className="band-grid" amount={0.2}>
              <div className="band-lead">
                <p className="eyebrow">Why this matters</p>
                <h2>WTL separates mechanics from meaning.</h2>
              </div>
              <div className="band-points">
                <p>
                  You can swap policies without rewriting the loop controller.
                </p>
                <p>
                  You can add observers for logs, traces, and UI without making
                  them correctness dependencies.
                </p>
                <p>
                  You can verify invariants like completion gating and thread
                  reuse because ownership boundaries stay explicit.
                </p>
              </div>
            </Reveal>
          </section>

          <section className="section" id="roles">
            <SectionIntro
              eyebrow="Three roles"
              title="Every run is a small constitutional system."
              body="The spec stays small by assigning a single job to each actor. Once those responsibilities stop leaking across boundaries, the loop becomes reusable."
            />

            <div className="roles-grid">
              {roles.map((role, index) => (
                <RoleCard key={role.name} role={role} index={index} />
              ))}
            </div>
          </section>

          <section className="section accent-section" id="directives">
            <SectionIntro
              eyebrow="Directive grammar"
              title="The policy speaks in a tight set of loop instructions."
              body="Instead of micromanaging execution, the policy returns directives. The engine treats those as authoritative and handles the mechanics."
            />

            <div className="directive-grid">
              {directives.map((directive, index) => (
                <DirectiveCard key={directive[0]} directive={directive} index={index} />
              ))}
            </div>
          </section>

          <section className="section" id="lifecycle">
            <SectionIntro
              eyebrow="Lifecycle"
              title="A run keeps cycling until the policy blocks it or ends it."
              body="The engine starts turns, the policy interprets outcomes, and observers get every transition. Waiting, retrying, compacting, and completion are all first-class states."
            />

            <LifecycleRail />
          </section>

          <section className="section diagram-section">
            <LoopMap />
          </section>

          <section className="section split-section">
            <Reveal className="panel guarantee-panel">
              <p className="eyebrow">Hard guarantees</p>
              <h2>The spec defines what must stay true.</h2>
              <ul className="guarantee-list">
                {guarantees.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="panel ownership-panel" delay={0.12}>
              <p className="eyebrow">State ownership</p>
              <h2>Each subsystem owns different failure modes.</h2>
              <div className="ownership-grid">
                <div>
                  <span>Engine</span>
                  <p>Loop control, iteration count, retries, waiting, thread lifecycle.</p>
                </div>
                <div>
                  <span>Policy</span>
                  <p>Completion gating, phase order, execution plans, thread reuse boundaries.</p>
                </div>
                <div>
                  <span>Observer</span>
                  <p>Logs, traces, metrics, UI, and audit views.</p>
                </div>
              </div>
            </Reveal>
          </section>

          <section className="section terminal-section" id="cli">
            <SectionIntro
              eyebrow="Minimal implementation"
              title="The spec also defines a tiny CLI contract."
              body="The first implementation is intentionally small: a single prompt, turn logs, streamed runtime output, and a completion marker protocol."
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
