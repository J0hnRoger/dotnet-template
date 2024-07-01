export interface UserProfile {
  login: string;
  cards: Array<CardUnitDto>;
  lastResetDate: string;
}

export class CardUnit {
  card: CardDto;
  id: string;
  owner: string;
  emittedDate: string;
  challengeId: string;
  name: string;
  new?: boolean;
  lost?: boolean;

  constructor(card: CardDto) {
    this.card = card;
  }

  get pv() {
    const hpStat = this.card.stats.find((s) => s.name == "HP");
    if (hpStat == undefined) return 0;
    return this.card.stats.find((s) => s.name == "HP").value;
  }
}

export interface PlayerDto {
  name: string;
  victory: number;
  defeat: number;
  manas: number;
  challenges: Array<ChallengeDto>;
  lastResetDate: Date;
  isChallenged: boolean;
  hasSentChallenge: boolean;
  challengeSent?: string;
  avatar?: string;
}

export interface LivePlayerDto {
  name: string;
  isOnline: boolean;
}

export interface Card {
  cardId: string;
  name: string;
  pv: number;
  skills?: Skill[];
}

type EffectType = {
  [key: string]: number;
};

export interface Skill {
  cardId: string;
  name: string;
  damage: number;
  heal: number;
  effect: EffectType;
}

export interface ChallengeDto {
  id: string;
  winner: string;
  opponent: string;
  challenger: string;
  createdAt: string;
  resolvedAt: string;
  status: "Resolved" | "Pending" | "Archived"; // Ajoutez d'autres statuts si nécessaire
  challengerSequence: ChallengerSequenceDto;
  opponentSequence: ChallengerSequenceDto;
  stateHistory: StateHistoryDto[];
  cardReward: CardUnitDto | null;
}

export interface CreateChallengeDto {
  id: string;
  challenger: string;
  opponent: string;
  cards: CardUnit[];
  sequence: SkillSequenceDto[];
}

export type ReportStateHistoryDto = Omit<
  StateHistoryDto,
  "attackerAction" | "defenderAction"
> & {
  attackerAction: ReportTurnDto;
  defenderAction: ReportTurnDto;
};

export type ReportTurnDto = Omit<TurnDto, "targets"> & {
  targets: Array<{ key: string; cardName: string; stats: StatDto[] }>;
};

export interface StateHistoryDto {
  turnIndex: number;
  attacker: string;
  defender: string;
  attackerAction: TurnDto;
  defenderAction: TurnDto;
  challengerCards: StateHistoryCard[];
  opponentCards: StateHistoryCard[];
}

export interface StateHistoryCard {
  id: string;
  cardId: string;
  name: string;
  pv: number;
  stats: StatDto[];
  frontline: boolean;
  slots: null;
}

export interface TurnDto {
  actor: string;
  player: string;
  targets: Record<string, StatDto[]>;
  spell: SkillDto;
  damage: number;
}

export interface TurnActorDto {
  id: string;
  cardId: string;
  name: string;
  pv: number;
  frontline: boolean;
  stats: StatDto[];
}

// only for the targetStat wich is an object rather than a string
export interface TurnEffectDto {
  value: number;
  targetStat: StatDto;
  targetActor: "frontline" | "backline" | "random" | "self";
  side: "allies" | "opponents" | "both";
  duration: number;
  specialEffect: "stun";
}

export interface ChallengerSequenceDto {
  challenger: string;
  opponent: string;
  cards: CardUnitDto[];
  sequence: SkillSequenceDto[];
}

export interface ChallengeEffectDto {
  value: number;
  targetStat: string;
  targetActor: "frontline" | "backline" | "random" | "self";
  side: "allies" | "opponents" | "both";
  duration: number;
  specialEffect: "stun";
}

export interface CardDto {
  cardId: string;
  name: string;
  level: number;
  pv: number;
  skills: SkillDto[];
  stats: StatDto[];
}

export interface CardUnitDto {
  new?: boolean;
  lost?: boolean;
  name: string;
  cardId: string;
  level: number;
  id: string;
  owner: string;
  emittedDate: string;
  challengeId: string;
}

export interface BattleCard {
  id: string;
  cardId: string;
  owner: string;
  emittedDate: string;
  challengeId: string;
  name: string;
}

export interface StatDto {
  name: CardStats;
  value: number;
}

export interface SkillDto {
  name: string;
  type: { name: string; value: number };
  effects: Array<EffectDto>;
  positioning: PositioningDto[];
}

export type ChallengeSkillDto = SkillDto & { cardId: string };

export interface EffectDto {
  value: number;
  targetStat: { name: string; value: number };
  targetActor: "frontline" | "backline" | "random" | "self";
  side: "allies" | "opponents" | "both";
  duration: number;
  specialEffect: "stun";
}

export interface PositioningDto {
  target: "frontline" | "backline" | "random" | "self";
  side: "allies" | "opponents" | "both";
}

export interface SkillSequenceDto {
  name: string;
  cardId: string;
  damage: number;
  heal: number;
  effect: { [key: string]: any }; // Utilisez un type plus spécifique si vous connaissez la structure exacte des effets
}

export interface ChallengeCanceledEvent {
  challenger: string;
  opponent: string;
  challengeId: string;
}

export interface ChallengeInitEvent {
  challenge: ChallengeDto;
}

export interface ChallengeSentEvent {
  challenge: ChallengeDto;
}

export interface ChallengeReceivedEvent {
  challenge: ChallengeDto;
}

export interface ChallengeAccepted {
  challenge: ChallengeDto;
}

export interface ChallengeResolvedEvent {
  challenge: ChallengeDto;
}

export enum CardStats {
  HP = "HP",
  Physique = "Physique",
  Chimique = "Chimique",
  Psychique = "Psychique",
  Sonore = "Sonore",
  Optique = "Optique",
  Thermique = "Thermique",
}

export enum CardColors {
  HP = "HP",
  Physique = "#9CA3AF",
  Chimique = "#4ADE80",
  Psychique = "#C084FC",
  Sonore = "#60A5FA",
  Optique = "#FB923C",
  Thermique = "#F87171",
}
