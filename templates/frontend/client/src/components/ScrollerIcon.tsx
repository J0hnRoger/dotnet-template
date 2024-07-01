import "./ScrollerIcon.css"

export const ScrollerIcon = ({ onClick }) => {
    return (
        <div className="scroll-icon" onClick={onClick} >
            <div className="scroll-icon__wheel-outer">
                <span className="scroll-icon__wheel-inner"></span>
            </div>
        </div>
    );
}