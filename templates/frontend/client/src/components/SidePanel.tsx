import { useEffect, useState } from "react"

export const SidePanel = ({ children, show }) => {
    const [showPanel, setShowPanel] = useState(show)

    useEffect(() => {
        setShowPanel(show)
    }, [show])

    return (
        <>{showPanel && <div className="absolute right-0 p-8  bg-white text-black">
            <div className="flex flex-col ">
                <div className="self-end font-bold text-xl cursor-pointer" onClick={() => setShowPanel(false)} >x</div>
                <div>
                    {children}
                </div>
            </div>
        </div>}
        </>
    )
}