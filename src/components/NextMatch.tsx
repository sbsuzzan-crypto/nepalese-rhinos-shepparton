
import { useNextFixture } from "@/hooks/useFixtures";
import FixtureCard from "./fixtures/FixtureCard";
import FixtureLoadingSkeleton from "./fixtures/FixtureLoadingSkeleton";
import NoUpcomingMatches from "./fixtures/NoUpcomingMatches";

const NextMatch = () => {
  const { data: fixture, isLoading, error } = useNextFixture();

  console.log('NextMatch - fixture:', fixture, 'isLoading:', isLoading, 'error:', error);

  if (isLoading) {
    return <FixtureLoadingSkeleton />;
  }

  if (error) {
    console.error('Error loading next fixture:', error);
    return <NoUpcomingMatches />;
  }

  if (!fixture) {
    console.log('No fixture found');
    return <NoUpcomingMatches />;
  }

  return <FixtureCard fixture={fixture} />;
};

export default NextMatch;
