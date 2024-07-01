import { useRef, useEffect, FC } from "react"

import explosionsSprites from "../../assets/sprites/explosions.png"
import healSprites from "../../assets/sprites/healing.png"

import { Sounds, useSound } from "./useSound"

export type Animations = "explosion" | "fire" | "heal"

export interface AnimatorProps {
    delay: number
    animation: Animations
    sound: Sounds
    play: boolean
}

export const CanvaAnimator: FC<AnimatorProps> = ({ animation, play, delay, sound }) => {
    const { playSound } = useSound()

    const canvasRef = useRef<HTMLCanvasElement>(null)
    let width = 300
    let height = 300
    const x = 0
    const y = 0
    let spriteWidth = 300
    let spriteHeight = 300
    let maxFrame = 22
    let animationInterval = 1000 / 40


    if (animation == "heal") {
        width = 128
        height = 128
        spriteWidth = 128
        spriteHeight = 128
        maxFrame = 22
        animationInterval = 1000 / 10
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        let currentFrame = 0
        const currentRow = 0;
        const explosionImage = new Image();

        explosionImage.onload = () => {

            const animate = () => {
                context.clearRect(0, 0, width, height);
                context.drawImage(explosionImage, spriteWidth * currentFrame, spriteHeight * currentRow,
                    spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);

                currentFrame++;
                if (currentFrame < maxFrame) {
                    // Continuer l'animation jusqu'à ce que le dernier frame soit atteint
                    setTimeout(animate, animationInterval);
                }
            };

            if (play) {
                setTimeout(() => {
                    animate()
                    console.log(sound)
                    playSound(sound)
                }, delay);
            }

        };
        explosionImage.src = animation == "heal" ? healSprites : explosionsSprites;
    })

    return (
        <div className="absolute z-10 w-full h-full flex items-center justify-center" >
            <canvas className="flex" ref={canvasRef} width={width} height={height} />
        </div>
    )
}