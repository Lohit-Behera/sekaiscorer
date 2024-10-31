import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchGetAllQuizzes } from "@/features/QuizSlice";
import { useEffect } from "react";
import { format } from "date-fns";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  const getallQuizzes = useSelector((state: RootState) => {
    return state.quiz.getAllQuizzes;
  });
  const getallQuizzesStatus = useSelector((state: RootState) => {
    return state.quiz.getAllQuizzesStatus;
  });

  useEffect(() => {
    dispatch(fetchGetAllQuizzes());
  }, []);

  return (
    <>
      {getallQuizzesStatus === "loading" ? (
        <p>Loading...</p>
      ) : getallQuizzesStatus === "failed" ? (
        <p>Something went wrong</p>
      ) : getallQuizzesStatus === "succeeded" ? (
        <div className="gird grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getallQuizzes?.data.docs.map((quiz) => (
            <div
              key={quiz._id}
              className={`min-h-56 rounded-lg ${
                quiz.difficulty === "easy"
                  ? "bg-green-300/50 dark:bg-green-800/50"
                  : quiz.difficulty === "medium"
                  ? "bg-yellow-300/50 dark:bg-yellow-800/50"
                  : "bg-red-300/50 dark:bg-red-800/50"
              }`}
            >
              <div>
                <img
                  className="w-full h-44 object-cover rounded-t-lg"
                  src={quiz.thumbnail}
                  alt=""
                />
              </div>
              <div className="p-2 md:p-4">
                <h3 className="text-base md:text-lg font-bold">{quiz.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Created By: {quiz.createdBy} <br />
                  {format(quiz.createdAt, "PPP")}
                </p>
                <p className="text-sm md:text-base ">
                  Category: {quiz.category}
                </p>
                <div className="text-sm md:text-base flex">
                  <span
                    className={`w-3 h-3 inline-block mr-2 rounded-full my-auto ${
                      quiz.difficulty === "easy"
                        ? "bg-green-500"
                        : quiz.difficulty === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span>
                    {quiz.difficulty === "easy"
                      ? "Easy"
                      : quiz.difficulty === "medium"
                      ? "Medium"
                      : "Hard"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default HomePage;
