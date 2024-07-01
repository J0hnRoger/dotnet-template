import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import Cookies from 'js-cookie';
import { serverUrl, webSocketServerUrl } from './config';
import { CardDto, CardUnit, ChallengeCanceledEvent, ChallengeDto, ChallengeInitEvent, ChallengeReceivedEvent, ChallengeResolvedEvent, ChallengeSentEvent, LivePlayerDto, PlayerDto, UserProfile } from './types';

import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { CardService } from './services/cardService';
import { Failure, Success } from './common/fp';

export enum ChallengeMethods {
    ChallengePlayer = "ChallengePlayer",
    AcceptLiveChallenge = "AcceptLiveChallenge",
    SendChallengeSequence = "SendChallengeSequence",
}

interface RealTimeEvents {
    isConnected: boolean;
    onUserConnected?: (callback: (data: string) => void) => void;
    onUserDisconnected?: (callback: (data: any) => void) => void;
    onConnectedUsersList?: (callback: (users: LivePlayerDto[]) => void) => void;
    onChallengeInit?: (callback: (data: any) => void) => void;
    onChallengeSent?: (callback: (opponent: string) => void) => void;
    onChallengeAccepted?: (callback: (data: string) => void) => void;
    onChallengeCanceled?: (callback: (data: string) => void) => void;
    onReceiveChallenge?: (callback: (receivedChallenge: ChallengeReceivedEvent) => void) => void;
    onChallengeComplete?: (callback: (result: any) => void) => void;
    onGameError?: (callback: (error: any) => void) => void;
}

interface CardDnaContextType {
    connection: HubConnection | null;
    userProfile: UserProfile | null;
    userCards: Array<CardUnit> | null;
    library: Array<CardDto>;
    players: Array<(LivePlayerDto & PlayerDto)>;
    userChallenges: Array<ChallengeDto>;
    setUserProfile: (userProfile: UserProfile) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    events: RealTimeEvents | null;
    invoke: (method: string, ...args: any[]) => Promise<void>;
    applyCurrentChallenge: (challengeId: string) => void;
    currentChallenge: ChallengeDto | null;
    setCurrentChallenge: (challenge: ChallengeDto) => void;
    resetCards: () => void;
    cancelChallenge: (challengeId: string) => void;
    updateCard: (updatingCard: CardDto) => void;
    logout: () => void;
}

const CardDnaContext = createContext<CardDnaContextType | undefined>(undefined);

export const useCardDna = () => {
    const context = useContext(CardDnaContext);
    if (context === undefined) {
        throw new Error('useCardDna must be used within a CardDnaProvider');
    }
    return context;
}

interface Props {
    children: ReactNode;
}

