import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { FC } from "react";
import { CardStats, SkillDto } from "../../types";

interface SkillEditFormProps {
    skill: SkillDto;
    onSkillChange: (skill: SkillDto) => void;
}

export const SkillEditForm: FC<SkillEditFormProps> = ({ skill, onSkillChange }) => {
    return (
        <div>
            <label>Skill name</label>
            <Input
                type="text"
                value={skill.name}
                onChange={(e) => {
                    onSkillChange({ ...skill, name: e.target.value });
                }}
            />

            <div className="flex flex-col ">
                <label>Effects</label>
                {skill.effects.map((effect, index) => (
                    <div key={index} className="flex bg-slate-200 space-x-2">
                        <div className="w-32">
                            <label>Stat</label>
                            <Select onValueChange={(value: CardStats) => {
                                onSkillChange({ ...skill, effects: [...skill.effects.filter(e => e != effect), { ...effect, targetStat: { name: value, value: 0 } }] })
                            }} defaultValue={effect.targetStat.name} >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(CardStats).map((stat: CardStats) => (
                                        <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-16">
                            <label>Value</label>
                            <Input type="text"
                                value={effect.value}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value)
                                    onSkillChange({
                                        ...skill, effects: [...skill.effects.filter(e => e != effect),
                                        { ...effect, value: newValue }]
                                    })
                                }}
                            />
                        </div>
                        <div className="w-16">
                            <label>Duration</label>
                            <Input
                                type="number"
                                value={effect.duration}
                                onChange={(e) => {
                                    onSkillChange({ ...skill, effects: [...skill.effects.filter(e => e != effect), { ...effect, duration: parseInt(e.target.value) }] })
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}