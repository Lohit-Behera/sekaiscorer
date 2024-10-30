import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCcw, SquarePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchCreateQuiz } from "@/features/QuizSlice";

export type Question = {
  questionText: string;
  correctAnswer: string;
  options: string[];
};

const quizSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  difficulty: z.enum(["easy", "medium", "hard"]),
  thumbnail: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Avatar is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Avatar size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
});

function CreateQuizPage() {
  const dispatch = useDispatch<AppDispatch>();

  const quizForm = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficulty: "easy",
      thumbnail: undefined,
    },
  });

  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [question, setQuestion] = useState<Question>({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const onSubmit = (data: z.infer<typeof quizSchema>) => {
    if (questions.length < 5) {
      toast.warning("Please add at least 5 questions.");
    } else if (questions.length > 20) {
      toast.warning("Please add at most 20 questions.");
    } else {
      const quizPromise = dispatch(
        fetchCreateQuiz({
          title: data.title,
          description: data.description,
          category: data.category,
          difficulty: data.difficulty,
          thumbnail: data.thumbnail,
          questions: questions,
        })
      ).unwrap();
      toast.promise(quizPromise, {
        loading: "Creating quiz...",
        success: (data: any) => {
          quizForm.reset();
          setQuestions([]);
          setQuestion({
            questionText: "",
            options: ["", "", "", ""],
            correctAnswer: "",
          });
          return data.message || "Quiz created successfully!";
        },
        error: (error: any) => {
          return (
            error || error.message || "Something went wrong while creating quiz"
          );
        },
      });
    }
  };

  const addQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.questionText === "") {
      toast.warning("Please enter a question.");
    } else if (question.options[0] === "" || question.options[1] === "") {
      toast.warning("Please enter at least 2 options.");
    } else if (!question.options.includes(question.correctAnswer)) {
      toast.warning("Please select a correct answer.");
    } else {
      const newOptions = question.options.filter((option) => option !== "");
      const newQuestion: Question = {
        questionText: question.questionText,
        correctAnswer: question.correctAnswer,
        options: newOptions,
      };
      setQuestions([...questions, newQuestion]);
      setQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    }
  };

  const removeQuestion = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  return (
    <Card className="w-full sm:w-[95%] md:w-[90%] lg:w-[85%]">
      <CardHeader>
        <CardTitle>Create Quiz</CardTitle>
        <CardDescription>
          You can Add up to 20 questions per quiz and minimum of 5.
        </CardDescription>
      </CardHeader>

      <Form {...quizForm}>
        <form onSubmit={quizForm.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={quizForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={quizForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      className="resize-none"
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={quizForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={quizForm.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={quizForm.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                      placeholder="Thumbnail"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Show Questions */}
            <div className="grid gap-4 ">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="gird gap-4 bg-muted p-2 md:p-4 rounded-lg"
                >
                  <div className="grid gap-2">
                    <div className="flex justify-between space-y-2">
                      <p className="text-xs sm:text-sm md:text-base my-auto">
                        {index + 1}. {question.questionText}
                      </p>
                      <Button
                        className="my-auto"
                        variant="destructive"
                        size="icon"
                        onClick={(e) => removeQuestion(e, index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, index) => (
                        <div key={index} className="grid gap-2">
                          {option !== "" && (
                            <p className="text-xs sm:text-sm md:text-base">
                              Option {index + 1}. {option}
                            </p>
                          )}
                        </div>
                      ))}
                      <p className="text-xs sm:text-sm md:text-base">
                        Correct Answer: {question.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {questions.length < 20 && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={question.questionText}
                    placeholder="Question"
                    onChange={(e) =>
                      setQuestion({ ...question, questionText: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="option1">Option 1</Label>
                    <Input
                      id="option1"
                      value={question.options[0]}
                      placeholder="Option 1"
                      onChange={(e) =>
                        setQuestion({
                          ...question,
                          options: [
                            e.target.value,
                            question.options[1],
                            question.options[2],
                            question.options[3],
                          ],
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="option2">Option 2</Label>
                    <Input
                      id="option2"
                      value={question.options[1]}
                      placeholder="Option 2"
                      onChange={(e) =>
                        setQuestion({
                          ...question,
                          options: [
                            question.options[0],
                            e.target.value,
                            question.options[2],
                            question.options[3],
                          ],
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="option3">Option 3</Label>
                    <Input
                      id="option3"
                      value={question.options[2]}
                      placeholder="Option 3"
                      onChange={(e) =>
                        setQuestion({
                          ...question,
                          options: [
                            question.options[0],
                            question.options[1],
                            e.target.value,
                            question.options[3],
                          ],
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="option4">Option 4</Label>
                    <Input
                      id="option4"
                      value={question.options[3]}
                      placeholder="Option 4"
                      onChange={(e) =>
                        setQuestion({
                          ...question,
                          options: [
                            question.options[0],
                            question.options[1],
                            question.options[2],
                            e.target.value,
                          ],
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose the correct answer for this question it must be one
                      of the options.
                    </p>
                    <Input
                      id="correctAnswer"
                      type="text"
                      value={question.correctAnswer}
                      placeholder="Correct Answer"
                      onChange={(e) =>
                        setQuestion({
                          ...question,
                          correctAnswer: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    disabled={questions.length >= 20}
                    onClick={(e) => addQuestion(e)}
                  >
                    <SquarePlus className="mr-2 h-4 w-4" /> Add
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuestion({
                        questionText: "",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                      });
                    }}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
              </div>
            )}
            <Button
              disabled={
                questions.length === 0 ||
                questions.length < 5 ||
                questions.length > 20
              }
              type="submit"
            >
              Submit
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}

export default CreateQuizPage;
