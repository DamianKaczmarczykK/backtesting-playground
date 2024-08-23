import { createSignal } from "solid-js";
import { Account, Strategy, TOHLCV, runStrategy } from "~/components/BacktestingEngine";
import { importFromCsv } from "~/components/DataImporter";

export default function Home() {

  const account: Account = {
    initialBalance: 10_000.0,
    currentBalance: 10_000.0,
    openPositions: [],
    closedPositions: []
  }

  const codePrefix = "window['strategy'] = (index, data) => {"
  const codeSuffix = "};"

  const [backtestingReport, setBacktestingReport] = createSignal(account);
  const [strategyCode, setStrategyCode] = createSignal("const currentCandle = data[index]; if (currentCandle.close < 30_000.0) {return 0.1; } else if (currentCandle.close > 60_000.0) { return -0.1; } return 0.0;");


  return (
    <main class="text-center mx-auto p-4">
      <div class="flex flex-col">
        <textarea placeholder="Write strategy here" textContent={strategyCode()} onInput={(e) => {
          setStrategyCode(e.currentTarget.value);
        }}></textarea>
        <button onClick={() => {
          try {
            const importedData = importFromCsv();
            console.log(eval(codePrefix + strategyCode() + codeSuffix));
            // HACK: Jesus Christ, it's taking string input, declares global variable and assign evaluated result to it - then it can be passed in rest of the code
            const strategy: Strategy = window['strategy']
            const backtestingResult = runStrategy(strategy, importedData, account);
            console.log(backtestingResult);
            setBacktestingReport(backtestingResult);
          }
          catch (e) {
            console.error(e)
          }
        }
        }>Run strategy</button>

        <div>
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
                <td>{backtestingReport().initialBalance}</td>
                <td>{backtestingReport().currentBalance}</td>
                <td>{backtestingReport().closedPositions.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main >
  );
}
