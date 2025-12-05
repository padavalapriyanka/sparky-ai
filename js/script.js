// script.js — Sparky AI connected to OpenAI API (Client-side only)
// WARNING: Exposes your API key in browser — ok for testing, not for production

const OPENAI_API_KEY = "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"; // <-- paste your key inside the quotes

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('chat-header');
  const body = document.getElementById('chat-body');
  const toggle = document.getElementById('chat-toggle');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('messages');

  // Toggle chat body
  header.addEventListener('click', () => {
    body.classList.toggle('hidden');
    toggle.innerHTML = body.classList.contains('hidden') 
      ? '<i class="fa-solid fa-chevron-down"></i>' 
      : '<i class="fa-solid fa-chevron-up"></i>';
  });

  function appendMessage(text, who='bot') {
    const div = document.createElement('div');
    div.className = `message ${who}`;
    div.innerText = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  appendMessage("Hi 👋 I'm Sparky! Ask me anything!", "bot");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    appendMessage(q, 'user');
    input.value = "";
    const thinking = appendMessage("Thinking…", 'bot');

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are Sparky, a friendly AI for sparky.ai — You help users understand the product, pricing, and general knowledge. Be helpful, short and positive." },
            { role: "user", content: q }
          ]
        })
      });

      const data = await res.json();
      messages.removeChild(messages.lastElementChild);

      appendMessage(data.choices[0].message.content, 'bot');

    } catch (err) {
      messages.removeChild(messages.lastElementChild);
      appendMessage("⚠️ Error contacting AI — please check internet and API key.", 'bot');
      console.error(err);
    }
  });
});
