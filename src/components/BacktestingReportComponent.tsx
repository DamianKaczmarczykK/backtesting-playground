import { For, Show, onMount } from "solid-js";
import { BacktestingReport, ClosedPosition, PositionType, profitWithoutCommission } from "./BacktestingEngine";
import { IChartApi, createChart } from "lightweight-charts";
import { BadgeDelta } from "./ui/badge-delta";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

function Arrow(props: any) {
  const backtestingReport = () => props.backtestingReport;
  const percentChange = (report: BacktestingReport) => (100 * ((report.equity - report.initialBalance) / report.initialBalance)).toFixed(2);
  return (
    <>
      <Show when={backtestingReport()?.equity > backtestingReport()?.initialBalance}>
        <BadgeDelta deltaType="increase">+ {percentChange(backtestingReport())}%</BadgeDelta>
      </Show>

      <Show when={backtestingReport()?.equity < backtestingReport()?.initialBalance}>
        <BadgeDelta deltaType="decrease">- {percentChange(backtestingReport())}%</BadgeDelta>
      </Show>
    </>
  );
}

export default function BacktestingReportComponent(props: any) {
  const backtestingReport = () => props.backtestingReport;

  const marketData = () => props.marketData;
  const markers = () => props.markers || [];

  let chartDiv: HTMLDivElement;
  let chart: IChartApi;
  let candlestickSeries: any;

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
    candlestickSeries.setData(marketData());
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
            <p class="text-sm text-gray-500">Equity</p>
            <p class="text-2xl font-medium text-gray-900">${backtestingReport()?.equity.toFixed(2)}</p>
          </div>

          <Arrow backtestingReport={backtestingReport()} />
        </article>

      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200">

        <h1 class="text-4xl font-bold tracking-tight text-gray-900 p-6">Closed positions</h1>

        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center">Type</TableHead>
              <TableHead class="text-center">Start date</TableHead>
              <TableHead class="text-center">End date</TableHead>
              <TableHead class="text-center">Start price</TableHead>
              <TableHead class="text-center">End price</TableHead>
              <TableHead class="text-center">Quantity</TableHead>
              <TableHead class="text-center">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <For each={backtestingReport()?.closedPositions}>{(elem: ClosedPosition, index) =>
              <TableRow onmouseover={(_e: MouseEvent) => {
                chart.setCrosshairPosition(elem.startPrice, elem.startDate, candlestickSeries);
              }} >
                <TableCell>{PositionType[elem.type]}</TableCell>
                <TableCell>{elem.startDate}</TableCell>
                <TableCell>{elem.endDate}</TableCell>
                <TableCell>{elem.startPrice.toFixed(2)}</TableCell>
                <TableCell>{elem.endPrice.toFixed(2)}</TableCell>
                <TableCell>{elem.quantity}</TableCell>
                <TableCell class={(profitWithoutCommission(elem) > 0 ? 'text-green-500' : 'text-red-500')}>{profitWithoutCommission(elem).toFixed(2)}</TableCell>
              </TableRow>
            }
            </For>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
