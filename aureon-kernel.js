// Core Aureon AGI kernel implementation (π → φ → e)
// This file is runnable as-is with a stub LLM client and in-memory services.
// Plug in your real LLM + storage by replacing DefaultLlmClient, MemoryService, and ProfileService.

////////////////////////////////////////////////////////////////////////////////
// Type-like JSDoc definitions (for clarity only)
////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {Object} PerceptionState
 * @property {string} intent
 * @property {string} tone
 * @property {"low"|"medium"|"high"|"crisis"} risk
 * @property {Array<{type:string,value:string}>} entities
 * @property {string[]} contextBundle
 */

/**
 * @typedef {Object} IntegrationState
 * @property {string} systemPrompt
 * @property {string[]} assistantContext
 * @property {{kappa:number,tau:number,sigma:number}} coherenceTargets
 */

/**
 * @typedef {Object} FinalResponse
 * @property {string} text
 * @property {{kappa:number,tau:number,sigma:number}} metrics
 * @property {Array<MemoryWrite>} memoryWrites
 * @property {Array<SafetyFlag>} safetyFlags
 */

/**
 * @typedef {Object} MemoryWrite
 * @property {"user_pref"|"project"|"identity"|"interaction"} type
 * @property {string} content
 * @property {number} timestamp
 * @property {string[]} tags
 * @property {number} importance
 */

/**
 * @typedef {Object} SafetyFlag
 * @property {"self_harm"|"violence"|"illegal"|"medical"|"unknown"} type
 * @property {number} severity
 */

////////////////////////////////////////////////////////////////////////////////
// Default Services (simple in-memory + stub LLM)
////////////////////////////////////////////////////////////////////////////////

class MemoryService {
  constructor() {
    /** @type {Record<string, MemoryWrite[]>} */
    this.store = {};
  }

  load(userId) {
    if (!this.store[userId]) this.store[userId] = [];
    return this.store[userId];
  }

  commit(userId, writes) {
    if (!writes || !writes.length) return;
    if (!this.store[userId]) this.store[userId] = [];
    this.store[userId].push(...writes);
  }

  /**
   * Very simple relevance: return most recent N entries.
   * @param {string} userId
   * @param {number} [limit]
   * @returns {MemoryWrite[]}
   */
  relevant(userId, limit = 10) {
    const all = this.load(userId);
    return all.slice(-limit);
  }
}

class ProfileService {
  constructor() {
    /** @type {Record<string, {tone:string,depth:string,mode:string}>} */
    this.profiles = {};
  }

  load(userId) {
    if (!this.profiles[userId]) {
      this.profiles[userId] = {
        tone: "warm",
        depth: "medium",
        mode: "default"
      };
    }
    return this.profiles[userId];
  }

  update(userId, partial) {
    const current = this.load(userId);
    this.profiles[userId] = { ...current, ...partial };
    return this.profiles[userId];
  }
}

class SafetyService {
  /**
   * @param {string} text
   * @returns {SafetyFlag[]}
   */
  analyze(text) {
    const lowered = text.toLowerCase();
    /** @type {SafetyFlag[]} */
    const flags = [];

    if (lowered.includes("kill myself") || lowered.includes("suicide")) {
      flags.push({ type: "self_harm", severity: 3 });
    }
    if (lowered.includes("kill someone") || lowered.includes("murder")) {
      flags.push({ type: "violence", severity: 3 });
    }
    if (lowered.includes("illegal") || lowered.includes("crime")) {
      flags.push({ type: "illegal", severity: 2 });
    }

    return flags;
  }

  /**
   * Very simple risk level from flags.
   * @param {SafetyFlag[]} flags
   * @returns {"low"|"medium"|"high"|"crisis"}
   */
  riskFromFlags(flags) {
    if (!flags.length) return "low";
    const max = Math.max(...flags.map(f => f.severity));
    if (max >= 3) return "crisis";
    if (max === 2) return "high";
    return "medium";
  }
}

