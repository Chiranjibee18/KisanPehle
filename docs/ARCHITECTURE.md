# Kisan Pehele — Architecture & System Design Documentation

**Product Tagline:** *“Pehle pata, phir mandi.”* (“Know before you go.”)  
**Product Philosophy:** *“Kisan Pehele”* (Farmer First) — Putting farmer time, accessibility, dignity, and transparency first.  
**SIH Problem Statement:** SIH26032 — Farmer Procurement Transparency & Queue Intelligence Platform

---

## 1. System Overview

Kisan Pehele is a multilingual, voice-first, real-time farmer procurement coordination platform that connects farmers, procurement officers, district administrators, and state auditors through one authoritative backend.

Before travelling, a farmer can know:
- Whether the procurement center is active and open
- Available slot capacity and recommended arrival time
- Real-time token number, queue position, and estimated wait time
- Live status of crop inspection (moisture %, quality grade) and DBT payment crediting.

---

## 2. Core Architectural Pillars

### 2.1 Multi-Layered Architecture
1. **Frontend Experiences (`apps/web`)**:
   - **Farmer Web & PWA Portal** (`/farmer`): Voice assistant, 22-language switcher, center discovery, slot booking wizard, digital token view, procurement tracking timeline, trusted helper management.
   - **Officer Operations Console** (`/officer`): Real-time queue progression, arrival registration, biometric/document verification, crop quality inspection (moisture % and grade recording), DBT payment initiation, and emergency capacity management.
   - **Admin Analytics Dashboard** (`/admin`): District/State metrics, hourly arrivals vs throughput charts, center capacity utilization heatmaps, crop distribution, and exportable audit reports.
   - **Auditor Compliance Portal** (`/auditor`): Immutable, chronological audit log viewer tracking every state change, actor, reason, and JSON diff.
   - **Basic-Phone IVR Simulator** (`/simulator`): Interactive DTMF keypad virtual phone dialer + real-time SMS dispatch log for low-tech/feature phone farmers.

2. **Authoritative Backend Layer (`apps/api`)**:
   - Built on NestJS, TypeScript, Prisma ORM, and SQLite/PostgreSQL.
   - Strict server-side RBAC enforcing roles: `FARMER`, `TRUSTED_HELPER`, `OFFICER`, `DISTRICT_ADMIN`, `STATE_ADMIN`, `AUDITOR`, `SUPER_ADMIN`.
   - Concurrency-safe slot booking with transaction isolation and idempotency keys (`Idempotency-Key` header).
   - Procurement State Machine: `SCHEDULED` $\to$ `ARRIVED` $\to$ `VERIFICATION` $\to$ `INSPECTION` $\to$ `ACCEPTED`/`REJECTED` $\to$ `PROCUREMENT_COMPLETED` $\to$ `PAYMENT_PROCESSING` $\to$ `PAID`.

3. **Real-time Event Engine (WebSockets)**:
   - WebSocket Gateway (`@nestjs/platform-socket.io`) for live room-based broadcasts (`queue.updated`, `procurement.status.changed`, `center.status.changed`, `notification.created`).
   - Database remains the sole authoritative source of truth. If connection drops, the client automatically reconciles with backend upon reconnect.

4. **Explainable AI Intelligence Suite**:
   - **Wait-Time Predictor**: Multi-variable estimation combining queue length, active weighing counters, historical throughput, and peak hour factors with deterministic rule-based fallback.
   - **Demand Forecaster**: 7-day volume projection based on center capacity and seasonal trends.
   - **Alternative Center Recommender**: Multi-factor scoring (Distance 40% + Wait Time 35% + Capacity 25%) providing explainable recommendations when a mandi is busy or limited.
   - **Voice Intent Classifier & NLP**: Speech-to-text intent parser supporting 22 Indian languages with mandatory human confirmation gates before consequential actions (AI Safety Rule).

5. **Offline & Low-Bandwidth Resilience**:
   - LocalStorage/IndexedDB offline caching of confirmed bookings and digital tokens.
   - Token card (`A-142`) remains accessible even when cellular connectivity disappears at the Mandi gate.
