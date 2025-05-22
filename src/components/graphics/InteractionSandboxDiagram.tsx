import React from "react";
import { useMantineColorScheme } from "@mantine/core";
import interactionSandboxSvgUrl from "./svgs/Interaction Sandbox.svg"; // Import as URL

const InteractionSandboxDiagram: React.FC = () => {
  const { colorScheme } = useMantineColorScheme(); // Get current color scheme

  return (
    <div
      style={{
        aspectRatio: 3 / 1,
        width: "100%",
        maxWidth: 1200,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
        borderRadius: 16,
        overflow: "hidden", // Important to clip the img to rounded corners
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        background: colorScheme === "dark" ? "#000" : "#fff", // Conditional background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      <img
        src={interactionSandboxSvgUrl}
        alt="Interaction Sandbox Diagram"
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

export default InteractionSandboxDiagram;