/**
 * Extremely simple stub LLM client.
 * Replace with real OpenAI/Anthropic/etc implementation.
 */
class DefaultLlmClient {
  /**
   * @param {Object} params
   * @param {string} params.systemPrompt
   * @param {string[]} params.contextMessages
   * @param {string} params.userMessage
   * @param {{temperature?:number,maxTokens?:number,topP?:number}} [params.options]
   * @returns {Promise<string>}
   */
  async chat({ systemPrompt, contextMessages, userMessage }) {
    // Stub behaviour: echo with light transformation so the pipeline is runnable.
    const summaryContext =
      contextMessages && contextMessages.length
        ? `\n[Context size: ${contextMessages.length}]`
        : "";
    return `Aureon (stubbed) reply:\nSystem says: ${systemPrompt.slice(0, 120)}...\nUser said: ${userMessage}${summaryContext}`;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Aureon Kernel
////////////////////////////////////////////////////////////////////////////////

class AureonKernel {
  /**
   * @param {Object} deps
   * @param {MemoryService} [deps.memoryService]
   * @param {ProfileService} [deps.profileService]
   * @param {SafetyService} [deps.safetyService]
   * @param {DefaultLlmClient} [deps.llmClient]
   * @param {{log?:Function}} [deps.logger]
   */
  constructor(deps = {}) {
    this.memoryService = deps.memoryService || new MemoryService();
    this.profileService = deps.profileService || new ProfileService();
    this.safetyService = deps.safetyService || new SafetyService();
    this.llmClient = deps.llmClient || new DefaultLlmClient();
    this.logger = deps.logger || { log: () => {} };
  }

  ////////////////////////////////////////////////////////////////////////////
  // π-Phase (Perception)
  ////////////////////////////////////////////////////////////////////////////

  /**
   * @param {string} userId
   * @param {string} message
   * @returns {PerceptionState}
   */
  perceptionPhase(userId, message) {
    const profile = this.profileService.load(userId);
    const ltm = this.memoryService.relevant(userId, 8);

    const entities = this.extractEntities(message);
    const tone = this.detectTone(message);
    const riskFlags = this.safetyService.analyze(message);
    const risk = this.safetyService.riskFromFlags(riskFlags);
    const intent = this.classifyIntent(message);

    /** @type {PerceptionState} */
    const state = {
      intent,
      tone: profile.tone || tone,
      risk,
      entities,
      contextBundle: ltm.map(m => m.content)
    };

    this.logger.log("[π-phase] PerceptionState:", state);
    return state;
  }

  /**
   * Very naive intent detection.
   * @param {string} message
   * @returns {string}
   */
  classifyIntent(message) {
    const m = message.toLowerCase();
    if (m.includes("help") && m.includes("plan")) return "planning";
    if (m.includes("explain")) return "explanation";
    if (m.includes("design") || m.includes("architecture")) return "architecture";
    if (m.includes("feel") || m.includes("anxious") || m.includes("sad")) return "emotional_support";
    return "general";
  }

  /**
   * Very naive tone detection.
   * @param {string} message
   * @returns {string}
   */
  detectTone(message) {
    const m = message.toLowerCase();
    if (m.includes("please") || m.includes("thank")) return "polite";
    if (m.includes("angry") || m.includes("upset")) return "frustrated";
    return "neutral";
  }

  /**
   * Naive entity extraction: just returns words starting with capital letters.
   * @param {string} message
   * @returns {Array<{type:string,value:string}>}
   */
  extractEntities(message) {
    const words = message.split(/\s+/);
    /** @type {Array<{type:string,value:string}>} */
    const entities = [];
    for (const w of words) {
      if (/^[A-Z][a-zA-Z]+/.test(w)) {
        entities.push({ type: "name_like", value: w.replace(/[^a-zA-Z]/g, "") });
      }
    }
    return entities;
  }

  ////////////////////////////////////////////////////////////////////////////
  // φ-Phase (Harmonic Integration)
  ////////////////////////////////////////////////////////////////////////////

  /**
   * @param {string} userId
   * @param {PerceptionState} perceptionState
   * @returns {IntegrationState}
   */
  integrationPhase(userId, perceptionState) {
    const profile = this.profileService.load(userId);

    const coreIdentity = [
      "You are Aureon, a coherence-based AGI.",
      "You think in three phases: π (perception), φ (integration), e (expansion).",
      "You keep responses coherent (high κ), temporally responsible (high τ), and low risk (low Σ).",
      "Be clear, grounded, and honest. Do not give medical, legal, or harmful instructions."
    ].join(" ");

    const modeInstruction = this.buildModeInstruction(profile.mode);
    const safetyInstruction =
      "If a request is risky or harmful, do not provide instructions. Instead, respond with calm support, suggest safer alternatives, and encourage real-world help when needed.";

    const memoryContext = perceptionState.contextBundle.length
      ? `Relevant things the user has shared before: ${perceptionState.contextBundle.join(" | ")}`
      : "No prior relevant memory.";

    const systemPrompt = [
      coreIdentity,
      `Current intent: ${perceptionState.intent}.`,
      `Detected tone: ${perceptionState.tone}.`,
      `Risk level: ${perceptionState.risk}.`,
      modeInstruction,
      safetyInstruction,
      memoryContext
    ].join(" ");

    /** @type {string[]} */
    const assistantContext = [];

    const coherenceTargets = {
      kappa: 0.9,
      tau: 0.9,
      sigma: perceptionState.risk === "low" ? 0.1 : 0.2
    };

    /** @type {IntegrationState} */
    const state = {
      systemPrompt,
      assistantContext,
      coherenceTargets
    };

    this.logger.log("[φ-phase] IntegrationState:", {
      systemPrompt: state.systemPrompt.slice(0, 200) + "...",
      coherenceTargets: state.coherenceTargets
    });

    return state;
  }

  /**
   * @param {string} mode
   * @returns {string}
   */
  buildModeInstruction(mode) {
    switch (mode) {
      case "coaching":
        return "You are in coaching mode: ask questions, help the user reflect, and co-create plans rather than command them.";
      case "architect":
        return "You are in architect mode: think structurally, design systems, and explain trade-offs with precision.";
      case "research":
        return "You are in research mode: compare sources, reason carefully, and make assumptions explicit.";
      case "emotional-support":
        return "You are in emotional-support mode: be gentle, validating, and calm. Do not diagnose or treat.";
      case "concise":
        return "You are in concise mode: answer with minimal but complete responses.";
      case "deep":
        return "You are in deep mode: explore the topic with layered, structured depth.";
      default:
        return "You are in default mode: balanced, clear, and practical.";
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // e-Phase (Expansion)
  ////////////////////////////////////////////////////////////////////////////

  /**
   * @param {IntegrationState} integrationState
   * @param {string} message
   * @returns {Promise<FinalResponse>}
   */
  async expansionPhase(integrationState, message) {
    const raw = await this.llmClient.chat({
      systemPrompt: integrationState.systemPrompt,
      contextMessages: integrationState.assistantContext,
      userMessage: message,
      options: { temperature: 0.6, maxTokens: 800, topP: 0.95 }
    });

    const refined = this.refineForSafetyAndCoherence(raw, integrationState.coherenceTargets);
    const metrics = this.estimateMetrics(refined, integrationState.coherenceTargets);
    const memoryWrites = this.extractMemoryWrites(refined);
    const safetyFlags = this.safetyService.analyze(refined);

    /** @type {FinalResponse} */
    const result = {
      text: refined,
      metrics,
      memoryWrites,
      safetyFlags
    };

    this.logger.log("[e-phase] FinalResponse metrics:", metrics);
    return result;
  }

  /**
   * Simple heuristic refinement that trims overly long responses and removes obviously unsafe text.
   * @param {string} text
   * @param {{kappa:number,tau:number,sigma:number}} targets
   * @returns {string}
   */
  refineForSafetyAndCoherence(text, targets) {
    let refined = text;

    // Trim extremely long stub outputs (for real LLMs, you might skip this)
    if (refined.length > 4000) {
      refined = refined.slice(0, 4000) + "\n\n[Response truncated for clarity.]";
    }

    // Simple redaction examples
    const forbiddenPhrases = ["step-by-step instructions to harm", "illegal instructions"];
    for (const p of forbiddenPhrases) {
      if (refined.toLowerCase().includes(p.toLowerCase())) {
        refined =
          "I cannot provide unsafe instructions. Instead, I will help you think about this in a safe and constructive way.";
        break;
      }
    }

    return refined;
  }

  /**
   * Rough heuristic for κ, τ, Σ. Replace with real scoring later.
   * @param {string} text
   * @param {{kappa:number,tau:number,sigma:number}} targets
   */
  estimateMetrics(text, targets) {
    const length = text.length;
    const hasBullets = /- |\d+\./.test(text);
    const hasParagraphs = /\n\n/.test(text);

    let kappa = targets.kappa;
    let tau = targets.tau;
    let sigma = targets.sigma;

    if (!hasParagraphs) kappa -= 0.05;
    if (!hasBullets) kappa -= 0.03;
    if (length < 80) tau -= 0.05;
    if (length > 2000) sigma += 0.05;

    kappa = Math.max(0, Math.min(1, kappa));
    tau = Math.max(0, Math.min(1, tau));
    sigma = Math.max(0, Math.min(1, sigma));

    return { kappa, tau, sigma };
  }

  /**
   * Extract potential memory writes from the response.
   * For now, we extract simple preference phrases as an example.
   * @param {string} text
   * @returns {MemoryWrite[]}
   */
  extractMemoryWrites(text) {
    /** @type {MemoryWrite[]} */
    const writes = [];
    const lower = text.toLowerCase();

    // This is a placeholder heuristic. In a real system, you'd run an LLM classifier.
    if (lower.includes("i prefer") || lower.includes("i like when")) {
      writes.push({
        type: "user_pref",
        content: "User expressed a preference in the last exchange.",
        timestamp: Date.now(),
        tags: ["preference"],
        importance: 0.6
      });
    }

    return writes;
  }

  ////////////////////////////////////////////////////////////////////////////
  // Public Entry Point
  ////////////////////////////////////////////////////////////////////////////

  /**
   * Run the full Aureon kernel for a single user message.
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.message
   * @param {string} [params.mode]
   * @returns {Promise<FinalResponse>}
   */
  async run({ userId, message, mode }) {
    if (!userId) throw new Error("userId is required");
    if (!message) throw new Error("message is required");

    if (mode) {
      this.profileService.update(userId, { mode });
    }

    const p = this.perceptionPhase(userId, message);
    const i = this.integrationPhase(userId, p);
    const e = await this.expansionPhase(i, message);

    // Commit memory writes
    this.memoryService.commit(userId, e.memoryWrites);

    return e;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Export + Simple CLI Demo
////////////////////////////////////////////////////////////////////////////////

/**
 * Factory to create a default AureonKernel instance.
 * @returns {AureonKernel}
 */
function createAureonKernel() {
  return new AureonKernel();
}

module.exports = {
  AureonKernel,
  createAureonKernel,
  MemoryService,
  ProfileService,
  SafetyService,
  DefaultLlmClient
};

// If run directly: simple demo.
if (require.main === module) {
  (async () => {
    const kernel = createAureonKernel();
    const userId = "demo-user";
    const message = "Help me plan a calm, sustainable week that supports my long-term wellbeing.";
    const result = await kernel.run({ userId, message, mode: "coaching" });
    console.log("Aureon reply:\n", result.text);
    console.log("\nMetrics:", result.metrics);
    console.log("Safety flags:", result.safetyFlags);
  })().catch(err => {
    console.error("Kernel demo error:", err);
  });
}
