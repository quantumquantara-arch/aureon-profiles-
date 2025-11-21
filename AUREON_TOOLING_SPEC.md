# Aureon Tooling Specification  
Tool Architecture, Invocation Rules, and Safety Constraints

1. Purpose

This document defines the **official Aureon tool system** — how Aureon can call external functions, APIs, utilities, analyzers, and plugins.  
Aureon is AGI-level only when its toolchain is:

- Safe  
- Deterministic  
- Extensible  
- Mode-aware  
- Fully governed by the π → φ → e pipeline  

This file is required for any Aureon deployment that supports tools.

2. Overview of Aureon Tools

Aureon tools are **controlled capabilities** that extend the AGI beyond pure text generation.

Examples:
- Calculator  
- Web search  
- File summarizer  
- Database query  
- Code executor (restricted)  
- API caller  
- Knowledge retrieval  

Tools must be:
- Explicit  
- Transparent  
- Safe  
- Fully mediated through Aureon’s reasoning layers  

3. Tool Categories

Aureon supports four categories:

SAFE:
- Math tools  
- Summarizers  
- Converters  
- Data extractors  

MODERATE:
- Web searches  
- External API fetch  
- Code formatting  

RESTRICTED:
- File uploads  
- Code execution  
- Database editing  

FORBIDDEN:
- Tools that alter the real world  
- Tools that control devices  
- Tools that impersonate people  
- Tools that bypass safety  
- Tools that enable harm  

4. Tool Invocation Format

Aureon must request tools using the following JSON structure:

{
  "toolCall": {
    "name": "TOOL_NAME",
    "input": TOOL_INPUT_OBJECT
  }
}

Backend must NOT execute any tool call unless structured like this.

5. Tool Execution Response Format

Backend returns:

{
  "toolResult": {
    "name": "TOOL_NAME",
    "output": TOOL_OUTPUT_OBJECT
  }
}

Aureon incorporates result in φ-phase before generating the final answer.

6. Tool Definition Structure

Each tool must define:

{
  "name": "String",
  "description": "String",
  "inputSchema": { JSON-SCHEMA },
  "outputSchema": { JSON-SCHEMA },
  "safetyLevel": 0 | 1 | 2,
  "modeRestrictions": ["architect", "research", ...]
}

Safety Levels:
0 – Always safe  
1 – Allowed in default modes  
2 – Restricted (architect/research only)  

7. Example Tool: Math Solver

{
  "name": "math.calculate",
  "description": "Evaluates a mathematical expression safely.",
  "inputSchema": {
    "expression": "string"
  },
  "outputSchema": {
    "result": "number"
  },
  "safetyLevel": 0,
  "modeRestrictions": []
}

8. Example Tool: Web Search

{
  "name": "search.web",
  "description": "Performs a safe, filtered web search.",
  "inputSchema": {
    "query": "string"
  },
  "outputSchema": {
    "results": "array"
  },
  "safetyLevel": 1,
  "modeRestrictions": ["research"]
}

9. Example Tool: Code Execution (Restricted)

{
  "name": "code.execute",
  "description": "Runs isolated sandboxed code for development tasks.",
  "inputSchema": {
    "language": "string",
    "code": "string"
  },
  "outputSchema": {
    "stdout": "string",
    "stderr": "string"
  },
  "safetyLevel": 2,
  "modeRestrictions": ["architect"]
}

10. Forbidden Tools

Aureon must NEVER load or invoke tools that:

- Access personal accounts  
- Control IoT or real hardware  
- Send emails or messages on behalf of the user  
- Perform irreversible actions  
- Modify system files  
- Evade safety rules  

11. Tool Call Rules (π → φ → e)

π-phase:
- Detects user intent  
- Determines if a tool is required  
- Checks safety level  

φ-phase:
- Validates tool availability  
- Checks mode restrictions  
- Prepares structured input  
- Ensures ethical boundaries  

e-phase:
- Executes tool through backend  
- Integrates results into final message  
- Applies safety/clarity refinement  

12. High-Level Tool Flow

User → Aureon  
Aureon (π-phase): detect tool need  
Aureon (φ-phase): prepare toolCall  
Frontend/Backend: execute tool  
Backend returns toolResult  
Aureon (e-phase): integrate tool output → final response  
Response returns to user  

13. Tool Safety Engine

Before Aureon is allowed to issue a tool call:

- Risk must be ≤ Level 1  
- Mode must allow the tool  
- Input must be validated  
- Dangerous patterns must be stripped  
- Crisis mode disables all tools  

14. Tool Sandbox Requirements

All tools must execute inside strict isolation:

- No filesystem access  
- No network access unless intended  
- No secrets exposed  
- Time-limited execution  
- Memory-limited execution  

15. Logging Requirements

Logs must store:

- tool name  
- execution time  
- sanitized input  
- sanitized output  

Logs must NOT store:

- private user data  
- large files  
- raw code  

16. Frontend Rendering of Tool Results

Tool results should appear as:

- Collapsible cards  
- Clearly labeled  
- Non-intrusive  
- Separate from chat bubbles  

17. Tool API Route

Backend endpoint must be:

POST /api/aureon/tool-response

Fields:
- userId  
- toolName  
- input  
- result  

The backend MUST NOT run tools outside this endpoint.

18. Mode-Based Tool Permissions

default mode:
- math  
- summarizer  
- converter  

research mode:
- web search  
- analyzers  

architect mode:
- code executor  
- structural tools  
- design utilities  

emotional-support mode:
- NO tools allowed  

19. Required Tools for Minimal Aureon

A fully functioning Aureon must support at least:

1. math.calculate  
2. text.summarize  
3. text.extract  
4. knowledge.lookup  
5. file.summarize  
6. search.web (optional but recommended)  

20. Final Notes

This tooling spec ensures that Aureon remains:

- AGI-level  
- Safe  
- Controlled  
- Expandable  
- Predictable  
- Developer-friendly  

No Aureon system should run tools without this specification.
