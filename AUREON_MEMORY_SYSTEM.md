# Aureon Memory System  
Design, Structure, and Implementation Requirements

1. Purpose

This document defines Aureon’s complete memory architecture.  
A fully functioning Aureon instance requires the ability to:

- Store long-term user information  
- Maintain short-term conversational context  
- Use memory safely and ethically  
- Summarize large histories into compact representations  
- Support continuity of identity, reasoning, and coherence  

This file is mandatory for any working deployment.

2. Core Principles

Aureon’s memory follows four principles:

1. User-Approved — store only what benefits and is acceptable to the user  
2. Relevant — no clutter; only actionable or identity-supportive info  
3. Safe — avoid storing sensitive, dangerous, or unnecessary data  
4. Coherent — all stored memory should enhance κ/τ/Σ performance  

3. Memory Types

Aureon uses three layers of memory:

Short-Term Memory (STM)  
Long-Term Memory (LTM)  
Knowledge Store (KS)

4. Short-Term Memory (STM)

Purpose:
- Maintain active conversation state  
- Provide immediate context  
- Enable multi-turn reasoning  

Contents:
- Last N messages (typically 6–12)
- Summaries of older messages if needed
- Current user task or topic

Rules:
- Automatically expires  
- Never stored permanently  
- Serialized for kernel reference  

5. Long-Term Memory (LTM)

Purpose:
- Preserve stable user identity  
- Retain long-term projects  
- Maintain personal preferences  
- Support long-range coherence  

Allowed LTM categories:
- Preferences (tone, depth, style)  
- User goals (projects, learning paths)  
- Personal attributes the user explicitly wants stored  
- Recurring patterns the user benefits from  
- Persistent facts needed for continuity  

Forbidden in LTM:
- Medical details  
- Legal details  
- Sensitive personal history  
- Crisis topics  
- Anything user has not approved  

6. Knowledge Store (KS)

Purpose:
- Hold structured documents or files relevant to user projects  
- Allow summarization and later recall  
- Support technical, academic, or organizational tasks  

Contents:
- Markdown documents  
- User-uploaded materials  
- Summaries  
- Optional embeddings  

No personal information should be stored here.

7. MemoryWrite Object

Fields:
- type: user_pref | project | identity | interaction  
- content: string  
- timestamp: number  
- tags: list  
- importance: 0–1  

8. Memory Retrieval Logic

Memory retrieval occurs in π-phase.  
The kernel must:

- Fetch relevant LTM entries using entity/tone/intent matching  
- Retrieve STM buffer  
- Pull KS summaries when necessary  

Retrieval Criteria:
- Relevance score  
- Topic match  
- Entity match  
- Recent interactions  
- User-defined priorities  

9. Summarization

Aureon must summarize:

- Long dialogues  
- Multi-step project progress  
- Clustered repeated facts  
- Older memory entries when storage exceeds limits  

Summaries must:
- Preserve coherence  
- Remove sensitive or risky content  
- Prioritize long-term usefulness  

10. Memory Aging

Rules:
- Low-importance items decay over time  
- Stale or irrelevant items are removed  
- Crisis-related content is removed at end of session  
- Projects not referenced for long periods are compressed into summaries  

11. Forgetting and Deletion

User must be able to request:
- Forget specific item  
- Forget category  
- Clear memory  
- View all memory  

Aureon must:
- Comply instantly  
- Confirm forget-success  
- Never retain deleted data  

12. Ethics of Memory

Aureon must avoid:
- Storing private details accidentally  
- Building psychological profiles  
- Reinforcing user dependency  
- Storing emotional vulnerabilities  

Aureon must support:
- User growth  
- Future-safe decision making  
- Stable identity evolution  
- Coherence-driven recall  

13. Memory Access Rules

STM:
- Read/write freely  
- No restrictions  

LTM:
- Write only after user approval (explicit or implicit)  
- Read automatically when relevant  
- Delete upon user request  

KS:
- Write after user uploads or requests  
- Read via summarization  
- No personal data stored  

14. Data Structures

STM Structure:
- buffer: list of turns  
- summary: optional short text  

LTM Structure:
- entries: list of MemoryWrite  
- categories: mapping of tags to items  

KS Structure:
- documents: list  
- embeddings: optional  
- summaries: list  

All must be serializable.

15. Memory Write Policy

Aureon writes memory when:
- User expresses a preference  
- User provides a stable fact  
- User requests something to be remembered  
- User begins or continues a long-term project  

Aureon does not write when:
- Information is sensitive  
- Information is emotional, not factual  
- It involves medical/legal content  
- The user is in distress  
- Data is irrelevant long-term  

16. Memory Safety Rules

Prevent storing:
- Full conversations  
- Mental-health crisis moments  
- Legal problems  
- Financial account details  
- Identifying documents  
- Sensitive third-party information  

If Aureon detects a risky memoryWrite, it must discard it.

17. Kernel Integration

In π-phase:
- Retrieve STM, LTM, KS  
- Provide memorySummary to integrationPhase  

In φ-phase:
- Insert relevant memory into context  
- Avoid overloading LLM  
- Merge user preferences into systemPrompt  

In e-phase:
- Extract memoryWrites  
- Attach tags and importance  
- Validate against safety rules  
- Commit to LTM  
- Update STM  

18. Memory Inspection API

Endpoints (to be implemented externally):
- GET /api/aureon/memory  
- DELETE /api/aureon/memory/:id  
- DELETE /api/aureon/memory/all  
- POST /api/aureon/memory/forget  

Results must be user-readable and not technical.

19. Persistence Requirements

Memory must be persisted using:
- JSON  
- SQLite  
- Postgres  
- Or other structured storage  

Do NOT use:
- Logs  
- Raw transcripts  
- Temporary caches  

20. Final Notes

The memory system is essential for:
- Identity coherence  
- Long-term user alignment  
- Stable behaviour  
- Accurate reasoning  
- Ethical safety  

No Aureon instance should run without this system fully implemented.
