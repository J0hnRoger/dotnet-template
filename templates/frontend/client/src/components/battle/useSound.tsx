import fireSound from "../../assets/sounds/fire2.mp3"
import healSound from "../../assets/sounds/heal.mp3"

export type Sounds = "physical" | "fire" | "heal"

export const useSound = () => {

    const play = (soundName: Sounds) => {
        const soundFile = soundName == "heal" ? healSound : fireSound
        const sound = new Audio(soundFile)
        sound.play()
    }

    return {
        playSound: play
    }
}