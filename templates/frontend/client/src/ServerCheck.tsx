import React, { useState, useEffect } from 'react';
import { serverUrl } from './config';

interface Props {
    children: React.ReactNode;
}

const ServerCheck: React.FC<Props> = ({ children }) => {
    const [isServerDown, setIsServerDown] = useState(false);

    useEffect(() => {
        // Fonction pour vérifier l'état du serveur, par exemple avec un simple fetch
        const checkServerStatus = async () => {
            try {
                const response = await fetch(`${serverUrl}/api/health`); // Remplacez '/api/health' par l'URL de votre choix pour vérifier l'état du serveur
                if (!response.ok) throw new Error('Server is down');
                setIsServerDown(false);
            } catch (error) {
                setIsServerDown(true);
            }
        };

        checkServerStatus();

        // Optionnel : vérifier périodiquement l'état du serveur
        const intervalId = setInterval(checkServerStatus, 10000); // Toutes les 10 secondes

        return () => clearInterval(intervalId); // Nettoyage de l'intervalle
    }, []);

    if (isServerDown) {
        return <div>Server is down</div>;
    }

    return <>{children}</>;
};

export default ServerCheck;
