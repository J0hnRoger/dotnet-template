import React, { useEffect } from "react";
import { useCardDna } from "../CardDnaContext";
import { Notification, NotificationType } from "../components/Notification";

export const GameNotifier = () => {
    const { events } = useCardDna()
    const [notificationText, setNotificationText] = React.useState(null);
    const [notificationType, setNotificationType] = React.useState<NotificationType>("info");

    useEffect(() => {
        let timeoutId;
        if (notificationText) {
            timeoutId = setTimeout(() => setNotificationText(null), 3000);
        }
        return () => clearTimeout(timeoutId);
    }, [notificationText]);

    useEffect(() => {

        if (events == null)
            return


        events.onChallengeInit((data: any) => {
            setNotificationText(`Défi init à ${data.opponent}`);
            setNotificationType("info")
        });

        events.onChallengeAccepted((data: any) => {
            setNotificationText(`Défi ${data.id} accepté par ${data.opponent}`);
            setNotificationType("info")
        });

        events.onChallengeSent((data: any) => {
            setNotificationText(`Défi envoyé à ${data.opponent}`);
            setNotificationType("info")
        });

        events.onReceiveChallenge((data: any) => {
            setNotificationText(`${data.challenger} vous défis!`);
            setNotificationType("info")
        });

        events.onChallengeComplete((data: any) => {
            setNotificationText(`Défi relevé! Resultat: ${data}`);
            setNotificationType("info")
        });

        events.onUserConnected((data: string) => {
            setNotificationText(`${data} est connecté`);
            setNotificationType("info")
        })

        events.onChallengeCanceled((data: string) => {
            // @ts-ignore
            setNotificationText(`le challenge ${data.challenger} vs ${data.opponent} a été annulé`);
            setNotificationType("info")
        })

        events.onUserDisconnected((data: string) => {
            setNotificationText(`${data} s'est déconnecté`);
        })

        events.onGameError((data: string) => {
            setNotificationText(`Erreur server: ${data}`);
            setNotificationType("error")
        })
    }, [events])

    return (
        <Notification type={notificationType} show={notificationText != null} text={notificationText} />
    )
}
