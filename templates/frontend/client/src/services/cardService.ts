import { cloneDeep } from "lodash";
import { Mail } from "src/pages/data";
import { Failure, Result, Success } from "../common/fp";
import {
  CardDto,
  CardUnit,
  CardUnitDto,
  ChallengeDto,
  StateHistoryCard,
  StateHistoryDto,
  TurnDto,
} from "../types";

import { ReplayChallengeDto, TurnHistory } from "@components/battle/types";

const findCard = (
  cards: CardDto[],
  cardId: string
): Result<CardDto, string> => {
  const card = cards.find((card) => card.cardId === cardId);
  if (card == null) return Failure("Card not found");
  return Success(card);
};

const mapCardUnit = (card: CardDto, cardUnit: CardUnitDto): CardUnit => {
  const newCardUnit = new CardUnit(card);
  newCardUnit.id = cardUnit.id;
  newCardUnit.owner = cardUnit.owner;
  newCardUnit.emittedDate = cardUnit.emittedDate;
  newCardUnit.challengeId = cardUnit.challengeId;
  newCardUnit.name = cardUnit.name;
  newCardUnit.new = cardUnit.new;
  newCardUnit.lost = cardUnit.lost;
  return newCardUnit;
};

const mapCardUnitDto = (cardUnit: CardUnit): CardUnitDto => ({
  // map properties
  name: cardUnit.name,
  cardId: cardUnit.card.cardId,
  id: cardUnit.id,
  owner: cardUnit.owner,
  emittedDate: cardUnit.emittedDate,
  challengeId: cardUnit.challengeId,
  new: cardUnit.new,
  lost: cardUnit.lost,
  level: cardUnit.card.level,
});

const mapCardUnits = (
  cards: CardDto[],
  cardUnits: CardUnitDto[]
): Result<CardUnit, string>[] => {
  return cardUnits.map((cardUnit) => {
    const current = cards.find((card) => cardUnit.cardId === card.cardId);
    if (current == null) return Failure(`Card not found: ${cardUnit.cardId}`);
    return Success(mapCardUnit(current, cardUnit));
  });
};

const getRandomTags = (randomTags: string[]): string[] => {
  const randomTagsCount = Math.floor(Math.random() * 3) + 1;
  const randomTagsSelection: string[] = [];

  for (let i = 0; i < randomTagsCount; i++) {
    const randomIndex = Math.floor(Math.random() * randomTags.length);
    randomTagsSelection.push(randomTags[randomIndex]);
  }

  return randomTagsSelection;
};

const mapChallengeToMail = (challenge: ChallengeDto): Mail => {
  const randomTags = [
    "chain-loose",
    "nemesis",
    "hot-strike",
    "hard-stuck",
    "sans-poison-pls...",
  ];

  const labels = getRandomTags(randomTags);

  return {
    id: challenge.id,
    name: challenge.id,
    email: challenge.challenger,
    date: challenge.createdAt,
    subject: "Difficulty: 111 - Reward: 25 manas",
    text: "Have fun - texte du mail de challenge",
    read: challenge.status === "Pending" ? false : true,
    labels,
    challenge: challenge,
  };
};

const mapBattleChallengeTurn = (turn: StateHistoryDto): TurnHistory => {
  const getCardFactory =
    (cards: StateHistoryCard[]) =>
    (actor: string): StateHistoryCard | null =>
      cards.find((c) => c.id === actor);
  const getCard = getCardFactory(
    turn.challengerCards.concat(turn.opponentCards)
  );

  const replaceTargetsByCards = (turnAction: TurnDto) => {
    if (turnAction == null) return null;

    return Object.entries(turnAction.targets).map(([key, stats]) => {
      return {
        key,
        cardName: getCard(key)?.name as string,
        stats: [...stats.map((s) => ({ ...s }))],
      };
    });
  };

  const attackerAction = cloneDeep(turn.attackerAction);
  const defenderAction = cloneDeep(turn.defenderAction);

  return {
    ...turn,
    challengerCards: cloneDeep(turn.challengerCards),
    opponentCards: cloneDeep(turn.opponentCards),
    attackerAction: cloneDeep({
      ...attackerAction,
      actor: getCard(turn.attackerAction?.actor)?.name,
      targets: replaceTargetsByCards(turn.attackerAction),
    }),
    defenderAction: cloneDeep({
      ...defenderAction,
      actor: getCard(turn.defenderAction?.actor)?.name,
      targets: replaceTargetsByCards(turn.defenderAction),
    }),
  };
};

export const mapBattleChallenge = (
  library: Array<CardDto>,
  challenge: ChallengeDto
): ReplayChallengeDto => {
  return {
    id: challenge.id,
    winner: challenge.winner,
    challenger: challenge.challenger,
    opponent: challenge.opponent,
    createdAt: challenge.createdAt,
    resolvedAt: challenge.resolvedAt,
    turns: challenge.stateHistory.map(mapBattleChallengeTurn),
    cardReward: challenge.cardReward,
  };
};

export const CardService = {
  // Retourne les Cards avec toute les informations nécessaires de la carte parente
  mapCardUnit,
  mapCardUnitDto,
  mapChallengeToMail,
  findCard,
  mapCardUnits,
  mapCardUnitDtos: (cardUnits: CardUnit[]): CardUnitDto[] => {
    return cardUnits.map(mapCardUnitDto);
  },
  mapChallengesToMails: (challenges: ChallengeDto[]) =>
    challenges.map(mapChallengeToMail),
  mapReplayChallengeDto: (
    cards: CardDto[],
    challenge: ChallengeDto
  ): ReplayChallengeDto => {
    const challengerCardUnits = mapCardUnits(
      cards,
      challenge.challengerSequence.cards
    )
      .filter((result) => result.isSuccess)
      .map((result) => (result as Success<CardUnit>).value);

    const opponentCardUnits = mapCardUnits(
      cards,
      challenge.opponentSequence.cards
    )
      .filter((result) => result.isSuccess)
      .map((result) => (result as Success<CardUnit>).value);

    const reward = challenge.cardReward
      ? mapCardUnit(
          cards.find((card) => card.cardId === challenge.cardReward.cardId)!,
          challenge.cardReward
        )
      : null;

    return {
      ...challenge,
      challengerSequence: {
        ...challenge.challengerSequence,
        cards: challengerCardUnits,
      },
      opponentSequence: {
        ...challenge.opponentSequence,
        cards: opponentCardUnits,
      },
      cardReward: reward,
      turnHistory: null,
    };
  },
  mapBattleChallenge,
};

export function getCardFromChallenge(
  challenge: ReplayChallengeDto
): CardUnitDto | null {
  return challenge.cardReward;
}
