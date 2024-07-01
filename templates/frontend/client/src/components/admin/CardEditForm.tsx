import { useState } from "react";
import { CardDto, CardStats, SkillDto, StatDto } from "../../types";
import { SkillEditForm } from "./SkillEditForm";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { StatEditForm } from "./StatEditForm";
import { useCardDna } from "../../CardDnaContext";

interface CardEditFormProps {
    card: CardDto;
}

export const CardEditForm: React.FC<CardEditFormProps> = ({ card }) => {
    const { updateCard } = useCardDna();
    const [updatingCard, setUpdatingCard] = useState<CardDto>(card);

    const omittedKeys = ["cardId", "createdAt", "updatedAt"];

    const handleStatChange = (updatingStat: StatDto) => {
        setUpdatingCard({ ...updatingCard, stats: updatingCard.stats.map((stat) => stat.name === updatingStat.name ? updatingStat : stat) });
    };

    const handleSkillChange = (updatingSkill: SkillDto) => {
        setUpdatingCard({ ...updatingCard, skills: updatingCard.skills.map((skill) => skill.name === updatingSkill.name ? updatingSkill : skill) });
    };

    const handleSave = (updatingCard: CardDto) => {
        console.info("Updating card", updatingCard)
        updateCard(updatingCard)
    };

    return (
        <div className="flex flex-col bg-white rounded-md border-double border-4 border-black min-h-48 w-auto m-2 p-2 text-black">
            {Object.entries(updatingCard)
                .filter(([key]) => !omittedKeys.includes(key))
                .map(([key, value]) => {
                    switch (key) {
                        case "skills":
                            return (
                                <div key={key} className="flex flex-col">
                                    <label htmlFor={key}>{key}</label>
                                    {value.map((skill: SkillDto) => (
                                        <SkillEditForm skill={skill} onSkillChange={handleSkillChange} />
                                    ))}

                                    <Button onClick={() => { }}>Add new Skill</Button>
                                </div>
                            );
                        case "stats":
                            return (
                                <div key={key} className="flex flex-col">
                                    <label htmlFor={key}>{key}</label>
                                    {value.map((stat: StatDto) => (
                                        <StatEditForm stat={stat} onStatChange={handleStatChange} />
                                    ))}
                                    <span className="text-blue-400">Somme des resistances:{value.filter(s => s.name != CardStats.HP).reduce((p, n) => p + n.value, 0)}</span>
                                </div>
                            );
                        default:
                            return (
                                <div key={key} className="flex flex-col">
                                    <label htmlFor={key}>{key}</label>
                                    <Input
                                        id={key}
                                        type="text"
                                        value={value}
                                        onChange={(e) => {
                                            const updatingCard = { ...card, [key]: e.target.value };
                                            setUpdatingCard(updatingCard);
                                        }}
                                    />
                                </div>
                            );
                    }
                })}
            <Button onClick={() => {
                handleSave(updatingCard);
            }}>Save</Button>
        </div>)
}
