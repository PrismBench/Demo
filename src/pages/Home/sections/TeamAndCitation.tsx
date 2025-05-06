import React from "react";
import {
  Container,
  SimpleGrid,
  Box,
  Text,
  Title,
  Avatar,
  Stack,
  Group,
  Textarea,
  Button,
  Anchor,
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconCheck } from "@tabler/icons-react"; // Icons for copy button
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";
import { getCitationText } from "../../../utils/citationUtils";

// Placeholder data for team members
const teamMembers = [
  { name: "Team Member 1", affiliation: "Affiliation 1", image: "" }, // Add image URLs later
  { name: "Team Member 2", affiliation: "Affiliation 2", image: "" },
  { name: "Team Member 3", affiliation: "Affiliation 3", image: "" },
  { name: "Team Member 4", affiliation: "Affiliation 4", image: "" },
];

export function TeamAndCitation() {
  const citationText = getCitationText();
  const clipboard = useClipboard({ timeout: 1000 }); // Clipboard hook

  return (
    <Box id="team-citation" style={{ padding: "var(--mantine-spacing-xl) 0" }}>
      <Container size="lg">
        {/* Team Section */}
        <SectionTitle title="Meet the Team" />
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="lg" mb="xl">
          {teamMembers.map((member) => (
            <Stack key={member.name} align="center">
              <Avatar
                src={member.image || undefined}
                alt={member.name}
                size="xl"
                radius="xl"
              />
              <Text fw={500} ta="center">
                {member.name}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                {member.affiliation}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>

        {/* Citation Section */}
        <SectionTitle title="Citation" />
        <Stack align="center" gap="md">
          <Textarea
            readOnly
            value={citationText}
            minRows={6}
            autosize
            style={{
              width: "100%",
              maxWidth: "700px",
              fontFamily: "monospace",
            }}
          />
          <Group>
            <Tooltip
              label={clipboard.copied ? "Copied!" : "Copy to clipboard"}
              withArrow
            >
              <Button
                leftSection={
                  clipboard.copied ? (
                    <IconCheck size={16} />
                  ) : (
                    <IconCopy size={16} />
                  )
                }
                onClick={() => clipboard.copy(citationText)}
                variant="light"
              >
                Copy BibTeX
              </Button>
            </Tooltip>
            <Button
              component="a"
              href="#" // Replace with actual link to PDF paper
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Read the Paper (PDF)
            </Button>
          </Group>
        </Stack>

        {/* Optional Acknowledgments */}
        {/* <Box mt="xl">
          <Text size="sm" c="dimmed" ta="center">
            Acknowledgments text goes here...
          </Text>
        </Box> */}
      </Container>
    </Box>
  );
}

export default TeamAndCitation;
