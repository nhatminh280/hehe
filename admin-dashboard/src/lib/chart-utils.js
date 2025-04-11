// charts/chart-utils.js
import { Chart } from "chart.js";

export const defaultTooltipConfig = {
  backgroundColor: "#ffffff",
  titleColor: "#101828",
  bodyColor: "#667085",
  borderColor: "#e4e7ec",
  borderWidth: 1,
  padding: 12,
  cornerRadius: 8,
  displayColors: false,
};

export const defaultScaleConfig = {
  x: {
    grid: {
      display: false,
    },
    ticks: {
      color: "#667085",
      font: {
        size: 12,
      },
    },
  },
  y: {
    border: {
      display: false,
    },
    grid: {
      color: "#f2f4f7",
    },
    ticks: {
      color: "#667085",
      font: {
        size: 12,
      },
    },
  },
};

export const initializeChart = (chartRef, chartInstance, config) => {
  if (!chartRef.current) return null;

  const ctx = chartRef.current.getContext("2d");
  if (!ctx) return null;

  // Destroy existing chart
  if (chartInstance.current) {
    chartInstance.current.destroy();
  }

  // Create new chart
  chartInstance.current = new Chart(ctx, config);

  return chartInstance.current;
};
