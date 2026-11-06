const chat = document.querySelector('#chat');
const status = document.querySelector('#status');
const searchPanel = document.querySelector('#search-panel');
const searchInput = document.querySelector('#search-input');
const searchCount = document.querySelector('#search-count');
const toBottom = document.querySelector('#to-bottom');
const toast = document.querySelector('#toast');

const chatFile = 'data/Chat de WhatsApp con Diario de cuarentena 👑🦠.txt';
const entryPattern = /^(\d{1,2}\/\d{1,2}\/\d{2})\s+(\d{1,2}:\d{2})\s+-\s+(.*)$/;
let messages = [];

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

function parseChat(text) {
  const parsed = [];
  let current = null;
  text.replace(/^\uFEFF/, '').split(/\r?\n/).forEach((line) => {
    const match = line.match(entryPattern);
    if (match) {
      if (current) parsed.push(current);
      const senderMatch = match[3].match(/^([^:]+):\s([\s\S]*)$/);
      current = { date: match[1], time: match[2], sender: senderMatch ? senderMatch[1] : null, body: senderMatch ? senderMatch[2] : match[3] };
    } else if (current && line.trim()) {
      current.body += `\n${line}`;
    }
  });
  if (current) parsed.push(current);
  return parsed;
}

function formatDate(date) {
  const [day, month, year] = date.split('/');
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2000 + Number(year), Number(month) - 1, Number(day)));
}

function renderMessages(filter = '') {
  const query = filter.trim().toLocaleLowerCase('es');
  const filtered = messages.filter((message) => message.body.toLocaleLowerCase('es').includes(query) || (message.sender || '').toLocaleLowerCase('es').includes(query));
  let previousDate = '';
  chat.innerHTML = '';
  filtered.forEach((message, index) => {
    if (message.date !== previousDate) {
      const divider = document.createElement('div');
      divider.className = 'day-divider';
      divider.textContent = formatDate(message.date);
      chat.appendChild(divider);
      previousDate = message.date;
    }
    const element = document.createElement('article');
    element.className = message.sender ? 'message' : 'message message--system';
    element.style.animationDelay = `${Math.min(index, 18) * 18}ms`;
    const highlightedBody = escapeHtml(message.body).replace(/\n/g, '<br>');
    const body = query ? highlightedBody.replace(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>') : highlightedBody;
    element.innerHTML = `${message.sender ? `<p class="message__author">${escapeHtml(message.sender)}</p>` : ''}<p class="message__body">${body}</p><time class="message__meta">${message.time}</time>`;
    chat.appendChild(element);
  });
  searchCount.textContent = query ? `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}` : '';
  if (!filtered.length) chat.innerHTML = '<div class="loading">No hay mensajes que coincidan con esa búsqueda.</div>';
}

async function loadChat() {
  try {
    const response = await fetch(encodeURI(chatFile));
    if (!response.ok) throw new Error('No se pudo leer el archivo del chat.');
    messages = parseChat(await response.text());
    renderMessages();
    const authored = messages.filter((message) => message.sender);
    status.textContent = `${authored.length} entradas · ${messages[0].date} — ${messages[messages.length - 1].date}`;
  } catch (error) {
    chat.innerHTML = `<div class="loading">${escapeHtml(error.message)}<br><small>Abre la página desde un servidor local o publícala en GitHub Pages.</small></div>`;
    status.textContent = 'no se pudo cargar el diario';
  }
}

document.querySelector('#search-toggle').addEventListener('click', () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) searchInput.focus();
});
document.querySelector('#about-toggle').addEventListener('click', () => {
  toast.textContent = 'Diario de cuarentena · chat de solo lectura';
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
});
searchInput.addEventListener('input', (event) => renderMessages(event.target.value));
toBottom.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
window.addEventListener('scroll', () => toBottom.classList.toggle('is-visible', window.scrollY < document.body.scrollHeight - window.innerHeight - 280));
loadChat();