import { Box, Text, Group, Center, Stack, Button } from "@mantine/core";
import LogoShell from "@/components/logo/LogoShell";
import Rainbow from "@/components/logo/graphics/Rainbow";
import LandingHeroContent from "@/static/LandingHeroContent";

/**
 * @file Hero.tsx
 * @description This component renders the main hero section for the landing page.
 * It displays the application logo, a brief description, and call-to-action buttons.
 * It utilizes the LogoShell component for the animated logo display and fetches content
 * from LandingHeroContent.
 */

/**
 * Renders the hero section of the application.
 * Displays the PRISM logo with animation, a short description, and links
 * provided in LandingHeroContent.
 * @returns {JSX.Element} The rendered hero section.
 */
export function HeroSection() {
  return (
    <Box
      id="hero-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Center style={{ height: "100%" }}>
        <Stack align="center" gap="lg">
          <LogoShell text="PRISM" revealChars="SM" Graphic={Rainbow} />
          <Text size="xl" ta="center" style={{ maxWidth: "400px" }}>
            {LandingHeroContent.description}
          </Text>
          <Group mt="xl">
            {LandingHeroContent.buttons.map((button: any, index: number) => (
              <Button
                className="prism-button"
                key={index}
                size="lg"
                component="a"
                href={button.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {button.text}
              </Button>
            ))}
          </Group>
        </Stack>
      </Center>
    </Box>
  );
}

export default HeroSection;
