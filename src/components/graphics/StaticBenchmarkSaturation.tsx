import React from "react";
import { useMantineColorScheme } from "@mantine/core"; // Import the hook
import benchmarkSvgUrl from "./svgs/benchmark_performance.svg"; // Import as URL

const StaticBenchmarkSaturation: React.FC = () => {
  const { colorScheme } = useMantineColorScheme(); // Get current color scheme

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
        borderRadius: 16,
        overflow: "hidden", // Important to clip the img to rounded corners
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        background: colorScheme === "dark" ? "#000" : "#fff", // Conditional background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem", // Optional padding around the image
      }}
    >
      <img
        src={benchmarkSvgUrl}
        alt="Benchmark Performance"
        style={{
          display: "block",
          width: "100%",
          height: "100%", // Adjust if you want to maintain aspect ratio and not fill
          objectFit: "contain", // Ensures the whole SVG is visible, might add letterboxing
        }}
      />
    </div>
  );
};

export default StaticBenchmarkSaturation;
