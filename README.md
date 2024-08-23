# backtesting-ts

## Idea

Application similar to TradingView - main features are:
- finance charts view
- Technical Analysis indicators selection
- possibility to include your own indicators in JS
- built-in backtesting engine using JS to write strategies
- being embeddable on personal sites

## How to run?

Install dependencies and run server:

```bash
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Roadmap

- [ ] view basic candle chart from file
- [ ] TODO - add more features

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## This project was created with the [Solid CLI](https://solid-cli.netlify.app)
