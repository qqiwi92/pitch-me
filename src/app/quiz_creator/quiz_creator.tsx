"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PlusCircle,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";
import { useToast } from "@/components/ui/toast/use-toast";
import { createClient } from "@/components/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getQuizes, createQuiz, deleteQuiz } from "./fetch-actions";
import AIListCreator from "./ai_list_creator";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function QuizCreator() {
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    question: "",
    options: ["", "", ""],
    correctAnswer: "",
    explanation: "",
  });
  const quizes = useQuery({ queryKey: ["quizes"], queryFn: getQuizes });
  const queryClient = useQueryClient();
  const createQuizMutation = useMutation({
    mutationKey: ["quizes"],
    mutationFn: createQuiz,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quizes"] });
    },
  });
  const deleteQuizMutation = useMutation({
    mutationKey: ["quizes"],
    mutationFn: deleteQuiz,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quizes"] });
    },
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion({ ...currentQuestion, question: e.target.value });
  };

  const handleOptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = e.target.value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectAnswerChange = (option: string) => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: option });
    setIsPopoverOpen(false);
    popoverTriggerRef.current?.click();
  };

  const handleExplanationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCurrentQuestion({ ...currentQuestion, explanation: e.target.value });
  };
  const { toast } = useToast();
  const validateQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast({ variant: "destructive", title: "Please enter a question." });
      return false;
    }

    if (currentQuestion.options.some((option) => !option.trim())) {
      toast({
        variant: "destructive",
        title: "All answer options must be filled.",
      });
      return false;
    }

    if (
      new Set(currentQuestion.options).size !== currentQuestion.options.length
    ) {
      toast({
        variant: "destructive",
        title: "All answer options must be unique.",
      });
      return false;
    }

    if (!currentQuestion.correctAnswer) {
      toast({
        variant: "destructive",
        title: "Please select a correct answer.",
      });
      return false;
    }

    if (
      quiz.some(
        (q, index) =>
          q.question === currentQuestion.question && index !== editingIndex,
      )
    ) {
      alert("This question already exists in the quiz.");
      return false;
    }

    return true;
  };

  const addQuestion = () => {
    if (validateQuestion()) {
      if (editingIndex !== null) {
        const newQuiz = [...quiz];
        newQuiz[editingIndex] = {
          ...currentQuestion,
          id: quiz[editingIndex].id,
        };
        setQuiz(newQuiz);
        setEditingIndex(null);
      } else {
        setQuiz([...quiz, { ...currentQuestion, id: Date.now().toString() }]);
      }
      setCurrentQuestion({
        id: "",
        question: "",
        options: ["", "", ""],
        correctAnswer: "",
        explanation: "",
      });
    }
  };

  const removeQuestion = (index: number) => {
    const newQuiz = [...quiz];
    newQuiz.splice(index, 1);
    setQuiz(newQuiz);
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion(quiz[index]);
    setEditingIndex(index);
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < quiz.length - 1)
    ) {
      const newQuiz = [...quiz];
      const temp = newQuiz[index];
      newQuiz[index] = newQuiz[index + (direction === "up" ? -1 : 1)];
      newQuiz[index + (direction === "up" ? -1 : 1)] = temp;
      setQuiz(newQuiz);
    }
  };

  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="mb-4 flex items-center justify-between text-2xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Quiz Creator
        <Dialog>
          <DialogTrigger className="ml-6" asChild>
            <Button variant="outline">see lists</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>all lists</DialogTitle>
              <DialogDescription>view all lists</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {quizes.data?.map((i: { id: string; created_at: string }) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between space-x-4"
                >
                  {new Date(i.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <Button
                    variant={"destructive"}
                    className="h-7 py-0"
                    onClick={() => {
                      deleteQuizMutation.mutate({ id: i.id });
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
        <AIListCreator onListCreated={(list) => setQuiz(list)} />
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? "Edit Question" : "Add New Question"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  className="bg-background"
                  placeholder="Enter your question"
                />
              </div>
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                  <Input
                    className="bg-background"
                    id={`option-${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e)}
                    placeholder={`Enter option ${index + 1}`}
                  />
                </motion.div>
              ))}
              <div>
                <Label>Correct Answer</Label>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      ref={popoverTriggerRef}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      {truncateString(
                        currentQuestion.correctAnswer ||
                          "Select correct answer",
                        15,
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleCorrectAnswerChange(option)}
                      >
                        {option === currentQuestion.correctAnswer && (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        {truncateString(option, 15)}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  value={currentQuestion.explanation}
                  onChange={handleExplanationChange}
                  placeholder="Explain why this is the correct answer"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" />{" "}
              {editingIndex !== null ? "Update Question" : "Add Question"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.h2
        className="mb-4 text-xl font-semibold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Current Quiz
      </motion.h2>
      <AnimatePresence mode="popLayout">
        {quiz.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Question {index + 1}</span>
                  <div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveQuestion(index, "up")}
                      className="mr-2"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveQuestion(index, "down")}
                      className="mr-2"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => editQuestion(index)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{q.question}</p>
                <ul className="mt-2 list-inside list-disc">
                  {q.options.map((option, optionIndex) => (
                    <li
                      key={optionIndex}
                      className={
                        option === q.correctAnswer
                          ? "font-semibold text-green-600"
                          : ""
                      }
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                {q.explanation && (
                  <p className="mt-2 text-sm">{q.explanation}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {quiz.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={() => {
              createQuizMutation.mutate({ quiz: JSON.stringify(quiz) });
              setQuiz([]);
              toast({
                variant: "success",
                title: "Quiz uploaded successfully",
              });
            }}
          >
            upload
          </Button>
        </motion.div>
      )}
    </div>
  );
}
