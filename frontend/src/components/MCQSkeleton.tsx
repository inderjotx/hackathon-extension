import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

export function MCQSkeleton() {
  return (
    <div className="flex flex-col gap-2  relative">
      <div className="flex items-center gap-2 justify-center">
        <Spinner className="" />
        Generating Questions...
      </div>
      <div className="flex flex-col gap-6  ">
        {/* Generate 3 skeleton questions */}

        {Array.from({ length: 5 }).map((_, questionIndex) => (
          <div
            key={questionIndex}
            className="flex flex-col gap-2 justify-start"
          >
            {/* Question skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-4 flex-1 bg-gray-300 rounded-sm" />{" "}
              {/* Question text */}
            </div>

            {/* Options skeleton */}
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-start gap-2 text-sm"
                >
                  <Skeleton className="h-4 w-4 mt-0.5 rounded-sm bg-gray-300" />{" "}
                  {/* Checkbox */}
                  <Skeleton className="h-4 w-3/5 bg-gray-300 rounded-sm" />{" "}
                  {/* Option text */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
