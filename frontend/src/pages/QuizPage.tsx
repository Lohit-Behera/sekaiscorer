import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate, useParams } from "react-router-dom";
import { fetchGetQuiz } from "@/features/QuizSlice";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

function QuizPage() {
  const { quizId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const getQuiz = useSelector((state: RootState) => state.quiz.getQuiz);
  const getQuizStatus = useSelector(
    (state: RootState) => state.quiz.getQuizStatus
  );

  useEffect(() => {
    dispatch(fetchGetQuiz(quizId as string));
  }, [quizId]);

  return (
    <>
      {getQuizStatus === "loading" ? (
        <p>Loading...</p>
      ) : getQuizStatus === "failed" ? (
        <p>Something went wrong</p>
      ) : getQuizStatus === "succeeded" ? (
        <Card className="w-full md:w-[90%] lg:w-[85%]">
          <CardHeader>
            <CardTitle>{getQuiz?.data.title}</CardTitle>
            <CardDescription>
              Created At: {format(getQuiz?.data.createdAt as string, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <img
              className="mx-auto rounded-lg"
              src={getQuiz?.data.thumbnail}
              alt={getQuiz?.data.title}
            />
            <div className="grid gap-2">
              <Label>Description</Label>
              <p className="text-xs sm:text-sm md:text-base">
                {getQuiz?.data.description}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <p className="text-xs sm:text-sm md:text-base">
                {getQuiz?.data.category}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Difficulty</Label>
              <p className="text-xs sm:text-sm md:text-base">
                {getQuiz?.data.difficulty}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Created By</Label>
              <p className="text-xs sm:text-sm md:text-base">
                {getQuiz?.data.createdBy}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button size="sm">
              <Play className="mr-1 h-4 w-4" />
              Start
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
}

export default QuizPage;
