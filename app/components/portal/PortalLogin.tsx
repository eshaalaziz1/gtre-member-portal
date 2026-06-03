"use client";

import MemberAuth from "../MemberAuth";

export default function PortalLogin({
  errorMessage,
}: {
  errorMessage?: string;
}) {
  return (
    <div className="portal-root">
      <div className="portal-login">
        <div className="portal-login-box">
          <div className="portal-login-logo">GTRE ANALYST PROGRAM</div>
          <h2>Member Portal</h2>
          <p>
            Sign in with your Wix member account to access the analyst program
            portal.
          </p>
          {errorMessage && (
            <p className="portal-login-error">{errorMessage}</p>
          )}
          <MemberAuth
            initialLoggedIn={false}
            initialEmail={null}
            errorMessage={errorMessage}
            variant="portal"
          />
        </div>
      </div>
    </div>
  );
}
