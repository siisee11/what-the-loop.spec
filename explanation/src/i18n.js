export const i18n = {
  en: {
    langToggle: "한국어",
    nav: {
      roles: "Roles",
      directives: "Directives",
      lifecycle: "Lifecycle",
      cli: "CLI"
    },
    ui: {
      turnRunning: "Turn {n} running…",
      sendingOutcome: "Sending outcome",
      gotDirective: "Got directive",
      idle: "Idle",
      interpreting: "Interpreting…",
      waiting: "Waiting",
      eventsDown: "events ↓",
      logHdr: "event log",
      logIdle: "…",
      logStart: "turn:start",
      logComplete: "turn:complete",
      actingOn: "Acting on:"
    },
    hero: {
      eyebrow: "Spec-first execution contract",
      h1: "The loop contract for agent runs.",
      body: "WTL is not a framework and not a runtime. It is the shared behavioral contract between the part that runs the loop, the part that interprets outcomes, and the part that watches.",
      btnSplit: "See the split",
      btnLoop: "Follow the loop",
      facts: [
        { strong: "3 roles", span: "Engine, Policy, Observer" },
        { strong: "6 directives", span: "Meaning returned to the engine" },
        { strong: "1 rule", span: "The engine never invents semantics" }
      ]
    },
    band: {
      eyebrow: "Why this matters",
      h2: "WTL separates mechanics from meaning.",
      points: [
        "You can swap policies without rewriting the loop controller.",
        "You can add observers for logs, traces, and UI without making them correctness dependencies.",
        "You can verify invariants like completion gating and thread reuse because ownership boundaries stay explicit."
      ]
    },
    roles: {
      eyebrow: "Three roles",
      title: "Every run is a small constitutional system.",
      body: "The spec stays small by assigning a single job to each actor. Once those responsibilities stop leaking across boundaries, the loop becomes reusable.",
      items: [
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
      ]
    },
    directives: {
      eyebrow: "Directive grammar",
      title: "The policy speaks in a tight set of loop instructions.",
      body: "Instead of micromanaging execution, the policy returns directives. The engine treats those as authoritative and handles the mechanics.",
      items: [
        ["continue", "Proceed with the next turn in the current phase."],
        ["wait", "Stop launching turns until external input resolves the block."],
        ["retry", "Retry the last turn after a recoverable failure."],
        ["compact", "Compress context before the next step."],
        ["advance_phase", "Install a new execution plan for the next stage."],
        ["complete", "Terminate only after explicit policy approval."]
      ]
    },
    lifecycle: {
      eyebrow: "Lifecycle",
      title: "A run keeps cycling until the policy blocks it or ends it.",
      body: "The engine starts turns, the policy interprets outcomes, and observers get every transition. Waiting, retrying, compacting, and completion are all first-class states.",
      steps: [
        { step: "Init", body: "The engine initializes run state, the policy seeds its internal state, and observers get the first event." },
        { step: "Turn", body: "If the policy is runnable, the engine executes a turn using the current execution plan." },
        { step: "Interpret", body: "The policy receives the outcome and returns a directive that gives the engine meaning." },
        { step: "Handle", body: "The engine loops, waits, retries, compacts, changes phase, or terminates based on that directive." }
      ]
    },
    loopMap: {
      eyebrow: "Animated system map",
      h2: "Signals move, responsibilities stay fixed.",
      body: "The point of WTL is not that nothing moves. It is that movement has a contract. The engine cycles, the policy interprets, the observer listens, and the run stays legible even while directives branch into waiting or completion.",
      engine: {
        tag: "Mechanics",
        owns: ["Starts and runs turns", "Enforces iteration limits", "Handles retries and waits", "Owns thread lifecycle"]
      },
      policy: {
        tag: "Meaning",
        owns: ["Interprets turn outcomes", "Returns directives", "Controls completion gating", "Owns phase ordering"]
      },
      observer: {
        tag: "Visibility · never controls",
        owns: ["Receives all lifecycle events", "Cannot steer execution", "Logs · traces · UI · audit"]
      },
      connOutcome: "outcome →",
      connDirective: "← directive"
    },
    guarantees: {
      eyebrow: "Hard guarantees",
      h2: "The spec defines what must stay true.",
      items: [
        "Completion only happens when the policy explicitly says `complete`.",
        "Waiting is a real state: no new turns may start while blocked.",
        "Thread identity remains stable when a phase asks for reuse.",
        "Observers can record everything without steering execution.",
        "Exhaustion and recoverable failure stay distinguishable in external reporting."
      ]
    },
    ownership: {
      eyebrow: "State ownership",
      h2: "Each subsystem owns different failure modes.",
      items: [
        { name: "Engine", body: "Loop control, iteration count, retries, waiting, thread lifecycle." },
        { name: "Policy", body: "Completion gating, phase order, execution plans, thread reuse boundaries." },
        { name: "Observer", body: "Logs, traces, metrics, UI, and audit views." }
      ]
    },
    cli: {
      eyebrow: "Minimal implementation",
      title: "The spec also defines a tiny CLI contract.",
      body: "The first implementation is intentionally small: a single prompt, turn logs, streamed runtime output, and a completion marker protocol."
    }
  },

  ko: {
    langToggle: "EN",
    nav: {
      roles: "역할",
      directives: "지시어",
      lifecycle: "생명주기",
      cli: "CLI"
    },
    ui: {
      turnRunning: "턴 {n} 실행 중…",
      sendingOutcome: "결과 전송 중",
      gotDirective: "지시어 수신",
      idle: "대기",
      interpreting: "해석 중…",
      waiting: "대기",
      eventsDown: "이벤트 ↓",
      logHdr: "이벤트 로그",
      logIdle: "…",
      logStart: "turn:start",
      logComplete: "turn:complete",
      actingOn: "처리 중:"
    },
    hero: {
      eyebrow: "스펙 기반 실행 계약",
      h1: "에이전트 실행의 루프 계약.",
      body: "WTL은 프레임워크가 아니고 런타임도 아닙니다. 루프를 실행하는 부분, 결과를 해석하는 부분, 그리고 관찰하는 부분 사이의 공유된 동작 계약입니다.",
      btnSplit: "역할 구분 보기",
      btnLoop: "루프 따라가기",
      facts: [
        { strong: "3가지 역할", span: "Engine, Policy, Observer" },
        { strong: "6가지 지시어", span: "엔진에 반환되는 의미" },
        { strong: "1가지 규칙", span: "엔진은 의미를 발명하지 않는다" }
      ]
    },
    band: {
      eyebrow: "왜 중요한가",
      h2: "WTL은 메커니즘과 의미를 분리합니다.",
      points: [
        "루프 컨트롤러를 재작성하지 않고도 정책을 교체할 수 있습니다.",
        "로그, 트레이스, UI를 위한 옵저버를 정확성 의존성 없이 추가할 수 있습니다.",
        "소유권 경계가 명시적으로 유지되므로 완료 게이팅과 스레드 재사용 같은 불변 조건을 검증할 수 있습니다."
      ]
    },
    roles: {
      eyebrow: "세 가지 역할",
      title: "모든 실행은 작은 헌법적 시스템입니다.",
      body: "스펙은 각 액터에게 단일 역할을 부여함으로써 작게 유지됩니다. 책임이 경계를 넘어 누출되지 않으면 루프는 재사용 가능해집니다.",
      items: [
        {
          name: "Engine",
          tag: "루프 메커니즘",
          accent: "var(--coral)",
          points: [
            "턴을 시작하고, 제한을 강제하며, 스레드 생명주기를 소유합니다.",
            "컴팩션, 재시도 처리, 종료를 수행합니다.",
            "턴이 무엇을 의미하는지 결정해서는 안 됩니다."
          ]
        },
        {
          name: "Policy",
          tag: "워크플로우 의미",
          accent: "var(--gold)",
          points: [
            "턴 결과를 해석하고 다음 지시어를 반환합니다.",
            "완료 게이팅, 단계 순서, 대기 상태를 소유합니다.",
            "실행 가능한 각 턴의 실행 계획을 정의합니다."
          ]
        },
        {
          name: "Observer",
          tag: "읽기 전용 가시성",
          accent: "var(--teal)",
          points: [
            "실행 시작, 단계 변경, 완료와 같은 생명주기 이벤트를 수신합니다.",
            "정확성에 영향을 주지 않고 로그, 트레이스, UI를 렌더링할 수 있습니다.",
            "제어 의존성이 되어서는 안 됩니다."
          ]
        }
      ]
    },
    directives: {
      eyebrow: "지시어 문법",
      title: "정책은 루프 지시어의 집합으로 말합니다.",
      body: "실행을 세세하게 관리하는 대신 정책은 지시어를 반환합니다. 엔진은 이를 권위 있는 것으로 취급하고 메커니즘을 처리합니다.",
      items: [
        ["continue", "현재 단계에서 다음 턴을 진행합니다."],
        ["wait", "외부 입력이 차단을 해결할 때까지 턴 시작을 중지합니다."],
        ["retry", "복구 가능한 실패 후 마지막 턴을 재시도합니다."],
        ["compact", "다음 단계 전에 컨텍스트를 압축합니다."],
        ["advance_phase", "다음 단계를 위한 새 실행 계획을 설치합니다."],
        ["complete", "정책의 명시적 승인 후에만 종료합니다."]
      ]
    },
    lifecycle: {
      eyebrow: "생명주기",
      title: "정책이 차단하거나 종료할 때까지 실행은 계속 순환합니다.",
      body: "엔진은 턴을 시작하고, 정책은 결과를 해석하며, 옵저버는 모든 전환을 받습니다. 대기, 재시도, 컴팩션, 완료는 모두 일급 상태입니다.",
      steps: [
        { step: "초기화", body: "엔진이 실행 상태를 초기화하고, 정책이 내부 상태를 시드하며, 옵저버가 첫 번째 이벤트를 받습니다." },
        { step: "턴 실행", body: "정책이 실행 가능한 경우, 엔진은 현재 실행 계획을 사용하여 턴을 실행합니다." },
        { step: "해석", body: "정책이 결과를 받아 엔진에 의미를 부여하는 지시어를 반환합니다." },
        { step: "처리", body: "엔진은 그 지시어에 따라 루프, 대기, 재시도, 컴팩션, 단계 변경 또는 종료를 수행합니다." }
      ]
    },
    loopMap: {
      eyebrow: "애니메이션 시스템 맵",
      h2: "신호는 움직이고, 책임은 고정됩니다.",
      body: "WTL의 핵심은 아무것도 움직이지 않는다는 것이 아닙니다. 움직임에 계약이 있다는 것입니다. 엔진은 순환하고, 정책은 해석하며, 옵저버는 듣습니다. 지시어가 대기나 완료로 분기되더라도 실행은 명확하게 유지됩니다.",
      engine: {
        tag: "메커니즘",
        owns: ["턴 시작 및 실행", "반복 제한 강제", "재시도 및 대기 처리", "스레드 생명주기 소유"]
      },
      policy: {
        tag: "의미",
        owns: ["턴 결과 해석", "지시어 반환", "완료 게이팅 제어", "단계 순서 소유"]
      },
      observer: {
        tag: "가시성 · 제어 불가",
        owns: ["모든 생명주기 이벤트 수신", "실행 조종 불가", "로그 · 트레이스 · UI · 감사"]
      },
      connOutcome: "결과 →",
      connDirective: "← 지시어"
    },
    guarantees: {
      eyebrow: "강력한 보장",
      h2: "스펙은 반드시 유지되어야 할 것을 정의합니다.",
      items: [
        "정책이 명시적으로 `complete`를 반환할 때만 완료가 일어납니다.",
        "대기는 실제 상태입니다: 차단된 동안 새 턴이 시작될 수 없습니다.",
        "단계가 재사용을 요청할 때 스레드 정체성이 안정적으로 유지됩니다.",
        "옵저버는 실행을 조종하지 않고 모든 것을 기록할 수 있습니다.",
        "소진과 복구 가능한 실패는 외부 보고에서 구별 가능하게 유지됩니다."
      ]
    },
    ownership: {
      eyebrow: "상태 소유권",
      h2: "각 서브시스템은 서로 다른 실패 모드를 소유합니다.",
      items: [
        { name: "Engine", body: "루프 제어, 반복 횟수, 재시도, 대기, 스레드 생명주기." },
        { name: "Policy", body: "완료 게이팅, 단계 순서, 실행 계획, 스레드 재사용 경계." },
        { name: "Observer", body: "로그, 트레이스, 메트릭, UI, 감사 뷰." }
      ]
    },
    cli: {
      eyebrow: "최소 구현",
      title: "스펙은 작은 CLI 계약도 정의합니다.",
      body: "첫 번째 구현은 의도적으로 작게: 단일 프롬프트, 턴 로그, 스트리밍 런타임 출력, 완료 마커 프로토콜."
    }
  }
};
