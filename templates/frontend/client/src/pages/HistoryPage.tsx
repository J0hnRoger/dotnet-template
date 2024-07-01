import { getChallengeByStatus } from "../services/challengeService";
import { useCardDna } from "../CardDnaContext"
import { useMemo, useState } from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table"

import { Link } from "react-router-dom";
import { formatDate } from "../common/date";
import { Badge } from "@components/ui/badge";
import { pipe, sortBy } from "../common/fp";
import { Button } from "@components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
} from "@components/ui/dialog"

import { ChallengeReport } from "@components/ChallengeReport"

import { ChallengeDto } from "../types";

export const HistoryPage = () => {
    const { userChallenges, userProfile } = useCardDna()
    const [showReport, setShowReport] = useState(false)
    const [currentChallenge, setCurrentChallenge] = useState<ChallengeDto>(null)

    const archivedChallenges = useMemo(() => {
        return pipe(
            getChallengeByStatus("Archived"),
            sortBy("resolvedAt", true)
        )(userChallenges)

    }, [userChallenges])

    const handleReport = (challenge: ChallengeDto) => {
        setShowReport(true)
        setCurrentChallenge(challenge)
    }

    const handleClose = () => {
        setCurrentChallenge(null)
        setShowReport(false)
    }

    return (
        <div className="flex flex-col p-8">
            {
                <Dialog open={showReport} onOpenChange={handleClose}>
                    <DialogContent className="flex flex-col max-w-[80%] p-8">
                        <DialogDescription>
                            <ChallengeReport challenge={currentChallenge} />
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={handleClose}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>}

            <h1 className="text-xl font-bold">History</h1>
            <div>
                <Table>
                    <TableCaption>Archived Challenges</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Duel</TableHead>
                            <TableHead>Resultat</TableHead>
                            <TableHead>Récompense</TableHead>
                            <TableHead>Replay</TableHead>
                            <TableHead>Resolved</TableHead>
                            <TableHead>Report</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {archivedChallenges.map((challenge) => (
                            <TableRow key={challenge.id}>
                                <TableCell className="font-medium">{challenge.challenger} VS {challenge.opponent}</TableCell>
                                <TableCell>{challenge.winner == userProfile.login ? <Badge className="bg-green-300">Victory</Badge> : <Badge className="bg-red-300">Defeat</Badge>}</TableCell>
                                <TableCell>
                                    {challenge.cardReward == null
                                        ? "Duel d'entrainement"
                                        : (<>{challenge.cardReward.id} - {challenge.cardReward.name}</>)}
                                </TableCell>
                                <TableCell>
                                    <Link className="underline" to={`/battle?challengeId=${challenge.id}`}>Replay</Link>
                                </TableCell>
                                <TableCell>
                                    {formatDate(challenge.resolvedAt)}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleReport(challenge)}>Show report</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>Total</TableCell>
                            <TableCell className="text-right">{archivedChallenges.filter(c => c.winner == userProfile.login).length} Victory / {archivedChallenges.filter(c => c.winner !== userProfile.login).length} Défaites</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
}