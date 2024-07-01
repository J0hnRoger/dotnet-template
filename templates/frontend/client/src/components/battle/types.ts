import {
  CardUnitDto,
  EffectDto,
  PositioningDto,
  StatDto,
  StateHistoryCard,
} from "src/types";

export interface ReplayChallengeDto {
  id: string;
  challenger: string;
  opponent: string;
  winner: string;
  createdAt: string;
  resolvedAt: string;
  turns: TurnHistory[];
  cardReward: CardUnitDto;
}

export interface TurnHistory {
  attacker: string;
  defender: string;
  attackerAction: TurnAction;
  defenderAction: TurnAction;
  challengerCards: StateHistoryCard[];
  opponentCards: StateHistoryCard[];
}

export interface TurnAction {
  actor: string;
  player: string;
  targets: Array<{ key: string; cardName: string; stats: StatDto[] }>;
  spell: TurnSkill;
}

export interface TurnSkill {
  cardId: string;
  name: string;
  type: { name: string; value: number };
  effects: Array<EffectDto>;
  positioning: PositioningDto[];
}
