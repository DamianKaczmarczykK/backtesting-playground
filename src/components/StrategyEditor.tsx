import { Show, createSignal, onMount } from "solid-js";
import { BacktestingReport, DEFAULT_STRATEGY, MarketData, Strategy, runBacktesting } from "./BacktestingEngine";
import Editor from "./Editor";

export function StrategyEditor(props: any) {

  const setBacktestingReport = (backtestingReport: BacktestingReport) => props.setBacktestingReport(backtestingReport);
  const marketData = () => props.marketData;

  let importedData: MarketData;

  onMount(() => {
    importedData = new MarketData(marketData());
  });

  const [backtestingError, setBacktestingError] = createSignal<string | null>(null);
  const [strategyCode, setStrategyCode] = createSignal(DEFAULT_STRATEGY);

  const [initialBalance, setInitialBalance] = createSignal<number>(10000);

  return (
    <div>

      <div>

        <div class="flex items-center gap-1">
          <label for="InitialBalance">Initial balance</label>
          <button type="button" class="size-10 leading-10 text-gray-600 transition hover:opacity-75">
            &minus;
          </button>

          <input
            type="number"
            id="InitialBalance"
            value={initialBalance()}
            onChange={(e: any) => {
              setInitialBalance(e.currentTarget.value)
            }}
            class="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />

          <button type="button" class="size-10 leading-10 text-gray-600 transition hover:opacity-75">
            &plus;
          </button>
        </div>
      </div>



      <a
        class="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        href="#"
        onClick={() => {
          try {
            console.log(strategyCode());
            // HACK: Jesus Christ, it's taking string input, declares global variable and assign evaluated result to it - then it can be passed in rest of the code
            eval(strategyCode());
            const strategy: Strategy = window['strategy']

            // TODO: move below part to separated function/class
            const backtestingAccount = {
              initialBalance: initialBalance(),
              currentBalance: initialBalance(),
              openPositions: [],
              closedPositions: []
            };
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
        <span class="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-indigo-600 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" ></span>
        <span class="relative block border border-current bg-white px-8 py-3">Run strategy</span>
      </a>

      <Editor
        onEdit={(content: string) => setStrategyCode(content)}
        defaultContent={DEFAULT_STRATEGY} />

      <Show when={backtestingError()}>
        <div class="bg-red-700">
          {backtestingError()}
        </div>
      </Show>
    </div>
  );
}
