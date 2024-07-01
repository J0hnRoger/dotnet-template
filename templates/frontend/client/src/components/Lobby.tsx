import { cn } from "@lib/utils"
import { HourglassIcon, LucideIcon, Swords, Users2 } from "lucide-react"
import { buttonVariants } from "./ui/button"
import { useCardDna } from "../CardDnaContext"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { OnlinePill } from "./OnlinePill"
import clsx from "clsx"
import { ChallengeDto, PlayerDto } from "src/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

import { pipe } from "../common/fp"
import { getChallengeByStatus, getChallengeFor, getChallengeSentByMe } from "../services/challengeService"
import { FC } from "react"

interface LobbyProps {
    isCollapsed: boolean
    links?: {
        title: string
        label?: string
        icon: LucideIcon
        variant: "default" | "ghost"
    }[]
    onChallenge: (player: PlayerDto) => void
    onAnswerChallenge: (player: PlayerDto, challenge: ChallengeDto) => void
    onCancelChallenge: (challenge: ChallengeDto) => void
}

export const Lobby: FC<LobbyProps> = ({ isCollapsed, onChallenge, onAnswerChallenge, onCancelChallenge }) => {
    const { players, userProfile } = useCardDna()

    const getChallengeForMe = getChallengeFor(userProfile.login)
    const getPendingChallengeForMe = pipe(getChallengeByStatus("Pending"), getChallengeForMe)
    const getPendingChallenge = getChallengeByStatus("Pending")

    const handleChallenge = (player: PlayerDto) => {
        const currentChallenge = pipe(
            getChallengeByStatus("Pending"),
            getChallengeSentByMe(userProfile.login)
        )(player.challenges)

        if (currentChallenge.length > 0)
            return;
        onChallenge && onChallenge(player)
    }

    const handleCancelChallenge = (cancelingChallenge: ChallengeDto) => {
        onCancelChallenge && onCancelChallenge(cancelingChallenge)
    }

    const handleAnswerChallenge = (player: PlayerDto) => {
        const currentChallenges = pipe(
            getChallengeByStatus("Pending"),
            getChallengeForMe,
        )(player.challenges)

        if (currentChallenges.length === 0)
            return
        const challenge = currentChallenges[0]
        onAnswerChallenge(player, challenge)
    }

    return (
        <div
            data-collapsed={isCollapsed}
            className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
        >
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                <div className="flex space-x-2 mb-4">
                    <div
                        className={cn(
                            buttonVariants({ size: "icon" }),
                            "h-9 w-9",
                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                        )}>
                        <div>
                            <Users2 className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="font-bold text-xl underline">
                                Lobby
                            </h2>
                        </div>
                    </div>
                </div>
                {players.map((player, index) => {
                    const meClass = "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white rounded-md pointer-events-none"
                    const pendingChallengeByMe = pipe(getPendingChallenge,
                        getChallengeSentByMe(userProfile.login)
                    )(player.challenges)

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger disabled={userProfile.login === player.name}>
                                <div key={index}
                                    className={clsx("flex space-x-4 items-center p-2 ", { [meClass]: userProfile.login === player.name })}>
                                    <div>{index + 1}</div>
                                    <Avatar>
                                        <AvatarImage src={player.avatar ?? "https://github.com/shadcn.png"} alt="@shadcn" />
                                        <AvatarFallback>{player.name}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className="font-bold">{player.name}</div>
                                    </div>

                                    <OnlinePill isOnline={player.name != userProfile.login && player.isOnline} ></OnlinePill>
                                    {player.name != userProfile.login && getPendingChallengeForMe(player.challenges).length === 1 && <Swords className="animate animate-bounce text-white-500" />}
                                    {player.name != userProfile.login && pendingChallengeByMe.length === 1 && <HourglassIcon />}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleChallenge(player)}>Défier {player.name}</DropdownMenuItem>
                                {getPendingChallengeForMe(player.challenges).length === 1 && <DropdownMenuItem onClick={() => handleAnswerChallenge(player)}>Relever le défi</DropdownMenuItem>}
                                {pendingChallengeByMe.length === 1 && <DropdownMenuItem onClick={() => handleCancelChallenge(pendingChallengeByMe[0])}>Annuler le défi</DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                })
                }
            </nav>
        </div >
    )
}