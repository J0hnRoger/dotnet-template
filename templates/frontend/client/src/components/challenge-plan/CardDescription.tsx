import { Stat } from "@components/battle/Stat"
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip"
import { StarIcon } from "lucide-react"
import { FC } from "react"
import { CardUnit, ChallengeSkillDto } from "src/types"
import { SkillDescription } from "./SkillDescription"
import { CardStatDescription } from "./CardStatDescription"

interface CardDescriptionProps {
    card: CardUnit
    selectedSkill: ChallengeSkillDto | null
}

export const CardDescription: FC<CardDescriptionProps> = ({ card, selectedSkill }) => {
    return (
        <div className="flex flex-col rounded-md border-double border-4 border-black min-h-48 m-2 p-2 space-y-2">
            <div className="relative min-h-48">
                <div className="absolute w-full bg-top bg-[url('/images/training-dummy.webp')] min-h-64 rounded-t-md">
                    <div className="flex self-end w-full p-2 min-h-24">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    {Array.from({ length: card.card.level }, (_, index) => (
                                        <StarIcon color="#F5AA19" key={index} />
                                    ))}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="p-1 px-2 rounded-md bg-primary">
                                    niveau de la carte
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="flex flex-col backdrop-blur-xl bg-black/30">
                <div className="text-lg font-bold space-y-2 p-2">
                    <div className="text-center text-3xl">{card.name}</div>
                    <div>PV: {card.card.stats.find(stat => stat.name === "HP").value}</div>
                    <div className="flex space-x-2">
                        {card.card.stats.filter(s => s.name !== "HP").map((stat, index) => (
                            <CardStatDescription key={index} stat={stat} />
                        ))}
                    </div>
                </div>
                <div className="text-lg font-bold">
                    {card.card.skills?.map((skill, index) => (
                        <SkillDescription key={index} skill={{ ...skill, cardId: card.id }} active={skill.name == selectedSkill?.name} />
                    ))}
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}