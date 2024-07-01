import { useEffect, useState } from "react"
import { Progress } from "./ui/progress"

export const WaitForApprovalProgress = ({ timeInSeconds }: { timeInSeconds: number }) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prevProgress => prevProgress + 100 / timeInSeconds)
        }, 1000)
        return () => clearInterval(interval)
    }, [timeInSeconds])

    return <div className="flex flex-col w-full z-100">
        <div className="text-center">
            Waiting for the opponent
        </div>
        <div className="m-6 flex justify-center">
            <Progress value={progress} className="w-[80%] bg-gray-300" />
        </div>
    </div>
}