"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";
import { useMutation } from "@tanstack/react-query";
import { generateListAi } from "./fetch-actions";

export default function AIListCreator({
  onListCreated,
}: {
  onListCreated: (list: any) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [generatedList, setGeneratedList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const mutation = useMutation({
    mutationKey: ["ai-list"],
    mutationFn: async ({ prompt }: { prompt: string }) => {
      return generateListAi({ prompt });
    },
    onSuccess: (data) => {
      setGeneratedList(data);
    },
  });

  const handleSave = () => {
    onListCreated(generatedList);
    setIsOpen(false);
    toast({
      title: "Success",
      description: "List created successfully!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create List with AI</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create List with AI</DialogTitle>
          <DialogDescription>
            Enter a prompt to generate a list using AI. The generated list can
            be used to create quiz questions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Generate a list of 5 capital cities in Europe"
            />
          </div>
          <Button
            onClick={() => mutation.mutate({ prompt })}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Generate List
          </Button>
          {generatedList.length > 0 && (
            <div className="grid gap-2">
              <Label>Generated List</Label>
              <Textarea
                readOnly
                value={JSON.stringify(generatedList, null, 2)}
                className="h-[200px]"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant={`outline`}
            onClick={handleSave}
            disabled={generatedList.length === 0}
          >
            apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
