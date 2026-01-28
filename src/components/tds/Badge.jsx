import React from 'react';

const Badge = ({ children, variant = 'gray' }) => {
    const variants = {
        gray: "bg-[#F2F4F6] text-[#6B7684]",
        orange: "bg-[#FFF1EB] text-brand-orange",
        blue: "bg-[#E8F3FF] text-[#1B64DA]",
    };

    return (
        <span className={`inline-flex items-center px-[6px] py-[2px] rounded-[4px] text-[12px] font-medium leading-[1.5] ${variants[variant] || variants.gray}`}>
            {children}
        </span>
    );
};

export default Badge;
