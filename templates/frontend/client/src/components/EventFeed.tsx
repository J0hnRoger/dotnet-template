import { FC, useEffect, useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Tooltip } from "./ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useCardDna } from "../CardDnaContext";
import { getChallengeByStatus } from "../services/challengeService";
import { ChallengeDto } from "../types";
import { displayTimeSince } from "../common/date";
import { Badge } from "./ui/badge";

export const EventFeed: FC = () => {
    const navigate = useNavigate()
    const { applyCurrentChallenge, userChallenges } = useCardDna()
    const [isHovered, setIsHovered] = useState(false)
    const [newResolvedChallenges, setNewResolvedChallenges] = useState<ChallengeDto[]>([])

    useEffect(() => {
        if (userChallenges.length === 0)
            return;
        const newChallenges = getChallengeByStatus('Resolved')(userChallenges)
        setNewResolvedChallenges(newChallenges)
    }, [userChallenges])

    const handleClose = () => {
        console.log('close')
    }

    const handleSkipChallengeReplay = (event: ChallengeDto) => {
        applyCurrentChallenge(event.id)
    }

    const handleOpenEvent = (event: ChallengeDto) => {
        applyCurrentChallenge(event.id)
        navigate(`/battle?challengeId=${event.id}`)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-276px)] py-8">
            <ScrollArea className="flex w-full h-full">
                <div className="flex flex-col flex-grow">
                    <div className="h-full">
                        {newResolvedChallenges.map((event, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col space-y-2">
                                            <Badge className="self-start">{displayTimeSince(event.resolvedAt)}</Badge>
                                            <CardTitle>{event.challenger} VS {event.opponent}</CardTitle>
                                            <CardDescription>{event.challengerSequence.cards.map((c) => c.name).join('-')}</CardDescription>
                                        </div>
                                        <div>
                                            <X onClick={handleClose}></X>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardFooter className="flex justify-between">
                                    <Button onClick={() => handleOpenEvent(event)}>Accéder au duel</Button>
                                    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                                        className="cursor-pointer" onClick={() => handleSkipChallengeReplay(event)}>
                                        <TooltipProvider>
                                            <Tooltip />
                                            {!isHovered ? <EyeOpenIcon></EyeOpenIcon> : <EyeClosedIcon></EyeClosedIcon>}
                                        </TooltipProvider>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}