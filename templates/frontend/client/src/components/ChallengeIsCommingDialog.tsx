
import { useEffect, useState } from 'react';
import { useCardDna } from '../CardDnaContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ChallengeDto, ChallengeReceivedEvent } from '../types';
import { Button } from './ui/button';
import { BellRingIcon } from 'lucide-react';

const ChallengeIsComingDialog = () => {
    const { events, setCurrentChallenge, invoke } = useCardDna();
    const [showDialog, setShowDialog] = useState(false);
    const [receivedChallenge, setReceivedChallenge] = useState<ChallengeDto>(null);

    useEffect(() => {
        if (events == null)
            return;

        const handleChallengeReceived = (data: ChallengeReceivedEvent) => {
            setReceivedChallenge(data.challenge)
            setShowDialog(true);
        };

        events.onReceiveChallenge(handleChallengeReceived);

    }, [events]);

    const handleClose = () => {
        setShowDialog(false);
    }

    const handleChallengeAccepted = () => {
        invoke('AcceptLiveChallenge', receivedChallenge)
        setShowDialog(false);
        setCurrentChallenge(receivedChallenge);
    }

    return (
        <Dialog open={showDialog} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouveau défi arrivé</DialogTitle>
                    <DialogDescription>
                        <div className='flex flex-col space-y-2'>
                            <div className="flex justify-center text-white p-6 animate-bounce">
                                <BellRingIcon size={64} />
                            </div>
                            <div>
                                {receivedChallenge?.challenger} vous a défié. Voulez-vous relever le défi?
                            </div>
                            <Button onClick={handleChallengeAccepted}>Relever le défi</Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ChallengeIsComingDialog;