export const i18n = {
  en: {
    langToggle: "한국어",
    nav: {
      explore: "Explore",
      problems: "Problems",
      roles: "Roles",
      directives: "Directives",
      lifecycle: "Lifecycle",
      cli: "CLI"
    },
    ui: {
      turnRunning: "Turn {n} running…",
      turnBadge: "Turn {n}",
      engineRunning: "Running",
      endingRun: "Ending run",
      sendingOutcome: "Sending outcome",
      gotDirective: "Got directive",
      idle: "Idle",
      observing: "Watching…",
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
    explore: {
      eyebrow: "Explorable explanation",
      title: "Pick a simple situation and watch the next step.",
      body: "Choose the situation the run is in. Policy returns one directive, the engine follows it, and the observer only records what happened.",
      controlsTitle: "1. Pick a situation",
      controlsBody: "Each card is a plain-language situation. You do not need to think about internal flags first.",
      steps: [
        "1. Choose a situation",
        "2. Read the policy decision",
        "3. Run one legal step"
      ],
      phaseLabel: "Current phase",
      finalPhase: "final",
      phaseNames: ["Discover", "Draft", "Finalize"],
      phaseGuide: {
        label: "What phase means",
        title: "A phase is a workflow stage, not a turn counter.",
        body: "Turns count repetitions. Phases describe what kind of work the run is doing right now, so policy can tell the difference between continuing, moving forward, and legally ending.",
        points: [
          "`Discover`, `Draft`, and `Finalize` here are examples, not fixed WTL keywords.",
          "A real workflow could use names like `Plan / Execute / Review` or `Collect / Analyze / Answer`."
        ]
      },
      observerTitle: "Observer visibility",
      observerBodyOn: "Observer online",
      observerBodyOff: "Observer offline",
      scenarios: {
        continue: {
          label: "Keep working",
          body: "Nothing is blocked. The run should take another turn in the current phase."
        },
        wait: {
          label: "Need outside input",
          body: "The run is waiting on the user or a tool result."
        },
        retry: {
          label: "Temporary failure",
          body: "The last turn failed in a way that can be retried."
        },
        compact: {
          label: "Context is too full",
          body: "The next turn should compact context before continuing."
        },
        advance_phase: {
          label: "This phase is done",
          body: "The current phase reached its goal, but the run is not finished."
        },
        complete: {
          label: "Ready to finish",
          body: "The final phase is done and policy explicitly approves ending the run."
        }
      },
      buttons: {
        apply: "Run This Step",
        reset: "Start Over",
        completed: "Run Completed"
      },
      status: {
        phase: "Phase",
        turn: "Turn",
        retries: "Retries",
        compactions: "Compactions",
        run: "Run",
        observer: "Observer",
        lastDirective: "Last directive",
        online: "online",
        offline: "offline"
      },
      runStates: {
        live: "runnable",
        waiting: "waiting",
        completed: "completed"
      },
      engineStatus: {
        ready: "Ready for the next legal step",
        waiting: "Blocked until external input arrives",
        completed: "Terminated by explicit policy approval"
      },
      preview: {
        situation: "Situation",
        policy: "Policy says",
        engine: "Engine does",
        observer: "Observer sees",
        help: "Read the four boxes once from top-left to bottom-right. That is one loop decision.",
        why: "Rule being protected",
        eventLog: "Event log"
      },
      engineActions: {
        continue: "Return `continue`.",
        retry: "Return `retry`.",
        wait: "Return `wait`.",
        compact: "Return `compact`.",
        advance_phase: "Return `advance_phase`.",
        complete: "Return `complete`."
      },
      engineDetails: {
        continue: "Start the next turn in the same phase.",
        retry: "Run the same turn again instead of inventing a new meaning.",
        wait: "Do not start a new turn until the missing input arrives.",
        compact: "Compact context first, then continue later.",
        advance_phase: "Install the next phase plan and keep the run alive.",
        complete: "End the run now."
      },
      reasonTitles: {
        continue: "Nothing is blocking progress.",
        gate_closed: "It may look done, but stopping is still illegal.",
        retry: "A temporary failure should be retried first.",
        wait: "The run is blocked on outside input.",
        compact: "Context cleanup must happen before the next turn.",
        advance_phase: "This phase is done, but the whole run is not.",
        complete: "The final phase is approved, so the run may end."
      },
      ruleTitles: {
        continue: "The engine cannot invent a stop condition.",
        gate_closed: "Completion is gated by policy.",
        retry: "Retry is a meaning decision, not an engine guess.",
        wait: "Waiting must be visible and must stop new turns.",
        compact: "Compaction must be explicit.",
        advance_phase: "Finishing a phase is not the same as finishing the run.",
        complete: "Completion needs final-phase approval."
      },
      ruleBodies: {
        continue: "If nothing higher priority is true, policy may keep the loop moving. The engine still does not decide on its own.",
        gate_closed: "Even in the final phase, the engine may not stop unless policy explicitly opens the completion gate.",
        retry: "Policy decides that the failure is retryable. The engine only carries out that retry.",
        wait: "While input is unresolved, the engine must not silently continue. It waits, and observers can see that state.",
        compact: "Context maintenance is a real step in the contract, not a hidden side effect.",
        advance_phase: "Policy can say this phase is done while keeping the run alive for the next phase.",
        complete: "A run becomes legally complete only when policy says so in the final phase."
      },
      observerStates: {
        online: "The observer records the event, but does not control the loop.",
        offline: "The observer misses the event, but the loop must still stay correct."
      },
      log: {
        boot: "observer: run initialized",
        policy_continue: "return continue",
        policy_retry: "return retry",
        policy_wait: "return wait",
        policy_compact: "return compact",
        policy_advance_phase: "return advance_phase",
        policy_complete: "return complete",
        engine_continue: "turn {n} 시작",
        engine_retry: "turn {n} 재시도",
        engine_wait: "외부 입력이 해결될 때까지 대기",
        engine_compact: "다음 턴 전에 컨텍스트 압축",
        engine_advance: "단계 전환 {from} -> {to}",
        engine_complete: "실행 완료로 표시",
        observer_seen: "directive {directive} 관찰됨",
        observer_dropped: "observer 오프라인, 이벤트 유실"
      }
    },
    problems: {
      eyebrow: "Why WTL exists",
      h2: "Six problems that break agent loops.",
      body: "These problems appear in every agent runtime that grows beyond a single script. Each one has a clean solution — once you separate mechanics from meaning.",
      items: [
        {
          id: "P1", accent: "coral",
          title: "Every loop is written from scratch",
          body: "No shared interface for agent execution means each workflow reinvents the same mechanics: iteration limits, retry handling, and termination logic.",
          question: "Can one well-tested engine serve many different workflows?"
        },
        {
          id: "P2", accent: "coral",
          title: "Loops can't be verified",
          body: "Without a defined contract, there's no way to test that a loop behaves correctly. Completion conditions, retry semantics, and exhaustion are all undefined.",
          question: "What invariants must a loop always hold?"
        },
        {
          id: "P3", accent: "gold",
          title: "Mechanics and meaning bleed together",
          body: "Engines decide what turn outcomes mean. Policies reach into execution mechanics. Mixed responsibilities make neither component testable in isolation.",
          question: "What is the complete list of things the engine must not know?"
        },
        {
          id: "P4", accent: "gold",
          title: "Completion is arbitrary",
          body: "Runs terminate on string matches, fixed turn counts, or nothing at all. Whether a run truly completed or simply stopped is undetectable from outside.",
          question: "Who decides completion — the engine or the policy?"
        },
        {
          id: "P5", accent: "teal",
          title: "Waiting looks like failing",
          body: "When a workflow needs external input, implementations poll, block, or fail. A paused run is indistinguishable from a broken one.",
          question: "Can waiting be a first-class, observable state?"
        },
        {
          id: "P6", accent: "teal",
          title: "Observing breaks correctness",
          body: "Logging, tracing, and UI updates are woven into execution. When an observer fails, the run fails. What should be invisible becomes a dependency.",
          question: "Should a run succeed even if all observers are removed?"
        }
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
      explore: "탐색",
      problems: "문제",
      roles: "역할",
      directives: "지시어",
      lifecycle: "생명주기",
      cli: "CLI"
    },
    ui: {
      turnRunning: "턴 {n} 실행 중…",
      turnBadge: "턴 {n}",
      engineRunning: "실행 중",
      endingRun: "종료 처리 중",
      sendingOutcome: "결과 전송 중",
      gotDirective: "지시어 수신",
      idle: "대기",
      observing: "관찰 중…",
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
    explore: {
      eyebrow: "탐색형 설명",
      title: "간단한 상황을 고르고, 다음 한 걸음을 보세요.",
      body: "실행이 어떤 상황에 있는지만 고르면 됩니다. Policy가 지시어 하나를 고르고, Engine이 그대로 따르며, Observer는 그 사실만 기록합니다.",
      controlsTitle: "1. 상황 고르기",
      controlsBody: "각 카드는 내부 플래그 묶음이 아니라 사람이 이해하기 쉬운 상황 하나를 뜻합니다.",
      steps: [
        "1. 상황 선택",
        "2. Policy 결정 읽기",
        "3. 합법적인 한 단계 실행"
      ],
      phaseLabel: "현재 단계",
      finalPhase: "최종",
      phaseNames: ["탐색", "작성", "마무리"],
      phaseGuide: {
        label: "Phase란 무엇인가",
        title: "Phase는 턴 수가 아니라 작업 단계입니다.",
        body: "턴은 반복 횟수를 세고, phase는 지금 어떤 종류의 일을 하는지 보여줍니다. 이 구분이 있어야 Policy가 계속 진행할지, 다음 단계로 넘어갈지, 합법적으로 종료할지를 나눠 판단할 수 있습니다.",
        points: [
          "여기서 `탐색 / 작성 / 마무리`는 설명용 예시일 뿐, WTL의 고정 키워드는 아닙니다.",
          "실제 워크플로에서는 `계획 / 실행 / 검토`나 `수집 / 분석 / 답변`처럼 다른 단계 이름을 써도 됩니다."
        ]
      },
      observerTitle: "Observer 가시성",
      observerBodyOn: "Observer 연결됨",
      observerBodyOff: "Observer 오프라인",
      scenarios: {
        continue: {
          label: "계속 작업 중",
          body: "막힌 것은 없습니다. 현재 단계에서 다음 턴을 시작하면 됩니다."
        },
        wait: {
          label: "외부 입력이 필요함",
          body: "사용자 응답이나 도구 결과를 기다리고 있습니다."
        },
        retry: {
          label: "일시적인 실패",
          body: "마지막 턴은 재시도로 복구할 수 있는 실패였습니다."
        },
        compact: {
          label: "컨텍스트가 너무 큼",
          body: "다음 턴 전에 컨텍스트를 먼저 압축해야 합니다."
        },
        advance_phase: {
          label: "이 단계는 끝남",
          body: "현재 단계 목표는 달성했지만 실행 전체는 아직 끝나지 않았습니다."
        },
        complete: {
          label: "이제 종료 가능",
          body: "최종 단계가 끝났고, Policy도 종료를 명시적으로 승인했습니다."
        }
      },
      buttons: {
        apply: "이 단계 실행",
        reset: "처음부터 보기",
        completed: "실행 완료"
      },
      status: {
        phase: "단계",
        turn: "턴",
        retries: "재시도",
        compactions: "압축",
        run: "실행",
        observer: "옵저버",
        lastDirective: "마지막 지시어",
        online: "연결됨",
        offline: "오프라인"
      },
      runStates: {
        live: "실행 가능",
        waiting: "대기 중",
        completed: "완료됨"
      },
      engineStatus: {
        ready: "다음 합법적 단계를 실행할 준비가 됨",
        waiting: "외부 입력이 올 때까지 차단됨",
        completed: "정책의 명시적 승인으로 종료됨"
      },
      preview: {
        situation: "상황",
        policy: "Policy의 판단",
        engine: "Engine의 동작",
        observer: "Observer가 보는 것",
        help: "왼쪽 위에서 오른쪽 아래까지 네 칸만 읽으면, 그 순간의 루프 결정이 보입니다.",
        why: "지키는 규칙",
        eventLog: "이벤트 로그"
      },
      engineActions: {
        continue: "`continue`를 반환합니다.",
        retry: "`retry`를 반환합니다.",
        wait: "`wait`를 반환합니다.",
        compact: "`compact`를 반환합니다.",
        advance_phase: "`advance_phase`를 반환합니다.",
        complete: "`complete`를 반환합니다."
      },
      engineDetails: {
        continue: "같은 단계에서 다음 턴을 시작합니다.",
        retry: "새 의미를 만들지 않고 같은 턴을 다시 실행합니다.",
        wait: "빠진 입력이 올 때까지 새 턴을 시작하지 않습니다.",
        compact: "먼저 컨텍스트를 압축하고 나중에 이어서 진행합니다.",
        advance_phase: "다음 단계 계획으로 넘어가되 실행은 계속 유지합니다.",
        complete: "지금 실행을 종료합니다."
      },
      reasonTitles: {
        continue: "진행을 막는 조건이 없습니다.",
        gate_closed: "끝나 보이더라도, 지금 멈추는 것은 아직 불법입니다.",
        retry: "일시적 실패는 먼저 재시도해야 합니다.",
        wait: "실행이 외부 입력에 막혀 있습니다.",
        compact: "다음 턴 전에 컨텍스트 정리가 필요합니다.",
        advance_phase: "이 단계는 끝났지만 실행 전체는 아닙니다.",
        complete: "최종 단계가 승인되었으므로 실행을 끝낼 수 있습니다."
      },
      ruleTitles: {
        continue: "엔진은 스스로 멈춤을 결정할 수 없습니다.",
        gate_closed: "완료는 Policy가 여는 게이트입니다.",
        retry: "재시도는 엔진 추측이 아니라 의미 판단입니다.",
        wait: "대기는 보여야 하고, 새 턴을 막아야 합니다.",
        compact: "컴팩션은 명시적으로 보여야 합니다.",
        advance_phase: "단계 완료와 실행 완료는 다릅니다.",
        complete: "완료에는 최종 단계 승인 이 필요합니다."
      },
      ruleBodies: {
        continue: "더 높은 우선순위의 차단 조건이 없으면 Policy는 계속 진행을 허용할 수 있습니다. 그래도 결정권은 여전히 Policy에 있습니다.",
        gate_closed: "최종 단계처럼 보여도, Policy가 완료 게이트를 열지 않으면 Engine은 멈출 수 없습니다.",
        retry: "실패가 재시도 가능한지 판단하는 쪽은 Policy이고, Engine은 그 결정을 수행만 합니다.",
        wait: "입력이 해결되지 않았을 때 Engine은 몰래 진행하면 안 됩니다. 기다려야 하고, 그 상태는 밖에서도 보여야 합니다.",
        compact: "컨텍스트 정리는 숨어 있는 부작용이 아니라 계약에 드러나는 한 단계입니다.",
        advance_phase: "현재 단계 목표를 달성했더라도, 다음 단계가 남아 있다면 실행은 계속 살아 있어야 합니다.",
        complete: "실행은 최종 단계이면서 Policy가 명시적으로 승인했을 때만 합법적으로 끝날 수 있습니다."
      },
      observerStates: {
        online: "Observer는 이벤트를 기록하지만 루프를 제어하지는 못합니다.",
        offline: "Observer가 이벤트를 놓쳐도 루프 정합성은 그대로 유지되어야 합니다."
      },
      log: {
        boot: "observer: 실행 초기화",
        policy_continue: "return continue",
        policy_retry: "return retry",
        policy_wait: "return wait",
        policy_compact: "return compact",
        policy_advance_phase: "return advance_phase",
        policy_complete: "return complete",
        engine_continue: "start turn {n}",
        engine_retry: "retry turn {n}",
        engine_wait: "pause until external input resolves",
        engine_compact: "compact context before the next turn",
        engine_advance: "switch phase {from} -> {to}",
        engine_complete: "mark run complete",
        observer_seen: "observed directive {directive}",
        observer_dropped: "observer offline, event dropped"
      }
    },
    problems: {
      eyebrow: "WTL이 존재하는 이유",
      h2: "에이전트 루프를 망가뜨리는 여섯 가지 문제.",
      body: "이 문제들은 단순한 스크립트를 넘어 성장하는 모든 에이전트 런타임에서 나타납니다. 메커니즘과 의미를 분리하면 각각의 문제에 명확한 해답이 있습니다.",
      items: [
        {
          id: "P1", accent: "coral",
          title: "루프를 매번 처음부터 작성한다",
          body: "에이전트 실행을 위한 공통 인터페이스가 없어서, 모든 워크플로는 반복 제한·재시도·종료 로직을 각자 다시 구현합니다.",
          question: "잘 검증된 하나의 엔진이 여러 워크플로를 지원할 수 있는가?"
        },
        {
          id: "P2", accent: "coral",
          title: "루프의 정합성을 검증할 수 없다",
          body: "정의된 계약이 없으면 루프가 올바르게 동작하는지 테스트할 방법이 없습니다. 완료 조건, 재시도 의미론, 소진 기준이 모두 미정의 상태입니다.",
          question: "루프가 반드시 지켜야 할 불변 조건은 무엇인가?"
        },
        {
          id: "P3", accent: "gold",
          title: "메커니즘과 의미가 뒤섞인다",
          body: "엔진이 턴 결과의 의미를 직접 판단하고, 정책이 실행 메커니즘에 개입합니다. 책임이 혼재되면 어느 쪽도 독립적으로 테스트할 수 없습니다.",
          question: "엔진이 반드시 몰라야 하는 것들의 목록은 무엇인가?"
        },
        {
          id: "P4", accent: "gold",
          title: "완료 조건이 임의적이다",
          body: "문자열 매칭, 고정된 턴 수, 또는 아무 조건 없이 실행이 종료됩니다. 진정으로 완료된 것인지, 그냥 멈춘 것인지 외부에서 알 수 없습니다.",
          question: "완료를 결정하는 것은 엔진인가, 정책인가?"
        },
        {
          id: "P5", accent: "teal",
          title: "대기와 실패가 구분되지 않는다",
          body: "워크플로가 외부 입력을 기다려야 할 때, 구현체들은 폴링하거나 블록하거나 실패 처리합니다. 일시 중단된 실행과 오류 상태를 구분할 수 없습니다.",
          question: "대기가 일급 상태로서 관찰 가능한 상태가 될 수 있는가?"
        },
        {
          id: "P6", accent: "teal",
          title: "관찰이 정확성을 깨뜨린다",
          body: "로깅·트레이싱·UI 업데이트가 실행 흐름에 직접 엮여 있습니다. 옵저버가 실패하면 실행도 실패합니다. 보이지 않아야 할 것이 의존성이 됩니다.",
          question: "모든 옵저버가 제거되어도 실행은 성공해야 하는가?"
        }
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
