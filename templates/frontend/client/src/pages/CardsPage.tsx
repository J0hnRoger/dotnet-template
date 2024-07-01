import React, { useState } from 'react';
import { useCardDna } from '../CardDnaContext';
import { CardShowCase } from '../components/CardShowCase';

import style from './CardsPage.module.css';
import Modal from '../components/Modal';
import { Button } from '../components/Button';

const CardsPage: React.FC = () => {
    const { userProfile, userCards, resetCards } = useCardDna();
    const [showResetConfirmation, setShowResetConfirmation] = useState<boolean>(false);
    const [waitingMessage, setWaitingMessage] = useState<string>("");

    const getNbDayAgo = (nbDay: number) => {
        const now = new Date(); // Date actuelle
        return new Date(now.getTime() - (nbDay * 24 * 60 * 60 * 1000));
    }


    const handleReset = () => {
        // TODO Debug purpose
        const threeDaysAgo = getNbDayAgo(1)

        // Convertir lastResetDate en objet Date si ce n'est pas déjà le cas
        const lastResetDate = new Date(userProfile.lastResetDate);

        if (lastResetDate < threeDaysAgo) {
            // La dernière réinitialisation a eu lieu il y a plus de 3 jours
            resetCards();
        } else {
            const daysUntilReset = Math.ceil((lastResetDate.getTime() - threeDaysAgo.getTime()) / (24 * 60 * 60 * 1000));
            setWaitingMessage(`Vous devez attendre encore ${daysUntilReset} jours avant de pouvoir réinitialiser vos cartes.`);
        }
    }

    return (
        <div>
            <Modal show={showResetConfirmation} onClose={() => setShowResetConfirmation(false)}>
                <div className='flex flex-col'>
                    <span className="text-red-500">
                        {waitingMessage}
                    </span>
                    <Button onClick={handleReset}>
                        Réinitialiser
                    </Button>
                </div>
            </Modal>
            <h2 className='p-2'>Mes Cartes</h2>
            <div className={style.cardList}>
                {userCards?.map((card, index) => (
                    <CardShowCase key={index} cardUnit={card} />
                ))}
            </div>
            <div className='p-8'>
                Mauvais départ?
                <span className='ml-2'>
                    <button className='underline underline-offset-1' onClick={() => setShowResetConfirmation(true)}>Réinitialiser mes cartes</button>
                </span>
            </div>
        </div>
    );
};

export default CardsPage;
