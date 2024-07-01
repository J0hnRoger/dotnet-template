import classNames from "classnames";
import React, { FC, ReactNode } from "react";

type ButtonProps = Exclude<React.ComponentPropsWithoutRef<"button">, "onClick"> & MyButtonProps;

export interface MyButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    children: ReactNode;
}

export const Button: FC<ButtonProps> = ({ children, onClick, disabled, className, ...rest }) => {
    const buttonClass = classNames(
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded',
        className // className peut être une string, un objet, ou même un tableau
    );
    return (
        <button disabled={disabled} onClick={onClick} className={buttonClass} {...rest}>
            {children}
        </button>
    )
} 