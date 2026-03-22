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

function HeroDiagram() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-diagram">
      <motion.div
        className="diagram-ambient-grid"
        animate={reduceMotion ? undefined : { rotate: [0, 12, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="diagram-beam diagram-beam-a"
        animate={reduceMotion ? undefined : { x: ["-10%", "20%", "-10%"], y: ["-4%", "8%", "-4%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="diagram-beam diagram-beam-b"
        animate={reduceMotion ? undefined : { x: ["12%", "-8%", "12%"], y: ["8%", "-4%", "8%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="diagram-halo diagram-halo-a"
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="diagram-halo diagram-halo-b"
        animate={reduceMotion ? undefined : { scale: [1.02, 0.96, 1.02], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="diagram-orbit diagram-orbit-outer"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <span className="orbit-dot orbit-dot-coral" />
        <span className="orbit-dot orbit-dot-gold" />
      </motion.div>
      <motion.div
        className="diagram-orbit diagram-orbit-inner"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <span className="orbit-dot orbit-dot-teal" />
      </motion.div>
      <div className="diagram-ring" />
      <svg className="diagram-links" viewBox="0 0 540 540" aria-hidden="true">
        <path
          d="M145 122C200 150 210 178 238 228"
          className="diagram-link-path"
        />
        <path
          d="M392 158C350 184 332 195 300 230"
          className="diagram-link-path"
        />
        <path
          d="M270 356C270 325 270 314 270 300"
          className="diagram-link-path"
        />
        <motion.path
          d="M145 122C200 150 210 178 238 228"
          className="diagram-link-active diagram-link-active-coral"
          animate={reduceMotion ? undefined : { pathLength: [0.12, 1, 0.12], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M392 158C350 184 332 195 300 230"
          className="diagram-link-active diagram-link-active-gold"
          animate={reduceMotion ? undefined : { pathLength: [0.14, 1, 0.14], opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.path
          d="M270 356C270 325 270 314 270 300"
          className="diagram-link-active diagram-link-active-teal"
          animate={reduceMotion ? undefined : { pathLength: [0.2, 1, 0.2], opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.circle
          cx="145"
          cy="122"
          r="6"
          className="diagram-signal diagram-signal-coral"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 37, 67, 93],
                  y: [0, 21, 54, 106]
                }
          }
          transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="392"
          cy="158"
          r="6"
          className="diagram-signal diagram-signal-gold"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -32, -62, -92],
                  y: [0, 22, 40, 72]
                }
          }
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.circle
          cx="270"
          cy="356"
          r="6"
          className="diagram-signal diagram-signal-teal"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 0, 0],
                  y: [0, -28, -56]
                }
          }
          transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
      </svg>

      <motion.div
        className="diagram-core"
        initial={{ opacity: 0, scale: 0.86 }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, scale: [1, 1.04, 1], boxShadow: ["0 30px 60px rgba(11, 34, 44, 0.28)", "0 36px 90px rgba(11, 34, 44, 0.34)", "0 30px 60px rgba(11, 34, 44, 0.28)"] }
        }
        transition={{
          duration: 6,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "easeInOut"
        }}
      >
        <span>Run</span>
        <strong>One shared execution loop</strong>
      </motion.div>

      <motion.article
        className="diagram-card diagram-card-engine"
        animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, -1.5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <p>Engine</p>
        <span>Runs turns and enforces limits</span>
      </motion.article>

      <motion.article
        className="diagram-card diagram-card-policy"
        animate={reduceMotion ? undefined : { y: [0, 12, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <p>Policy</p>
        <span>Assigns meaning and emits directives</span>
      </motion.article>

      <motion.article
        className="diagram-card diagram-card-observer"
        animate={reduceMotion ? undefined : { y: [0, -8, 0], x: [0, -4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <p>Observer</p>
        <span>Sees everything, controls nothing</span>
      </motion.article>

      <div className="diagram-chip-rail">
        {heroChips.map((chip, index) => (
          <motion.div
            key={chip.label}
            className={`diagram-chip diagram-chip-${chip.tone}`}
            animate={reduceMotion ? undefined : { y: [0, -6, 0], opacity: [0.72, 1, 0.72] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.35
            }}
          >
            {chip.label}
          </motion.div>
        ))}
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
        <motion.div
          className="loop-map-sheen"
          animate={reduceMotion ? undefined : { x: ["-12%", "12%", "-12%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <svg className="loop-map-svg" viewBox="0 0 760 520" aria-hidden="true">
          <path
            d="M108 122H235H430C505 122 555 152 604 204C578 262 533 317 460 338H183C122 338 92 300 92 248V156C92 136 96 128 108 122Z"
            className="loop-map-path"
          />
          <path
            d="M430 122C484 122 564 96 640 58"
            className="loop-map-branch"
          />
          <path
            d="M604 204C632 250 650 294 664 342"
            className="loop-map-branch"
          />
          <path
            d="M183 338C152 338 120 338 96 334"
            className="loop-map-branch"
          />

          <motion.path
            d="M108 122H235H430C505 122 555 152 604 204C578 262 533 317 460 338H183C122 338 92 300 92 248V156C92 136 96 128 108 122Z"
            className="loop-map-active"
            animate={reduceMotion ? undefined : { pathLength: [0.1, 1, 0.1], opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M430 122C484 122 564 96 640 58"
            className="loop-map-active loop-map-active-wait"
            animate={reduceMotion ? undefined : { pathLength: [0.15, 1, 0.15], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M604 204C632 250 650 294 664 342"
            className="loop-map-active loop-map-active-complete"
            animate={reduceMotion ? undefined : { pathLength: [0.2, 1, 0.2], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />

          <motion.circle
            cx="108"
            cy="122"
            r="7"
            className="loop-map-pulse loop-map-pulse-main"
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 127, 322, 496, 352, 75, -16, 0],
                    y: [0, 0, 0, 82, 216, 216, 126, 0]
                  }
            }
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="430"
            cy="122"
            r="6"
            className="loop-map-pulse loop-map-pulse-wait"
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 78, 150, 210, 150, 78, 0],
                    y: [0, -8, -30, -64, -30, -8, 0]
                  }
            }
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
          />
          <motion.circle
            cx="604"
            cy="204"
            r="6"
            className="loop-map-pulse loop-map-pulse-complete"
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 24, 44, 60],
                    y: [0, 48, 92, 138]
                  }
            }
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.15 }}
          />
        </svg>

        {loopNodes.map((node, index) => (
          <motion.article
            key={node.name}
            className={`loop-node loop-node-${node.tone}`}
            style={{ left: node.x, top: node.y }}
            animate={
              reduceMotion
                ? undefined
                : { y: [0, index % 2 === 0 ? -8 : 8, 0], rotate: [0, index % 2 === 0 ? -1 : 1, 0] }
            }
            transition={{
              duration: 5.5 + index * 0.25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.18
            }}
          >
            <strong>{node.name}</strong>
            <span>{node.body}</span>
          </motion.article>
        ))}

        <div className="loop-map-legend">
          <div>
            <span className="legend-swatch legend-main" />
            <p>Main run loop</p>
          </div>
          <div>
            <span className="legend-swatch legend-wait" />
            <p>Wait branch</p>
          </div>
          <div>
            <span className="legend-swatch legend-complete" />
            <p>Completion branch</p>
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
