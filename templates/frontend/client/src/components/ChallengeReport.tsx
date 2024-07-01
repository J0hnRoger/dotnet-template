import { FC } from "react";
import { ChallengeDto, ReportStateHistoryDto, ReportTurnDto, StateHistoryCard, StateHistoryDto, TurnDto } from "../types";
import { cn } from "@lib/utils";
import { useCardDna } from "../CardDnaContext";

export interface ReportProps {
    challenge: ChallengeDto
}

const getTurnReport = (turn: StateHistoryDto): ReportStateHistoryDto => {
    const getCardFactory = (cards: StateHistoryCard[]) => (actor: string): StateHistoryCard | null => cards.find(c => c.id === actor)
    const getCard = getCardFactory(turn.challengerCards.concat(turn.opponentCards))

    const replaceTargetsByCards = (turnAction: TurnDto) => {
        if (turnAction == null)
            return null

        return Object.entries(turnAction.targets)
            .map(([key, stats]) => {
                return { key, cardName: getCard(key)?.name as string, stats }
            })
    }

    return {
        ...turn,
        attackerAction: {
            ...turn.attackerAction,
            actor: getCard(turn.attackerAction?.actor)?.name,
            targets: replaceTargetsByCards(turn.attackerAction)
        },
        defenderAction: {
            ...turn.defenderAction,
            actor: getCard(turn.defenderAction?.actor)?.name,
            targets: replaceTargetsByCards(turn.defenderAction)
        }
    }
}

export const ChallengeReport: FC<ReportProps> = ({ challenge }) => {
    const { userProfile } = useCardDna()

    const turns = challenge?.stateHistory.map(getTurnReport)

    if (challenge == null)
        return;

    return (<div className="flex flex-col p-6 mt-4 bg-gray-800 text-white rounded-md shadow-md h-[80vh]	overflow-auto">
        <div className="flex justify-between mb-4">
            <div className="text-xl font-bold">
                Combat Log:
            </div>
            <div className="flex px-8 space-x-2">
                <div className="bg-red-400 px-2 rounded">Vous</div>
                <div className="bg-slate-400 px-2 rounded">{challenge.challenger == userProfile.login ? challenge.opponent : challenge.challenger}</div>
            </div>
        </div>

        <pre className="font-mono text-sm">
            <InitialStateReport turn={challenge.stateHistory[0]} isChallenger={userProfile.login == challenge.challenger} />
            {challenge && turns.slice(1).map((turn, index) => (
                <ChallengeReportTurn key={index} turn={turn} player={userProfile.login} />
            ))}
            <LastStateReport challenge={challenge} currentPlayer={userProfile.login} />
        </pre>
    </div>)
}

interface InitialTurn {
    turn: StateHistoryDto
    isChallenger: boolean
}

const InitialStateReport: FC<InitialTurn> = ({ turn, isChallenger }) => {
    return (
        <div>
            <div className="flex mb-8">
                <span className={cn("flex font-bold", { "text-red-400": isChallenger, "text-gray-400": !isChallenger })}>
                    {turn.challengerCards.map(card => {
                        return <div key={card.id} className="flex flex-col border border-solid border-1 border-black px-1 mx-2">
                            <div className="">{card.name}: </div>
                            {card.stats.map((s, index) =>
                                <div className="border border-solid border-1 border-black px-1 mx-2" key={index}>{s.name}: {s.value}</div>)}
                        </div>
                    })}
                </span>
                <div className="px-4">
                    vs
                </div>
                <span className={cn("flex font-bold", { "text-red-400": !isChallenger, "text-gray-400": isChallenger })}>
                    {turn.opponentCards.map(card => {
                        return <div key={card.id} className="flex flex-col border border-solid border-1 border-black px-1 mx-2">
                            <div className="">{card.name}: </div>
                            {card.stats.map((s, index) =>
                                <div className="border border-solid border-1 border-black px-1 mx-2" key={index}>{s.name}: {s.value}</div>)}
                        </div>
                    })}
                </span>
                <div className="flex">
                </div>
            </div>
        </div>
    )
}

interface ChallengeTurnProps {
    turn: ReportStateHistoryDto
    player: string
}

