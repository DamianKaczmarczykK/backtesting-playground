import { createChart } from "lightweight-charts";
import { onMount } from "solid-js";
import { TOHLCV } from "./BacktestingEngine";

export default function Chart(props: any) {

  const marketData = () => props.marketData;
  const markers = () => props.markers || [];

  const data = () => marketData().map((e: TOHLCV) => {
    return {
      time: e.timestamp,
      open: e.open,
      high: e.high,
      low: e.low,
      close: e.close
    }
  });

  let chartDiv: HTMLDivElement;

  onMount(() => {
    // TODO: adjust width and height
    const chart = createChart(chartDiv, {
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


    const lineSeries = chart.addCandlestickSeries();
    lineSeries.setData(data());
    lineSeries.setMarkers(markers());
  });

  return (
    <div id="chart"
      class="mr-4 mb-4"
      ref={(el) => {
        chartDiv = el;
      }}> </div>
  );
}

