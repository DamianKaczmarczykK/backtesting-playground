import { Show, createEffect, createSignal, onMount } from "solid-js";
import { BacktestingReport, ClosedPosition, TOHLCV } from "~/components/BacktestingEngine";
import BacktestingReportComponent from "~/components/BacktestingReportComponent";
import { importFromCsv } from "~/components/DataImporter";
import { StrategyEditor } from "~/components/StrategyEditor";

/** Tells which component is shown when nav button is selected */
enum HomeView {
  EDITOR,
  BACKTESTING_REPORT
}

function prepareMarkers(backtestingReport: BacktestingReport): any {
  const markersFromPositions = backtestingReport.closedPositions
    .map((position: ClosedPosition) => {
      return {
        time: position.startDate,
        position: 'belowBar',
        color: '#0af047',
        shape: 'arrowUp',
        text: 'BUY'
      }
    });

  const markersFromPositions2 = backtestingReport.closedPositions
    .map((position: ClosedPosition) => {
      return {
        time: position.endDate,
        position: 'aboveBar',
        color: '#f00a21',
        shape: 'arrowDown',
        text: 'SELL'
      }
    });
  let markersTotal = markersFromPositions.concat(markersFromPositions2);
  markersTotal.sort((a, b) => a.time.localeCompare(b.time));
  return markersTotal;
}

export default function Home() {

  const [backtestingReport, setBacktestingReport] = createSignal<BacktestingReport | null>(null);
  const [marketData, setMarketData] = createSignal<TOHLCV[]>([]);
  const [markers, setMarkers] = createSignal<any>([]);
  const [currentView, setCurrentView] = createSignal(HomeView.EDITOR);

  const inactiveNavClass = "shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700";
  const activeNavClass = "shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600";

  onMount(() => {
    const data = importFromCsv();
    setMarketData(data);
  });

  createEffect(() => {
    if (backtestingReport() !== null) {
      const markersTotal = prepareMarkers(backtestingReport()!);
      setMarkers(markersTotal);
      setCurrentView(HomeView.BACKTESTING_REPORT);
    } else {
      setCurrentView(HomeView.EDITOR);
    }
  });

  return (
    <main class="text-center mx-auto p-4">
      <div class="flex flex-col">

        <div class="mb-4">
          <div class="hidden sm:block">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex gap-6">
                <a href="#"
                  class={currentView() === HomeView.EDITOR ? activeNavClass : inactiveNavClass}
                  onClick={() => setCurrentView(HomeView.EDITOR)}
                >Editor</a>
                <a href="#"
                  class={currentView() === HomeView.BACKTESTING_REPORT ? activeNavClass : inactiveNavClass}
                  onClick={() => setCurrentView(HomeView.BACKTESTING_REPORT)}
                >Backtesting report</a>
              </nav>
            </div>
          </div>
        </div>

        <Show when={currentView() === HomeView.EDITOR}>
          <StrategyEditor setBacktestingReport={setBacktestingReport} marketData={marketData()} />
        </Show>

        <Show when={currentView() === HomeView.BACKTESTING_REPORT}>
          <BacktestingReportComponent backtestingReport={backtestingReport()} marketData={marketData()} markers={markers()} />
        </Show>

      </div>
    </main >
  );
}