const ChallengeReportTurn: FC<ChallengeTurnProps> = ({ turn, player }) => {
    return (
        <div>
            {turn.attackerAction.actor != null &&
                <ChallengeReportRow turnAction={turn.attackerAction} player={player} />}

            {turn.attackerAction.actor != null &&
                <BoardStateReportRow turn={turn} action={turn.attackerAction} />}
            {turn.defenderAction.actor != null &&
                <ChallengeReportRow turnAction={turn.defenderAction} player={player} />}

            {turn.defenderAction.actor != null &&
                <BoardStateReportRow turn={turn} action={turn.defenderAction} />}
        </div>
    )
}

const BoardStateReportRow = ({ turn, action }) => {
    return (<div className="flex flex-col">
        <div className="flex flex-col justify-between">
            <div className="font-bold">turn {turn.turnIndex}</div>
            <div>
                {action.targets.map(t => {
                    const card = turn.challengerCards.find(c => c.id === t.key) || turn.opponentCards.find(c => c.id === t.key)
                    return <div key={t.id} className="flex flex-col border boder-1">
                        <div className="flex ">
                            <div className="text-md">{t.cardName}: </div>
                            {card.stats.map((s, index) =>
                                <div className="border border-solid border-1 border-black px-1 mx-2" key={index}>{s.name}: {s.value}</div>)}
                        </div>
                    </div>
                })}
                {action.targets.map(t => {
                    const card = turn.challengerCards.find(c => c.id === t.key) || turn.opponentCards.find(c => c.id === t.key)
                    if (card.stats.find(s => s.name === "HP")?.value <= 0)
                        return (<div key={t.id} className="flex p-1 rounded bg-black">
                            <div className="flex ">
                                <div className="text-md">{t.cardName} is dead </div>
                            </div>
                        </div>)
                })}
            </div>
        </div>
    </div>)
}

interface ReportRow {
    turnAction: ReportTurnDto
    player: string
}

const ChallengeReportRow: FC<ReportRow> = ({ turnAction, player }) => {
    if (turnAction.spell.effects.length == 0)
        return (
            <>
                <div className={cn("p-1 rounded", {
                    "bg-red-400": turnAction.player === player,
                    "bg-slate-400": turnAction.player !== player
                })}>
                    <div>{turnAction.actor} ne fait rien</div>
                </div>
            </>
        )
    const effectText = turnAction.spell.effects.length == 0 ? "Pas d'effet" : turnAction.spell.effects
        .filter((effect) => effect.targetStat.name != "HP")
        .map((effect) => `${effect.targetStat.name}: ${effect.value}`)
        .join(", ");

    const targetDamagesText = `${turnAction.targets.map(t => t.stats.find(s => s.name === "HP")?.value).join(', ')} PV`

    const pureDamageText = `(${turnAction.spell.effects.find(e => e.targetStat.name === "HP")?.value}PV)` ?? ""

    return (
        <>
            <div className={cn("p-1 rounded", {
                "bg-red-400": turnAction.player === player,
                "bg-slate-400": turnAction.player !== player
            })}>
                <div>{turnAction.actor} used {turnAction.spell.name} {pureDamageText} and reduce {effectText} and caused {targetDamagesText} damages to {turnAction.targets.map(t => t.cardName).join(', ')}</div>
            </div>
        </>
    )
}


interface LastTurn {
    challenge: ChallengeDto
    currentPlayer: string
}

const LastStateReport: FC<LastTurn> = ({ challenge, currentPlayer }) => {
    const isWinner = challenge.winner === currentPlayer
    return (
        <div>
            <div className="flex flex-col mb-8 ">
                <div className={cn("flex p-1 rounded font-bold", { "bg-red-400": !isWinner, "bg-green-400": isWinner })}>
                    {isWinner && "Vous avez gagné"}
                    {!isWinner && "Vous avez perdu"}
                </div>
                {challenge.cardReward && <div>Carte perdue: {challenge.cardReward.name}</div>}
                {!challenge.cardReward && <div>pas de cartes en jeu</div>}
                <div>Mana gagné: {"TODO"}</div>
            </div>
        </div>
    )
}