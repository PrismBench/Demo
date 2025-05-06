import React from "react";
import { Container, Tabs, Box, Text, Center } from "@mantine/core";
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";

export function Demos() {
  return (
    <Box id="demos" style={{ padding: "var(--mantine-spacing-xl) 0" }}>
      <Container size="lg">
        <SectionTitle
          title="Explore the Demos"
          subtitle="See Prism in action with interactive examples"
        />

        <Tabs defaultValue="tree-visualization" variant="outline" radius="md">
          <Tabs.List grow>
            {" "}
            {/* Make tabs fill the width */}
            <Tabs.Tab value="tree-visualization">Tree Visualization</Tabs.Tab>
            <Tabs.Tab value="diagnostic-report">Diagnostic Report</Tabs.Tab>
            <Tabs.Tab value="node-viewer">Interactive Node Viewer</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="tree-visualization" pt="xl">
            {" "}
            {/* Add padding top to panel */}
            {/* Placeholder for Tree Visualization Demo */}
            {/* This could be an iframe or the actual TreeVisualization component */}
            <Center
              style={{
                height: "400px",
                border: "1px dashed grey",
                color: "grey",
              }}
            >
              Tree Visualization Demo Placeholder
            </Center>
          </Tabs.Panel>

          <Tabs.Panel value="diagnostic-report" pt="xl">
            {/* Placeholder for Diagnostic Report Demo */}
            <Center
              style={{
                height: "400px",
                border: "1px dashed grey",
                color: "grey",
              }}
            >
              Diagnostic Report Demo Placeholder
            </Center>
          </Tabs.Panel>

          <Tabs.Panel value="node-viewer" pt="xl">
            {/* Placeholder for Interactive Node Viewer Demo */}
            <Center
              style={{
                height: "400px",
                border: "1px dashed grey",
                color: "grey",
              }}
            >
              Interactive Node Viewer Demo Placeholder
            </Center>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
}

export default Demos;
