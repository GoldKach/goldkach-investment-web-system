export interface RiskQuestion {
  id: string;
  section: string;
  title: string;
  question: string;
  options: { label: string; score: number }[];
}

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: "q1",
    section: "SECTION 1",
    title: "HOW LONG WILL YOU INVEST?",
    question: "Roughly how long do you plan to keep this money invested before you need it back?",
    options: [
      { label: "Less than 1 year", score: 1 },
      { label: "1 to 3 years", score: 2 },
      { label: "3 to 5 years", score: 3 },
      { label: "5 to 10 years", score: 4 },
      { label: "More than 10 years", score: 5 },
    ],
  },
  {
    id: "q2",
    section: "SECTION 2",
    title: "WHAT YOU WANT FROM THIS INVESTMENT",
    question: "What matters most to you with this money?",
    options: [
      { label: "Keeping it safe — protecting what I already have", score: 1 },
      { label: "Getting regular payouts (income)", score: 2 },
      { label: "Some growth, without big ups and downs", score: 3 },
      { label: "Solid growth, even if the value moves around sometimes", score: 4 },
      { label: "The biggest possible growth over time, even with some swings", score: 5 },
    ],
  },
  {
    id: "q3",
    section: "SECTION 3",
    title: "YOUR INVESTING EXPERIENCE",
    question: "Which best describes your experience with investing so far?",
    options: [
      { label: "I have never invested before", score: 1 },
      { label: "I have only used a savings account", score: 2 },
      { label: "I have used government savings bonds or fixed deposits", score: 3 },
      { label: "I have invested in Unit Trusts (pooled investment funds)", score: 4 },
      { label: "I have invested in shares, or other investments", score: 5 },
    ],
  },
  {
    id: "q4",
    section: "SECTION 4",
    title: "IF YOUR INVESTMENT DROPS IN VALUE",
    question: "If the value of your investment suddenly dropped by 10%, what would you most likely do?",
    options: [
      { label: "Sell everything right away", score: 1 },
      { label: "Sell some of it to limit further loss", score: 2 },
      { label: "Wait and see — give it time to recover", score: 3 },
      { label: "Add more money while prices are lower", score: 4 },
      { label: "Add a lot more money to take advantage of the lower price", score: 5 },
    ],
  },
  {
    id: "q5",
    section: "SECTION 5",
    title: "HOW MUCH YOU NEED THIS MONEY",
    question: "How much do you depend on this money for everyday living costs?",
    options: [
      { label: "I need it to cover daily living expenses", score: 1 },
      { label: "It's important, but I could manage without some of it", score: 2 },
      { label: "It matters somewhat, but I have other money to fall back on", score: 3 },
      { label: "This is spare money I won't need soon", score: 4 },
      { label: "This is long-term extra money I don't expect to need", score: 5 },
    ],
  },
  {
    id: "q6",
    section: "SECTION 6",
    title: "HOW STEADY IS YOUR INCOME",
    question: "Which best describes the money coming in to you each month?",
    options: [
      { label: "My income is unpredictable", score: 1 },
      { label: "My income is somewhat unpredictable", score: 2 },
      { label: "I have a steady salary", score: 3 },
      { label: "I have steady income from my own business", score: 4 },
      { label: "I have several reliable sources of income", score: 5 },
    ],
  },
  {
    id: "q7",
    section: "SECTION 7",
    title: "WHAT YOU'VE INVESTED IN BEFORE",
    question: "Which of these have you held or currently hold?",
    options: [
      { label: "A savings account only", score: 1 },
      { label: "Government savings bonds or fixed deposits", score: 2 },
      { label: "Bonds", score: 3 },
      { label: "Unit Trusts (pooled investment funds)", score: 4 },
      { label: "Shares, or other private investments", score: 5 },
    ],
  },
  {
    id: "q8",
    section: "SECTION 8",
    title: "HOW MUCH LOSS YOU CAN ACCEPT",
    question: "Over a 12-month period, what is the most your investment could temporarily drop in value before it would worry you?",
    options: [
      { label: "Less than 5%", score: 1 },
      { label: "5% to 10%", score: 2 },
      { label: "10% to 20%", score: 3 },
      { label: "20% to 30%", score: 4 },
      { label: "More than 30%", score: 5 },
    ],
  },
  {
    id: "q9",
    section: "SECTION 9",
    title: "WHAT RETURNS YOU EXPECT",
    question: "Realistically, what yearly return would you expect from this investment over the long run?",
    options: [
      { label: "3% to 5%", score: 1 },
      { label: "5% to 8%", score: 2 },
      { label: "8% to 12%", score: 3 },
      { label: "12% to 18%", score: 4 },
      { label: "More than 18%", score: 5 },
    ],
  },
  {
    id: "q10",
    section: "SECTION 10",
    title: "YOUR OVERALL ATTITUDE TO RISK",
    question: "Which statement sounds most like you?",
    options: [
      { label: "I avoid risk as much as possible", score: 1 },
      { label: "I prefer low risk and steady, predictable returns", score: 2 },
      { label: "I can accept some ups and downs for better returns", score: 3 },
      { label: "I'm willing to accept ups and downs for higher returns", score: 4 },
      { label: "I focus on long-term growth even through short-term swings", score: 5 },
    ],
  },
];

export type RiskAnswers = Record<string, number>;

export interface RiskResult {
  score: number;
  profile: string;
  strategy: string;
}

export function computeRiskProfile(answers: RiskAnswers): RiskResult {
  const score = RISK_QUESTIONS.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
  if (score <= 23) {
    return { score, profile: "Conservative (Income)", strategy: "70% Income ETFs / 30% Growth ETFs" };
  }
  if (score <= 37) {
    return { score, profile: "Balanced (Income and Growth)", strategy: "50% Income ETFs / 50% Growth ETFs" };
  }
  return { score, profile: "Growth", strategy: "100% Growth ETFs" };
}

export function isQuestionnaireComplete(answers: RiskAnswers): boolean {
  return RISK_QUESTIONS.every((q) => (answers[q.id] ?? 0) > 0);
}

/** Map questionnaire answers to legacy investment profile field values. */
export function deriveInvestmentProfileFields(answers: RiskAnswers) {
  const timeHorizonMap: Record<number, string> = {
    1: "less-than-1-year", 2: "1-3-years", 3: "3-5-years", 4: "5-10-years", 5: "over-10-years",
  };
  const primaryGoalMap: Record<number, string> = {
    1: "capital-preservation", 2: "income", 3: "income-growth", 4: "growth", 5: "growth",
  };
  const experienceMap: Record<number, string> = {
    1: "none", 2: "none", 3: "limited", 4: "moderate", 5: "extensive",
  };
  const toleranceMap: Record<number, string> = {
    1: "conservative", 2: "conservative", 3: "moderate-risk", 4: "aggressive", 5: "aggressive",
  };
  return {
    timeHorizon: timeHorizonMap[answers.q1] ?? "",
    primaryGoal: primaryGoalMap[answers.q2] ?? "",
    investmentExperience: experienceMap[answers.q3] ?? "",
    riskTolerance: toleranceMap[answers.q10] ?? "",
  };
}
