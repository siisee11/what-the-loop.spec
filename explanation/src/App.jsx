import { useState, useEffect } from "react";
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

// Hero: 4 phases — engine runs, outcome travels, policy decides, directive returns
const HERO_DELAYS = [850, 950, 850, 950];
const HERO_DIRECTIVES = ["continue", "retry", "wait", "complete"];

function HeroDiagram({ t }) {
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
          {connOutcome}
        </text>
        <text x="270" y="144" textAnchor="middle"
          fill="rgba(29,23,17,0.34)" fontSize="10"
          fontFamily="Space Grotesk,sans-serif" fontWeight="700" letterSpacing="1.5">
          {connDirective}
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
          {phase === 0 ? ui.turnRunning.replace("{n}", turnNum)
            : phase === 1 ? ui.sendingOutcome
            : phase === 3 ? ui.gotDirective
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
            : phase === 3 ? `→ ${directive}`
            : ui.waiting}
        </span>
      </motion.div>

      {/* Observer — bottom-center */}
      <div className="wtl-node wtl-node-observer">
        <span className="wtl-role">Observer</span>
        <span className="wtl-sub">
          {phase === 1 ? `↗ ${ui.logStart}`
            : phase === 3 ? `↗ ${ui.logComplete}`
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

const LOOP_DIRECTIVES = ["continue", "retry", "wait", "complete"];
const LOOP_DELAYS = [900, 1000, 900, 1000];

function LoopMap({ t }) {
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
  const ui = t.ui;
  const lm = t.loopMap;

  return (
    <Reveal className="loop-map-shell" amount={0.2}>
      <div className="loop-map-copy">
        <p className="eyebrow">{lm.eyebrow}</p>
        <h2>{lm.h2}</h2>
        <p className="section-copy">{lm.body}</p>
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
                <span className="role-tag">{lm.engine.tag}</span>
              </div>
              <ul className="role-owns">
                {lm.engine.owns.map(item => <li key={item}>{item}</li>)}
              </ul>
              <div className={`role-live${phase === 0 ? " role-live-on role-live-engine" : ""}`}>
                {phase === 0 ? ui.turnRunning.replace("{n}", cycle + 1)
                  : phase === 3 ? `${ui.actingOn} ${directive}`
                  : ui.liveIdle || "—"}
              </div>
            </motion.div>

            {/* Bidirectional connector */}
            <div className="role-conn">
              <span className="role-conn-lbl">{lm.connOutcome}</span>
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
              <span className="role-conn-lbl">{lm.connDirective}</span>
            </div>

            {/* Policy */}
            <motion.div
              className={`role-card role-card-policy${phase === 2 ? " role-card-active" : ""}`}
              animate={!reduceMotion && phase === 2 ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.65 }}
            >
              <div className="role-header">
                <strong>Policy</strong>
                <span className="role-tag">{lm.policy.tag}</span>
              </div>
              <ul className="role-owns">
                {lm.policy.owns.map(item => <li key={item}>{item}</li>)}
              </ul>
              <div className={`role-live${phase === 2 ? " role-live-on role-live-policy" : ""}`}>
                {phase === 2 ? ui.interpreting
                  : phase === 3 ? `→ ${directive}`
                  : ui.liveIdle || "—"}
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
                >{ui.eventsDown}</motion.span>
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
                >{ui.eventsDown}</motion.span>
              )}
            </div>
          </div>

          {/* ── Observer ── */}
          <div className="role-card role-card-observer">
            <div className="role-header">
              <strong>Observer</strong>
              <span className="role-tag">{lm.observer.tag}</span>
            </div>
            <div className="role-obs-body">
              <ul className="role-owns">
                {lm.observer.owns.map(item => <li key={item}>{item}</li>)}
              </ul>
              <div className="role-log">
                <span className="role-log-hdr">{ui.logHdr}</span>
                {(phase === 1 || phase === 3) ? (
                  <motion.span
                    key={`log-${phase}-${cycle}`}
                    className="role-log-entry"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {phase === 1 ? ui.logStart : ui.logComplete}
                  </motion.span>
                ) : (
                  <span className="role-log-idle">{ui.logIdle}</span>
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

          <section className="section diagram-section">
            <LoopMap t={t} />
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
