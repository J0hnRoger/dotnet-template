export type JobOffer = {
  id: string;
  title: string;
  description: string;
  enterprise: object;
  duration: number;
  origin: string;
  status: "open" | "selected" | "failed" | "pending";
  response: string;
  contact: Skill[];
  rythm: "remote" | "hybrid" | "atWork";
};

export type Skill = {
  name: string;
  type: string;
};
