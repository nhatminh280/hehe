// charts/AreaChart.jsx
"use client";

import chartData from "../json/chart-data.json";
import {
  defaultTooltipConfig,
  defaultScaleConfig,
  initializeChart,
} from "../lib/chart-utils";
import { Chart, registerables } from "chart.js";
import { useEffect, useRef, useState } from "react";

Chart.register(...registerables);

export function AreaChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [timePeriod, setTimePeriod] = useState("12m");
  const { timePeriodsData } = chartData.areaChart;

  useEffect(() => {
    const currentData = timePeriodsData[timePeriod];

    const config = {
      type: "line",
      data: {
        labels: currentData.labels,
        datasets: [
          {
            label: "Upper area",
            data: currentData.upperData,
            borderColor: "#465fff",
            backgroundColor: "rgba(69, 92, 241, 0.1)",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBorderColor: "#1866dc",
            pointHoverRadius: 6,
            fill: true,
          },
          {
            label: "Lower area",
            data: currentData.lowerData,
            borderColor: "#9cb9ff",
            backgroundColor: "rgba(69, 92, 241, 0.1)",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBorderColor: "#1866dc",
            pointHoverRadius: 6,
            fill: true,
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
          tooltip: defaultTooltipConfig,
        },
        scales: {
          ...defaultScaleConfig,
          y: {
            ...defaultScaleConfig.y,
            ticks: {
              ...defaultScaleConfig.y.ticks,
              stepSize: 50,
            },
            min: 0,
            max: 250,
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
  }, [timePeriod, timePeriodsData]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-6">
        <span className="text-base font-medium text-foreground">
          Time Period:
        </span>
        <div className="flex p-1 rounded-lg bg-muted/50 border border-border shadow-sm">
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              timePeriod === "7d"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => setTimePeriod("7d")}
          >
            7 Days
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              timePeriod === "30d"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => setTimePeriod("30d")}
          >
            30 Days
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              timePeriod === "3m"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => setTimePeriod("3m")}
          >
            3 Months
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              timePeriod === "12m"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => setTimePeriod("12m")}
          >
            12 Months
          </button>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
