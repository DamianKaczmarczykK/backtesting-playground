import { For, Show, onMount } from "solid-js";
import { BacktestingReport, ClosePosition, TOHLCV, profit } from "./BacktestingEngine";
import Chart from "./Chart";
import { IChartApi, createChart } from "lightweight-charts";

function UpArrow(props: any) {
  const percent = () => props.percent;
  return (
    <div class="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>

      <span class="text-xs font-medium">{percent()}% </span>
    </div>
  );
}

function DownArrow(props: any) {
  const percent = () => props.percent;
  return (
    <div class="inline-flex gap-2 rounded bg-red-100 p-1 text-red-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
        />
      </svg>

      <span class="text-xs font-medium">{percent()}% </span>
    </div>
  );
}

export default function BacktestingReportComponent(props: any) {
  const backtestingReport = () => props.backtestingReport;

  const marketData = () => props.marketData;
  const markers = () => props.markers || [];

  const percentChange = (report: BacktestingReport) => (100 * ((report.currentBalance - report.initialBalance) / report.initialBalance)).toFixed(2);

  let chartDiv: HTMLDivElement;
  let chart: IChartApi;
  let candlestickSeries: any;

  const data = () => marketData().map((candle: TOHLCV) => {
    return {
      time: candle.timestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close
    }
  });

  onMount(() => {
    chart = createChart(chartDiv, {
      height: 500,
      layout: {
        textColor: '#DDD',
        background: { color: '#222' }
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' }
      }
    });

    candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(data());
    candlestickSeries.setMarkers(markers());
  });

  return (
    <div>

      <div id="chart"
        class="mr-4 mb-4"
        ref={(el) => {
          chartDiv = el;
        }}> </div>


      <div class="flex">
        <article class="flex mr-2 flex-1 items-end justify-between rounded-lg border border-gray-100 bg-white p-6">
          <div>
            <p class="text-sm text-gray-500">Initial balance</p>
            <p class="text-2xl font-medium text-gray-900">${backtestingReport()?.initialBalance}</p>
          </div>
        </article>

        <article class="flex ml-2 flex-1 items-end justify-between rounded-lg border border-gray-100 bg-white p-6">
          <div>
            <p class="text-sm text-gray-500">Current balance</p>
            <p class="text-2xl font-medium text-gray-900">${backtestingReport()?.currentBalance.toFixed(2)}</p>
          </div>

          <Show when={backtestingReport()?.currentBalance > backtestingReport()?.initialBalance}>
            <UpArrow percent={percentChange(backtestingReport())} />
          </Show>

          <Show when={backtestingReport()?.currentBalance < backtestingReport()?.initialBalance}>
            <DownArrow percent={percentChange(backtestingReport())} />
          </Show>
        </article>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200">

        <h1 class="text-4xl font-bold tracking-tight text-gray-900 p-6">Closed positions</h1>
        <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead class="ltr:text-left rtl:text-right">
            <tr>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Start date</th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">End date</th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Start price</th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">End price</th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Profit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <For each={backtestingReport()?.closedPositions}>{(elem: ClosePosition, index) =>
              <tr onmouseover={(_e: MouseEvent) => {
                chart.setCrosshairPosition(elem.startPrice, elem.startDate, candlestickSeries);
              }} >
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{elem.startDate}</td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{elem.endDate}</td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{elem.startPrice.toFixed(2)}</td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{elem.endPrice.toFixed(2)}</td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{elem.quantity}</td>
                <td class={(elem.endPrice > elem.startPrice ? 'text-green-500' : 'text-red-500') + " whitespace-nowrap px-4 py-2"}>{profit(elem).toFixed(2)}</td>
              </tr>
            }
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
}
