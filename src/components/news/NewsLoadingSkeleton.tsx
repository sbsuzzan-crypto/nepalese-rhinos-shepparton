
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsLoadingSkeletonProps {
  count?: number;
  variant?: 'default' | 'featured' | 'compact';
}

const NewsLoadingSkeleton = ({ count = 3, variant = 'default' }: NewsLoadingSkeletonProps) => {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <div className={`grid gap-6 ${
      isFeatured ? 'grid-cols-1' : 
      isCompact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <Skeleton className={`w-full ${
            isFeatured ? 'h-48 sm:h-64' : 
            isCompact ? 'h-32 sm:h-40' : 
            'h-40 sm:h-48'
          }`} />
          
          <CardContent className={`p-4 sm:p-6 ${isCompact ? 'p-3 sm:p-4' : ''} space-y-3`}>
            {/* Category Badge */}
            <Skeleton className="h-5 w-20 rounded-full" />
            
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className={`h-5 w-full ${isFeatured ? 'h-6' : ''}`} />
              <Skeleton className={`h-5 w-4/5 ${isFeatured ? 'h-6' : ''}`} />
            </div>
            
            {/* Excerpt */}
            {!isCompact && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}
            
            {/* Meta Info */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-16" />
                {!isCompact && <Skeleton className="h-3 w-12" />}
              </div>
              <Skeleton className="h-3 w-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NewsLoadingSkeleton;
