import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium', className = '', ...props }) => {
    const baseStyles = "w-full rounded-[14px] font-semibold transition-all active:scale-[0.98] flex items-center justify-center";

    const variants = {
        primary: "bg-brand-orange text-white hover:bg-[#E56218]",
        secondary: "bg-[#EAEBEF] text-[#4E5968] hover:bg-[#DEDFE3]",
        text: "bg-transparent text-[#4E5968] hover:bg-black/5",
    };

    const sizes = {
        small: "h-[40px] text-[14px]",
        medium: "h-[56px] text-[16px]",
        large: "h-[62px] text-[18px]",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
