import { FC } from 'react';
import { CardUnit } from '../types';
import style from './CardShowCase.module.css'
import { Tag } from './Tag';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';


interface CardShowCaseProps {
    cardUnit: CardUnit
}

export const CardShowCase: FC<CardShowCaseProps> = ({ cardUnit }) => {

    const getVSText = (card) => {
        if (card.challengeId == null)
            return ""
        const challenger = card.challengeId.split("-")[0].trim();
        const opponent = card.challengeId.split("-")[1].trim();
        return (<Tooltip>
                <TooltipTrigger>utilisé dans {challenger} VS {opponent}</TooltipTrigger>
                <TooltipContent>
                    {card.challengeId}
                </TooltipContent>
            </Tooltip>);
    }

    const getSideText = (side: "allies" | "opponents" | "both" | "self") => {
        switch (side) {
            case "allies":
                return (<span className="text-green-400">"Alliés"</span>)
            case "opponents":
                return (<span className="text-red-400">Adversaires</span>)
            case "both":
                return (<span className="text-yellow-400">Les deux camps</span>)
            case "self":
                return (<span className="text-blue-400">Soi-même</span>)
        }
    }

    return <div className={style.card}>
        <header>
            <div className='flex space-between max-x-4'>
                <div className='flex flex-grow'>
                    <h2>{cardUnit.name}</h2>
                </div>
                {cardUnit.challengeId && <Tag>
                    <>{getVSText(cardUnit)}</></Tag>
                }
            </div>
            <div>
                <p className='text-green-400'>PV: {cardUnit.card?.stats.find(s => s.name == "HP").value}</p>
                {cardUnit.card.skills.map((skill, index) => (
                    <div key={index} className="py-4">
                        <p className="font-bold text-blue-400">{skill.name}</p>
                        {skill.effects && skill.effects.map((effect) => {
                            return (
                                <div className='flex flex-col'>
                                    { /* @ts-ignore */}
                                    <div>{effect.targetStat}: {effect.value}</div>
                                    {effect.duration > 1 &&
                                        <div>Duration: {effect.duration}</div>
                                    }
                                    <div>Cible: {effect.targetActor} ({getSideText(effect.side)})</div>
                                </div>)
                        })}
                        <div>Position: {(skill.positioning[0] != null) ? "Contact" : "Distance"}</div>
                    </div>
                ))}
            </div>
        </header >
    </div >;
};