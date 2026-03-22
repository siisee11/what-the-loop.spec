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

const flowStepLabels = ["Init", "Turn", "Interpret", "Handle"];

function HeroDiagram() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setStep(s => (s + 1) % 4), 1900);
    return () => clearInterval(t);
  }, [reduceMotion]);

  return (
    <div className="hero-diagram">
      <div className="flow-diagram">
        <p className="flow-eyebrow">How a WTL run moves</p>

        <div className="flow-row">
          <div className="flow-node">
            <span className="flow-icon" aria-hidden="true">🤖</span>
            <strong>Agent</strong>
          </div>

          <div className="flow-conn">
            <svg viewBox="0 0 100 16" preserveAspectRatio="none" className="conn-svg" aria-hidden="true">
              <line x1="2" y1="8" x2="98" y2="8" className="conn-track" />
              {!reduceMotion && step === 0 && (
                <motion.circle
                  key="dot-a0"
                  cx="2" cy="8" r="5"
                  className="conn-dot-coral"
                  animate={{ cx: 98 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                />
              )}
            </svg>
          </div>

          <motion.div
            className="flow-node flow-node-center"
            animate={!reduceMotion && (step === 0 || step === 3) ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="flow-icon flow-icon-teal" aria-hidden="true">{">>"}</span>
            <strong>Engine</strong>
          </motion.div>

          <div className="flow-conn">
            <svg viewBox="0 0 100 16" preserveAspectRatio="none" className="conn-svg" aria-hidden="true">
              <line x1="2" y1="8" x2="98" y2="8" className="conn-track" />
              {!reduceMotion && step === 1 && (
                <motion.circle
                  key="dot-fwd"
                  cx="2" cy="8" r="5"
                  className="conn-dot-gold"
                  animate={{ cx: 98 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                />
              )}
              {!reduceMotion && step === 2 && (
                <motion.circle
                  key="dot-back"
                  cx="98" cy="8" r="5"
                  className="conn-dot-teal"
                  animate={{ cx: 2 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                />
              )}
            </svg>
          </div>

          <motion.div
            className="flow-node"
            animate={!reduceMotion && step === 2 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="flow-icon" aria-hidden="true">⚙</span>
            <strong>Policy</strong>
          </motion.div>
        </div>

        <div className="flow-obs-area">
          <div className="flow-obs-line" />
          <div className="flow-obs-wrap">
            <div className="flow-obs-node">
              <strong>Observer</strong>
              <span>reads all events</span>
            </div>
            <motion.span
              className="flow-badge"
              animate={reduceMotion ? undefined : { opacity: step === 2 ? 1 : 0.28, y: step === 2 ? 0 : 4 }}
              transition={{ duration: 0.35 }}
            >
              ✓ directive
            </motion.span>
          </div>
        </div>

        <div className="flow-steps">
          {flowStepLabels.flatMap((label, i) => [
            i > 0 && <span key={`sep-${i}`} className="flow-step-sep">←</span>,
            <div key={label} className={`flow-step${step === i ? " flow-step-on" : ""}`}>
              <span>{i + 1}</span>
              <strong>{label}</strong>
            </div>
          ]).filter(Boolean)}
        </div>
      </div>
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

const archCallers = ["OpenClaw", "NanoClaw", "IronClaw", "Any Agent"];
const archDirectives = ["continue", "wait", "retry", "compact", "advance_phase", "complete"];

function LoopMap() {
  const reduceMotion = useReducedMotion();

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
        <div className="arch-diagram">
          <p className="arch-tier-label">Callers</p>
          <div className="arch-tier">
            {archCallers.map((c, i) => (
              <motion.div
                key={c}
                className="arch-cell arch-cell-plain"
                animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.4 }}
              >
                {c}
              </motion.div>
            ))}
          </div>

          <div className="arch-arrow-row">
            {archCallers.map((_, i) => (
              <div key={i} className="arch-arrow-col">
                <motion.div
                  className="arch-arrow-stem"
                  animate={reduceMotion ? undefined : { scaleY: [0.6, 1, 0.6], opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
                />
                <div className="arch-arrow-head" />
              </div>
            ))}
          </div>

          <div className="arch-gateway">
            <p className="arch-gateway-label">WTL LOOP</p>
            <div className="arch-gateway-body">
              <div className="arch-cell arch-cell-core arch-cell-coral">
                <strong>Engine</strong>
                <span>Runs turns · enforces limits</span>
              </div>
              <div className="arch-inner-dash" />
              <div className="arch-cell arch-cell-core arch-cell-gold arch-cell-focus">
                <strong>Policy</strong>
                <span>Interprets outcomes · returns directives</span>
              </div>
              <div className="arch-inner-dash" />
              <div className="arch-cell arch-cell-core arch-cell-teal">
                <strong>Observer</strong>
                <span>Read-only event visibility</span>
              </div>
            </div>
          </div>

          <div className="arch-arrow-row">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="arch-arrow-col">
                <motion.div
                  className="arch-arrow-stem"
                  animate={reduceMotion ? undefined : { scaleY: [0.6, 1, 0.6], opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 + 0.25 }}
                />
                <div className="arch-arrow-head" />
              </div>
            ))}
          </div>

          <p className="arch-tier-label">Directives</p>
          <div className="arch-tier arch-tier-directives">
            {archDirectives.map((d, i) => (
              <motion.div
                key={d}
                className="arch-cell arch-cell-plain arch-cell-sm"
                animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              >
                {d}
              </motion.div>
            ))}
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
