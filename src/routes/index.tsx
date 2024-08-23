import { createSignal } from "solid-js";
import { Account, Strategy, runStrategy } from "~/components/BacktestingEngine";
import { importFromCsv } from "~/components/DataImporter";
import Editor from "~/components/Editor"

export default function Home() {

  const account: Account = {
    initialBalance: 10_000.0,
    currentBalance: 10_000.0,
    openPositions: [],
    closedPositions: []
  }

  const [backtestingReport, setBacktestingReport] = createSignal(account);
  const [strategyCode, setStrategyCode] = createSignal(
    "window['strategy'] = (index, data) => {\n\
    const currentCandle = data[index];\n\
    if (currentCandle.close < 30000.0) {\n\
        return 0.1;\n\
    } else if (currentCandle.close > 60000.0) {\n\
        return -0.1;\n\
    }\n\
    return 0.0;\n\
};"
  );

  return (
    <main class="text-center mx-auto p-4">
      <div class="flex flex-col">
        <Editor onEdit={(content: string) => setStrategyCode(content)} />
        <button onClick={() => {
          try {
            const importedData = importFromCsv();
            console.log(strategyCode());
            console.log(eval(strategyCode()));
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
