import { FC } from 'react';
import { ChallengeSkillDto } from '../types';

interface SequenceProps {
    sequence: ChallengeSkillDto[];
    onSkillOver?: (skill: ChallengeSkillDto) => void;
    onSkillClicked?: (skill: ChallengeSkillDto) => void;
}

export const Sequence: FC<SequenceProps> = ({ sequence, onSkillClicked, onSkillOver }) => {
    return (
        <div className="flex" >
            <div className="flex justify-center p-2 font-medium ">Séquence</div>
            <div className="flex cursor-pointer">
                {sequence.map((skill, index) => (
                    <div key={index}
                        onMouseOver={() => onSkillOver && onSkillOver(skill)}
                        onMouseOut={() => onSkillOver && onSkillOver(null)}
                        onClick={() => onSkillClicked && onSkillClicked(skill)}
                    >
                        <div className='text-white p-2'>
                            {index}
                        </div>
                        <div key={index} className="bg-white rounded-md border-double border-4 border-black text-black p-2 mr-8">
                            <p>{skill.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}