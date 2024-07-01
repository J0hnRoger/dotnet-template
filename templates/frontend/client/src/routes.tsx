import React, { FC, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CardsPage from './pages/CardsPage';
import { useCardDna } from './CardDnaContext';
import BattlePage from './pages/BattlePage';
import { DashBoardPage } from './pages/Dashboard';
import { HistoryPage } from './pages/HistoryPage';
import { CardAdminPage } from './pages/CardsAdminPage';
import { CardAnimationPage } from './pages/CardAnimationPage';
import { MapPage } from './pages/MapPage';

export const AppRoutes: React.FC = () => {
    return (
        <AuthGuard>
            <Routes>
                <Route path="/" element={<DashBoardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/battle" element={<BattlePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/admin" element={<CardAdminPage />} />
                <Route path="/animations" element={<CardAnimationPage />} />
            </Routes>
        </AuthGuard>
    );
};

export interface AuthGuardProps {
    children?: React.ReactNode
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
    const { isLoggedIn } = useCardDna()
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn)
            navigate('/login');
    }, [isLoggedIn, navigate]);

    return <>{children}</>;
}