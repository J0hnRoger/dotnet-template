import classnames from "classnames"

interface IconProps {
    classNames?: string
}

const Icon: React.FC<IconProps> = ({ classNames }) => {
    return <PlaySvg classNames={classNames} />
}

const PlaySvg = ({ classNames }) => (<svg
    className={classnames("w-6 h-6 text-gray-800 dark:text-white", classNames)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m2.707 14.293 5.586-5.586a1 1 0 0 0 0-1.414L2.707 1.707A1 1 0 0 0 1 2.414v11.172a1 1 0 0 0 1.707.707Z"></path>
</svg>)

export default Icon