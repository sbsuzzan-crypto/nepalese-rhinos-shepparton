
import { useNextFixture } from "@/hooks/useFixtures";
import FixtureCard from "./fixtures/FixtureCard";
import FixtureLoadingSkeleton from "./fixtures/FixtureLoadingSkeleton";
import NoUpcomingMatches from "./fixtures/NoUpcomingMatches";

const NextMatch = () => {
  const { data: nextFixture, isLoading, error } = useNextFixture();

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-rhino-blue">Next Match</h2>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-red-600">Unable to load fixture information. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-rhino-blue">Next Match</h2>
          
          {isLoading ? (
            <FixtureLoadingSkeleton />
          ) : !nextFixture ? (
            <NoUpcomingMatches />
          ) : (
            <FixtureCard fixture={nextFixture} />
          )}
        </div>
      </div>
    </section>
  );
};

export default NextMatch;
