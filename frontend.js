// Complete Aureon Frontend Logic (Vanilla JS)
// Connects directly to the Aureon backend (server.js) and powers a full chat UI.
// This file is designed to drop into ANY frontend: static HTML, React, Vue, or custom.
// All logic is self-contained, clean, stable, and production-ready.

// ===============================
// CONFIGURATION
// ===============================

const AUREON_API_BASE = "https://YOUR_BACKEND_DOMAIN.com/api/aureon"; 
// Replace with your Render / Vercel / custom domain.

// User identity (simple client-side for now)
const AUREON_USER_ID = localStorage.getItem("aureon-user-id") || generateUserId();
localStorage.setItem("aureon-user-id", AUREON_USER_ID);

// ===============================
// UTILITY FUNCTIONS
// ===============================

function generateUserId() {
  return "user-" + Math.random().toString(36).substring(2, 12);
}

function qs(selector) {
  return document.querySelector(selector);
}

function createMsgHTML(text, role = "assistant") {
  const el = document.createElement("div");
  el.className = `msg ${role}`;
  el.innerHTML = `<div class="bubble">${text}</div>`;
  return el;
}

function scrollToBottom() {
  const chat = qs("#chat");
  chat.scrollTop = chat.scrollHeight;
}

// ===============================
// SEND MESSAGE TO BACKEND
// ===============================

async function sendToAureon(message, mode = null) {
  const body = { userId: AUREON_USER_ID, message };

  if (mode) body.mode = mode;

  const res = await fetch(`${AUREON_API_BASE}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error("Backend request failed");
  }

  return await res.json();
}

// ===============================
// RENDER AUREON'S REPLY
// ===============================

function renderAureonReply(reply, metrics, safetyFlags) {
  const chat = qs("#chat");

  const html = `
    <div class="aureon-output">
      <div class="aureon-text">${reply}</div>
      <div class="aureon-metrics">
        κ: ${metrics.kappa.toFixed(2)} |
        τ: ${metrics.tau.toFixed(2)} |
        Σ: ${metrics.sigma.toFixed(2)}
      </div>
      ${
        safetyFlags.length
          ? `<div class="aureon-safety">⚠ Safety flags: ${safetyFlags
              .map(f => `${f.type} (sev ${f.severity})`)
              .join(", ")}</div>`
          : ""
      }
    </div>
  `;

  const msg = createMsgHTML(html, "assistant");
  chat.appendChild(msg);
  scrollToBottom();
}

// ===============================
// SUBMIT HANDLER
// ===============================

async function onUserSubmit() {
  const input = qs("#input");
  const text = input.value.trim();
  if (!text) return;

  // Render user message
  const chat = qs("#chat");
  chat.appendChild(createMsgHTML(text, "user"));
  scrollToBottom();

  input.value = "";

  // Send to Aureon
  try {
    const { reply, metrics, safetyFlags } = await sendToAureon(text);
    renderAureonReply(reply, metrics, safetyFlags);
  } catch (err) {
    chat.appendChild(createMsgHTML("⚠ Error connecting to Aureon backend.", "assistant"));
    scrollToBottom();
  }
}

// ===============================
// EVENT LISTENERS
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = qs("#send");
  const input = qs("#input");

  sendBtn.addEventListener("click", onUserSubmit);

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") onUserSubmit();
  });
});

// ===============================
// OPTIONAL: LOAD MEMORY VIEW
// ===============================

async function loadAureonMemory() {
  const res = await fetch(`${AUREON_API_BASE}/memory?userId=${AUREON_USER_ID}`);
  if (!res.ok) return;

  const { entries } = await res.json();

  const container = qs("#memory-view");
  if (!container) return;

  container.innerHTML = entries
    .map(
      (m, i) =>
        `<div class="mem-item"><b>${i}:</b> ${m.content} <span class="mem-tags">${m.tags.join(
          ", "
        )}</span></div>`
    )
    .join("");
}

// ===============================
// OPTIONAL: MODE SWITCH
// ===============================

async function setAureonMode(mode) {
  await fetch(`${AUREON_API_BASE}/profile/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: AUREON_USER_ID, preferences: { mode } })
  });

  alert(`Aureon mode changed to: ${mode}`);
}

// END OF FILE
