import { Container, Box, Grid } from "@mantine/core";
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";
import ExploreCard from "../../../components/common/ExploreCard/ExploreCard";
import { ExploreCardContent } from "@/static/ExploreCardContent";

export function ExploreMore() {
  return (
    <Box id="explore-more" style={{ padding: "var(--mantine-spacing-xl) 0" }}>
      <Container size="lg">
        <SectionTitle
          title={ExploreCardContent.title}
          subtitle={ExploreCardContent.description}
        />

        <Grid gutter="xl">
          {ExploreCardContent.cards.map((card) => (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <ExploreCard
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                linkTo={card.linkTo}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ExploreMore;
