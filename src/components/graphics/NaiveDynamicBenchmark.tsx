import React from "react";
import { useMantineColorScheme } from "@mantine/core";
import closedLoopSvgUrl from "./svgs/closed_loop.svg";

const NaiveDynamicBenchmark: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <div
      style={{
        aspectRatio: 3 / 2,
        width: "100%",
        maxWidth: 600,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        background: colorScheme === "dark" ? "#222" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      <img
        src={closedLoopSvgUrl}
        alt="Closed Loop Diagram"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default NaiveDynamicBenchmark;
