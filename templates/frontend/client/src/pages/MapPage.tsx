import { Button } from "@components/ui/button";
import { cn } from "@lib/utils"
import { ShieldHalf, Sword } from "lucide-react";
import { useState } from "react"

export const glassEffect = {
    "backgroundColor": "rgba(255, 255, 255, 0.06)",
    "backdropFilter": "blur(15px)",
    "boxShadow": "0 25px 23px rgba(0, 0, 0, 0.15)",
}

export const MapPage = () => {

    const guilds = [
        {
            name: "Guilde 1",
            player: "JOHN",
            isMine: true,
            defenders: null,
            coordinates: { x: 500, y: 400 },
            colors: {
                "background": "#2db2ff",
                "box-shadow": "0 0 5px #2db2ff, 0 0 15px #2db2ff, 0 0 30px #2db2ff, 0 0 60px #2db2ff"
            }
        },
        {
            name: "Guilde 2",
            player: "EDGE",
            isMine: false,
            defenders: null,
            coordinates: { x: 1000, y: 800 },
            colors: {
                "background": "#1eff45",
                "box-shadow": "0 0 5px #1eff45, 0 0 15px #1eff45, 0 0 30px #1eff45, 0 0 60px #1eff45"
            }
        },
    ]
    return (<div className="relative w-full h-full overflow-hidden bg-no-repeat bg-center bg-cover bg-[url('/images/world-map.webp')]">
        {guilds.map(g => <GuildPoint guild={g} />)}
    </div>)
}

const GuildPoint = ({ guild }) => {
    const [show, setShow] = useState(false);

    return <div className="absolute flex flex-col items-center " style={{
        "top": `${guild.coordinates.y}px`, "left": `${guild.coordinates.x}px`,
    }}>
        {show && <div className="relative">
            <div className="absolute -top-32 rounded p-4" style={glassEffect}>
                <div className="text-center text-xxl mb-2">{guild.name}</div>
                <div className="text-center mb-2">{guild.player}</div>
                {guild.isMine && <Button onClick={() => { }}><ShieldHalf /><div className="ml-2">Défendre</div></Button>}
                {!guild.isMine && <Button onClick={() => { }}><Sword /><div className="ml-2">Attaquer</div></Button>}

            </div>
        </div>}
        {<div className="text-center mb-2">{guild.name}</div>}
        <div onClick={() => setShow(() => !show)} className={cn(`w-6 h-6 rounded-full bg-violet-400`)}
            style={{
                ...guild.colors
            }}>
        </div>
    </div>
}