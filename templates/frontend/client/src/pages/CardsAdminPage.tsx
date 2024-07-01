import { CardEditForm } from "@components/admin/CardEditForm";
import { useCardDna } from "../CardDnaContext";
import { Input } from "@components/Input";
import { useState } from "react";
import { Button } from "@components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

export const CardAdminPage = () => {
    const { library, cancelChallenge } = useCardDna();
    const [cancelChallengeId, setCancelChallengeId] = useState<string>("");

    const handleCancelChallenge = async () => {
        if (cancelChallengeId == "") return;
        await cancelChallenge(cancelChallengeId)
    }

    return (
        <div className="flex flex-col h-full overflow-auto p-4 items-center">
            <Tabs defaultValue="cards" className="w-[80%] m-2">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cards">Cards</TabsTrigger>
                    <TabsTrigger value="missions">Missions</TabsTrigger>
                    <TabsTrigger value="challenges">Challenges</TabsTrigger>
                </TabsList>
                <TabsContent value="cards">
                    <div className="flex flex-wrap h-full">
                        {library.map((card) => (
                            <div className="flex">
                                <CardEditForm card={card} />
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="missions">
                    <div>
                        <h1>Manage missions</h1>

                    </div>
                </TabsContent>
                <TabsContent value="challenges">
                    <div>
                        <h1>Gestion des défis </h1>
                        <Input value={cancelChallengeId} onChange={(value) => setCancelChallengeId(() => value)} placeholder={"ChallengeId"} type={"text"} />

                        <Button onClick={handleCancelChallenge}>Cancel the Challenge</Button>
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    )
}
