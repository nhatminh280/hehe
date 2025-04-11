// charts/BarChart.jsx
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

export function BarChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const { labels, revenue } = chartData.barChart;

    const config = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: revenue,
            backgroundColor: "#465fff",
            borderRadius: 4,
            barThickness: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: defaultTooltipConfig,
        },
        scales: {
          ...defaultScaleConfig,
          y: {
            ...defaultScaleConfig.y,
            ticks: {
              ...defaultScaleConfig.y.ticks,
              callback: function (value) {
                return value + "0";
              },
              stepSize: 20,
            },
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
