import { useEffect } from 'react';

const useScroll = (onScrollUp, onScrollDown) => {
    // Garder la trace de la dernière position de scroll
    let lastScrollY = window.scrollY;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                // L'utilisateur fait défiler vers le haut
                onScrollUp();
            } else if (currentScrollY > lastScrollY) {
                // L'utilisateur fait défiler vers le bas
                onScrollDown();
            }

            // Mettre à jour la dernière position de scroll
            lastScrollY = currentScrollY;
        };

        // Ajouter l'écouteur d'événement de scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            // Supprimer l'écouteur d'événement lors du nettoyage
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onScrollUp, onScrollDown]); // Les callbacks sont ajoutés en tant que dépendances
};

export default useScroll;
