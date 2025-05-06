import { Title, Text, Stack } from "@mantine/core";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export function SectionTitle({
  title,
  subtitle,
  align = "center",
}: SectionTitleProps) {
  return (
    <Stack align={align} gap="xs">
      <Title order={2} ta={align}>
        {title}
      </Title>
      {subtitle && (
        <Text size="lg" c="dimmed" ta={align}>
          {subtitle}
        </Text>
      )}
    </Stack>
  );
}

export default SectionTitle;
