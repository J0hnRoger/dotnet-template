import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { AudioLines, Biohazard, EyeOff, Flame, Hand, Rainbow } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { CardColors, StatDto } from "../../types"
import { motion } from "framer-motion"
import { cardVariants } from "./BattleCardContent"
import { cn } from "@lib/utils"

export interface StatProps {
    stat: StatDto
}

export function getStatColor(statName: string): string {
    let color = CardColors.Physique
    Object.keys(CardColors).forEach((key) => {
        if (statName == key) {
            color = CardColors[key]
            return;
        }
    });
    return color
}

export function getStatIcon(statName: string) {
    let statIcon = null
    switch (statName) {
        case "Thermique":
            statIcon = <Flame className="text-red-400"></Flame>
            break;
        case "Psychique":
            statIcon = <Rainbow className="text-violet-400"></Rainbow>
            break;
        case "Chimique":
            statIcon = <Biohazard className="text-green-400"></Biohazard>
            break;
        case "Sonore":
            statIcon = <AudioLines className="text-blue-400"></AudioLines>
            break;
        case "Optique":
            statIcon = <EyeOff className="text-orange-400"></EyeOff>
            break;
        case "HP":
            statIcon = <div>HP</div>
            break;
        default:
            statIcon = <Hand></Hand>
    }
    return statIcon
}

export const Stat: FC<StatProps> = ({ stat }) => {
    const [original] = useState<StatDto>(stat)
    const [current, setCurrent] = useState<StatDto>(stat)
    const [animation, setAnimation] = useState("initial")
    const [previous, setPrevious] = useState<StatDto | null>(null)

    const statIcon = getStatIcon(stat.name)

    useEffect(() => {
        if (stat.value !== current.value) {
            if (stat.value < current.value) {
                setAnimation("pvlost")
            }

            if (stat.value > current.value) {
                setAnimation("pvgain")
            }
        } else {
            setAnimation("initial")
        }

    }, [stat])

    const updateStat = () => {
        setPrevious(current)
        setCurrent(stat)
    }

    const getStatDiff = (next: number, prev: number): string => {
        if (prev == null || next == null)
            return `${original.value}`
        if (next === prev)
            return `${next}`
        const sign = next > prev ? "+" : "-"
        return `${sign}${prev - next}`
    }
    return (
        <div>
            <motion.div variants={cardVariants}
                animate={animation}
                onAnimationComplete={updateStat}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn("flex z-20", {
                            "text-red": previous != null && current.value < previous.value,
                            "text-green-400": previous != null && current.value > previous.value
                        })} >
                            {statIcon} | {stat.value} ({getStatDiff(current?.value, previous?.value)})
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="p-1 px-2 rounded-md bg-primary">
                            {stat.name}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </motion.div>
        </div>
    )
}
