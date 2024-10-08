import { For, Show, onMount } from "solid-js";
import { BacktestingReport, ClosedPosition, PositionType, closePositionProfitWithoutCommission } from "../services/BacktestingEngine";
import { IChartApi, createChart } from "lightweight-charts";
import { BadgeDelta } from "./ui/badge-delta";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { selectedMarketData } from "./EditorStore";
import { fixedWithoutTrailingZeroes } from "~/services/Utils";

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

  const markers = () => props.markers || [];

  let chartDiv: HTMLDivElement;
  let chart: IChartApi;
  let candlestickSeries: any;
  let equitySeries: any = null;

  onMount(() => {
    chart = createChart(chartDiv, {
      height: 400,
      rightPriceScale: {
        visible: true
      },
      leftPriceScale: {
        visible: true
      },
      layout: {
        textColor: '#DDD',
        background: { color: '#222' }
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' }
      }
    });

    if (backtestingReport()?.equityTimeseries) {
      equitySeries = chart.addLineSeries({
        title: 'Equity',
        priceScaleId: 'left',
        color: '#2962FF',
        lineWidth: 2,
      });
      equitySeries.setData(backtestingReport().equityTimeseries);
    }

    candlestickSeries = chart.addCandlestickSeries({
      title: 'Price',
      priceScaleId: 'right'
    });
    candlestickSeries.setData(selectedMarketData().value);
    candlestickSeries.setMarkers(markers());
    chart.timeScale().fitContent();
  });

  return (
    <div>

      <div id="chart"
        class="mr-4 mb-4"
        ref={(el) => {
          chartDiv = el;
        }}>
        <i class="text-gray-500">
          Chart library created by <a
            class="font-bold text-sky-600 hover:underline"
            href="https://www.tradingview.com/">TradingView</a>
        </i>
      </div>


      <div class="flex">
        <article class="flex mr-2 flex-1 items-center justify-between rounded-lg border border-gray-100 bg-white p-6">
          <div>
            <p class="ml-1 text-sm text-gray-500">Initial balance</p>
            <p class="text-2xl font-medium text-gray-900">{fixedWithoutTrailingZeroes(backtestingReport()?.initialBalance)} {backtestingReport()?.quoteSymbol}</p>
          </div>
        </article>

        <article class="flex ml-2 flex-1 items-center justify-between rounded-lg border border-gray-100 bg-white p-6">
          <div class="justify-start">
            <p class="ml-1 text-sm text-gray-500">Equity</p>
            <p class="text-2xl font-medium text-gray-900">{fixedWithoutTrailingZeroes(backtestingReport()?.equity)} {backtestingReport()?.quoteSymbol}</p>
          </div>

          <Arrow backtestingReport={backtestingReport()} />
        </article>

      </div>

      { /* FIX: leave table header as non-scrollable */}
      <div class="overflow-y-auto h-svh rounded-lg border border-gray-200">
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>End date</TableHead>
              <TableHead>Start price</TableHead>
              <TableHead>End price</TableHead>
              <TableHead>Quantity [{backtestingReport()?.baseSymbol}]</TableHead>
              <TableHead>Profit [{backtestingReport()?.quoteSymbol}]</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <For each={backtestingReport()?.closedPositions}>{(position: ClosedPosition, index) =>
              <TableRow
                onmouseover={(_e: MouseEvent) => {
                  chart.setCrosshairPosition(position.startPrice, position.startDate, candlestickSeries);
                }} >
                <TableCell>{position.id}</TableCell>
                <TableCell>{PositionType[position.type]}</TableCell>
                <TableCell>{position.startDate}</TableCell>
                <TableCell>{position.endDate}</TableCell>
                <TableCell>{fixedWithoutTrailingZeroes(position.startPrice)}</TableCell>
                <TableCell>{fixedWithoutTrailingZeroes(position.endPrice)}</TableCell>
                <TableCell>{fixedWithoutTrailingZeroes(position.quantity)}</TableCell>
                <TableCell class={(closePositionProfitWithoutCommission(position) > 0 ? 'text-green-500' : 'text-red-500')}>{fixedWithoutTrailingZeroes(closePositionProfitWithoutCommission(position))}</TableCell>
              </TableRow>
            }
            </For>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
