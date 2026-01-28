import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type GenerateBioRequest, type CheckBioRequest } from "@shared/schema";
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
        let errorMessage = "Не удалось проверить биографию";
        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(errorMessage);
      }

      return api.biography.check.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Ошибка проверки",
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
        let errorMessage = "Не удалось создать биографию";
        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(errorMessage);
      }

      return api.biography.generate.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Ошибка генерации",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
