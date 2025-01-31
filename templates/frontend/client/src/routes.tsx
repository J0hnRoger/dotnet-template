import React, { FC, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';

export const AppRoutes: React.FC = () => {
    return (
        <AuthGuard>
            <Routes>
                <Route path="/Home" element={<Home />} />
            </Routes>
        </AuthGuard>
    );
};

export interface AuthGuardProps {
    children?: React.ReactNode
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
    // const { isLoggedIn } = useProfile()
    const navigate = useNavigate();
    useEffect(() => {
        // if (!isLoggedIn)
        //    navigate('/login');
    }, [navigate]);

    return <>{children}</>;
}