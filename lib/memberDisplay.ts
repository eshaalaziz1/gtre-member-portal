export function getMemberDisplayEmail(
  member?: {
    loginEmail?: string | null;
    contact?: { emails?: unknown } | null;
    profile?: { nickname?: string | null; slug?: string | null } | null;
  } | null,
): string | null {
  if (!member) return null;

  const contactEmail = Array.isArray(member.contact?.emails)
    ? (member.contact.emails[0] as { email?: string | null } | undefined)?.email
    : null;

  return (
    member.loginEmail ??
    contactEmail ??
    member.profile?.nickname ??
    member.profile?.slug ??
    null
  );
}
