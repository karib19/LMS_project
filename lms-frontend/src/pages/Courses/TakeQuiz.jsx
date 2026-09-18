import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../Api/api";

export default function TakeQuiz() {
  const { id } = useParams(); // quiz id
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { question_id: choice_id }
  const [result, setResult] = useState(null);

  useEffect(() => {
    API.get(`quizzes/`).then((res) => {
      const found = res.data.find((q) => q.id === Number(id));
      setQuiz(found);
    });
  }, [id]);

  const selectAnswer = (questionId, choiceId) => {
    setAnswers({ ...answers, [questionId]: choiceId });
  };

  const submitQuiz = async () => {
    const res = await API.post("quiz/submit/", { quiz: id, answers });
    setResult(res.data);
  };

  if (!quiz) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{quiz.title}</h1>

          {result ? (
            <div className="text-center py-8">
              <p className="text-4xl font-bold text-indigo-600 mb-2">
                {result.score} / {result.total_questions}
              </p>
              <p className="text-gray-600 mb-6">Your Score</p>
              <Link
                to={`/courses/${quiz.course}`}
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Back to Course
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {quiz.questions.map((q, i) => (
                <div key={q.id} className="border-b border-gray-100 pb-4">
                  <p className="font-semibold text-gray-800 mb-3">
                    {i + 1}. {q.text}
                  </p>
                  <div className="space-y-2">
                    {q.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={answers[q.id] === choice.id}
                          onChange={() => selectAnswer(q.id, choice.id)}
                        />
                        <span className="text-gray-700">{choice.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length !== quiz.questions.length}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}