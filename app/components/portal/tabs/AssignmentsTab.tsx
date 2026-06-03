"use client";

import { useState } from "react";
import QuizModal from "../QuizModal";
import SubmitModal from "../SubmitModal";
import type { AssignmentListItem } from "@/lib/dashboard";
import { formatDisplayDate, isPastDate } from "@/lib/programConfig";
import { getQuizByModuleId } from "@/lib/quiz/capitalMarkets";

function AssignCard({
  header,
  body,
}: {
  header: React.ReactNode;
  body: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="portal-assign-card">
      <div
        className="portal-assign-hdr"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
        role="button"
        tabIndex={0}
      >
        {header}
      </div>
      {open && <div className="portal-assign-body">{body}</div>}
    </div>
  );
}

export default function AssignmentsTab({
  due,
  done,
}: {
  due: AssignmentListItem[];
  done: AssignmentListItem[];
}) {
  const [submitAssignment, setSubmitAssignment] = useState<
    AssignmentListItem & { kind: "assignment" }
  | null>(null);
  const [quizWeek, setQuizWeek] = useState<
    AssignmentListItem & { kind: "quiz" } | null
  >(null);

  return (
    <>
      <div className="portal-section-label">Due soon</div>
      {due.length === 0 ? (
        <div className="portal-empty">Nothing due right now.</div>
      ) : (
        due.map((item) => {
          if (item.kind === "quiz") {
            return (
              <AssignCard
                key={`quiz-${item.week.id}`}
                header={
                  <>
                    <div className="portal-assign-left">
                      <div className="portal-assign-name">
                        {item.week.quizLabel}
                      </div>
                      <div className="portal-assign-due red">
                        Due this week · 7 questions
                      </div>
                    </div>
                    <span className="portal-badge missing">Not started</span>
                  </>
                }
                body={
                  <>
                    <div className="portal-assign-desc">
                      Test your understanding of capital markets concepts.
                      Auto-graded and saved to your account.
                    </div>
                    <div className="portal-assign-actions">
                      <button
                        type="button"
                        className="portal-btn-primary"
                        onClick={() => setQuizWeek(item)}
                      >
                        Take quiz
                      </button>
                    </div>
                  </>
                }
              />
            );
          }
          const dueClass = isPastDate(item.assignment.due) ? "gray" : "red";
          return (
            <AssignCard
              key={item.assignment.id}
              header={
                <>
                  <div className="portal-assign-left">
                    <div className="portal-assign-name">{item.assignment.title}</div>
                    <div className={`portal-assign-due ${dueClass}`}>
                      Due {formatDisplayDate(item.assignment.due)}
                    </div>
                  </div>
                  <span className="portal-badge missing">Not started</span>
                </>
              }
              body={
                <>
                  <div className="portal-assign-desc">
                    {item.assignment.description}
                  </div>
                  <div className="portal-assign-actions">
                    <button
                      type="button"
                      className="portal-btn-primary"
                      onClick={() => setSubmitAssignment(item)}
                    >
                      Submit
                    </button>
                  </div>
                </>
              }
            />
          );
        })
      )}

      <div className="portal-section-label" style={{ marginTop: 20 }}>
        Completed
      </div>
      {done.length === 0 ? (
        <div className="portal-empty">No submissions yet.</div>
      ) : (
        done.map((item) =>
          item.kind === "assignment" ? (
            <div key={item.assignment.id} className="portal-assign-card">
              <div className="portal-assign-hdr">
                <div className="portal-assign-left">
                  <div className="portal-assign-name">{item.assignment.title}</div>
                  <div className="portal-assign-due green">Submitted</div>
                </div>
                <span className="portal-badge submitted">Submitted</span>
              </div>
            </div>
          ) : null,
        )
      )}

      {submitAssignment && (
        <SubmitModal
          assignment={submitAssignment.assignment}
          onClose={() => setSubmitAssignment(null)}
        />
      )}
      {quizWeek && quizWeek.week.quizModuleId && (
        <QuizModal
          moduleId={quizWeek.week.quizModuleId}
          title={quizWeek.week.quizLabel ?? "Module Quiz"}
          subtitle="Capital Markets & Financing"
          questions={getQuizByModuleId(quizWeek.week.quizModuleId)}
          onClose={() => setQuizWeek(null)}
        />
      )}
    </>
  );
}
