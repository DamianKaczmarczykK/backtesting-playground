import { Show, createSignal, onMount } from "solid-js";
import { FuturesAccount, BacktestingReport, MarketData, Strategy, runBacktesting } from "./BacktestingEngine";
import Editor from "./Editor";
import { backtestingOptions, setBacktestingOptions, strategyCode } from "./EditorStore";

export function StrategyEditor(props: any) {

  const setBacktestingReport = (backtestingReport: BacktestingReport) => props.setBacktestingReport(backtestingReport);
  const marketData = () => props.marketData;

  const [backtestingError, setBacktestingError] = createSignal<string | null>(null);

  return (
    <div>
      <div>

        <div class="flex items-center gap-1">
          <label>Initial balance
            <input
              type="number"
              id="initial-balance"
              value={backtestingOptions.initialBalance}
              onChange={(e: any) =>
                setBacktestingOptions({ ...backtestingOptions, initialBalance: e.currentTarget.value })
              }
              class="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            />
          </label>
        </div>

        <div class="flex items-center gap-1">
          <label>Commission
            <input
              type="number"
              id="commission"
              value={backtestingOptions.commissionPercentage}
              onChange={(e: any) =>
                setBacktestingOptions({ ...backtestingOptions, commissionPercentage: e.currentTarget.value })
              }
              class="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            />
          </label>
        </div>
      </div>

      <button
        onClick={() => {
          try {
            const importedData = new MarketData(marketData());
            console.log(strategyCode);
            console.log(importedData);
            // HACK: Jesus Christ, it's taking string input, declares global variable and assign evaluated result to it - then it can be passed in rest of the code
            eval(strategyCode.value);
            const strategy: Strategy = window['strategy']

            // TODO: move below part to separated function/class
            const backtestingAccount = new FuturesAccount(backtestingOptions.initialBalance, backtestingOptions.commissionPercentage);
            const backtestingResult = runBacktesting(strategy, importedData, backtestingAccount);
            console.log(backtestingResult);
            setBacktestingReport(backtestingResult);
            setBacktestingError(null);
          }
          catch (e) {
            if (e instanceof Error) {
              setBacktestingError(`${e.name}: ${e.message}`);
              console.error(e);
            }
          }
        }
        }
      >
        <span class="mt-4 block border border-current bg-gray-100 px-8 py-3">Run strategy</span>
      </button>

      <Editor />

      <Show when={backtestingError()}>
        <div class="my-4 bg-red-700 text-gray-100">
          {backtestingError()}
        </div>
      </Show>
    </div>
  );
}
