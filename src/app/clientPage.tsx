"use client";
import { Skeleton } from "@nextui-org/skeleton";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Coolshape } from "coolshapes-react";

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { createClient } from "@/components/utils/supabase/client";
import { useList } from "@/components/utils/providers/listProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useLocalStorageState from "use-local-storage-state";
import { useState } from "react";
import { List } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ClientPage({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useLocalStorageState("newName", {
    defaultValue: "",
  });
  const [editName, setEditName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentListId, setCurrentListId] = useState<number | null>(null);

  const { data: lists, isPending } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const supabase = createClient();
      const res = await supabase
        .from("lists")
        .select("created_at, list_id, list_name, user_id")
        .eq("user_id", user.id)
        .limit(10);
      return res.data as List[];
    },
  });

  // Mutation to create a list
  const createList = useMutation({
    mutationKey: ["lists"],
    mutationFn: async () => {
      const supabase = createClient();
      if (
        !newName.trim() ||
        newName.length < 2 ||
        newName.length > 50 ||
        (lists?.length ?? 0) >= 10
      )
        return;
      const res = await supabase
        .from("lists")
        .insert({ user_id: user.id, list_name: newName })
        .select();
      return res.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["lists"] });
    },
  });

  // Mutation to edit a list name
  const editList = useMutation({
    mutationKey: ["lists"],
    mutationFn: async (listId: number) => {
      const supabase = createClient();
      await supabase
        .from("lists")
        .update({ list_name: editName })
        .eq("list_id", listId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      setEditName("");
      setCurrentListId(null);
    },
  });
  const deleteList = useMutation({
    mutationKey: ["lists"],
    mutationFn: async (listId: number) => {
      const supabase = createClient();
      await supabase.from("lists").delete().eq("list_id", listId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      setIsDeleteOpen(false);
      setCurrentListId(null);
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <Coolshape type="moon" />

      <div className={`flex flex-col items-center justify-center gap-3`}>
        {isPending ? (
          <div className="flex flex-col gap-4">
            <p>Select or create a list to continue.</p>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="relative">
                  <Skeleton className="bottom-0 left-0 right-0 top-0 h-12 w-64 rounded-md" />
                </div>
              ))}
          </div>
        ) : lists?.length === 0 ? (
          <span className="flex flex-col items-center justify-center gap-5">
            <span>We did not find any lists.</span>
          </span>
        ) : (
          <p>Select or create a list to continue.</p>
        )}

        <ScrollArea
          className={`${(lists?.length ?? 0) < 5 ? "h-full" : "h-52 pr-2.5"} l`}
        >
          {lists?.map((list) => (
            <motion.div
              layout
              key={list.list_id}
              className="relative mb-2 max-h-20 bg-card h-fit flex size-full w-64 justify-between gap-3 overflow-hidden rounded-xl border hover:bg-background px-3 py-2 transition-all hover:border-primary"
            >
              <Link
                href={`/list/${list.list_id}`}
                className="absolute bottom-0 left-0 right-0 top-0"
              >
                {" "}
              </Link>

              <span className="text-xl font-semibold">{list.list_name}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="z-[30] h-8 w-8 hover:bg-foreground/10 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-1" align="end">
                  <Button
                    variant="ghost"
                    className="w-full  flex gap-2 items-center px-2 py-1  justify-start hover:bg-foreground/20 hover:text-white"
                    onClick={() => {
                      setEditName(list.list_name);
                      setCurrentListId(list.list_id);
                      setIsOpen(true);
                    }}
                  >
                    <Pencil className="size-4 stroke-[1.5px]" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full flex gap-2 items-center px-2 py-1   justify-start text-destructive hover:bg-destructive/20 hover:text-destructive"
                    onClick={() => {
                      setCurrentListId(list.list_id);
                      setIsDeleteOpen(true);
                    }}
                  ><Trash2 className="size-4 stroke-[1.5px]"/>
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </motion.div>
          ))}
        </ScrollArea>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="font-semibold">
              Create a list
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {currentListId ? "Edit List" : "Creating a new list"}
              </DialogTitle>
              <DialogDescription>
                {currentListId
                  ? "Edit the name of your list."
                  : "Create a name for your new list."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={currentListId ? editName : newName}
                  onChange={(e) =>
                    currentListId
                      ? setEditName(e.target.value)
                      : setNewName(e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (currentListId) {
                    editList.mutate(currentListId);
                  } else {
                    createList.mutate();
                  }
                  setIsOpen(false);
                }}
              >
                {currentListId ? "Save Changes" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this list? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (currentListId) deleteList.mutate(currentListId);
                  setIsDeleteOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
