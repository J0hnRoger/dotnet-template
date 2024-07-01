import { cloneDeep } from "lodash";
import { TurnBoard } from "@components/battle/TurnBoard";
import { CardUnit, SkillSequenceDto } from "../types";
import { ReplayChallengeDto, TurnAction } from "@components/battle/types";
import {
  Effect,
  Position,
  Side,
  TurnCard,
} from "@components/battle/BattleCard";

const getCardPv = (cardUnit) => {
  return cardUnit.stats.find((s) => s.name == "HP").value;
};

export type CardPositions = 1 | 2 | 3;

export function getInitialTurn(challenge: ReplayChallengeDto): TurnBoard {
  const firstTurn = challenge.turns[0];

  const attackerCards = firstTurn.challengerCards.map((c, idx) => ({
    ...c,
    side: "attacker" as Side,
    pv: getCardPv(c),
    owner: challenge.challenger,
    position: (idx + 1) as Position,
    spell: null,
    appliedEffects: [],
  }));

  // La carte en 1er est la carte en position 2 - frontline
  const ordered: Position[] = [2, 1, 3];
  const defenderCards = firstTurn.opponentCards.map((c, idx) => ({
    ...c,
    side: "defender" as Side,
    pv: getCardPv(c),
    owner: challenge.opponent,
    position: ordered[idx],
    spell: null,
    appliedEffects: [],
  }));

  const allCards = defenderCards.concat(attackerCards);

  return {
    index: 0,
    cards: allCards,
  };
}

export function createGameTurns(
  originalCards: TurnCard[],
  challenge: ReplayChallengeDto
): TurnBoard[] {
  const turnStates = [];
  const allCards = originalCards.map((c) => cloneDeep(c));

  // Pour tous les turns, on doit afficher 2 attaques: l'attacker et le defender
  challenge.turns.slice(1).forEach((turn, index) => {
    const mapCardsToTurnCard =
      (action: TurnAction) =>
      (cardUnit: TurnCard): TurnCard => {
        const targetEffects = action.targets?.find((t) => t.key == cardUnit.id);
        const attackerSpell =
          action.spell.cardId == cardUnit.id ? action.spell : null;
        const appliedEffects = [];
        if (targetEffects != null) {
          const effect: Effect = {
            spellId: action.spell.name,
            type: action.spell.type.name,
            affectedStats: targetEffects.stats,
          };
          appliedEffects.push(effect);

          // update cardUnit stat
          targetEffects.stats.map((targetedStat) => {
            const impacted = cardUnit.stats.find(
              (s) => targetedStat.name == s.name
            );
            if (impacted != null) {
              impacted.value += targetedStat.value;
            }
          });
        }

        return {
          id: cardUnit.id,
          position: cardUnit.position,
          name: cardUnit.name,
          side: cardUnit.side,
          owner: cardUnit.owner,
          spell: attackerSpell,
          appliedEffects,
          stats: cardUnit.stats.map((c) => cloneDeep(c)),
        };
      };

    const generateStateForAction = (turnAction: TurnAction) => {
      const turnCards = allCards.map(mapCardsToTurnCard(turnAction));
      // Swap cards positions if needed
      const challengerFrontline = allCards.find(
        (c) => c.side == "attacker" && c.position == 2
      );

      const opponentFrontline = allCards.find(
        (c) => c.side == "defender" && c.position == 2
      );

      const actualFrontline =
        turnAction.player == challenge.challenger
          ? challengerFrontline
          : opponentFrontline;

      const attacker = turnCards.find(
        (c) => c.spell != null && c.owner == turnAction.player
      );

      if (attacker && attacker.name !== actualFrontline.name) {
        // màj cards positions
        actualFrontline.position = attacker.position;
        const newFrontline = allCards.find(
          (c) => c.owner == turnAction.player && c.name === turnAction.actor
        );
        newFrontline.position = 2;
        // màj turnCards positions
        const actualFrontlineTurn = turnCards.find(
          (c) =>
            c.name === actualFrontline.name && c.owner === turnAction.player
        );
        actualFrontlineTurn.position = attacker.position;
        attacker.position = 2;
      }

      const turnState = {
        index: index + 1,
        cards: turnCards,
      };
      return turnState;
    };

    turnStates.push(generateStateForAction(turn.attackerAction));
    turnStates.push(generateStateForAction(turn.defenderAction));
  });

  return turnStates;
}

const reorderCardsWithPositions = (
  firstSpell: SkillSequenceDto | null,
  cards
): (TurnCard & CardUnit)[] => {
  if (firstSpell === null) return cards;

  const isFrontline = (card: CardUnit): boolean => card.id == firstSpell.cardId;
  const frontlineCard = cards.find(isFrontline);

  if (frontlineCard && frontlineCard.position !== 2) {
    const currentFrontline = cards.find(
      (c) => c.position === 2 && c.id !== frontlineCard.id
    );
    currentFrontline.position = frontlineCard.position;
    frontlineCard.position = 2;
  }

  return cards;
};
