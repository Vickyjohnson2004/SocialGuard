"use client";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export default function Investigations() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["investigations"],
    queryFn: async () => (await api.get("/investigations")).data.data,
  });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/investigations/${id}`, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["investigations"] }),
  });
  return (
    <main className="page-shell">
      <h1 className="text-3xl font-bold">Investigations</h1>
      <p className="mt-1 text-slate-400">
        Review flagged accounts and record the investigation status.
      </p>
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : data?.length ? (
          data.map((x: any) => (
            <div
              key={x._id}
              className="rounded-xl border border-slate-800 bg-[#111827] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <b>{x.status.replace("_", " ")}</b>
                <span className="text-slate-400">
                  {new Date(x.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-slate-400">
                Account: {x.accountId?.platform} / @{x.accountId?.username}
              </p>
              <p className="mt-2">
                {x.decision || "No decision recorded yet."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["UNDER_REVIEW", "CONFIRMED", "REJECTED", "RESOLVED"].map(
                  (status) => (
                    <button
                      key={status}
                      disabled={update.isPending}
                      onClick={() => update.mutate({ id: x._id, status })}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-[#F4A91C]"
                    >
                      {status.replace("_", " ")}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400">No investigations have been created.</p>
        )}
      </div>
    </main>
  );
}
