import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../Api/api";

export default function CourseDetail() {
  const { id } = useParams();
  const role = localStorage.getItem("role"); // "instructor" | "student" | "admin"

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [progress, setProgress] = useState({ total_lessons: 0, completed: 0, percentage: 0 });
  const [reviews, setReviews] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [lessonForm, setLessonForm] = useState({ title: "", content: "", video_url: "", order: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [quizForm, setQuizForm] = useState({ title: "" });
  const [questionForm, setQuestionForm] = useState({
    quiz: "",
    text: "",
    choices: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
  });

  const loadAll = () => {
    API.get(`courses/${id}/`).then((res) => setCourse(res.data));
    API.get(`lessons/?course=${id}`).then((res) => setLessons(res.data));
    API.get(`reviews/?course=${id}`).then((res) => setReviews(res.data));
    API.get(`quizzes/?course=${id}`).then((res) => setQuizzes(res.data));

    if (role === "student") {
      API.get(`courses/${id}/progress/`).then((res) => setProgress(res.data));
      API.get(`progress/?course=${id}`).then((res) => {
        const ids = res.data.filter((p) => p.completed).map((p) => p.lesson);
        setCompletedIds(ids);
      });
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const markComplete = async (lessonId) => {
    await API.post("lessons/complete/", { lesson: lessonId });
    loadAll(); // progress bar আর checkmark রিফ্রেশ করার জন্য
  };

  const addLesson = async () => {
    await API.post("lessons/", { ...lessonForm, course: id });
    setLessonForm({ title: "", content: "", video_url: "", order: 0 });
    loadAll();
  };

  const submitReview = async () => {
    await API.post("reviews/", { ...reviewForm, course: id });
    setReviewForm({ rating: 5, comment: "" });
    loadAll();
  };

  const addQuiz = async () => {
    await API.post("quizzes/", { ...quizForm, course: id });
    setQuizForm({ title: "" });
    loadAll();
  };

  const updateChoiceText = (index, value) => {
    const updated = [...questionForm.choices];
    updated[index].text = value;
    setQuestionForm({ ...questionForm, choices: updated });
  };

  const updateChoiceCorrect = (index) => {
    const updated = questionForm.choices.map((c, i) => ({
      ...c,
      is_correct: i === index, // একটাই সঠিক উত্তর হতে পারবে
    }));
    setQuestionForm({ ...questionForm, choices: updated });
  };

  const addQuestion = async () => {
    await API.post("questions/add/", questionForm);
    setQuestionForm({
      quiz: questionForm.quiz,
      text: "",
      choices: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    });
    loadAll();
    alert("Question added!");
  };

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* কোর্স হেডার */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>

        {/* Progress bar - শুধু স্টুডেন্টের জন্য */}
        {role === "student" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">Your Progress</span>
              <span className="font-bold text-indigo-600">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {progress.completed} / {progress.total_lessons} lessons completed
            </p>
          </div>
        )}

        {/* Lesson list */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Lessons</h2>

          {lessons.length > 0 ? (
            <div className="space-y-4">
              {lessons.map((lesson) => {
                const isDone = completedIds.includes(lesson.id);
                return (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">{lesson.title}</h3>

                      {role === "student" && (
                        <button
                          onClick={() => markComplete(lesson.id)}
                          disabled={isDone}
                          className={`text-sm font-bold py-1 px-3 rounded-lg transition ${
                            isDone
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                          }`}
                        >
                          {isDone ? "✓ Completed" : "Mark as Complete"}
                        </button>
                      )}
                    </div>

                    {lesson.content && <p className="text-gray-600 text-sm mt-2">{lesson.content}</p>}

                    {lesson.video_url && (
                      <div className="mt-3 aspect-video">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={lesson.video_url}
                          title={lesson.title}
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No lessons added yet.</p>
          )}

          {/* Instructor-এর জন্য নতুন লেসন যোগ করার ফর্ম */}
          {role === "instructor" && course.instructor === Number(localStorage.getItem("user_id")) && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-bold text-gray-800 mb-3">Add New Lesson</h3>
              <div className="space-y-3">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Lesson title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                />
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Lesson content / notes"
                  rows="3"
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                />
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Video URL (YouTube embed link)"
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                />
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Order (1, 2, 3...)"
                  value={lessonForm.order}
                  onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })}
                />
                <button
                  onClick={addLesson}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Add Lesson
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quizzes */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quizzes</h2>

          {quizzes.length > 0 ? (
            <div className="space-y-3 mb-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex justify-between items-center border border-gray-200 rounded-lg p-4"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">{quiz.questions.length} question(s)</p>
                  </div>

                  {role === "student" && (
                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      Take Quiz
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No quizzes added yet.</p>
          )}

          {/* Instructor: নতুন কুইজ বানানো এবং প্রশ্ন যোগ করা */}
          {role === "instructor" && course.instructor === Number(localStorage.getItem("user_id")) && (
            <div className="border-t pt-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Create New Quiz</h3>
                <div className="flex gap-3">
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Quiz title"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ title: e.target.value })}
                  />
                  <button
                    onClick={addQuiz}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    Create Quiz
                  </button>
                </div>
              </div>

              {quizzes.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Add Question to a Quiz</h3>
                  <div className="space-y-3">
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      value={questionForm.quiz}
                      onChange={(e) => setQuestionForm({ ...questionForm, quiz: e.target.value })}
                    >
                      <option value="">Select quiz</option>
                      {quizzes.map((q) => (
                        <option key={q.id} value={q.id}>{q.title}</option>
                      ))}
                    </select>

                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Question text"
                      value={questionForm.text}
                      onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                    />

                    {questionForm.choices.map((choice, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correct-choice"
                          checked={choice.is_correct}
                          onChange={() => updateChoiceCorrect(i)}
                          title="Mark as correct answer"
                        />
                        <input
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Choice ${i + 1}`}
                          value={choice.text}
                          onChange={(e) => updateChoiceText(i, e.target.value)}
                        />
                      </div>
                    ))}

                    <button
                      onClick={addQuestion}
                      disabled={!questionForm.quiz || !questionForm.text}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

          {reviews.length > 0 ? (
            <div className="space-y-4 mb-6">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{r.student_username}</span>
                    <span className="text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm mt-1">{r.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No reviews yet.</p>
          )}

          {/* স্টুডেন্টের জন্য রিভিউ ফর্ম */}
          {role === "student" && (
            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-800 mb-3">Leave a Review</h3>
              <div className="space-y-3">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Write your feedback..."
                  rows="3"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
                <button
                  onClick={submitReview}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}