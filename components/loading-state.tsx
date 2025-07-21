import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plane } from "lucide-react"

export function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Loading Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <Plane className="h-6 w-6 animate-pulse text-blue-600" />
            <span className="text-lg font-medium">Searching for flights...</span>
          </div>
        </CardContent>
      </Card>

      {/* Loading Cards */}
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 space-y-4">
                {/* Airline skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Route skeleton */}
                <div className="flex items-center gap-4">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>

                  <div className="flex-1 flex flex-col items-center space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-px w-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>

                  <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                {/* Additional info skeleton */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Price skeleton */}
              <div className="flex flex-col items-end gap-3">
                <div className="text-right space-y-1">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
