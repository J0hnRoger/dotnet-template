import { FC, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@lib/utils"
import { Stat } from "./Stat"
import { TurnCard } from "./BattleCard"

interface BattleCardContentProps {
    turnCard: TurnCard
}

export const cardVariants = {
    initial: { y: 0, scale: 1, color: "#000" },
    pvlost: {
        transition: { duration: 0.4, delay: 1 },
        scale: [1, 1.2, 1],
        y: [0, -60, 0],
        color: ["#000", "#f00", "#000"]
    },
    pvgain: {
        transition: { duration: 0.4, delay: 1 },
        scale: [1, 1.2, 1],
        y: [0, -60, 0],
        color: ["#000", "rgb(74 222 128)", "#000"]
    }
}

function getHP(card: TurnCard): number {
    const hp = card?.stats.find(s => s.name == "HP").value
    return hp
}

export const BattleCardContent: FC<BattleCardContentProps> = ({ turnCard }) => {
    const [hp, setPv] = useState(getHP(turnCard) ?? 10000000)
    const [animation, setAnimation] = useState("initial")
    const [initialPv] = useState(turnCard.stats[0])

    useEffect(() => {
        const newHp = getHP(turnCard)
        if (newHp !== hp) {
            if (newHp < hp)
                setAnimation("pvlost")

            if (newHp > hp)
                setAnimation("pvgain")
        } else
            setAnimation("initial")

    }, [hp, turnCard])

    const updatePv = () => {
        setPv(getHP(turnCard))
    }

    return (<div className={cn(`relative flex flex-col bg-white rounded-md border-double border-4 border-black min-h-48 m-2 p-2 text-black`)
    }>
        <div className="flex justify-center p-2 font-medium ">{turnCard.name}</div>
        <div className="flex flex-col">
            {/* <motion.div variants={cardVariants}
                animate={animation}
                onAnimationComplete={updatePv}>
                PV: {hp} ({initialPv.value})
            </motion.div> */}
            <motion.div>
                <div>
                    <Stat stat={turnCard.stats.find(s => s.name == "HP")} />
                </div>
                <div className="border-t-2 py-2">
                    {turnCard.stats.filter(s => s.name != "HP").map((stat, index) => (
                        <Stat key={index} stat={stat} />
                    ))}
                </div>
            </motion.div>
        </div>
    </div >)
}