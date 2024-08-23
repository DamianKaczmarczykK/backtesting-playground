# backtesting-ts

## Idea

Backtesting engine with exposed UI via Web. You can:
1. Go to page
2. Load `csv` data (or select some default one)
3. Write strategy (you can use example strategies as starter)
4. Select backtesting params (initial balance, commission, laverage)
5. Run backtest and analyze results 

## How to run?

Install dependencies (e.g. via `pnpm`) and run server:

```bash
pnpm install
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Roadmap

On each feature/bulletpoint there is a number 1-3 which indicates how important it is (1 - least important, 3 - most important)

### UI:

- [x] (3) view basic candle chart from file
- [x] (3) backtesting settings (initial balance)
- [x] (3) show backtesting report with balance and postitions info
- [ ] (3) well designed UI (color pallete, layout)

### Editor:

- [x] (3) add strategy editor in web browser

### Other:
- [ ] (3) standard indicators (SMA, EMA, STOCH etc.)
- [ ] (3) documentation with examples
- [x] (2) import data in Yahoo's CSV format
- [ ] (1) calculate commission
- [ ] (1) use laverage in backtesting
- [ ] (1) add example strategies as templates

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `pnpm run build` will generate a Node app that you can run with `pnpm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## This project was created with the [Solid CLI](https://solid-cli.netlify.app)
