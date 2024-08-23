import { Show, createSignal } from "solid-js";
import { Account, BacktestingReport, DEFAULT_STRATEGY, MarketData, Strategy, runBacktesting } from "~/components/BacktestingEngine";
import { importFromCsv } from "~/components/DataImporter";
import Editor from "~/components/Editor"

export default function Home() {

  const account: Account = {
    initialBalance: 10_000.0,
    currentBalance: 10_000.0,
    openPositions: [],
    closedPositions: []
  }

  const [backtestingReport, setBacktestingReport] = createSignal<BacktestingReport | null>(null);
  const [backtestingError, setBacktestingError] = createSignal<string | null>(null);
  const [strategyCode, setStrategyCode] = createSignal(DEFAULT_STRATEGY);

  return (
    <main class="text-center mx-auto p-4">
      <div class="flex flex-col">

        <button
          class='bg-gray-400'
          onClick={() => {
            try {
              const fixturedImportedData = importFromCsv();
              const importedData = new MarketData(fixturedImportedData);
              console.log(strategyCode());
              // HACK: Jesus Christ, it's taking string input, declares global variable and assign evaluated result to it - then it can be passed in rest of the code
              eval(strategyCode());
              const strategy: Strategy = window['strategy']
              const backtestingResult = runBacktesting(strategy, importedData, account);
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
          }>Run strategy</button>

        <Editor
          onEdit={(content: string) => setStrategyCode(content)}
          defaultContent={DEFAULT_STRATEGY} />

        <Show when={backtestingError()}>
          <div class="bg-red-700">
            {backtestingError()}
          </div>
        </Show>

        <Show when={backtestingReport()}>
          <div class="ml-16 translate-x-1/2">
            <table>
              <thead>
                <tr>
                  <th>Initial balance</th>
                  <th>Current balance</th>
                  <th>Closed positions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{backtestingReport()?.initialBalance.toFixed(2)}</td>
                  <td>{backtestingReport()?.currentBalance.toFixed(2)}</td>
                  <td>{backtestingReport()?.closedPositions.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Show>
      </div>
    </main >
  );
}
