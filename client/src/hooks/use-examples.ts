import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useRandomExample() {
  return useQuery({
    queryKey: [api.examples.random.path],
    queryFn: async () => {
      const res = await fetch(api.examples.random.path);
      if (!res.ok) throw new Error("Failed to fetch example");
      return api.examples.random.responses[200].parse(await res.json());
    },
    enabled: false, // Don't fetch automatically, wait for user action
  });
}

export function useExamples() {
  return useQuery({
    queryKey: [api.examples.list.path],
    queryFn: async () => {
      const res = await fetch(api.examples.list.path);
      if (!res.ok) throw new Error("Failed to fetch examples");
      return api.examples.list.responses[200].parse(await res.json());
    },
  });
}
