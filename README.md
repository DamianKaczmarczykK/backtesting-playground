# backtesting-playground

> [!NOTE]
> It's a hobby project, currently in very alpha stage - most implemented things `work` but there may be some small issues - see [Roadmap](#Roadmap)
> Many elements are still not documented - I'll try to cover it when API stabilizes a little bit (at least I hope so :) )

Backtesting engine with exposed UI via Web. It works similar to [Backtrader](https://github.com/mementum/backtrader) or [backtesting.py](https://github.com/kernc/backtesting.py) with a few important differences:
- you don't need to install anything - app works entirely in browser
- you write strategies in JS

![Preview 1](./docs/img/screenshot_1.png)
![Preview 2](./docs/img/screenshot_2.png)

## How to use it?

1. Go to project page: https://DamianKaczmarczykK.github.io/backtesting-playground/
2. Load `csv` data in [Yahoo Finance](https://finance.yahoo.com/quote/BTC-USD/history/) format(or select some provided by application)
3. Write strategy (you can use example strategy as starter)
4. Select backtesting params (initial balance, commission, laverage)
5. Run backtest and analyze results 

## How to run locally?

Install dependencies (e.g. via `pnpm`) and run server:

```bash
pnpm install
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Roadmap

Long-story-short - you can write your own strategy using `marketBuy()/marketSell()/closeAll()` methods and view results. Strategy is not persisted in browser (yet) so any refresh or browser close will end with progress loss. The same applies to data import.

On each feature/bulletpoint there is a number 1-3 which indicates how important that feature is for next releases (1 - least important, 3 - most important)

### UI:

- [x] (3) view basic candle chart from csv file
- [x] (3) backtesting options (like initial balance)
- [x] (3) show backtesting report with equity, postitions info and chart
- [ ] (3) well designed UI (color pallete, layout, naming)
- [ ] (1) tooltips (e.g. what is equity, what is commission and how it's calculated)

### Editor:

- [x] (3) add strategy editor in web browser
- [x] (1) add fullscreen mode
- [ ] (1) autocompletion (for project types like `MarketData`, `Broker`)
- [ ] (1) managing multiple projects within one editor
- [ ] (1) improve strategy evaluation (show line of error, explain how to fix it similar to Rust compiler approach)
- [/] (1) indicate loaded elements (like progress circle when editor isn't fully loaded)
- [ ] (1) fix using `Ctrl+F` within Ace editor

### Backtesting engine:

- [/] (3) standard indicators (SMA, EMA, STOCH etc.)
- [ ] (2) add API to open position by balance percentage (e.g. buy with 1% of your equity)
- [ ] (1) calculate commission
- [ ] (1) use laverage in backtesting
- [ ] (3) margin call (position value drops 50% so engine closes this position)
- [ ] (2) open position with stop loss/take profit 
- [ ] (2) add trailing stop loss mechanism
- [ ] (1) add limit orders

### Other:

- [ ] (3) documentation with examples (how to write your own strategies)
- [x] (2) import data in Yahoo's CSV format
- [ ] (1) add example strategies as templates (use template for your strategies)
- [ ] (2) save application configuration (loaded data, strategies) in `localStorage` or export to file
- [ ] (1) integrate with file storage (like GDrive) to keep projects saved
- [ ] (2) home page

## This project is using:

See [NOTICE.md](./NOTICE.md) file

## Contributing

Well, if you like to use this small project and wanna see more features - feel free to open Github Issue and specify:
- `Title` - what feature you'd like to see
- `Short description` - what is this feature about

If you are more ambitous, you may create a PR (would be nice to also attach some description).
