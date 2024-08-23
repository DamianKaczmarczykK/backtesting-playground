import { Show, createSignal, onMount } from "solid-js";
import { FuturesAccount, BacktestingReport, DEFAULT_STRATEGY, MarketData, Strategy, runBacktesting } from "./BacktestingEngine";
import Editor from "./Editor";

function NumericInput(props: any) {
  const value = props.value;
  const setValue = props.setValue;
  const name = () => props.name;
  const id = () => props.id;

  return (
    <div class="flex items-center gap-1">
      <label>{name()}
        <input
          type="number"
          id={id()}
          value={value()}
          onChange={(e: any) => {
            setValue(e.currentTarget.value)
          }}
          class="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />
      </label>
    </div>
  );
}

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
  const [commission, setCommission] = createSignal<number>(0.005);

  return (
    <div>
      <div>
        <NumericInput value={initialBalance} setValue={setInitialBalance} name="Initial balance" id="initialBalance" />
        <NumericInput value={commission} setValue={setCommission} name="Commission" id="commission" />
      </div>

      <button
        onClick={() => {
          try {
            console.log(strategyCode());
            // HACK: Jesus Christ, it's taking string input, declares global variable and assign evaluated result to it - then it can be passed in rest of the code
            eval(strategyCode());
            const strategy: Strategy = window['strategy']

            // TODO: move below part to separated function/class
            const backtestingAccount = new FuturesAccount(initialBalance(), commission());
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

      <Editor
        onEdit={(content: string) => setStrategyCode(content)}
        defaultContent={DEFAULT_STRATEGY} />

      <Show when={backtestingError()}>
        <div class="my-4 bg-red-700 text-gray-100">
          {backtestingError()}
        </div>
      </Show>
    </div>
  );
}
