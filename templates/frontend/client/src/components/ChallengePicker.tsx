import { FC } from "react"

import { CardSlot, EmptySlot } from "../components/CardSlot";
import { CardUnit, ChallengeDto, ChallengeSkillDto, SkillDto } from "../types";
import { Sequence } from "../components/Sequence";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

interface ChallengePickerProps {
    challenge?: ChallengeDto
    selectedCards: CardUnit[]
    onCardOver: (card: CardUnit) => void
    onCardDeselect: (card: CardUnit) => void
    selectedSequence: ChallengeSkillDto[]
    onSkillOver: (skill: SkillDto, card: CardUnit) => void;
    onSkillSelected: (skill: ChallengeSkillDto, card: CardUnit) => void;
    onSkillRemoved: (skill: ChallengeSkillDto) => void;
}

export const ChallengePicker: FC<ChallengePickerProps> = ({ selectedCards, onCardOver,
    onCardDeselect, selectedSequence, onSkillOver, onSkillSelected, onSkillRemoved }) => {

    const handleSkillSelected = (skill: ChallengeSkillDto, card: CardUnit) => {
        onSkillSelected && onSkillSelected(skill, card)
    }

    const handleDeselect = (card: CardUnit | null) => {
        if (card == null)
            return;

        onCardDeselect(card)
    }

    const showSequence = selectedCards.length === 3;

    return (
        <div className="overflow-y-hidden h-full">
            {<div className="flex">
                {showSequence && <Sequence sequence={selectedSequence} onSkillClicked={onSkillRemoved}></Sequence>}
            </div>}
            <div className="flex flex-col">
                <div className="flex justify-center mb-8">
                    <div className="flex w-4/6 h-128 justify-center space-x-6 items-start">
                        <div className="slot">
                            <EmptySlot />
                        </div>
                        <div className="slot self-end mt-12">
                            <EmptySlot />
                        </div>
                        <div className="slot">
                            <EmptySlot />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex justify-center mb-8">
                    <div className="flex w-4/6 h-128 justify-center space-x-6 items-end">
                        <div className="slot">
                            <CardSlot
                                onCardOver={onCardOver}
                                onCardClicked={() => handleDeselect(selectedCards[1])}
                                number={2}
                                cardUnit={selectedCards[1]}
                                onSkillOver={onSkillOver}
                                onSkillClicked={handleSkillSelected} />
                        </div>
                        <div className="slot mb-12">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-center flex justify-center items-center w-full space-x-2">
                                        <div>frontline </div>
                                        <div className="cursor-pointer"><QuestionMarkCircledIcon /></div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="w-2/3 p-2 text-center text-xl">
                                        La carte en frontline subit les dégats des attaques adverses.<br />
                                        Chaque carte qui attaque avec une attaque de contact prend la position de frontline <br />
                                        Lorsque la carte de contact n'a plus de vie, alors la carte suivante dans l'ordre de constitution du duel est déplacée en frontline
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                            <CardSlot onCardClicked={() => handleDeselect(selectedCards[0])} number={1} cardUnit={selectedCards[0]}
                                onSkillOver={onSkillOver}
                                onSkillClicked={handleSkillSelected} />
                        </div>
                        <div className="slot">
                            <CardSlot onCardClicked={() => handleDeselect(selectedCards[2])} number={3} cardUnit={selectedCards[2]}
                                onSkillOver={onSkillOver}
                                onSkillClicked={handleSkillSelected} />
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}