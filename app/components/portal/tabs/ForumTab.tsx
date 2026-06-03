"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  postForumQuestionAction,
  postForumReplyAction,
} from "@/app/actions/forum";
import type { ForumQuestion, ForumReply } from "@/lib/forum";

export default function ForumTab({
  initialQuestions,
  authorName,
  detail,
}: {
  initialQuestions: ForumQuestion[];
  authorName: string;
  detail: { question: ForumQuestion; replies: ForumReply[] } | null;
}) {
  const router = useRouter();
  const [postError, setPostError] = useState("");
  const [pending, startTransition] = useTransition();

  if (detail) {
    const { question, replies } = detail;
    return (
      <div>
        <Link href="/?tab=forum" className="portal-forum-back">
          ← Back to questions
        </Link>
        <div className="portal-forum-detail">
          {question.visibility === "admin-only" && (
            <p className="portal-forum-private-note">Visible to e-board only</p>
          )}
          <h3>{question.title}</h3>
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
              startTransition(async () => {
                await postForumReplyAction({
                  questionId: question.id,
                  body,
                  authorName,
                });
                form.reset();
                router.refresh();
              });
            }}
          >
            <textarea name="reply" placeholder="Write a reply..." />
            <button type="submit" className="portal-btn-primary" disabled={pending}>
              Reply
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form
        className="portal-forum-compose"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const title = (form.elements.namedItem("title") as HTMLInputElement)
            .value;
          const body = (form.elements.namedItem("body") as HTMLTextAreaElement)
            .value;
          const visibility = (
            form.elements.namedItem("visibility") as HTMLSelectElement
          ).value as "public" | "admin-only";
          setPostError("");
          startTransition(async () => {
            const result = await postForumQuestionAction({
              title,
              body,
              visibility,
              authorName,
            });
            if (result.ok) {
              form.reset();
              router.refresh();
            } else {
              setPostError(result.error);
            }
          });
        }}
      >
        <div className="portal-forum-compose-title">Ask a question</div>
        <input name="title" type="text" placeholder="Question title" required />
        <textarea
          name="body"
          placeholder="What would you like to know?"
          required
        />
        <label className="portal-forum-visibility-label" htmlFor="forum-visibility">
          Who can see this?
        </label>
        <select id="forum-visibility" name="visibility" defaultValue="public">
          <option value="public">Everyone (all members)</option>
          <option value="admin-only">E-board only (private)</option>
        </select>
        {postError && <div className="portal-form-error">{postError}</div>}
        <button type="submit" className="portal-btn-primary" disabled={pending}>
          Post question
        </button>
      </form>
      <div className="portal-section-label">Recent questions</div>
      <div className="portal-forum-list">
        {initialQuestions.length === 0 ? (
          <div className="portal-empty">No questions yet. Be the first to ask!</div>
        ) : (
          initialQuestions.map((q) => (
            <Link
              key={q.id}
              href={`/?tab=forum&q=${q.id}`}
              className="portal-forum-item"
            >
              <h4>
                {q.title}
                {q.visibility === "admin-only" && (
                  <span className="portal-forum-badge-private">E-board only</span>
                )}
              </h4>
              <div className="portal-forum-meta">
                {q.authorName} ·{" "}
                {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ""}{" "}
                · {q.isAnswered ? "Answered" : "Open"}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
