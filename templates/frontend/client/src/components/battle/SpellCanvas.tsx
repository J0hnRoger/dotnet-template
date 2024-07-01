import { Shield3D } from '@components/3d/Shield3D';
import { Canvas } from "@react-three/fiber";

import { MotionConfig } from "framer-motion";
import { OrbitControls } from '@react-three/drei';
import { FC, useEffect, useState } from 'react';
import { TurnSkill } from './types';
import { getStatColor } from './Stat';
import { Sounds, useSound } from './useSound';

export interface SpellCanvasProps {
    spell: TurnSkill
    delay: number
    sound: Sounds
    play: boolean
}

export const SpellCanvas: FC<SpellCanvasProps> = ({ spell, sound, delay, play }) => {
    const { playSound } = useSound()
    const [color, setColor] = useState("#FFF")

    useEffect(() => {
        if (spell == null)
            return

        if (play) {
            setTimeout(() => {
                const spellTypeColor = getStatColor(spell.type.name)
                setColor(spellTypeColor)
                playSound(sound)
            }, delay);
        }
    }, [spell])

    if (spell == null)
        return


    return <div className='absolute z-10 w-full h-full'>
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
                    intensity={Math.PI * 2}
                />
                <Shield3D play={play} spell={spell} color={color} />
            </MotionConfig>
        </Canvas></div>
}