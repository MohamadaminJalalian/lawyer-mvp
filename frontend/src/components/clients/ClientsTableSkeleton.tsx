import Skeleton from "@/components/ui/Skeleton";

export default function ClientsTableSkeleton() {
    return (
        <div className="hidden sm:block bg-white border border-[#E4E1D8] rounded-xl overflow-hidden">
            <div className="border-b border-[#EDEBE2] bg-[#F1EFE6] p-4">
                <Skeleton className="h-4 w-40" />
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-6 border-t border-[#EDEBE2] p-4 first:border-0">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
    );
}