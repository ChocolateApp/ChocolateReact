import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    state: 'primary' | 'secondary';
    iconBefore?: React.ReactNode;
    iconAfter?: React.ReactNode;
    to?: string;
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    state,
    iconBefore,
    iconAfter,
    to,
    onClick,
    className = '',
    children,
    ...props
}) => {
    const baseStyle = 'flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium';

    const primaryStyle = 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300';
    const secondaryStyle = 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800';
    const selectedStyle = state === 'primary' ? primaryStyle : secondaryStyle;

    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`${baseStyle} ${selectedStyle} ${className} transition-colors duration-300`}
            {...props}
        >
            {iconBefore && <span>{iconBefore}</span>}
            {children}
            {iconAfter && <span>{iconAfter}</span>}
        </button>
    );
};

export default Button;
