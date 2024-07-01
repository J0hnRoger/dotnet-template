import { TurnBoard, TurnBoardComponent } from "@components/battle/TurnBoard"
import { Button } from "@components/Button"
import { Textarea } from "@components/ui/textarea"
import { useState } from "react"
import { CardStats, StatDto } from "../types"
import { Side } from "@components/battle/BattleCard"

const initialTurn = {
    "index": 0,
    "cards": [
        {
            "id": "5536a5e8-6481-4214-b1c2-d4090ff025c9",
            "position": 2 as 1 | 2 | 3,
            "name": "Géant",
            "pv": 20,
            "attacker": false,
            "target": null,
            "side": "attacker" as Side,
            "spell": null,
            "player": "PLAYER 1",
            "stats": [] as StatDto[]
        },
        {
            "id": "57305815-e96d-4cdb-82ba-28a1ec390c5d",
            "position": 2 as 1 | 2 | 3,
            "name": "Spectre",
            "pv": 15,
            "attacker": false,
            "target": false,
            "side": "opponent" as Side,
            "spell": null,
            "player": "BOT",
            "stats": [] as StatDto[]
        }
    ],
    "spell": null,
    "player": "attacker",
    "target": "opponent",
    "actor": "",
    "damage": 0,
    "stats": []
}

const turnOne = {
    "index": 1,
    "cards": [
        {
            "id": "5536a5e8-6481-4214-b1c2-d4090ff025c9",
            "position": 2 as 1 | 2 | 3,
            "name": "Géant",
            "pv": 20,
            "attacker": true,
            "target": null,
            "side": "attacker" as Side,
            "spell": null,
            "player": "PLAYER 1",
            "stats": [] as StatDto[]
        },
        {
            "id": "57305815-e96d-4cdb-82ba-28a1ec390c5d",
            "position": 2 as 1 | 2 | 3,
            "name": "Spectre",
            "pv": 8,
            "attacker": false,
            "target": true,
            "side": "defender" as Side,
            "spell": null,
            "player": "BOT",
            "stats": [] as StatDto[]
        }
    ],
    "spell": {
        "cardId": "5536a5e8-6481-4214-b1c2-d4090ff025c9",
        "name": "Coup écrasant",
        "type": {
            "name": "Physique",
            "value": 10
        },
        "effects": [
            {
                "value": -8,
                "targetStat": {
                    "name": CardStats.HP,
                    "value": 0
                },
                "targetActor": "frontline" as "frontline" | "backline" | "random" | "self",
                "side": "opponents" as "allies" | "opponents" | "both",
                "duration": 1,
                "specialEffect": null
            }
        ],
        "positioning": [
            {
                "target": "frontline" as "frontline" | "backline" | "random" | "self",
                "side": "opponents" as "allies" | "opponents" | "both",
            }
        ]
    },
    "player": "challenger",
    "actor": "Géant",
    "damage": 0,
    "target": "opponent",
}

export const CardAnimationPage = () => {
    const [allTurns] = useState<TurnBoard[]>([initialTurn, turnOne])
    const [turn, setTurn] = useState<TurnBoard>(initialTurn)

    const [turnText, setTurnText] = useState<string>(JSON.stringify(initialTurn, null, 2))

    const setNextTurn = (index: number) => {
        setTurn(allTurns[index])
    }

    return (
        <div className="flex flex-col flex-wrap">
            <div className="flex flex-col">
                <div>
                    <Textarea value={turnText} placeholder={""} onChange={(ev) => setTurnText(ev.target.value)} />
                </div>
                <div className="p-4 text-center space-x-2">
                    <Button onClick={() => setNextTurn(0)}>
                        Go turn 0
                    </Button>
                    <Button onClick={() => setNextTurn(1)}>
                        Go turn 1
                    </Button>
                </div>
            </div>
            <div className="flex relative">
                <TurnBoardComponent previousTurn={null} turn={turn}></TurnBoardComponent>
            </div>
        </div>
    )
}
