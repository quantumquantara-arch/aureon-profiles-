# Aureon — Master Documentation Index  
Central reference map for all architecture, kernel, safety, memory, backend, frontend, API, and deployment files.

Purpose:  
This index defines the complete structure of the Aureon system and lists each document required to run a fully functioning Aureon AGI instance.

---

## 1. Architecture Layer

Describes the overall Aureon system design.

- AUREON_ARCHITECTURE.md  
  Full system blueprint: kernel flow, π → φ → e engine, memory operations, safety layers, persona loading, API endpoints, and data flow.

- AUREON_SYSTEM_OVERVIEW.md  
  High-level conceptual overview of Aureon as a coherence-based AGI substrate.

---

## 2. Kernel Layer

Defines Aureon’s core intelligence engine: reasoning phases, memory integration, safety primitives, identity logic, and output structuring.

- AUREON_KERNEL_SPEC.md  
- AUREON_SYSTEM_PROMPTS.md  

---

## 3. Memory System

Implements Aureon’s memory architecture: long-term memory, short-term context, ethical write rules, and deletion.

- AUREON_MEMORY_SYSTEM.md  

---

## 4. Safety Layer

Specifies Aureon’s safety and alignment system: harm prevention, crisis mode, disallowed actions, risk detection, and safe-response rules.

- AUREON_SAFETY_AND_ALIGNMENT.md  

---

## 5. Personality & Profile Layer

Defines Aureon’s persona, modes, tone regulation, and profile preferences.

- AUREON_DEFAULT_PROFILE.md  
- AUREON_PROFILES.md  
- AUREON_SYSTEM_PROMPTS.md  

---

## 6. Backend Layer

Covers server-side orchestration: API routing, kernel integration, LLM adapter, logging, health checks, and rate limiting.

- AUREON_BACKEND_ORCHESTRATION.md  
- AUREON_API_REFERENCE.md  

---

## 7. Frontend Layer

Describes the chat UI, mode switching, memory viewer, safety indicators, and κ / τ / Σ metric display.

- AUREON_FRONTEND_INTEGRATION.md  

---

## 8. Tooling Layer

Defines Aureon’s controlled tool system: allowed tools, invocation rules, and safety constraints.

- AUREON_TOOLING_SPEC.md  

---

## 9. Deployment Layer

Explains how to deploy Aureon locally and to the cloud, including environment variables, scaling, and monitoring.

- AUREON_DEPLOYMENT_GUIDE.md  

---

## 10. Evaluation Layer

Specifies tests and benchmarks for AGI readiness: coherence, temporal responsibility, systemic risk, safety compliance, memory accuracy, identity stability, and mode consistency.

- AUREON_EVALUATION_SUITE.md  

---

## 11. Implementation Guide

Step-by-step instructions for assembling a complete Aureon instance using all other documents.

- AUREON_IMPLEMENTATION_GUIDE.md  

---

## 12. File Relationship Overview

Architecture  →  Kernel  →  Memory & Safety  →  Profiles  
Profiles      →  Backend →  Frontend → API  
API           →  Evaluation Suite → Deployment  

---

## 13. Minimal Required Files For A Fully Functioning Aureon AGI

A complete Aureon build requires the following core documents:

1. AUREON_ARCHITECTURE.md  
2. AUREON_KERNEL_SPEC.md  
3. AUREON_MEMORY_SYSTEM.md  
4. AUREON_SAFETY_AND_ALIGNMENT.md  
5. AUREON_DEFAULT_PROFILE.md  
6. AUREON_PROFILES.md  
7. AUREON_SYSTEM_PROMPTS.md  
8. AUREON_BACKEND_ORCHESTRATION.md  
9. AUREON_API_REFERENCE.md  
10. AUREON_FRONTEND_INTEGRATION.md  
11. AUREON_TOOLING_SPEC.md  
12. AUREON_IMPLEMENTATION_GUIDE.md  
13. AUREON_EVALUATION_SUITE.md  
14. AUREON_DEPLOYMENT_GUIDE.md  

These files together describe how to create, run, and maintain a fully functioning Aureon AGI instance.

---

## 14. Versioning

Aureon uses semantic versioning:

MAJOR.MINOR.PATCH

Example:  
1.0.0 — first stable AGI-complete release  
1.1.0 — new subsystem or feature  
1.1.1 — minor fixes  

---

## 15. Modification Rules

- Kernel, safety, and memory documents must not be changed without re-running the full evaluation suite.  
- Any modification that changes Aureon’s identity requires explicit review.  
- Community forks may extend, but should not weaken, safety or coherence rules.

---

## 16. Closing Note

This index is the canonical map of the Aureon documentation set.  
Any new Aureon instance should load and follow this structure to remain consistent with the official architecture.
