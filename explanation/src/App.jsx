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

// Hero: start, outcome, policy, directive, engine follow-through
const HERO_DELAYS = [850, 950, 850, 950, 900];
const DEMO_TURN_DIRECTIVES = ["continue", "continue", "complete"];

function HeroDiagram({ t }) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const directive = DEMO_TURN_DIRECTIVES[turnIndex];
    const tid = setTimeout(() => {
      if (phase === 4) {
        setTurnIndex(0);
        setPhase(0);
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
  }, [phase, reduceMotion, turnIndex]);

  const directive = DEMO_TURN_DIRECTIVES[turnIndex];
  const turnNum = turnIndex + 1;
  const ui = t.ui;
  const connOutcome = (t.loopMap.connOutcome || "outcome →").toUpperCase();
  const connDirective = (t.loopMap.connDirective || "← directive").toUpperCase();

  return (
    <div className="hero-diagram">
      <svg viewBox="0 0 540 540" className="wtl-track-svg" aria-hidden="true">
        <rect x="24" y="24" width="492" height="492" className="wtl-loop-frame" />

        <line x1="123" y1="110" x2="123" y2="186" className="wtl-line-backbone" />
        <line x1="123" y1="110" x2="123" y2="186" className="wtl-line-accent wtl-line-start" />
        <polygon points="117,180 123,192 129,180" className="wtl-arrow wtl-arrow-start" />

        <line x1="218" y1="228" x2="322" y2="228" className="wtl-line-backbone" />
        <line x1="218" y1="228" x2="322" y2="228" className="wtl-line-accent wtl-line-outcome" />
        <polygon points="314,221 328,228 314,235" className="wtl-arrow wtl-arrow-outcome" />

        <line x1="322" y1="252" x2="218" y2="252" className="wtl-line-backbone" />
        <line x1="322" y1="252" x2="218" y2="252" className="wtl-line-accent wtl-line-directive" />
        <polygon points="226,245 212,252 226,259" className="wtl-arrow wtl-arrow-directive" />

        <text x="270" y="214" textAnchor="middle" className="wtl-track-label wtl-track-label-outcome">
          {connOutcome}
        </text>
        <text x="270" y="270" textAnchor="middle" className="wtl-track-label wtl-track-label-directive">
          {connDirective}
        </text>

        <polyline points="118,288 118,380 192,380" className="wtl-line-backbone wtl-line-event-backbone" />
        <polyline points="118,288 118,380 192,380" className="wtl-line-accent wtl-line-event" />
        <polygon points="184,375 196,380 184,385" className="wtl-arrow wtl-arrow-event" />

        <polyline points="422,288 422,380 348,380" className="wtl-line-backbone wtl-line-event-backbone" />
        <polyline points="422,288 422,380 348,380" className="wtl-line-accent wtl-line-event" />
        <polygon points="356,375 344,380 356,385" className="wtl-arrow wtl-arrow-event" />

        <text x="166" y="366" textAnchor="middle" className="wtl-track-label wtl-track-label-event">
          events
        </text>
        <text x="374" y="366" textAnchor="middle" className="wtl-track-label wtl-track-label-event">
          events
        </text>

        {!reduceMotion && turnIndex === 0 && phase === 0 && (
          <motion.circle
            key="start-run"
            r="8"
            fill="var(--sky)"
            stroke="var(--ink)"
            strokeWidth="3"
            initial={{ x: 123, y: 110 }}
            animate={{ x: 123, y: 186 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}

        {!reduceMotion && phase === 1 && (
          <motion.circle
            key={`fwd-${turnIndex}`}
            r="8"
            fill="var(--coral)"
            stroke="var(--ink)"
            strokeWidth="3"
            initial={{ x: 218, y: 228 }}
            animate={{ x: 322 }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
          />
        )}

        {!reduceMotion && phase === 3 && (
          <motion.circle
            key={`back-${turnIndex}`}
            r="8"
            fill="var(--teal)"
            stroke="var(--ink)"
            strokeWidth="3"
            initial={{ x: 322, y: 252 }}
            animate={{ x: 218 }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
          />
        )}

        {!reduceMotion && (phase === 1 || phase === 3) && (
          <motion.circle
            key={`obs-l-${phase}-${turnIndex}`}
            r="5"
            fill="var(--sky)"
            stroke="var(--ink)"
            strokeWidth="2.5"
            initial={{ x: 118, y: 288 }}
            animate={{ x: 192, y: 380, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.35 }}
          />
        )}

        {!reduceMotion && (phase === 1 || phase === 3) && (
          <motion.circle
            key={`obs-r-${phase}-${turnIndex}`}
            r="5"
            fill="var(--sky)"
            stroke="var(--ink)"
            strokeWidth="2.5"
            initial={{ x: 422, y: 288 }}
            animate={{ x: 348, y: 380, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.45 }}
          />
        )}

        <line x1="123" y1="288" x2="123" y2="420" className="wtl-line-backbone" />
        <line x1="123" y1="288" x2="123" y2="420" className="wtl-line-accent wtl-line-end" />
        <polygon points="117,414 123,426 129,414" className="wtl-arrow wtl-arrow-end" />

        {!reduceMotion && phase === 4 && (
          <motion.circle
            key="finish-run"
            r="8"
            fill="var(--pink)"
            stroke="var(--ink)"
            strokeWidth="3"
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

      <div className={`wtl-flow-box wtl-flow-box-end${directive === "complete" ? " wtl-flow-box-active" : ""}`}>
        <span className="wtl-flow-label">Loop End</span>
        <strong>{directive === "complete" ? "policy: complete" : "await policy: complete"}</strong>
      </div>

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

const SWIMLANE_DELAYS = [900, 600, 850, 600];

function SwimLaneDiagram({ t }) {
  const reduceMotion = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);
  // animPhase: 0=engine running, 1=outcome→right, 2=policy deciding, 3=directive←left

  const steps = t.loopMap.workflow.steps;
  const wfPhases = t.loopMap.workflow.phases;
  const step = steps[stepIdx];

  useEffect(() => {
    if (reduceMotion) return;
    const tid = setTimeout(() => {
      if (animPhase === 3) {
        setStepIdx(i => (i + 1) % steps.length);
        setAnimPhase(0);
      } else {
        setAnimPhase(p => p + 1);
      }
    }, SWIMLANE_DELAYS[animPhase]);
    return () => clearTimeout(tid);
  }, [stepIdx, animPhase, reduceMotion, steps.length]);

  // Layout: Engine=left column, Policy=right column, time flows top→bottom
  const VW    = 520;
  const HDR   = 26;   // header row height
  const ROW_H = 50;   // height per turn row
  const BOX_H = 34;   // turn / phase box height
  const COL_W = 185;  // column width
  const EX    = 6;    // engine column x
  const PX    = 329;  // policy column x  (VW - COL_W - EX = 329)
  const MID_L = EX + COL_W + 4;   // 195
  const MID_R = PX - 4;            // 325
  const MID_CX = (MID_L + MID_R) / 2; // 260

  const rowY  = i => HDR + 8 + i * ROW_H;
  const rowCY = i => rowY(i) + BOX_H / 2;
  const VH    = rowY(steps.length - 1) + BOX_H + 14;

  // Phase blocks: group consecutive steps with same phase
  const phaseBlocks = [];
  let pi = 0;
  while (pi < steps.length) {
    const ph = steps[pi].phase;
    let pj = pi;
    while (pj < steps.length && steps[pj].phase === ph) pj++;
    phaseBlocks.push({
      phase: ph,
      endIdx: pj - 1,
      y:  rowY(pi),
      h:  rowY(pj - 1) + BOX_H - rowY(pi),
    });
    pi = pj;
  }

  const currentBlock = phaseBlocks.find(b => b.phase === step.phase);
  const blockCY = currentBlock ? currentBlock.y + currentBlock.h / 2 : rowCY(stepIdx);

  // SVG hard-shadow box helper (wtl-flow-box style)
  const ShadowBox = ({ x, y, w, h, fill = "#fffbf5", stroke = "var(--ink)", sw = 2.5, sdx = 3, sdy = 3, children }) => (
    <g>
      <rect x={x + sdx} y={y + sdy} width={w} height={h} fill="var(--ink)" />
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={sw} />
      {children}
    </g>
  );

  const SD = 3; // shadow offset
  const BX = EX + 5, BW = COL_W - 10;
  const PBX = PX + 5;

  return (
    <div className="swimlane-wrap">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="swimlane-svg" aria-hidden="true">

        {/* Column headers — wtl-flow-box style */}
        <ShadowBox x={EX} y={2} w={COL_W} h={HDR - 6} fill="rgba(209,77,44,0.12)" sdx={3} sdy={3}>
          <text x={EX + COL_W / 2} y={HDR - 7} textAnchor="middle"
            fontSize={10} fontWeight="900" fontFamily="Archivo Black, sans-serif"
            fill="var(--coral)">Engine</text>
        </ShadowBox>

        <ShadowBox x={PX} y={2} w={COL_W} h={HDR - 6} fill="rgba(210,163,58,0.14)" sdx={3} sdy={3}>
          <text x={PX + COL_W / 2} y={HDR - 7} textAnchor="middle"
            fontSize={10} fontWeight="900" fontFamily="Archivo Black, sans-serif"
            fill="var(--ink)">Policy</text>
        </ShadowBox>

        {/* Column lane backgrounds — light border, no shadow */}
        <rect x={EX} y={HDR + 4} width={COL_W} height={VH - HDR - 8}
          fill="rgba(209,77,44,0.03)" stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="4 3" />
        <rect x={PX} y={HDR + 4} width={COL_W} height={VH - HDR - 8}
          fill="rgba(210,163,58,0.04)" stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="4 3" />

        {/* Dashed guide lines across middle zone */}
        {steps.map((_, i) => (
          <line key={`guide-${i}`}
            x1={MID_L} y1={rowCY(i)} x2={MID_R} y2={rowCY(i)}
            stroke="var(--ink)" opacity={0.1}
            strokeWidth={1} strokeDasharray="4 4" />
        ))}

        {/* Phase blocks in Policy column — hard shadow box */}
        {phaseBlocks.map(block => {
          const name = wfPhases.find(p => p.id === block.phase)?.name || block.phase;
          const isActive = step.phase === block.phase;
          const isPast   = stepIdx > block.endIdx;
          const fill = isActive ? "var(--gold)" : isPast ? "rgba(0,109,114,0.15)" : "#fffbf5";
          return (
            <ShadowBox key={block.phase}
              x={PBX} y={block.y + 4} w={COL_W - 10} h={block.h - 8}
              fill={fill} sw={isActive ? 2.5 : 1.5}
              sdx={isActive ? 3 : 2} sdy={isActive ? 3 : 2}>
              <text
                x={PX + COL_W / 2} y={block.y + block.h / 2 + 5}
                textAnchor="middle" fontSize={11} fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
                fill={isActive ? "var(--ink)" : isPast ? "var(--teal)" : "var(--muted)"}
              >{name}</text>
            </ShadowBox>
          );
        })}

        {/* Turn boxes in Engine column — hard shadow box */}
        {steps.map((s, i) => {
          const isActive = i === stepIdx;
          const isDone   = i < stepIdx;
          const fill = isActive ? "var(--coral)" : isDone ? "rgba(0,109,114,0.15)" : "#fffbf5";
          return (
            <g key={i}>
              {/* shadow */}
              <rect x={BX + (isActive ? 3 : 2)} y={rowY(i) + 4 + (isActive ? 3 : 2)}
                width={BW} height={BOX_H - 8} fill="var(--ink)" />
              {/* box */}
              <motion.rect
                x={BX} y={rowY(i) + 4} width={BW} height={BOX_H - 8} rx={0}
                fill={fill} stroke="var(--ink)" strokeWidth={isActive ? 2.5 : 1.5}
                animate={!reduceMotion && isActive && animPhase === 0 ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.55 }}
              />
              <text
                x={EX + COL_W / 2} y={rowCY(i) + 5}
                textAnchor="middle" fontSize={10} fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
                fill={isActive ? "#fff" : isDone ? "var(--teal)" : "var(--muted)"}
              >T{s.turn} · {s.engine}</text>
            </g>
          );
        })}

        {/* Track lines — backbone + dashed accent */}
        <line x1={MID_L} y1={rowCY(stepIdx)} x2={MID_R} y2={rowCY(stepIdx)}
          stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" opacity={0.15} />
        <line x1={MID_L} y1={rowCY(stepIdx)} x2={MID_R} y2={rowCY(stepIdx)}
          stroke="var(--coral)" strokeWidth={2.5} strokeLinecap="round"
          strokeDasharray="8 8" opacity={animPhase >= 1 ? 0.7 : 0.15} />

        <line x1={MID_R} y1={rowCY(stepIdx) + 7} x2={MID_L} y2={rowCY(stepIdx) + 7}
          stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" opacity={0.15} />
        <line x1={MID_R} y1={rowCY(stepIdx) + 7} x2={MID_L} y2={rowCY(stepIdx) + 7}
          stroke="var(--teal)" strokeWidth={2.5} strokeLinecap="round"
          strokeDasharray="8 8" opacity={animPhase >= 3 ? 0.7 : 0.15} />

        {/* Outcome circle */}
        {!reduceMotion && animPhase === 1 && (
          <motion.circle key={`out-${stepIdx}`}
            r={7} fill="var(--coral)" stroke="var(--ink)" strokeWidth={2.5}
            initial={{ cx: MID_L + 7, cy: rowCY(stepIdx) }}
            animate={{ cx: MID_R - 7, cy: rowCY(stepIdx) }}
            transition={{ duration: 0.5, ease: "easeInOut" }} />
        )}

        {/* Directive circle */}
        {!reduceMotion && animPhase === 3 && (
          <motion.circle key={`dir-${stepIdx}`}
            r={7} fill="var(--teal)" stroke="var(--ink)" strokeWidth={2.5}
            initial={{ cx: MID_R - 7, cy: rowCY(stepIdx) + 7 }}
            animate={{ cx: MID_L + 7, cy: rowCY(stepIdx) + 7 }}
            transition={{ duration: 0.5, ease: "easeInOut" }} />
        )}

        {/* Directive badge — hard shadow box */}
        {animPhase >= 2 && (
          <motion.g key={`badge-${stepIdx}`}
            initial={reduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}>
            <rect x={MID_CX - 34} y={rowCY(stepIdx) - 9} width={68} height={20} fill="var(--ink)" />
            <rect x={MID_CX - 36} y={rowCY(stepIdx) - 11} width={68} height={20}
              fill="#fffbf5" stroke="var(--ink)" strokeWidth={2} />
            <text x={MID_CX - 2} y={rowCY(stepIdx) + 4}
              textAnchor="middle" fontSize={8.5} fontWeight="700"
              fontFamily="Space Grotesk, sans-serif"
              fill="var(--ink)">{step.directive}</text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}

// ── Policy Examples ──────────────────────────────────────────────────────────

const POLICY_STEPS = {
  ralph_wigum: [
    { phase: "planning",     directive: "advance_phase", isLoopBack: false, isSelfLoop: false },
    { phase: "implementing", directive: "continue",      isLoopBack: false, isSelfLoop: true  },
    { phase: "implementing", directive: "advance_phase", isLoopBack: false, isSelfLoop: false },
    { phase: "review",       directive: "complete",      isLoopBack: false, isSelfLoop: false },
  ],
  gan: [
    { phase: "planning",   directive: "advance_phase", isLoopBack: false, isSelfLoop: false },
    { phase: "generating", directive: "advance_phase", isLoopBack: false, isSelfLoop: false },
    { phase: "evaluating", directive: "advance_phase", isLoopBack: true,  isSelfLoop: false },
    { phase: "generating", directive: "advance_phase", isLoopBack: false, isSelfLoop: false },
    { phase: "evaluating", directive: "complete",      isLoopBack: false, isSelfLoop: false },
  ],
};

const POLICY_STEP_DELAY = 1700;

// Node centers (cx, cy) for 3-phase SVG layout
const PHASE_NODES = [
  { cx: 55,  cy: 30 },
  { cx: 180, cy: 30 },
  { cx: 305, cy: 30 },
];
const NODE_W = 88, NODE_H = 32, NODE_R = 0;

function PolicyFlowCard({ item, index }) {
  const reduceMotion = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0);
  const steps = POLICY_STEPS[item.id];
  const step = steps[stepIdx];
  const activePhaseIdx = item.phases.findIndex(p => p.id === step.phase);
  const isGAN = item.id === "gan";

  useEffect(() => {
    if (reduceMotion) return;
    const tid = setTimeout(() => {
      setStepIdx(i => (i + 1) % steps.length);
    }, POLICY_STEP_DELAY);
    return () => clearTimeout(tid);
  }, [stepIdx, reduceMotion, steps.length]);

  return (
    <Reveal className="policy-flow-card" delay={index * 0.1}>
      <div className="policy-card-top">
        <div className="policy-card-header">
          <span className="policy-name">{item.name}</span>
          <span className="policy-tag">{item.tag}</span>
        </div>
        <p className="policy-body">{item.body}</p>
      </div>

      <div className="policy-diagram-area">
        <svg
          viewBox={`0 0 360 ${isGAN ? 92 : 56}`}
          className="policy-svg"
          aria-hidden="true"
        >
          {/* Phase nodes */}
          {item.phases.map((phase, i) => {
            const { cx, cy } = PHASE_NODES[i];
            const isActive = i === activePhaseIdx;
            const isDone = i < activePhaseIdx;
            const nx = cx - NODE_W / 2, ny = cy - NODE_H / 2;
            const fill = isActive ? "var(--gold)" : isDone ? "rgba(0,109,114,0.15)" : "#fffbf5";
            const sdx = isActive ? 3 : 2, sdy = isActive ? 3 : 2;
            return (
              <g key={phase.id}>
                {/* hard shadow */}
                <rect x={nx + sdx} y={ny + sdy} width={NODE_W} height={NODE_H} fill="var(--ink)" />
                {/* main box */}
                <rect x={nx} y={ny} width={NODE_W} height={NODE_H} rx={0}
                  fill={fill} stroke="var(--ink)" strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={cx} y={cy + 5} textAnchor="middle"
                  fontSize="10" fontWeight="700" fontFamily="Space Grotesk, sans-serif"
                  fill={isActive ? "var(--ink)" : isDone ? "var(--teal)" : "var(--muted)"}>
                  {phase.name}
                </text>
              </g>
            );
          })}

          {/* Forward arrows — backbone + dashed accent (hero style) */}
          {item.phases.slice(0, -1).map((_, i) => {
            const x1 = PHASE_NODES[i].cx + NODE_W / 2 + 2;
            const x2 = PHASE_NODES[i + 1].cx - NODE_W / 2 - 2;
            const y = PHASE_NODES[i].cy;
            return (
              <g key={`fw-${i}`}>
                <line x1={x1} y1={y} x2={x2} y2={y}
                  stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" opacity={0.15} />
                <line x1={x1} y1={y} x2={x2 - 6} y2={y}
                  stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="5 4" opacity={0.45} />
                <polygon
                  points={`${x2 - 6},${y - 3.5} ${x2},${y} ${x2 - 6},${y + 3.5}`}
                  fill="var(--ink)" opacity={0.55} />
              </g>
            );
          })}

          {/* Ralph Wigum self-loop on Implementing node */}
          {!isGAN && (
            <motion.g
              animate={!reduceMotion ? { opacity: step.isSelfLoop ? 1 : 0.15 } : {}}
              transition={{ duration: 0.4 }}
            >
              {/* Arc curving above the Implementing node (cx=180) */}
              <path
                d="M 153 14 C 153 1, 207 1, 207 14"
                fill="none"
                stroke="var(--coral)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              {/* Arrowhead pointing down into the node */}
              <polygon
                points="203,8 207,15 211,8"
                fill="var(--coral)"
              />
            </motion.g>
          )}

          {/* GAN adversarial loop-back arc */}
          {isGAN && (
            <motion.g
              animate={!reduceMotion ? { opacity: step.isLoopBack ? 1 : 0.15 } : {}}
              transition={{ duration: 0.4 }}
            >
              {/* U-shaped path from Evaluating ↓ → ↑ Generating */}
              <path
                d={`M ${PHASE_NODES[2].cx} ${PHASE_NODES[2].cy + NODE_H / 2 + 1}
                    L ${PHASE_NODES[2].cx} 71
                    L ${PHASE_NODES[1].cx} 71
                    L ${PHASE_NODES[1].cx} ${PHASE_NODES[1].cy + NODE_H / 2 + 1}`}
                fill="none"
                stroke="var(--coral)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              {/* Arrowhead pointing up into Generating */}
              <polygon
                points={`${PHASE_NODES[1].cx - 4},${PHASE_NODES[1].cy + NODE_H / 2 + 8} ${PHASE_NODES[1].cx},${PHASE_NODES[1].cy + NODE_H / 2} ${PHASE_NODES[1].cx + 4},${PHASE_NODES[1].cy + NODE_H / 2 + 8}`}
                fill="var(--coral)"
              />
              {/* Loop label */}
              <text
                x={(PHASE_NODES[1].cx + PHASE_NODES[2].cx) / 2}
                y="85"
                textAnchor="middle"
                fontSize="9"
                fontFamily="Space Grotesk, sans-serif"
                fill="var(--coral)"
              >
                {item.loopNote}
              </text>
            </motion.g>
          )}
        </svg>

        {/* Current directive badge */}
        <div className="policy-directive-row">
          <motion.span
            key={`${item.id}-${stepIdx}`}
            className={`wtl-chip wtl-chip-inline wtl-chip-${step.directive}`}
            initial={reduceMotion ? {} : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            {step.directive}
          </motion.span>
        </div>
      </div>
    </Reveal>
  );
}

function PoliciesSection({ t }) {
  return (
    <section className="section policies-section" id="policies">
      <SectionIntro
        eyebrow={t.policies.eyebrow}
        title={t.policies.title}
        body={t.policies.body}
      />
      <div className="policies-grid">
        {t.policies.items.map((item, i) => (
          <PolicyFlowCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

function QuintSection({ t }) {
  return (
    <section className="section quint-section" id="quint">
      <SectionIntro
        eyebrow={t.quint.eyebrow}
        title={t.quint.title}
        body={t.quint.body}
      />

      <Reveal className="quint-concepts-title" delay={0.05}>
        <p className="quint-sub-heading">{t.quint.conceptsTitle}</p>
      </Reveal>
      <div className="directive-grid quint-concept-grid">
        {t.quint.concepts.map((item, i) => (
          <Reveal key={item.term} className="directive-card quint-concept-card" delay={i * 0.07} amount={0.15}>
            <code className="quint-term">{item.term}</code>
            <span>{item.desc}</span>
          </Reveal>
        ))}
      </div>

      <Reveal className="quint-files-title" delay={0.05}>
        <p className="quint-sub-heading">{t.quint.filesTitle}</p>
      </Reveal>
      <div className="quint-files-grid">
        {t.quint.files.map((item, i) => (
          <Reveal key={item.name} className="panel quint-file-card" delay={i * 0.06} amount={0.15}>
            <code className="quint-file-name">{item.name}</code>
            <p>{item.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
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

        <div className="diagram-phase-card">
          <p className="diagram-phase-kicker">{t.loopMap.phase.label}</p>
          <strong>{t.loopMap.phase.title}</strong>
          <p>{t.loopMap.phase.body}</p>
          <ul className="diagram-phase-list">
            {t.loopMap.phase.points.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

function ExampleWorkflowSection({ t }) {
  const phases = t.loopMap.workflow.phases;
  return (
    <section className="section workflow-section" id="workflow">
      <Reveal className="workflow-bento" amount={0.12}>
        <div className="workflow-main-card">
          <div className="workflow-copy">
            <p className="diagram-kicker">{t.loopMap.workflow.eyebrow}</p>
            <div className="workflow-phase-trail">
              {phases.map((ph, i) => (
                <span key={ph.id} className="workflow-phase-trail-row">
                  <span className={`workflow-phase-pill workflow-phase-pill-${ph.id}`}>{ph.name}</span>
                  {i < phases.length - 1 && <span className="workflow-phase-arrow">→</span>}
                </span>
              ))}
            </div>
            <h2>{t.loopMap.workflow.title}</h2>
            <p className="diagram-lead">{t.loopMap.workflow.body}</p>

            <ul className="diagram-note-list">
              {t.loopMap.workflow.notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="diagram-main-visual">
            <SwimLaneDiagram t={t} />
          </div>
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
              <a href="#workflow">{t.nav.workflow}</a>
              <a href="#policies">{t.nav.policies}</a>
              <a href="#problems">{t.nav.problems}</a>
              <a href="#roles">{t.nav.roles}</a>
              <a href="#directives">{t.nav.directives}</a>
              <a href="#lifecycle">{t.nav.lifecycle}</a>
              <a href="#quint">{t.nav.quint}</a>
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
          <ExampleWorkflowSection t={t} />
          <PoliciesSection t={t} />

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

          <QuintSection t={t} />

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
              <pre>{t.cli.snippet}</pre>
            </Reveal>
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
