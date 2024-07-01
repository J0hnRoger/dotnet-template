import { getStatColor, getStatIcon } from "@components/battle/Stat"
import { cn } from "@lib/utils"
import { FC } from "react"
import { ChallengeSkillDto } from "src/types"

interface SkillDescriptionProps {
    skill: ChallengeSkillDto
    active: boolean
}

export const SkillDescription: FC<SkillDescriptionProps> = ({ skill, active }) => {
    return (
        <div className={cn("flex flex-col", { "border border-2 rounded": active })}>
            <div className="flex space-x-4">
                <div>{skill.name}</div>
                <div>{getStatIcon(skill.type.name)}</div>
            </div>
            <div>
                {skill.effects.map((effect, index) => (
                    <div key={index} className="flex mb-2 p-2 space-x-2 items-center">
                        <div>{getStatIcon(effect.targetStat)}</div><div className="">{effect.value}</div>
                        {effect.duration > 1 && <div>durée: {effect.duration} tours</div>}
                    </div>
                ))}
            </div>
        </div>
    )
}