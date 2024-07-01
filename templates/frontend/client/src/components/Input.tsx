
export const Input = ({ value, placeholder, onChange, type }) => {

    return (
        <input
            className="neumorphism-shadow bg-indigo h-[40px] m-4 p-[25px] border-none outline-none bg-[#ecf0f3] transition duration-200 ease-in-out rounded-md text-black"
            type={type || "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    )
}