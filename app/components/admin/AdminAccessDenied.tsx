import Link from "next/link";
import MemberAuth from "../MemberAuth";

export default function AdminAccessDenied({
  loggedIn,
  email,
}: {
  loggedIn: boolean;
  email: string | null;
}) {
  if (!loggedIn) {
    return (
      <div className="portal-root portal-login">
        <div className="portal-login-box" style={{ maxWidth: 440 }}>
          <div className="portal-login-logo">GTRE ADMIN</div>
          <h2>Admin sign in required</h2>
          <p>Sign in with your Wix member account to access the admin portal.</p>
          <MemberAuth variant="portal" initialLoggedIn={false} />
          <p style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
            <Link href="/">← Back to member portal</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-root portal-login">
      <div className="portal-login-box" style={{ maxWidth: 440 }}>
        <div className="portal-login-logo">GTRE ADMIN</div>
        <h2>Access denied</h2>
        <p>
          Signed in as <strong>{email ?? "member"}</strong>, but this account
          does not have admin access.
        </p>
        <Link
          href="/"
          className="portal-btn-primary"
          style={{ display: "inline-block", marginTop: 8, padding: "10px 18px" }}
        >
          Go to member portal
        </Link>
      </div>
    </div>
  );
}
