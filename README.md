# Candle Dash

A tiny birthday cake game for the browser. Tap or click every candle before any of them relight. When all candles are out at once, you win.

There are 25 levels. Level 1 has 5 candles and a 6 second relight window. Each level adds one candle and reduces the window by 0.05 seconds. Level 25 has 29 candles and a 4.8 second window.

## Play locally

Open `index.html` in any modern browser. There are no dependencies or build steps.

Keyboard players can Tab to a candle and press Enter or Space to blow it out. The game also works on touch screens.

## Edit the game

The `LEVELS` array near the top of `script.js` controls candle counts and relight times (in milliseconds). The visual design is in `style.css`.

## License

MIT — see [LICENSE](LICENSE).
