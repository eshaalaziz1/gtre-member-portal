"use client";

import { useState } from "react";
import QuizModal from "../QuizModal";
import type { MemberActivity } from "@/lib/memberActivity";
import type { ProgramModule } from "@/lib/programConfig";
import {
  CAPITAL_MARKETS_MODULE_ID,
  getQuizByModuleId,
} from "@/lib/quiz/capitalMarkets";

export default function HomeClient({
  modules,
  activity,
}: {
  modules: ProgramModule[];
  activity: MemberActivity;
}) {
  const [quizOpen, setQuizOpen] = useState<{
    moduleId: string;
    title: string;
  } | null>(null);

  return (
    <>
      <div className="portal-module-grid">
        {modules.map((m) => {
          const locked = m.status === "locked";
          const done = m.status === "done";
          const active = m.status === "active";
          const quizScore =
            m.quizModuleId && activity.quizScores[m.quizModuleId];
          const quizDone = quizScore !== undefined;
          const canTakeQuiz =
            m.hasQuiz && m.quizModuleId && !locked && !quizDone;

          return (
            <div
              key={m.num}
              className={`portal-mod-card${active ? " active-mod" : ""}${locked ? " locked" : ""}`}
            >
              <div className={`portal-mod-num${locked ? " gray" : ""}`}>
                {m.num}
              </div>
              <div className="portal-mod-title">{m.title}</div>
              <div className="portal-mod-row">
                <span className="portal-mod-status">
                  {done
                    ? "Quiz + Assignment"
                    : active
                      ? "In progress"
                      : "Not started"}
                </span>
                <span
                  className={`portal-badge ${done ? "done" : active ? "active" : "locked"}`}
                >
                  {done ? "Complete" : active ? "In progress" : "Upcoming"}
                </span>
              </div>
              {canTakeQuiz && (
                <button
                  type="button"
                  className="portal-btn-primary portal-mod-quiz-btn"
                  onClick={() =>
                    setQuizOpen({
                      moduleId: m.quizModuleId!,
                      title: m.title,
                    })
                  }
                >
                  Take quiz
                </button>
              )}
              {m.hasQuiz && quizDone && (
                <span className="portal-badge done portal-mod-quiz-badge">
                  Quiz: {quizScore}%
                </span>
              )}
            </div>
          );
        })}
      </div>
      {quizOpen && (
        <QuizModal
          moduleId={quizOpen.moduleId}
          title={`${quizOpen.title} Quiz`}
          subtitle={quizOpen.title}
          questions={getQuizByModuleId(quizOpen.moduleId)}
          onClose={() => setQuizOpen(null)}
        />
      )}
    </>
  );
}
