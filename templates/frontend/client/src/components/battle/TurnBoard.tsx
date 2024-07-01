import { motion } from "framer-motion"
import { BattleCard, TurnCard } from "./BattleCard"

export interface TurnBoard {
    index: number
    cards: TurnCard[]
}

export interface TurnBoardProps {
    previousTurn: TurnBoard
    turn: TurnBoard
}

export const TurnBoardComponent: React.FC<TurnBoardProps> = ({ turn }) => {

    const containerVariants = {
        attack: { transition: { staggerChildren: 0.5 } }
    }

    if (turn == null)
        return

    return (
        <>
            <motion.div variants={containerVariants} className='w-full grid grid-cols-2 grid-rows-3 gap-6'>
                {turn.cards.filter(c => c.side == "attacker").map((card, index) => (
                    <BattleCard key={index} side={"attacker"} card={card} />
                ))}
            </motion.div>

            <motion.div variants={containerVariants} className='w-full h-full grid grid-cols-2 grid-rows-3 gap-6'>
                {turn.cards.filter(c => c.side == "defender").map((card, index) => (
                    <BattleCard key={index} side={"defender"} card={card} />
                ))}
            </motion.div>
        </>
    )
}