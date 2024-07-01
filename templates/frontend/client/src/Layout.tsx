import React from 'react';
import { Link } from 'react-router-dom';
import { useCardDna } from './CardDnaContext';
import styles from './Layout.module.css';
import { GameNotifier } from './pages/GameNotifier';
import ChallengeIsComingDialog from '@components/ChallengeIsCommingDialog';
import { cn } from '@lib/utils';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userProfile, logout } = useCardDna();

    const handleLogout = () => {
        logout();
    }

    return (
        <>
            <header className={cn(styles.header, "text-xl bg-primary text-brown-100 border-b-brown-100 border-solid border-b-2")}>
                <div className={styles.userProfile}>
                    {userProfile?.login}
                </div>
                <nav>
                    <ul className={styles.navList}>
                        <li><Link to="/">Lobby</Link></li>
                        <li><Link to="/map">Map</Link></li>
                        <li><Link to="/cards">Mes Cartes</Link></li>
                        <li><Link to="/history">History</Link></li>
                        {userProfile?.login == "JOHN"
                            && <li><Link to="/admin">Admin</Link></li>}

                        {userProfile?.login == "JOHN"
                            && <li><Link to="/animations">Animations</Link></li>}
                    </ul>
                </nav>
                <div className={styles.quickActions}>
                    <a href="/" onClick={handleLogout}>Logout</a>
                </div>
            </header>
            <main className={cn(styles.mainContent, "bg-primary text-white text-xl overflow-hidden")}>
                <>
                    <ChallengeIsComingDialog />
                    {children}
                </>
            </main >
            <footer className='absolute right-0 bottom-10 pr-2 overflow-hidden'>
                <GameNotifier />
            </footer>
        </>
    );
};

export default Layout;
