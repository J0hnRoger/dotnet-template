import { FC } from "react"
import { TurnSkill } from "./types"
import { glassEffect } from "../../pages/MapPage"
import { getStatIcon } from "./Stat"

export interface SkillDisplayProps {
    skill: TurnSkill
}

export const SkillDisplay: FC<SkillDisplayProps> = ({ skill }) => {

    if (!skill)
        return

    return (
        <div className='flex justify-center bottom-0 p-2 bg-red'>
            <div className='flex flex-col items-center p-8 text-black font-medium ml-[-30%]' style={glassEffect}>
                <div className='flex space-x-2 font-bold'>
                    <div>{getStatIcon(skill.type.name)}</div><div>{skill.name}</div>
                </div>
                <div>
                    {skill.effects.map(e => (<div>{e.targetStat.name} : {e.value}</div>))}
                </div>
            </div>
        </div>
    )
}