export const CardDnaProvider: React.FC<Props> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [library, setLibrary] = useState<Array<CardDto>>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [players, setAllPlayers] = useState<Array<PlayerDto>>([]);
    const [livePlayerInfos, setLivePlayerInfos] = useState<Array<LivePlayerDto>>([]);

    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const [userChallenges, setUserChallenges] = useState<Array<ChallengeDto>>([]);
    const [currentChallenge, setCurrentChallenge] = useState<ChallengeDto>(null);
    const [events, setEvents] = useState<RealTimeEvents>(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(webSocketServerUrl)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        const initiateConnection = async () => {
            try {
                await newConnection.start();
                setConnection(newConnection);
            } catch (error) {
                console.error('WebSocket Connection Failed:', error);
            }
        };

        initiateConnection()

        const fetchCards = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/card`);
                if (!response.ok) throw new Error('Erreur lors de la récupération des cartes');
                const cards = await response.json();
                setLibrary(cards);
            } catch (error) {
                console.error('Erreur lors du chargement des cartes:', error.message);
            }
        };

        fetchCards();

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/player/me`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const userProfile = await response.json();
                    setIsLoggedIn(true);
                    setUserProfile(userProfile);
                } else {
                    Cookies.remove('userId');
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Erreur lors de la requête:', error);
                setIsLoggedIn(false);
            }
        };

        fetchUserProfile();
        return () => {
            newConnection.stop().then(() => console.log('WebSocket Disconnected'));
        };
    }, []);

    useEffect(() => {
        if (userProfile == null || connection == null) return;
        if (isConnected) return;

        invoke("ConnectUser", userProfile.login);
        setIsConnected(true);
    }, [connection, isLoggedIn, userProfile]);

    useEffect(() => {
        if (userProfile == null) return;

        const fetchPlayers = async () => {
            // Remplacez par l'URL de votre API
            const response = await fetch(`${serverUrl}/api/player`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const playersData: PlayerDto[] = await response.json();
                setAllPlayers(playersData);
            } else {
                console.error('Erreur lors de la récupération des joueurs');
            }
        };

        const fetchChallenges = async () => {
            const response = await fetch(`${serverUrl}/api/challenge?status=pending&status=resolved&status=archived`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const challengesData: ChallengeDto[] = await response.json();
                setUserChallenges(challengesData);
            } else {
                console.error('Erreur lors de la récupération des joueurs');
            }
        };

        fetchPlayers();
        fetchChallenges();
    }, [userProfile]);

    const handleSetUserProfile = (newUserProfile) => {
        setUserProfile(newUserProfile);
        setIsLoggedIn(true);
    }

    const handleSetCurrentChallenge = async (challenge: ChallengeDto) => {
        setCurrentChallenge(challenge);
    }

    const resetUserCards = async () => {
        try {
            const response = await fetch(`${serverUrl}/api/player/reset`, {
                method: 'PUT',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Erreur lors de la récupération des cartes');
            const cards = await response.json();
            setUserProfile({ ...userProfile, cards });
        } catch (error) {
            console.error('Erreur lors du chargement des cartes:', error.message);
        }
    }

    // Admin only
    const cancelChallenge = async (challengeId: string) => {
        try {
            const response = await fetch(`${serverUrl}/api/challenge/${challengeId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Erreur lors de la récupération des cartes');
        } catch (error) {
            console.error('Erreur lors de l\'annulation du challenge:', error.message);
        }
    }

    const updateCard = async (updatingCard: CardDto) => {
        try {
            const response = await fetch(`${serverUrl}/api/card`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatingCard)
            });

            if (!response.ok) throw new Error(`Erreur lors de la mise à jour de la carte ${updateCard.name}`);
            const updated = await response.json();
            setLibrary(library => library.map(card => card.cardId === updated.cardId ? updated : card))
        } catch (error) {
            console.error('Erreur lors du chargement des cartes:', error.message);
        }
    }

    const handleLogout = async () => {
        try {
            const response = await fetch(`${serverUrl}/api/player/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setUserProfile(null);
                setIsLoggedIn(false);
            } else {
                console.error('Erreur lors de la déconnexion');
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    }

    const cards = useMemo(() => {
        if (library == null || userProfile == null) return [];

        const userCardUnits = CardService.mapCardUnits(library, userProfile.cards)
            .filter(result => result.isSuccess)
            .map(result => (result as Success<CardUnit>).value)

        if (userCardUnits.some(card => card instanceof Failure))
            throw new Error('Error while mapping user cards');

        return userCardUnits;
    }, [userProfile, library]);

    const playersWithConnectionInfos = useMemo<(LivePlayerDto & PlayerDto)[]>(() => {
        if (players == null || livePlayerInfos.length == 0) return [];

        const allPlayers = players.map(player => {
            let liveInfos = livePlayerInfos.find(liveInfos => liveInfos.name === player.name)

            const challenges = userChallenges
                .filter(challenge => challenge.opponent === userProfile.login
                    || challenge.challenger === userProfile.login)
                .filter(challenge => challenge.opponent === player.name || challenge.challenger === player.name)

            if (liveInfos == null) {
                liveInfos = {
                    isOnline: false,
                    name: player.name,
                }
            }
            return { ...player, ...liveInfos, challenges }
        })
        const ia = { name: "Training Dummy", avatar: "images/training-dummy.webp", isOnline: true, isChallenged: false, hasSentChallenge: false, challenges: [], victory: 0, defeat: 0, manas: 0, lastResetDate: null }
        return [...allPlayers, ia]
    }, [players, livePlayerInfos, userChallenges, userProfile]);

    // SignalR Events
    // Facade for event subscriptions
    useEffect(() => {
        const onEvent = (eventName, internalCallback?: (data) => void) => (callback) => {
            const eventHandler = (data) => {
                console.log(`event ${eventName} received with data:`, data);
                internalCallback && internalCallback(data)
                callback(data);
            }
            connection?.on(eventName, eventHandler);
            return () => connection?.off(eventName, callback);
        }

        const handleUsersConnected = (user) => {
            console.log(`${user} has joined the game.`);
            if (players.length > 0 && players.find(p => p.name === user) == null) {
                const subscribedPlayer: PlayerDto = {
                    name: user,
                    isChallenged: false,
                    hasSentChallenge: false,
                    challenges: [],
                    victory: 0,
                    defeat: 0,
                    manas: 0,
                    lastResetDate: null,
                }
                setAllPlayers(currentPlayers => [...currentPlayers, subscribedPlayer])
            }

            setLivePlayerInfos(currentPlayers => [...currentPlayers, { name: user, isOnline: true }]);
        };

        const onUserConnected = onEvent('UserConnected', handleUsersConnected)

        const handleUsersDisconnected = (user) => {
            console.log(`${user} has left the game.`);
            setLivePlayerInfos(currentPlayers => currentPlayers.filter(p => p.name !== user));
        };

        const onUserDisconnected = onEvent('UserDisconnected', handleUsersDisconnected)

        const handleUsersList = (data) => {
            const connectedPlayers = data.map(player => ({ ...player, isOnline: true }))
            setLivePlayerInfos(connectedPlayers);
        };

        const onConnectedUsersList = onEvent('ConnectedUsersList', handleUsersList)

        connection?.on('ConnectedUsersList', (data) => {
            handleUsersList(data)
        });

        connection?.on('ChallengeInit', (data: ChallengeInitEvent) => {
            console.log(`Challenge init: ${data.challenge.id} - ${data.challenge.challenger} vs ${data.challenge.opponent}`)
        });

        const onChallengeInit = onEvent('ChallengeInit', (data: ChallengeInitEvent) => {
            setCurrentChallenge(data.challenge)
        })

        const onChallengeAccepted = onEvent('ChallengeAccepted', (data: ChallengeInitEvent) => {
            setCurrentChallenge(data.challenge)
        })

        connection?.on('ChallengeAccepted', (data: ChallengeInitEvent) => {
            console.log(`Challenge Accepted: ${data.challenge.id} - ${data.challenge.challenger} vs ${data.challenge.opponent}`)
        });

        const onChallengeSent = onEvent('ChallengeSent', (data: ChallengeSentEvent) => {
            setAllPlayers(currentPlayers => currentPlayers.map(player => {
                if (player.name === data.challenge.opponent) {
                    return { ...player, isChallenged: true };
                }
                return player;
            }))

            setUserChallenges((challengeData) => [...challengeData, data.challenge])

            if (userProfile != null) {
                const updatedCards = userProfile.cards.map(card => {
                    const newCardInstance = data.challenge.challengerSequence.cards.find(newCard => newCard.id === card.id);
                    if (newCardInstance) {
                        return { ...card, ...newCardInstance };
                    } else {
                        return card;
                    }
                })

                setUserProfile({ ...userProfile, cards: updatedCards });
            }
        })

        const onReceiveChallenge = onEvent('ChallengeReceived', (data: ChallengeReceivedEvent) => {
            setAllPlayers(currentPlayers => currentPlayers.map(player => {
                if (player.name === data.challenge.challenger) {
                    return { ...player, hasSentChallenge: true, challengeSent: data.challenge.id };
                }
                return player;
            }))

            setUserChallenges((challengeData) => [...challengeData, data.challenge])
        })

        const onChallengeComplete = onEvent('ChallengeComplete', (data: ChallengeResolvedEvent) => {
            setAllPlayers(currentPlayers => currentPlayers.map(player => {
                if (player.name === data.challenge.challenger) {
                    return { ...player, hasSentChallenge: false };
                }
                if (player.name === data.challenge.opponent) {
                    return { ...player, isChallenged: false };
                }
                return player;
            }))

            setUserChallenges(challengeData => [...challengeData.filter(c => c.id !== data.challenge.id), data.challenge])
        })

        const handleChallengeCanceled = (data: ChallengeCanceledEvent) => {
            setAllPlayers(currentPlayers => currentPlayers.map(player => {
                if (player.name === data.challenger) {
                    return { ...player, hasSentChallenge: false, challengeId: null };
                }

                if (player.name === data.opponent) {
                    return { ...player, isChallenged: false, challengeId: null };
                }
                return player;
            }))

            if (userProfile != null) {
                const freeCards = userProfile.cards.map(card => {
                    if (card.challengeId === data.challengeId)
                        return { ...card, challengeId: null }
                    return card
                })
                setUserProfile({ ...userProfile, cards: freeCards });
            }

            setUserChallenges((challengeData) => [...challengeData.filter(c => c.id !== data.challengeId)])
            console.log(`${data.challengeId} was canceled.`);
        };

        const onChallengeCanceled = onEvent('ChallengeCanceled', handleChallengeCanceled)

        const onGameError = onEvent('GameError')

        const events: RealTimeEvents = {
            isConnected,
            onUserConnected,
            onUserDisconnected,
            onConnectedUsersList,
            // Challenge management
            onChallengeSent,
            onChallengeInit,
            onChallengeAccepted,
            onReceiveChallenge,
            onChallengeComplete,
            onChallengeCanceled,
            onGameError
        }
        setEvents(events)

    }, [connection, isConnected, players])

    const invoke = useCallback(async (method, ...args) => {
        if (!connection) return;

        try {
            await connection.invoke(method, ...args);
        } catch (error) {
            console.error(`Failed to invoke method ${method}`, error);
        }
    }, [connection]);

    const handleApplyCurrentChallenge = async (challengeId: string) => {
        const applyingChallenge = userChallenges.find(c => c.id === challengeId);

        // update current challenge status
        const cardsFromChallenge = (applyingChallenge.challenger === userProfile.login)
            ? applyingChallenge.challengerSequence.cards
            : applyingChallenge.opponentSequence.cards

        let updatedCards = userProfile.cards.map(card => {
            const newCardInstance = cardsFromChallenge.find(newCard => newCard.id === card.id);
            if (newCardInstance) {
                return { ...card, ...newCardInstance };
            } else {
                return card;
            }
        })

        if (applyingChallenge.cardReward != null) {
            const reward = applyingChallenge.cardReward;
            reward.owner = applyingChallenge.winner;
            if (applyingChallenge.winner === userProfile.login) {
                reward.new = true
                updatedCards = [...updatedCards, reward];
            } else {
                reward.lost = true
                updatedCards = [...updatedCards.filter(card => card.id !== applyingChallenge.cardReward.id), reward];
            }
        }

        const response = await fetch(`${serverUrl}/api/challenge/${applyingChallenge.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: "Archived"
            })
        });

        const updatedChallenge = await response.json()

        setUserChallenges(challenges => [...challenges.filter(challenge => challenge.id !== updatedChallenge.id), updatedChallenge])
        setUserProfile({ ...userProfile, cards: updatedCards });
    }

    return <CardDnaContext.Provider value={{
        logout: handleLogout,
        resetCards: resetUserCards,
        updateCard,
        currentChallenge,
        setCurrentChallenge: handleSetCurrentChallenge,
        applyCurrentChallenge: handleApplyCurrentChallenge,
        connection,
        players: playersWithConnectionInfos,
        userProfile,
        userCards: cards,
        userChallenges: userChallenges,
        library,
        setUserProfile: handleSetUserProfile,
        isLoggedIn,
        setIsLoggedIn,
        events,
        invoke,
        cancelChallenge
    }}>{children}</CardDnaContext.Provider>;
};


