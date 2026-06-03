"use client";

import { useState, useTransition } from "react";
import { saveProfileAction } from "@/app/actions/profile";
import type { AnalystProfile } from "@/lib/analystMembers";

export default function ProfileTab({
  initialProfile,
}: {
  initialProfile: AnalystProfile;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  function updateField<K extends keyof AnalystProfile>(
    key: K,
    value: AnalystProfile[K],
  ) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await saveProfileAction({
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        graduationYear: profile.graduationYear,
        reInterest: profile.reInterest,
        linkedinUrl: profile.linkedinUrl,
        resumeUrl: profile.resumeUrl,
        bio: profile.bio,
      });

      if (result.ok) {
        setProfile(result.profile);
        setMessage({ type: "ok", text: "Profile saved." });
      } else {
        setMessage({ type: "err", text: result.error });
      }
    });
  }

  return (
    <form className="portal-profile-card" onSubmit={handleSubmit}>
      <div className="portal-profile-title">My profile</div>
      <div className="portal-profile-grid">
        <div>
          <label htmlFor="prof-first">First name</label>
          <input
            id="prof-first"
            type="text"
            value={profile.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="prof-last">Last name</label>
          <input
            id="prof-last"
            type="text"
            value={profile.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="prof-email">GT email</label>
          <input
            id="prof-email"
            type="email"
            value={profile.gtEmail}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="prof-major">Major</label>
          <input
            id="prof-major"
            type="text"
            value={profile.major}
            onChange={(e) => updateField("major", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="prof-year">Graduation year</label>
          <input
            id="prof-year"
            type="number"
            placeholder="2027"
            value={profile.graduationYear ?? ""}
            onChange={(e) =>
              updateField(
                "graduationYear",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
        </div>
        <div className="full">
          <label htmlFor="prof-re">Interest in real estate</label>
          <input
            id="prof-re"
            type="text"
            placeholder="e.g. acquisitions, development"
            value={profile.reInterest}
            onChange={(e) => updateField("reInterest", e.target.value)}
          />
        </div>
        <div className="full">
          <label htmlFor="prof-linkedin">LinkedIn URL</label>
          <input
            id="prof-linkedin"
            type="url"
            placeholder="https://linkedin.com/in/..."
            value={profile.linkedinUrl}
            onChange={(e) => updateField("linkedinUrl", e.target.value)}
          />
        </div>
        <div className="full">
          <label htmlFor="prof-resume">Resume link (Google Drive, etc.)</label>
          <input
            id="prof-resume"
            type="url"
            placeholder="https://..."
            value={profile.resumeUrl}
            onChange={(e) => updateField("resumeUrl", e.target.value)}
          />
        </div>
        <div className="full">
          <label htmlFor="prof-bio">Bio</label>
          <textarea
            id="prof-bio"
            placeholder="Short bio for the club"
            value={profile.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </div>
      </div>
      <div
        className={`portal-profile-msg${message ? ` ${message.type}` : ""}`}
        role="status"
      >
        {message?.text ?? ""}
      </div>
      <button
        type="submit"
        className="portal-btn-primary"
        disabled={pending}
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
