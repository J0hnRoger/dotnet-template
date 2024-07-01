import { Lobby } from "@components/Lobby"
import { useCardDna } from "../CardDnaContext"
import { FC, useEffect, useMemo, useState } from "react"
import { CardUnit, ChallengeDto, ChallengeSkillDto, CreateChallengeDto, PlayerDto, SkillDto } from "../types"
import { Card } from "@components/Card"
import { ChallengePicker } from "@components/ChallengePicker"
import { ScrollArea } from "@components/ui/scroll-area"
import { Link } from "react-router-dom"
import { CardService } from "../services/cardService"
import { Button } from "@components/ui/button"
import { createAnsweredChallenge, createNewChallenge, isAnsweredChallenge } from "../services/challengeService"
import { EventFeed } from "@components/EventFeed"
import { HoverBorderGradient } from "@components/aceternity/glossy-button"
import { CardDescription } from "@components/challenge-plan/CardDescription"
import { Badge } from "@components/ui/badge"
import { WaitForApprovalProgress } from "@components/WaitForApprovalProgress"
import { BackgroundGradient } from "@components/aceternity/background-gradient"

export const DashBoardPage = () => {
    const { userProfile, userCards, invoke, currentChallenge, events } = useCardDna()

    const [challenge, setNewChallenge] = useState<CreateChallengeDto>(null);
    const [selectedCards, setSelectedCards] = useState<CardUnit[]>([]);
    const [hoveredCard, setHoveredCard] = useState<CardUnit>(null);
    const [selectedSkill, setSelectedSkill] = useState<ChallengeSkillDto | null>(null);
    const [selectedSequence, setSelectedSequence] = useState<ChallengeSkillDto[]>([]);
    const [showProgress, setShowProgress] = useState<boolean>(false);

    useEffect(() => {

        if (events == null)
            return;

        const handleAcceptedChallenge = (data) => {

            setShowProgress(false)
        };
        events.onChallengeAccepted(handleAcceptedChallenge);

    }, [events]);

    useEffect(() => {
        if (currentChallenge == null)
            return;
        setNewChallenge(createAnsweredChallenge(currentChallenge))
    }, [currentChallenge])

    const uniqCard = useMemo(() => {
        // Créer un nouvel objet Map pour suivre les noms uniques
        const uniqueNames = new Map<string, typeof userCards>();

        const availableCards = userCards.filter((card) => card.challengeId == null);

        availableCards?.forEach((card) => {
            // Si le nom de la carte n'est pas encore dans uniqueNames, ajoutez-le
            if (!uniqueNames.has(card.name)) {
                uniqueNames.set(card.name, [card]);
            } else {
                uniqueNames.set(card.name, [...uniqueNames.get(card.name), card]);
            }
        });
        // Convertir les valeurs de l'objet Map en un tableau
        return uniqueNames;
    }, [userCards]);

    if (userProfile === null) return null

    const handleSelectCard = (card: CardUnit) => {
        if (selectedCards.includes(card)) {
            setSelectedCards(current => current.filter(c => c.id !== card.id));
            return
        }

        setSelectedCards(current => {
            if (current.length >= 3) {
                return current;
            }
            return [...current, card];
        });
    }

    const handleDeselect = (card: CardUnit | null) => {
        if (card == null)
            return;

        setSelectedSequence(current => {
            return current.filter(c => c.cardId !== card.name);
        })
    }

    const handleSkillOver = (skill: SkillDto, card: CardUnit) => {
        const parentCard = selectedCards.find(c => c.id === card.id);

        setHoveredCard(parentCard)
        setSelectedSkill({ ...skill, cardId: card.id })
    }

    const handleSkillSelected = (skill: ChallengeSkillDto, card: CardUnit) => {
        setSelectedSequence(current => {
            return [...current, { ...skill, cardId: card.id }];
        });
    }

    const handleSkillRemoved = (skill: ChallengeSkillDto) => {
        setSelectedSequence(current => {
            return current.filter(c => c !== skill);
        })
    }

    const handlePrepareNewChallenge = (opponent: PlayerDto) => {
        invoke("ChallengePlayer", opponent.name)
        setShowProgress(true)
        setNewChallenge(createNewChallenge(userProfile.login, opponent.name))
    }

    const handleAnswerChallenge = (_, answeredChallenge) => {
        setNewChallenge(createAnsweredChallenge(answeredChallenge))
    }

    const handleCancel = (cancelingChallenge: ChallengeDto) => {
        invoke("CancelChallenge", {
            challengeId: cancelingChallenge.id,
            challenger: cancelingChallenge.challenger,
            opponent: cancelingChallenge.opponent
        });
    }

    const handleChallenge = async () => {
        if (selectedCards.length < 3 || selectedSequence.length === 0 || challenge == null)
            return;
        if (challenge == null)
            return;

        // const eventType = isAnsweredChallenge(challenge)
        //     ? "RespondToChallenge" : "ChallengePlayer"
        const eventType = "SendChallengeSequence"

        setSelectedCards([])
        setSelectedSequence([])
        setNewChallenge(null)

        await invoke(eventType, {
            id: challenge?.id,
            challenger: challenge.challenger,
            opponent: challenge.opponent,
            cards: CardService.mapCardUnitDtos(selectedCards),
            sequence: selectedSequence
        });
    }

    return (
        <div className="flex flex-col">
            <div className="flex w-full flex-grow overflow-y-hidden h-[calc(100vh-280px)]">
                <div className="w-full md:w-1/4 p-4 ">
                    <Lobby isCollapsed={false}
                        onChallenge={handlePrepareNewChallenge}
                        onAnswerChallenge={handleAnswerChallenge}
                        onCancelChallenge={handleCancel} ></Lobby>
                </div>

                <div className="relative md:w-1/2">
                    {showProgress &&
                        <div className="relative w-full h-full">
                            <div className="absolute flex w-full h-full items-center justify-center">
                                <WaitForApprovalProgress timeInSeconds={20} />
                            </div>
                        </div>}

                    <div className="h-16 flex justify-between p-2">
                        {!challenge && <div className="w-full text-center p-8">C'est bien calme par ici ... défiez un mage</div>}
                        {challenge &&
                            <PlayerProfil
                                disable={(selectedCards.length < 3 || selectedSequence.length === 0 || challenge == null)}
                                challenge={challenge}
                                onSentChallenge={handleChallenge} />
                        }
                    </div>
                    {uniqCard?.size < 3 && <div className="flex flex-col w-full h-full items-center justify-center">
                        <div className="text-xl">
                            Vous n'avez pas assez de carte pour un nouveau défi
                            {uniqCard?.size < 3 && <div className="text-lg">Vous avez <span className="font-bold text-blue-500">{uniqCard?.size} carte{uniqCard?.size > 1 ? "s" : ""}</span> disponibles</div>}
                        </div>
                        <div className="p-4">
                            <Button className="bg-red-400" onClick={() => { }}>
                                <Link to={"/cards"}>Abandonner & Réinitialiser...</Link>
                            </Button>
                        </div>
                    </div>}
                    {!showProgress && challenge &&
                        <ScrollArea className="flex w-full h-[calc(100%-4rem)]">
                            <div className="flex flex-col flex-grow border-double border-4 border-brown-300">
                                <ChallengePicker
                                    onCardOver={(card) => setHoveredCard(card)}
                                    selectedSequence={selectedSequence}
                                    onCardDeselect={handleDeselect}
                                    onSkillOver={handleSkillOver}
                                    selectedCards={selectedCards}
                                    onSkillSelected={handleSkillSelected}
                                    onSkillRemoved={handleSkillRemoved} />
                            </div>
                        </ScrollArea>}
                </div>
                <div className="w-full md:w-1/4 min-w-[350px] p-4">
                    <div className="p-2 h-full">
                        {hoveredCard && <CardDescription card={hoveredCard} selectedSkill={selectedSkill} />}
                        <EventFeed />
                    </div>
                </div>
            </div>
            <div className="flex justify-center border-t border-t-solid border-t-1 border-brown-100">
                <CardHand cards={uniqCard} onSelectCard={handleSelectCard} onCardHovered={(card) => setHoveredCard(card)} />
            </div>
        </div>
    )
}

interface CardHandProps {
    cards: Map<string, CardUnit[]>
    onSelectCard: (card: CardUnit) => void;
    onCardHovered: (card: CardUnit) => void;
}

const CardHand: FC<CardHandProps> = ({ cards, onSelectCard, onCardHovered }) => {
    const [pinnedCard, setPinnedCard] = useState<CardUnit>(null)
    return (
        <div className="flex">
            {Array.from(cards.entries()).map(([_, cards], index) => {
                const card = cards[0];
                return (
                    <div key={index} className="cursor-pointer relative">
                        <div className="absolute left-0 z-10 font-md">
                            {cards.length > 1 && <Badge className="text-xl bg-blue">
                                {cards.length}
                            </Badge>}
                        </div>
                        <Card onPin={(pinned) => pinned ? setPinnedCard(card) : setPinnedCard(null)} cardUnit={card} onCardLeave={() => (card !== pinnedCard) && onCardHovered(null)} onCardEnter={() => (card !== pinnedCard) && onCardHovered(card)} onClick={() => onSelectCard(card)} disabled={card.challengeId != null} />
                    </div>
                )
            })}
        </div>
    )
}

interface PlayerProfilProps {
    challenge: CreateChallengeDto
    onSentChallenge: () => void
    disable: boolean
}

const PlayerProfil: FC<PlayerProfilProps> = ({ challenge, onSentChallenge }) => {
    const { players } = useCardDna()

    const isLiveChallenge = (challenge) => {
        const challengerOnline = players.find(p => p.name == challenge.challenger).isOnline
        const opponentOnline = players.find(p => p.name == challenge.opponent).isOnline
        return challengerOnline && opponentOnline
    }

    return (<>
        {isLiveChallenge(challenge) && <div>
            Your opponent choose his cards ...
        </div>}
        <div className="p-4 flex items-center">
            <div className="flex">
                <HoverBorderGradient as="button"
                    containerClassName="rounded-full"
                    className="bg-black  text-white text-base flex items-center space-x-1"
                    onClick={onSentChallenge}
                >
                    {isAnsweredChallenge(challenge) ? "Répondre au défi" : "Envoyer le défi"}
                </HoverBorderGradient>
            </div>
        </div>
    </>)
}