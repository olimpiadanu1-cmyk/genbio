import { useMutation } from "@tanstack/react-query";
import { api, type GenerateBioRequest, type CheckBioRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCheckBiography() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CheckBioRequest) => {
      const res = await fetch(api.biography.check.path, {
        method: api.biography.check.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to check biography");
      }

      return api.biography.check.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Error checking biography",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useGenerateBiography() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateBioRequest) => {
      const res = await fetch(api.biography.generate.path, {
        method: api.biography.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Invalid parameters");
        }
        throw new Error("Failed to generate biography");
      }

      return api.biography.generate.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
