import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";
import { BattleCardContent } from "./BattleCardContent";
import { Sounds } from "./useSound";
import { SkillDisplay } from "./SkillDisplay";
import { TurnSkill } from "./types";
import { StatDto } from "../../types";
import { SpellCanvas } from "./SpellCanvas";

export type Side = 'attacker' | 'defender'

export type Position = 1 | 2 | 3

export type Effect = {
    spellId: string,
    type: string,
    affectedStats: StatDto[]
}

export interface TurnCard {
    id: string
    name: string
    position: Position
    side: Side
    owner: string
    stats: StatDto[]
    spell: TurnSkill
    // Effets subis par la carte à ce tour
    appliedEffects: Effect[]
}

export interface BattleCardProps {
    side: Side
    card: TurnCard
}

export type TurnPosition = { rowStart: Position, colStart: Position }

// Calculer la position de départ en ligne et en colonne en fonction de la position et du côté
const getTurnCardPosition = (position, side): TurnPosition => {
    let rowStart, colStart;
    switch (position) {
        case 1:
            rowStart = 1;
            colStart = side === 'attacker' ? 1 : 2;
            break;
        case 2:
            rowStart = 2;
            colStart = side === 'attacker' ? 2 : 1;
            break;
        case 3:
            rowStart = 3;
            colStart = side === 'attacker' ? 1 : 2;
            break;
        default:
            rowStart = 2; // Position par défaut au milieu
            colStart = side === 'attacker' ? 1 : 2;
    }
    return { rowStart, colStart }
}

export const BattleCard: React.FC<BattleCardProps> = ({ side, card }) => {
    const [animateDeadCard, setAnimateDeadCard] = useState(false);
    const [isAttacking, setIsAttacking] = useState(false);

    const { rowStart, colStart } = getTurnCardPosition(card.position, side);

    const pv = card.stats[0]?.value
    const isDead = pv <= 0;

    const variants = {
        initial: { rotate: 0 },
        attackattacker: {
            transition: { duration: 0.3, delay: 1 },
            rotate: [0, 45, 0],
            x: [0, 200, 0]
        },
        attackdefender: {
            transition: { duration: 0.3, delay: 1 },
            rotate: [0, -45, 0],
            x: [0, -200, 0]
        },
        dead: {
            transition: { duration: 0.3, delay: 1 },
            rotate: [0, 360],
            scale: [1, 0, 1]
        },
        pvLost: {
            transition: { duration: 0.3, delay: 1 },
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            color: ["black", "red", "black"]
        }
    }

    useEffect(() => {
        if (!card)
            return

        if (card && card.spell !== null) {
            const timer = setTimeout(() => {
                setIsAttacking(true)
            }, 1200)
            return () => clearTimeout(timer);
        } else {
            setIsAttacking(false)
        }
    }, [card]);

    useEffect(() => {
        if (isDead) {
            // Appliquez un délai avant de déclencher l'animation DeadCard
            const timer = setTimeout(() => {
                setAnimateDeadCard(true);
            }, 1000); // Délai d'1 seconde

            return () => clearTimeout(timer);
        }
    }, [isDead]);

    const isTarget = card.appliedEffects.length > 0
    const allyEffect = isTarget && card.appliedEffects[0].affectedStats.some(s => s.value > 0)
    const animating = (card.spell != null && card.spell.name !== "No Skill" && !allyEffect)
        ? "attack" + card.side
        : isDead ? "dead"
            : "initial"

    const sound: Sounds = allyEffect ? "heal" : "fire"

    return (
        <div
            style={{
                gridColumnStart: colStart,
                gridRowStart: rowStart,
            }}>
            <div className="relative">
                {isAttacking && <div className="absolute -top-48 left-20 z-10 w-full">
                    <SkillDisplay skill={card.spell} />
                </div>}
                {isTarget && <div className="absolute flex justify-center pb-2 w-48 -top-10">
                    <div className="w-6 h-6 rounded bg-blue rotate-45">
                        <span className="animate-ping inline-flex h-full w-full rounded bg-blue opacity-75"></span>
                    </div>
                </div>}
            </div>
            <motion.div
                animate={animating}
                variants={variants}
                layout="position"
                transition={{ ease: "easeOut", duration: 0.8 }}
            >
                <div >
                    <div
                        className={cn(`border-2 rounded-md border-sky-400`, {
                            'bg-green-400': card.spell != null && !isDead,
                            'bg-grey-400': isDead,
                        })}
                    >
                        {card && isDead && animateDeadCard && <DeadCard card={card}></DeadCard>}
                        {
                            // @ts-ignore
                            card && !animateDeadCard && (
                                <div className="relative">
                                    { /** <CanvaAnimator delay={1000} play={card.target && spell.name != "No Skill"}
                                        animation={animation} sound={sound} /> **/}
                                    <SpellCanvas play={card.appliedEffects.length > 0 || card.spell != null}
                                        delay={1000} sound={sound} spell={card.spell} />
                                    <BattleCardContent turnCard={card} />
                                </div>
                            )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const DeadCard = ({ card }) => {
    return (
        <motion.div
            className="flex flex-col bg-grey-400 rounded-md border-double border-4 border-black min-h-48 m-2 p-2 text-red-400">
            <div className="flex justify-center p-2 font-medium ">Dead</div>
            <div className="flex flex-col">
                <div className="pb-2 flex justify-center">
                    {card.name}
                </div>
            </div>
        </motion.div>
    )
}
