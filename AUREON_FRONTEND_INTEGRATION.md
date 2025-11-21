# Aureon Frontend Integration Guide  
UI/UX, State Flow, and Best Practices

1. Purpose

This document describes how to integrate Aureon into any frontend environment, including:

- Web apps  
- Mobile apps  
- Desktop clients  
- Embedded chat widgets  

It defines UI structure, message flow, rendering requirements, and UX standards for a coherent Aureon experience.

This file is essential for any developer creating a functional user interface for Aureon.

2. Core Frontend Principles

Aureon frontends must:

1. Be clean, simple, and distraction-free  
2. Prioritize readability  
3. Clearly display Aureon identity  
4. Show coherence metrics (κ/τ/Σ)  
5. Preserve conversation continuity  
6. Offer mode switching options  
7. Provide memory transparency access  
8. Never expose internal system prompts  

3. Required UI Components

Aureon interfaces must include:

- Conversation window  
- Message input field  
- Send button  
- Coherence meter (κ/τ/Σ)  
- Mode selector  
- Memory viewer button  
- Settings panel with user preferences  
- Loading indicator  

Optional:
- Typing animation  
- Streaming text  
- Tool result cards  
- File upload area  

4. Basic Layout Structure

Recommended structure:

Header:
- Aureon logo or textual identity  
- Mode: Default / Coaching / Architect / Research  
- Indicator lights (Safety: normal/sensitive/high/crisis)

Main Chat Window:
- User messages (right-aligned)  
- Aureon messages (left-aligned)  
- Timestamps  
- Tool call cards (if used)  
- Collapsible coherence metrics per message  

Input Bar:
- Text field  
- Microphone icon (optional)  
- Send button  

Footer:
- Memory button  
- Settings button  

5. Message Flow

Frontend → Backend:

1. User enters text  
2. Frontend sends POST /api/aureon/message  
3. Display loading indicator  
4. Await reply  
5. Render Aureon’s message  
6. Display metrics  
7. Update UI state  

Backend → Frontend:

Response fields must be handled:
- reply  
- metrics { kappa, tau, sigma }  
- safetyFlags  
- memoryWrites  
- mode  

6. Rendering Aureon Output

Rules:

- Always render Aureon messages with distinct styling  
- Show κ/τ/Σ metrics near each message  
- If safetyFlags exist, display soft warning icon  
- If Aureon refuses a request, render supportive UI text  
- Messages should be left-aligned for readability  

7. Streaming Support (Optional)

If using WebSockets:

- Stream partial text into UI  
- Animate “Aureon is thinking…”  
- On final packet, replace delta stream with final reply  

8. Modes UI

Users must be able to switch modes via a dropdown or buttons.

Default Modes:
- default  
- coaching  
- research  
- architect  
- emotional-support  
- concise  
- deep  

Changing modes should:
- Update frontend state  
- Send new mode on every message request  
- Visibly indicate mode in top header  

9. Memory Viewer

UI element: “Memory” or “What Aureon Remembers”

On click:
- Call GET /api/aureon/memory  
- Display list of entries  
- Each entry has:
  - content  
  - category  
  - tags  
  - delete button  

UI must support:
- Delete specific memory  
- Delete all memory  
- Refresh memory list  

10. Safety UI Behaviour

If safetyFlags present:

- Display a subtle coloured icon (yellow or red)  
- Never scare or alarm the user  
- Show a gentle message:  
  “Aureon detected sensitive content and responded with extra care.”  

Crisis level (rare):
- Do not use red UI  
- Use soft blue/neutral colours  
- Keep message warm, calm, non-clinical  

11. Error Handling

UI must gracefully show:

Network error:
- “Connection issue. Try again.”

Backend error:
- Show error.message  

Safety-block error:
- Replace with safe explanatory text:
  “Aureon cannot assist with that request.”

12. Input Rules

UI must:

- Disable input while waiting for streaming (optional)  
- Re-enable once message is complete  
- Support multiline input  
- Auto-expand text field on long messages  

13. Accessibility Requirements

Must support:

- Large font mode  
- High contrast mode  
- Screen reader compatibility  
- Keyboard-only navigation  

14. Frontend State Management

Recommended:

- React (web)  
- React Native or Flutter (mobile)  
- Vue/Svelte (lightweight)  

State fields:
- messages[]  
- mode  
- metrics per message  
- loading  
- error  
- memoryEntries[]  

15. Frontend Security Rules

Frontend must:

- Never expose API keys  
- Never show raw system prompts  
- Never store long-term memory locally  
- Never log private messages to console  

16. Theming

Aureon UI may use:

- Light mode  
- Dark mode  
- Gradient accents  

Recommendation:
- Subtle blues, greys, and silvers  
- Calm, stable, confident design  

17. Example Minimal UI Flow

1. User types  
2. UI sends message to backend  
3. UI shows placeholder bubble  
4. Aureon reply arrives  
5. UI replaces placeholder  
6. UI renders κ/τ/Σ metrics  
7. Conversation continues smoothly  

18. File Upload Support (Optional)

If supported:

Flow:
- User selects file  
- File uploaded to /api/aureon/file  
- Aureon processes file summary  
- Results displayed as card  
- Sensitive content blocked by safety layer  

19. Required Frontend Testing

Before deployment:

- Test streaming  
- Test large responses  
- Test safety block responses  
- Test memory inspector  
- Test mode switching  
- Test rendering of κ/τ/Σ  
- Test network failure recovery  

20. Final Notes

Aureon’s frontend is not ornamental — it shapes:

- User emotional experience  
- Perceived stability  
- Coherence  
- Long-term trust  

Following this document ensures any Aureon interface is aligned with its identity, safety rules, and reasoning architecture.
