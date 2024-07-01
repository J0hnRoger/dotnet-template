// LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardDna } from '../CardDnaContext';
import { serverUrl } from '../config';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { Leva } from 'leva';
// import { Card3D } from '@components/3d/Card3D';
import { Shield3D } from '@components/3d/Shield3D';
import { Canvas } from "@react-three/fiber";

import { MotionConfig } from "framer-motion";
import { OrbitControls } from '@react-three/drei';
import { CardColors } from '../types';

const LoginPage: React.FC = () => {
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { userProfile, setUserProfile } = useCardDna();
    const navigate = useNavigate();

    useEffect(() => {
        if (userProfile !== null)
            navigate('/');

    }, [userProfile])

    const handleLogin = async () => {
        // Remplacez cette URL par l'URL de votre endpoint de connexion
        const response = await fetch(`${serverUrl}/api/player/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: user, password: password }),
            credentials: 'include',
        });

        if (response.ok) {
            const result = await response.json();
            setUserProfile(result);
            navigate('/');
        } else {
            alert('Échec de la connexion');
        }
    };

    const handleSubscribe = async () => {
        // Remplacez cette URL par l'URL de votre endpoint de connexion
        const response = await fetch(`${serverUrl}/api/player/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: user, password: password }),
            credentials: 'include',
        });

        if (response.ok) {
            const result = await response.json();
            setUserProfile(result);
            navigate('/');
        } else {
            alert('Échec de l\'inscription');
        }
    };

    return (
        <div className='flex flex-col space-y-8 p-8'>
            <Leva hidden={false} />
            <Input
                value={user}
                onChange={(e) => setUser(e)}
                placeholder="Login" type={"text"}
            />
            <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e)}
                placeholder="Mot de passe"
            />
            <Button onClick={handleLogin}>Connexion</Button>
            <Button className='bg-yellow-400' onClick={handleSubscribe}>S'inscrire</Button>
            <div className='w-full h-[500px]'>
                <CardShowcase cardName={"giant.webp"} />
            </div>
        </div>
    );
};

export default LoginPage;

export const CardShowcase = ({ cardName }) => {
    return (
        <Canvas
            shadows
            camera={{
                position: [0, 1, 3],
                fov: 30,
            }}
        >
            <MotionConfig
                transition={{
                    type: "spring",
                    mass: 5,
                    stiffness: 500,
                    damping: 100,
                    restDelta: 0.0001,
                }}
            >
                <OrbitControls />
                <ambientLight
                    position={[3.3, 1.0, 4.4]}
                    castShadow
                    intensity={Math.PI * 2}
                />
                <Shield3D color={CardColors.Psychique} />
            </MotionConfig>
        </Canvas>
    )
}
