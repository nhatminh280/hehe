// charts/LineChart.jsx
"use client";

import chartData from "../json/chart-data.json";
import {
  defaultTooltipConfig,
  defaultScaleConfig,
  initializeChart,
} from "../lib/chart-utils";
import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

export function LineChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const { labels, users } = chartData.lineChart;

    const config = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Users",
            data: users,
            borderColor: "#465fff",
            backgroundColor: "#465fff",
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBorderColor: "#fff",
            pointBackgroundColor: "#465fff",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "nearest",
          intersect: false,
          axis: "x",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            ...defaultTooltipConfig,
            callbacks: {
              title: function (tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function (context) {
                return `Users: ${context.parsed.y}`;
              },
            },
          },
        },
        scales: {
          ...defaultScaleConfig,
          y: {
            ...defaultScaleConfig.y,
            ticks: {
              ...defaultScaleConfig.y.ticks,
              stepSize: 250,
              callback: function (value) {
                return value;
              },
            },
            min: 0,
            max: 1000,
          },
        },
      },
    };

    const chart = initializeChart(chartRef, chartInstance, config);

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  );
}
