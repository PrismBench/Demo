export type Phase = 1 | 2 | 3;
export type PhaseColors = {
  [key in Phase]: { bg: string; border: string };
};
