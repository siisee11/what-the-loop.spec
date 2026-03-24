import { useEffect, useState } from "react";
import {
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

function DiagramSection({ t }) {
  const items = [
    {
      key: "engine",
      title: "Engine",
      tag: t.loopMap.engine.tag,
      body: t.loopMap.engine.body
    },
    {
      key: "policy",
      title: "Policy",
      tag: t.loopMap.policy.tag,
      body: t.loopMap.policy.body
    },
    {
      key: "observer",
      title: "Observer",
      tag: t.loopMap.observer.tag,
      body: t.loopMap.observer.body
    }
  ];

  return (
    <section className="section diagram-section" id="diagram">
      <Reveal className="diagram-bento" amount={0.12}>
        <div className="diagram-main-card">
          <div className="diagram-main-copy">
            <p className="diagram-kicker">{t.loopMap.eyebrow}</p>
            <h2>{t.loopMap.h2}</h2>
            <p className="diagram-lead">{t.loopMap.body}</p>
            <p className="diagram-summary">{t.loopMap.lead}</p>

            <ul className="diagram-note-list">
              {t.loopMap.notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="diagram-main-visual">
            <HeroDiagram t={t} />
          </div>
        </div>

        <div className="diagram-card-grid">
          {items.map((item) => (
            <div key={item.key} className={`diagram-copy-card diagram-copy-${item.key}`}>
              <span>{item.title}</span>
              <strong>{item.tag}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
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
              <a href="#diagram">{t.nav.diagram}</a>
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
                  <a href="#diagram" className="button button-primary">
                    {t.hero.btnSplit}
                  </a>
                  <a href="#lifecycle" className="button button-secondary">
                    {t.hero.btnLoop}
                  </a>
                </div>
              </Reveal>
            </motion.div>
          </div>
        </header>

        <main>
          <DiagramSection t={t} />

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
