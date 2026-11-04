const LEVELS = Array.from({ length: 25 }, (_, index) => ({
  number: index + 1,
  count: 5 + index,
  relightMs: 6000 - index * 50
}));
const COLORS = ['#81d7db', '#ffd16e', '#bd99e5', '#f89ab8', '#9bddad', '#ffae80'];
const els = {
  level: document.querySelector('#level'), restart: document.querySelector('#restart'),
  candles: document.querySelector('#candles'), count: document.querySelector('#count'),
  progress: document.querySelector('#progress'), fill: document.querySelector('#progress-fill'),
  hint: document.querySelector('#level-hint'), message: document.querySelector('#message'),
  dialog: document.querySelector('#win-dialog'), playAgain: document.querySelector('#play-again'),
  nextLevel: document.querySelector('#next-level'), winCopy: document.querySelector('#win-copy')
};

let candles = [];
let won = false;
let lastFocused = null;

function updateStatus() {
  const out = candles.filter(candle => candle.out).length;
  const total = candles.length;
  els.count.textContent = `${out} / ${total}`;
  els.fill.style.width = `${(out / total) * 100}%`;
  els.progress.setAttribute('aria-valuemax', String(total));
  els.progress.setAttribute('aria-valuenow', String(out));
  if (out === total && total > 0 && !won) win();
}

function renderCandle(candle) {
  candle.button.classList.toggle('out', candle.out);
  candle.button.classList.toggle('urgent', candle.out && !won);
  candle.button.setAttribute('aria-label', `Candle ${candle.index + 1}: ${candle.out ? 'out, relighting soon' : 'lit, tap to blow out'}`);
}

function blowOut(candle) {
  if (won || candle.out) return;
  candle.out = true;
  renderCandle(candle);
  updateStatus();
  if (won) return;
  const delay = LEVELS[Number(els.level.value) - 1].relightMs;
  candle.timer = window.setTimeout(() => {
    candle.out = false;
    candle.timer = null;
    renderCandle(candle);
    updateStatus();
    els.message.textContent = 'A candle relit! Keep going!';
  }, delay);
  els.message.textContent = 'Quick! Get the rest before they relight.';
}

function win() {
  won = true;
  candles.forEach(candle => {
    window.clearTimeout(candle.timer);
    candle.timer = null;
    renderCandle(candle);
  });
  els.message.textContent = 'All candles out — happy birthday!';
  els.winCopy.textContent = `You blew out all ${candles.length} candles on Level ${els.level.value}!`;
  els.nextLevel.hidden = Number(els.level.value) === LEVELS.length;
  lastFocused = document.activeElement;
  els.dialog.hidden = false;
  els.playAgain.focus();
}

function closeWin() {
  els.dialog.hidden = true;
  (lastFocused?.isConnected ? lastFocused : els.restart).focus();
}

function start() {
  candles.forEach(candle => window.clearTimeout(candle.timer));
  won = false;
  els.dialog.hidden = true;
  const level = LEVELS[Number(els.level.value) - 1];
  els.candles.replaceChildren();
  els.candles.classList.toggle('many', level.count > 8);
  els.candles.classList.toggle('dense', level.count > 16);
  candles = Array.from({ length: level.count }, (_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'candle';
    button.style.setProperty('--candle-color', COLORS[index % COLORS.length]);
    button.innerHTML = '<span class="wick" aria-hidden="true"></span><span class="flame" aria-hidden="true"></span>';
    const candle = { index, button, out: false, timer: null };
    button.addEventListener('click', () => blowOut(candle));
    els.candles.append(button);
    renderCandle(candle);
    return candle;
  });
  els.hint.textContent = `Relights in ${(level.relightMs / 1000).toFixed(1)} seconds`;
  els.message.textContent = 'Tap a flame to blow it out!';
  updateStatus();
}

els.level.addEventListener('change', start);
els.restart.addEventListener('click', start);
els.playAgain.addEventListener('click', () => { closeWin(); start(); });
els.nextLevel.addEventListener('click', () => {
  const next = Number(els.level.value) + 1;
  if (next > LEVELS.length) return;
  closeWin();
  els.level.value = String(next);
  start();
});
els.dialog.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    const buttons = [els.playAgain, els.nextLevel].filter(button => !button.hidden);
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
LEVELS.slice(1).forEach(level => {
  const option = document.createElement('option');
  option.value = String(level.number);
  option.textContent = `Level ${level.number} · ${level.count} candles`;
  els.level.append(option);
});
start();
