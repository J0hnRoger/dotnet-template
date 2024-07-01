import { FC } from "react";
import { CardUnit, SkillDto } from "../types";

interface CardSlotProps {
    number: number;
    cardUnit: CardUnit;
    onCardClicked?: () => void;
    onCardOver?: (card: CardUnit) => void;
    onSkillOver?: (skill: SkillDto, card: CardUnit) => void;
    onSkillClicked?: (skill: SkillDto, card: CardUnit) => void;
}

export const EmptySlot: FC = () => {
    return <div className={`flex flex-col rounded-md border-2 border-white border-dotted bg-gray-500 w-32 h-48 m-2 text-black`}>
        <div className="flex items-end relative w-full">
            <div className="absolute -top-4 text-white w-full">
            </div>
        </div>
        <div className="flex justify-center items-center flex-1">
            ?
        </div>
    </div >
}

export const CardSlot: FC<CardSlotProps> = ({ number, cardUnit, onCardOver, onCardClicked, onSkillOver, onSkillClicked }) => {
    const selectedClass = cardUnit != null ? "bg-green-500 font-bold" : "bg-gray-500";
    const handleSkillClicked = (evt: React.MouseEvent<HTMLElement>, skill, card: CardUnit) => {
        onSkillClicked && onSkillClicked(skill, card);
        evt.stopPropagation();
    }

    return <div onClick={onCardClicked} onMouseOver={() => onCardOver && onCardOver(cardUnit)} onMouseOut={() => onCardOver && onCardOver(null)} className={`flex flex-col rounded-md border-2 border-white border-dotted bg-gray-500 w-32 h-48 m-2 text-black ${selectedClass}`}>
        <div className="flex items-end relative w-full">
            <div className="absolute -top-4 text-white w-full">
                <div className="flex w-full items-center justify-center">
                    {cardUnit?.card.skills.map((skill, index) => (
                        <div key={index} onClick={(evt) => handleSkillClicked(evt, skill, cardUnit)}
                            onMouseOver={() => {
                                onSkillOver && onSkillOver(skill, cardUnit)
                            }}
                            onMouseOut={() => onSkillOver && onSkillOver(null, cardUnit)}
                            className="z-10 cursor-pointer flex bg-indigo-500 p-2 mx-2" >
                            <div>{skill.name[0]}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex justify-center items-center flex-1">
            {(cardUnit != null ? <p>{cardUnit.name}</p> : <p>Slot {number}</p>)}
        </div>
    </div >
} 