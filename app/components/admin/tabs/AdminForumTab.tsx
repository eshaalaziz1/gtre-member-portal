"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminPostOfficialReplyAction,
  adminToggleAnsweredAction,
} from "@/app/actions/admin";
import type { ForumQuestion, ForumReply } from "@/lib/forum";

export default function AdminForumTab({
  questions,
  detail,
  authorName,
}: {
  questions: ForumQuestion[];
  detail: { question: ForumQuestion; replies: ForumReply[] } | null;
  authorName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  if (detail) {
    const { question, replies } = detail;
    return (
      <div>
        <Link href="/admin?section=forum" className="portal-forum-back">
          ← All questions
        </Link>
        <div className="portal-forum-detail">
          <div className="admin-detail-actions">
            <span className={`portal-badge ${question.isAnswered ? "done" : "pending"}`}>
              {question.isAnswered ? "Answered" : "Open"}
            </span>
            <button
              type="button"
              className="portal-btn-text"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  await adminToggleAnsweredAction(question.id, !question.isAnswered);
                  router.refresh();
                });
              }}
            >
              Mark {question.isAnswered ? "open" : "answered"}
            </button>
          </div>
          <h3>{question.title}</h3>
          <div className="portal-forum-meta">
            {question.authorName} · {question.gtEmail} · {question.visibility}
          </div>
          <div className="portal-forum-body">{question.body}</div>
          {replies.map((r) => (
            <div
              key={r.id}
              className={`portal-forum-reply${r.isOfficialAnswer ? " official" : ""}`}
            >
              <div className="portal-r-meta">
                {r.authorName}
                {r.isOfficialAnswer ? " · Official answer" : ""}
              </div>
              <div className="portal-r-body">{r.body}</div>
            </div>
          ))}
          <form
            className="portal-forum-reply-form"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const body = (
                form.elements.namedItem("reply") as HTMLTextAreaElement
              ).value.trim();
              if (!body) return;
              setError("");
              startTransition(async () => {
                const result = await adminPostOfficialReplyAction({
                  questionId: question.id,
                  body,
                  authorName,
                });
                if (result.ok) {
                  form.reset();
                  router.refresh();
                } else {
                  setError(result.error);
                }
              });
            }}
          >
            <div className="portal-form-label">Official answer (visible to member)</div>
            <textarea name="reply" placeholder="Write the official answer…" />
            {error && <div className="portal-form-error">{error}</div>}
            <button type="submit" className="portal-btn-primary" disabled={pending}>
              Post official answer
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="portal-forum-list">
        {questions.length === 0 ? (
          <div className="portal-empty">No forum questions yet.</div>
        ) : (
          questions.map((q) => (
            <Link
              key={q.id}
              href={`/admin?section=forum&q=${q.id}`}
              className="portal-forum-item"
            >
              <h4>
                {q.title}
                {q.visibility === "admin-only" && (
                  <span className="portal-forum-badge-private">E-board only</span>
                )}
              </h4>
              <div className="portal-forum-meta">
                {q.authorName} · {q.gtEmail} ·{" "}
                {q.isAnswered ? "Answered" : "Open"}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
