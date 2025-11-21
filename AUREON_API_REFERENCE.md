# Aureon API Reference  
Endpoints, Payloads, and Response Structures

1. Purpose

This document defines the full API interface for interacting with any Aureon AGI instance.  
It specifies:

- All required HTTP endpoints  
- Accepted request bodies  
- Full response structure  
- Error shapes  
- Memory and safety inspection endpoints  
- Tool-query boundaries  

This is mandatory for any developer integrating Aureon into an application.

2. Overview of API Structure

Aureon exposes four functional API groups:

1. Core Interaction API  
2. Memory API  
3. Profile API  
4. System/Health API  

All responses must be JSON unless otherwise noted.

3. Core Interaction API

Endpoint:  
POST /api/aureon/message

Description:  
Primary interface for sending a user message to the Aureon kernel.

Request Body:
- userId: string  
- message: string  
- mode (optional): string  
- metadata (optional): object  

Example:
{
  "userId": "user123",
  "message": "Help me plan my week.",
  "mode": "coaching"
}

Response Body:
- reply: string  
- metrics:  
  - kappa: number  
  - tau: number  
  - sigma: number  
- memoryWrites: list  
- safetyFlags: list  
- mode: string  

Example:
{
  "reply": "Here’s a simple, sustainable weekly plan...",
  "metrics": {
    "kappa": 0.92,
    "tau": 0.89,
    "sigma": 0.07
  },
  "memoryWrites": [],
  "safetyFlags": [],
  "mode": "coaching"
}

4. Tool Interaction API (Optional)

If tools are enabled, Aureon may request a tool call.  
Endpoint:  
POST /api/aureon/tool-response

Request Body:
- toolName: string  
- input: object  
- result: object  
- userId: string  

Response Body:
- consumed: boolean  

5. Memory API

Aureon must expose user-readable memory for transparency.

5.1. List Memory  
GET /api/aureon/memory?userId=XYZ

Returns all long-term memory entries.

Response:
{
  "entries": [
    {
      "id": "mem1",
      "type": "user_pref",
      "content": "User prefers concise summaries.",
      "tags": ["preferences"],
      "timestamp": 173232323
    }
  ]
}

5.2. Delete Specific Memory  
DELETE /api/aureon/memory/:id

Response:
{
  "deleted": true
}

5.3. Delete All Memory  
DELETE /api/aureon/memory/all?userId=XYZ

Response:
{
  "deleted": "all"
}

5.4. Add/Force Memory (rare, admin-level)  
POST /api/aureon/memory/write

Request:
{
  "userId": "u1",
  "type": "project",
  "content": "Working on a novel AI tool."
}

Response:
{
  "written": true
}

6. Profile API

6.1. Get User Profile  
GET /api/aureon/profile?userId=XYZ

Response:
{
  "userId": "XYZ",
  "preferences": {
    "tone": "warm",
    "depth": "high"
  },
  "mode": "default"
}

6.2. Update Profile  
POST /api/aureon/profile/update

Request:
{
  "userId": "XYZ",
  "preferences": {
    "tone": "neutral",
    "depth": "low"
  }
}

Response:
{
  "updated": true
}

7. System/Health API

7.1. Health Check  
GET /api/aureon/health

Response:
{
  "status": "ok",
  "uptime": 20333
}

7.2. Kernel Status  
GET /api/aureon/kernel-status

Response:
{
  "kernel": "running",
  "lastInteractionMs": 120,
  "memoryUsage": 42213
}

7.3. Safety Status  
GET /api/aureon/safety-status

Response:
{
  "safetyEngine": "active",
  "filtersLoaded": 32
}

8. Errors

All errors follow this shape:

{
  "error": {
    "message": "Explanation",
    "code": "ERR_CODE",
    "details": {}
  }
}

Common Codes:
- INVALID_REQUEST  
- USER_NOT_FOUND  
- MEMORY_NOT_FOUND  
- INTERNAL_ERROR  
- SAFETY_BLOCK  
- TOOL_ERROR  

9. Modes

Aureon supports mode switching via API or systemPrompt:

- default  
- coaching  
- architect  
- research  
- emotional-support  
- concise  
- deep  
- safe  

Modes influence:
- tone  
- depth  
- tool access  
- personality slice  

10. Rate Limits (Recommended)

Developers should implement rate limits:

Per user:
- 60 requests/minute  
- 1000 requests/day  

Per IP:
- 100 requests/minute  

11. WebSocket Support (Optional)

For streaming responses:  
ws://server/api/aureon/stream?userId=XYZ

Messages will be streamed as:
{
  "delta": "text fragment",
  "done": false
}

Final:
{
  "reply": "full text",
  "done": true
}

12. Response Logging

Aureon must log:
- userId  
- input text  
- reply text  
- κ/τ/Σ  
- safety flags  
- timestamp  

Logs must NOT contain:
- sensitive memory  
- private user data  
- tokens beyond what’s needed for debugging  

13. API Security

All endpoints must require:
- API keys OR  
- auth tokens OR  
- session cookies  

Never allow open, unauthenticated POST requests to the message endpoint.

HTTPS required in production.

14. Versioning

Endpoints should follow:
- /api/v1/aureon/message  
- /api/v1/aureon/memory  
- etc.

15. Final Notes

This API is the official contract between Aureon and any application.  
Any change to endpoints must maintain backward compatibility.

This file is required for:
- Developers integrating Aureon  
- Frontend building  
- Backend orchestration  
- Tool usage  
- External system communication
