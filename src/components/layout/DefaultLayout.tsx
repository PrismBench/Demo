import React from "react";
import {
  AppShell,
  Group,
  UnstyledButton,
  Center,
  ActionIcon,
  useMantineColorScheme,
  Box,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { IconSun, IconMoon } from "@tabler/icons-react";
import styles from "./DefaultLayout.module.css";

/**
 * DefaultLayout.tsx
 *
 * Provides the main application shell with a header, navigation, color scheme toggle, and content area.
 *
 * - Navigation links highlight the current route.
 * - Color scheme toggle switches between light and dark modes using Mantine.
 * - Extensible: Footer placeholder included for future use (see AppShell.Footer).
 *
 * Usage:
 *   <DefaultLayout> ... </DefaultLayout>
 *
 * Context:
 *   Used as the root layout for all main pages. Wraps page content and provides consistent navigation and theming.
 *
 * Extensibility:
 *   - To add more nav links, add more <UnstyledButton> components in the header.
 *   - To implement a footer, uncomment and customize the AppShell.Footer section.
 */

/**
 * Props for DefaultLayout component.
 * @property {React.ReactNode} children - The content to render inside the layout.
 */
interface DefaultLayoutProps {
  children: React.ReactNode;
}

/**
 * DefaultLayout React component
 *
 * Renders the main application shell with header, navigation, color scheme toggle, and content area.
 *
 * @param {DefaultLayoutProps} props - The props for the layout.
 * @returns {JSX.Element} The rendered layout shell.
 */
export function DefaultLayout({ children }: DefaultLayoutProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();

  /**
   * Determines if a navigation link is active based on the current route.
   * @param {string} path - The path to check.
   * @returns {boolean} True if the current route matches the path.
   */
  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }} // configure header height
    >
      {/* Header content: navigation and color scheme toggle */}
      <AppShell.Header
        p="md"
        className={[
          styles.header,
          colorScheme === "dark" ? styles.headerDark : styles.headerLight,
        ].join(" ")}
      >
        <Group justify="space-between">
          <Group gap="md">
            {/* Main nav links */}
            <UnstyledButton
              component={Link}
              to="/"
              className={isActive("/") ? styles.activeLink : undefined}
            >
              Home
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              to="/leaderboard"
              className={
                isActive("/leaderboard") ? styles.activeLink : undefined
              }
            >
              Leaderboard
            </UnstyledButton>
            <UnstyledButton
              component={Link}
              to="/showcase"
              className={isActive("/showcase") ? styles.activeLink : undefined}
            >
              Showcase
            </UnstyledButton>
          </Group>
          <Group>
            {/* Color scheme toggle */}
            <ActionIcon
              onClick={() => toggleColorScheme()}
              variant="default"
              aria-label="Toggle color scheme"
              className={styles.colorSchemeToggle}
            >
              {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Main Content Area */}
      <Box className={styles.mainContentWrapper}>
        <AppShell.Main className={styles.mainContent}>{children}</AppShell.Main>
      </Box>
      {/* Footer Placeholder */}
      {/* <AppShell.Footer p="md">
        Footer Content (Citation, Contact, GitHub)
      </AppShell.Footer> */}
    </AppShell>
  );
}
