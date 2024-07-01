import { getStatIcon } from "@components/battle/Stat"
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip"
import { StatDto } from "../../types"
import { FC } from "react"
import { cn } from "@lib/utils"

export interface StatProps {
    stat: StatDto
}

export const CardStatDescription: FC<StatProps> = ({ stat }) => {

    const statIcon = getStatIcon(stat.name)
    return <Tooltip>
        <TooltipTrigger asChild>
            <div className={cn("flex z-20")}>
                {statIcon} | {stat.value}
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <div className="p-1 px-2 rounded-md bg-primary">
                {stat.name}
            </div>
        </TooltipContent>
    </Tooltip>
}