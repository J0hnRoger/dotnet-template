import { FC, useState } from "react";
import { CardUnit } from "../types";
import { cn } from "@lib/utils";
import { Badge } from "./ui/badge";
import { PinIcon, PinOff } from "lucide-react";

interface CardProps {
    cardUnit: CardUnit
    onClick?: () => void
    onCardEnter?: () => void
    onCardLeave?: () => void
    withSkills?: boolean
    disabled?: boolean
    onPin?: (pinned: boolean) => void
}

export const Card: FC<CardProps> = ({ cardUnit, onCardEnter, onCardLeave, onClick, disabled = false, withSkills = true, onPin }) => {
    const [pv] = useState(cardUnit?.pv ?? 10000000)
    const [pinned, setPin] = useState(false)

    const disabledClasses = disabled || cardUnit.lost ? "opacity-50 pointer-events-none" : "cursor-pointer;";

    const togglePin = (ev) => {
        const newPin = !pinned
        setPin((old) => !old)
        ev.stopPropagation()
        onPin && onPin(newPin)
    }

    return (<div onMouseEnter={onCardEnter} onMouseLeave={onCardLeave} onClick={onClick} className={cn(`relative flex flex-col bg-white rounded-md border-double border-4 border-black min-h-48 m-2 p-2 text-black`, disabledClasses, {
        "border-green-500 border-8": cardUnit.new,
        "border-red-500 border-8": cardUnit.lost
    })
    }>
        {cardUnit.new && <div className="absolute top-[-20px] right-0"><Badge>New</Badge></div>}
        {cardUnit.lost && <div className="absolute top-[-20px] right-0"><Badge>Lost</Badge></div>}
        {onPin && <div onClick={togglePin} className="z-10 flex justify-end">{pinned ? <PinOff /> : <PinIcon />}</div>}
        <div className="flex justify-center p-2 font-medium ">{cardUnit.name}</div>
        <div className="flex flex-col">
            PV: {pv}
            <div className="border-t-2 py-2"></div>
            {withSkills && cardUnit.card.skills?.map((skill, index) => (
                <div key={index} className="text-green-400">
                    <p>{skill.name}</p>
                </div>
            ))}

        </div>
    </div >)
}
