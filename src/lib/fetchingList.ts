import { createClient } from "@/components/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { List, Slide } from "./types";
import { useToast } from "@/components/ui/toast/use-toast";
export const useList = () => {
  const queryKey = ["list"];
  const [currentInfo, setCurrentInfo] = useState<List>({created_at: "", list_id: 0, list_name: "", user_id: "", list: []});
  const params = useParams();
  const supabase = createClient();
  const [openedSlide, setOpenedSlide] = useState(-2);
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: user, error } = await supabase.auth.getUser();
      const res = await supabase
        .from("lists")
        .select("*")
        .eq("user_id", user.user?.id ?? "")
        .eq("list_id", params.list ?? "")
        .limit(1);
      if (res.data && res.data.length > 0) {
        setCurrentInfo(res.data[0] as any);
        return res.data[0].list as Slide[];
      } else {
        return [] as Slide[];
      }
    },
    enabled: !!params.list,
  });
  const { toast } = useToast();
  const { mutate: updateSlides } = useMutation({
    mutationKey: ["list"],
    mutationFn: async ({ newSlide }: { newSlide: Slide[] }) => {
      const { data, error } = await supabase
        .from("lists")
        .update({ list: newSlide })
        .eq("list_id", params.list ?? "")
        .select();
      return data;
    },
    onMutate: async ({ newSlide }: { newSlide: Slide[] }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousItems = queryClient.getQueryData<Slide[]>(queryKey);

      queryClient.setQueryData(queryKey, newSlide);

      return { previousItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }
      toast({
        title: "Error updating slides",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const setItems = (newSlide: Slide[]) => updateSlides({ newSlide });

  return {
    items,
    isLoading,
    setItems,
    setOpenedSlide,
    openedSlide,
    currentInfo,
  };
};
