"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitQuizAction } from "@/app/actions/quiz";
import type { QuizQuestion } from "@/lib/quiz/capitalMarkets";

export default function QuizModal({
  moduleId,
  title,
  subtitle,
  questions,
  onClose,
}: {
  moduleId: string;
  title: string;
  subtitle: string;
  questions: QuizQuestion[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{
    correct: number;
    total: number;
    pct: number;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const q = questions[index];
  const total = questions.length;

  function selectAnswer(letter: string) {
    if (answered || !q) return;
    setAnswers((prev) => ({ ...prev, [index]: letter }));
    setAnswered(true);
  }

  function goNext() {
    if (!answered) return;
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setAnswered(!!answers[index + 1]);
    } else {
      startTransition(async () => {
        const res = await submitQuizAction({ moduleId, answers: { ...answers } });
        if (res.ok) {
          setResult({ correct: res.correct, total: res.total, pct: res.percentage });
          setFinished(true);
          router.refresh();
        }
      });
    }
  }

  function goPrev() {
    if (index > 0) {
      setIndex((i) => i - 1);
      setAnswered(!!answers[index - 1]);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="portal-overlay active" onClick={onClose}>
        <div className="portal-quiz-modal" onClick={(e) => e.stopPropagation()}>
          <p>No questions available for this quiz.</p>
          <button type="button" className="portal-btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-overlay active" onClick={onClose}>
      <div className="portal-quiz-modal" onClick={(e) => e.stopPropagation()}>
        {!finished ? (
          <>
            <div className="portal-quiz-modal-title">{title}</div>
            <div className="portal-quiz-modal-sub">{subtitle}</div>
            <div className="portal-quiz-prog">
              <span className="portal-quiz-prog-text">
                Question {index + 1} of {total}
              </span>
              <div className="portal-quiz-prog-track">
                <div
                  className="portal-quiz-prog-fill"
                  style={{ width: `${Math.round(((index + 1) / total) * 100)}%` }}
                />
              </div>
              <span className="portal-quiz-prog-text">
                {Object.keys(answers).length} answered
              </span>
            </div>
            <div className="portal-quiz-q">{q.q}</div>
            <div className="portal-quiz-options">
              {(
                [
                  ["A", q.a],
                  ["B", q.b],
                  ["C", q.c],
                  ["D", q.d],
                ] as const
              ).map(([letter, text]) => {
                const selected = answers[index] === letter;
                const isCorrect = letter === q.ans;
                let cls = "portal-quiz-opt";
                if (answered) {
                  if (isCorrect) cls += " correct";
                  else if (selected) cls += " wrong";
                }
                return (
                  <button
                    key={letter}
                    type="button"
                    className={cls}
                    onClick={() => selectAnswer(letter)}
                    disabled={answered}
                  >
                    <span className="portal-opt-letter">{letter}</span>
                    <span>{text}</span>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="portal-quiz-explanation">{q.exp}</div>
            )}
            <div className="portal-modal-actions">
              {index > 0 && (
                <button type="button" className="portal-btn-cancel" onClick={goPrev}>
                  Back
                </button>
              )}
              <button
                type="button"
                className="portal-btn-primary"
                onClick={goNext}
                disabled={!answered || pending}
              >
                {pending
                  ? "Saving…"
                  : index === total - 1
                    ? "Submit Quiz"
                    : "Next"}
              </button>
            </div>
          </>
        ) : (
          <div className="portal-quiz-score-view">
            <div className="portal-score-circle">
              <div className="portal-score-pct">{result?.pct}%</div>
              <div className="portal-score-sub">SCORE</div>
            </div>
            <div className="portal-quiz-result-title">
              {(result?.pct ?? 0) >= 70 ? "Great work!" : "Keep studying!"}
            </div>
            <div className="portal-quiz-result-msg">
              You got {result?.correct} of {result?.total} correct. Score saved
              to your account.
            </div>
            <button
              type="button"
              className="portal-btn-primary"
              style={{ width: "100%", padding: "11px" }}
              onClick={onClose}
            >
              Back to Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
