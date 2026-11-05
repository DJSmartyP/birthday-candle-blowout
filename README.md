# Candle Dash

A tiny birthday cake game for the browser. Click or tap every candle before it relights. Every six candles blown out saves your progress. When all candles are out, you win.

There are 25 levels. Level 1 has 5 candles and a 3 second relight window. Each level adds one candle and shortens the window, reaching 29 candles and 1.5 seconds on Level 25. The game keeps the relight timing hidden from players.

## Play locally

Open `index.html` in any modern browser. There are no dependencies or build steps.

Keyboard players can Tab to a candle and press Enter or Space to blow it out. Mouse and touch players must click or tap each candle individually.

## Edit the game

The `LEVELS` array near the top of `script.js` controls candle counts and relight times (in milliseconds). The visual design is in `style.css`.

## License

MIT — see [LICENSE](LICENSE).
