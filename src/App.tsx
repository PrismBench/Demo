import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./theme/global.css";
import { theme } from "./theme";

import HomePage from "./pages/Home/Home";
import LeaderboardPage from "./pages/Leaderboard/Leaderboard";
import ShowcasePage from "./pages/Showcase/Showcase";

function App() {
  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <BrowserRouter basename="/PrismBenchDemo">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
