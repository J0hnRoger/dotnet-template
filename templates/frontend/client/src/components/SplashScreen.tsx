import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <h1>Impossible de se connecter au serveur</h1>
            <p>Server en maintenance ou mise à jour en cours</p>
            <p>Veuillez vérifier votre connexion ou réessayer plus tard.</p>
        </div>
    );
};

export default SplashScreen;
