import { IChartApi, createChart } from "lightweight-charts";
import { createEffect, onMount } from "solid-js";

export default function Chart(props: any) {

  let chartDiv: HTMLDivElement;
  let chart: IChartApi;
  let lineSeries: any;

  onMount(() => {
    // TODO: adjust width and height
    chart = createChart(chartDiv, {
      height: 200,
      layout: {
        textColor: '#DDD',
        background: { color: '#222' }
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' }
      }
    });

    lineSeries = chart.addCandlestickSeries();
  });

  // NOTE: update main series on every data change
  createEffect(() => {
    lineSeries.setData(props.marketData);
    lineSeries.setMarkers(props.markers || []);
    chart.timeScale().fitContent();
  });


  return (
    <div id="chart"
      class="mr-4 mb-4"
      ref={(el) => {
        chartDiv = el;
      }}> </div>
  );
}

