export type QuizQuestion = {
  q: string;
  a: string;
  b: string;
  c: string;
  d: string;
  ans: "A" | "B" | "C" | "D";
  exp: string;
};

export const CAPITAL_MARKETS_MODULE_ID =
  "5436f522-b2ec-415d-896f-ccab9c45022c";

export const CAPITAL_MARKETS_QUIZ: QuizQuestion[] = [
  {
    q: "A multifamily property in Midtown Atlanta traded at a 3.75% cap rate in mid-2021, and a similar property traded at a 5.1% cap rate in 2024. Assuming similar NOI levels, what does the change tell you about property values?",
    a: "Property values increased significantly because buyers were willing to pay more.",
    b: "Property values decreased because investors required a higher return relative to income.",
    c: "Property values stayed flat because NOI and cap rates moved in the same direction.",
    d: "Property values increased because interest rates rose.",
    ans: "B",
    exp: "When cap rates rise, property values fall — assuming stable NOI. A higher cap rate means investors demand more return per dollar of income, compressing the price they will pay.",
  },
  {
    q: "An investor purchases a property for $15,000,000 with $6,000,000 equity and a $9,000,000 loan at 6% interest-only. The property generates $900,000 NOI. What is the cap rate?",
    a: "6% (900,000 / 15,000,000)",
    b: "40% (6,000,000 / 5,000,000)",
    c: "60% (9,000,000 / 15,000,000)",
    d: "1%",
    ans: "A",
    exp: "Cap rate = NOI / Purchase Price = $900,000 / $15,000,000 = 6%. Cap rate is a property-level metric based on total value, not equity.",
  },
  {
    q: "A developer needs financing but the senior lender only covers 55% of project cost and the developer can contribute 10% equity. Which layer of the capital stack fills the remaining gap?",
    a: "Additional senior debt from the same bank",
    b: "Mezzanine debt or preferred equity",
    c: "A government grant covering the shortfall",
    d: "Common equity",
    ans: "B",
    exp: "Mezzanine debt and preferred equity sit between senior debt and common equity. They fill the gap when senior debt doesn't cover enough and the sponsor can't contribute more equity.",
  },
  {
    q: "After the Fed raised rates in 2022-2023, many banks pulled back from CRE lending. What type of capital stepped in and why were they willing to lend?",
    a: "The Federal Reserve began lending directly to developers at lower rates.",
    b: "Private credit lenders stepped in because they could charge higher rates to compensate for added risk.",
    c: "CMBS lenders eliminated all underwriting requirements to attract borrowers.",
    d: "Common equity investors converted their positions into debt to fill the void.",
    ans: "B",
    exp: "Private credit lenders aren't subject to the same regulatory requirements as banks. They stepped in charging elevated rates to reflect the added risk and opportunity.",
  },
  {
    q: "A lender requires a minimum DSCR of 1.25x. A property generates $1,250,000 NOI. What is the maximum annual debt service the lender will allow?",
    a: "$1,562,500 ($1,250,000 x 1.25)",
    b: "$1,250,000 ($1,250,000 / 1.00)",
    c: "$1,000,000 ($1,250,000 / 1.25)",
    d: "$800,000 ($1,250,000 / 1.56)",
    ans: "C",
    exp: "DSCR = NOI / Debt Service. Rearranging: Max Debt Service = NOI / DSCR = $1,250,000 / 1.25 = $1,000,000.",
  },
  {
    q: "In a typical institutional real estate deal, why does the GP often earn a disproportionate share of profits through the promote structure?",
    a: "Because the GP typically contributes the majority of the equity capital",
    b: "Because the GP guarantees the senior loan in all transactions",
    c: "Because the GP is compensated for sourcing, executing, and managing the deal successfully",
    d: "Because the GP receives fixed interest payments like a lender",
    ans: "C",
    exp: "The promote compensates the GP for the value created through deal sourcing, execution, and asset management — not capital contribution. LPs typically contribute the majority of equity.",
  },
  {
    q: "Why do common equity investors in CRE typically target higher returns than debt investors?",
    a: "Because common equity is paid before lenders in the capital stack",
    b: "Because common equity investors have capped upside but guaranteed payments",
    c: "Because common equity investors bear the most risk and are paid last in the capital stack",
    d: "Because common equity investors receive fixed interest payments from the borrower",
    ans: "C",
    exp: "Common equity sits at the bottom of the capital stack — paid last and absorbs losses first. This higher risk demands higher return targets to attract investors.",
  },
];

export function getQuizByModuleId(moduleId: string): QuizQuestion[] {
  if (moduleId === CAPITAL_MARKETS_MODULE_ID) return CAPITAL_MARKETS_QUIZ;
  return [];
}
