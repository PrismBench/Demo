import { createTheme, MantineColorsTuple } from "@mantine/core";

// Define custom colors if needed, e.g., the prism blue
const prismBlue: MantineColorsTuple = [
  "#eef0ff", // 0
  "#dee1f9", // 1
  "#bbc1f2", // 2
  "#96a0ec", // 3
  "#7683e7", // 4
  "#5f6fe5", // 5 - Main color? Let's use the specified #4B5AE5
  "#4b5ae5", // 6 - Specified primary color
  "#3f4ccd", // 7
  "#3441b6", // 8
  "#2a37a0", // 9
];

export const theme = createTheme({
  /* Theme configuration */
  fontFamily:
    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  headings: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  },
  colors: {
    // Add custom colors to the theme
    prismBlue,
    // You can define other colors here, e.g., dark, gray
  },
  primaryColor: "prismBlue", // Set the primary color
  primaryShade: {
    light: 6,
    dark: 9,
  },

  // Default radius for components like Button, Card, etc.
  radius: {
    md: "8px", // Example: 'md' radius value
    lg: "12px", // Example: 'lg' radius value
  },
  defaultRadius: "md", // Set the default radius size

  // Set default color scheme

  // Component overrides (can be added later based on plan)
  components: {
    // Example: Button overrides
    // Button: {
    //   styles: (theme) => ({
    //     root: {
    //       // Custom styles for Button
    //       '&:hover': {
    //         // Hover glow effect
    //         boxShadow: `0 0 15px 5px ${theme.colors.prismBlue[4]}`,
    //       },
    //     },
    //   }),
    // },
    // Title: { ... },
    // Text: { ... },
    // Container: { ... },
    // Paper: { ... },
    // Card: { ... },
  },
});

// You might need to install fonts or link them in your index.html
// e.g., <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:wght@700&display=swap" rel="stylesheet">
