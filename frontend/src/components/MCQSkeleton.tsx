import { Skeleton } from "./ui/skeleton";

export function MCQSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {/* Generate 3 skeleton questions */}
      {Array.from({ length: 3 }).map((_, questionIndex) => (
        <div key={questionIndex} className="flex flex-col gap-2 justify-start">
          {/* Question skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-4 w-6" /> {/* Question number */}
            <Skeleton className="h-4 flex-1" /> {/* Question text */}
          </div>

          {/* Options skeleton */}
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, optionIndex) => (
              <div key={optionIndex} className="flex items-start gap-2 text-sm">
                <Skeleton className="h-4 w-4 mt-0.5 rounded-sm" />{" "}
                {/* Checkbox */}
                <Skeleton className="h-4 flex-1" /> {/* Option text */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
