import React, { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCardDna } from '../CardDnaContext';
import { CardUnit } from '../types';
import { Card } from '../components/Card';

import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { CardService, getCardFromChallenge } from '../services/cardService';
import { createGameTurns, getInitialTurn } from '../services/battleService';
import { TurnBoardComponent as TurnBoard } from '@components/battle/TurnBoard';
import { Pause, Play, StepBack, StepForward } from 'lucide-react';
import { ReplayChallengeDto } from '@components/battle/types';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const BattlePage: React.FC = () => {
    const { userProfile, userChallenges, library } = useCardDna();

    const [turnIndex, setTurnIndex] = useState(0);
    const [currentChallengeReplay, setCurrentChallengeReplay] = useState<ReplayChallengeDto>(null);
    const [turns, setTurns] = useState(null)
    const [showResultScreen, setShowResultScreen] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);

    const query = useQuery();

    useEffect(() => {
        let interval = null;
        if (autoPlay) {
            interval = setInterval(() => {
                handleNext();
            }, 2000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [autoPlay, turnIndex, currentChallengeReplay]);

    useEffect(() => {
        if (userChallenges.length === 0 || library.length === 0)
            return

        const challengeId = query.get('challengeId');
        const challenge = userChallenges.find(c => c.id === challengeId);

        const currentChallengeReplay = CardService.mapBattleChallenge(library, challenge);

        const initialState = getInitialTurn(currentChallengeReplay)
        const turnStates = [initialState, ...createGameTurns(initialState.cards, currentChallengeReplay)]

        setCurrentChallengeReplay(currentChallengeReplay)
        console.log(turnStates)
        setTurns(turnStates);
    }, [userChallenges, library])

    const handleReset = () => {
        setTurnIndex(0);
        setShowResultScreen(false);
    }

    const handlePlay = () => {
        setAutoPlay(!autoPlay);
    }

    const handlePrev = () => {
        if (turnIndex > 0) {
            setTurnIndex(turnIndex - 1);
        }
    }

    const handleNext = () => {
        if (turnIndex < currentChallengeReplay.turns.length) {
            setTurnIndex(turnIndex + 1);
        } else {
            setShowResultScreen(true)
        }
    }

    if (!currentChallengeReplay || turns.length === 0)
        return null;

    return (
        <div className='w-full h-full flex flex-col p-2 '>
            {showResultScreen && (<ResultScreen cardReward={getCardFromChallenge(currentChallengeReplay)} winner={currentChallengeReplay.winner}
                onReset={handleReset} isWinner={currentChallengeReplay.winner === userProfile.login} />)}
            <div className='flex w-full justify-between'>
                <div>
                    <h2>{currentChallengeReplay.challenger}</h2>
                </div>
                <div className='controls text-blue-400 flex flex-col'>
                    <div className='flex space-x-2'>
                        <div onClick={handlePrev} className='cursor-pointer'>
                            {/* Assurez-vous que le composant Icon est correctement importé et utilisé */}
                            <StepBack />
                        </div>
                        <div onClick={handlePlay} className='cursor-pointer'>
                            {/* Assurez-vous que le composant Icon est correctement importé et utilisé */}
                            {autoPlay ? <Pause /> : <Play />}
                        </div>
                        <div onClick={handleNext} className='cursor-pointer'>
                            {/* Assurez-vous que le composant Icon est correctement importé et utilisé */}
                            <StepForward />
                        </div>
                    </div>
                    <div className='flex w-full'>
                        <div className='w-full font-bold text-center p-2'>{turnIndex === 0 ? "Start" : `Tour ${turns[turnIndex].index}`}</div>
                    </div>
                </div>
                <div>
                    <h2>{currentChallengeReplay.opponent}</h2>
                </div>
            </div>
            <div className='flex grow gap-8'>
                <TurnBoard previousTurn={turns[turnIndex - 1]} turn={turns[turnIndex]}></TurnBoard>
            </div>
        </div>
    );
};

interface ResultScreenProps {
    winner: string
    onReset: () => void
    cardReward: CardUnit
    isWinner: boolean
}

const ResultScreen: FC<ResultScreenProps> = ({ winner, onReset, cardReward, isWinner }) => {
    const classes = {
        "bg-green-400 text-white": isWinner,
        "bg-red-400 text-white": !isWinner
    }

    return (
        <div className='absolute w-[calc(100%-20px)] h-[calc(100%-66px)] flex items-center justify-center z-10'>
            <div className='flex flex-col bg-black p-8 rounded-md min-w-80'>
                <div className='font-bold text-center'>Gagnant: {winner}</div>
                <div className='flex items-center justify-center p-8'>
                    <Button onClick={onReset}>Replay</Button>
                </div>
                <div className={classnames('p-2 font-bold', classes)}>{(isWinner) ? "Bien joué! " : "Aie! vous perdez votre fidèle:"}:</div>
                <div>
                    {cardReward && <>Vous gagnez:<Card withSkills={false} cardUnit={cardReward} /></>}
                    {!cardReward && <span>Duel d'entrainement - pas de récompense</span>}
                </div>
                <div className='flex justify-center'>
                    <Link to="/" className='underline underline-offset-8'>Back to lobby</Link>
                </div>
            </div>
        </div>
    )
}

export default BattlePage;
