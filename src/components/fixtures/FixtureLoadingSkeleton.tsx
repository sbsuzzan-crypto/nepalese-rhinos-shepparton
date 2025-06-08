
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FixtureLoadingSkeleton = () => {
  return (
    <Card className="bg-white shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-rhino-blue to-rhino-navy text-white">
        <Skeleton className="h-8 w-32 mx-auto bg-white/20" />
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="text-center">
            <Skeleton className="h-20 w-20 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-12 w-16 mx-auto mb-4" />
            <Skeleton className="h-4 w-40 mx-auto mb-2" />
            <Skeleton className="h-6 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-20 w-20 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixtureLoadingSkeleton;
