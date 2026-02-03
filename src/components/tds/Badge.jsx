import React from 'react';

const Badge = ({ children, variant = 'gray' }) => {
    const variants = {
        gray: "bg-[#F2F4F6] text-[#6B7684]",
        orange: "bg-[#FFF1EB] text-brand-orange",
        blue: "bg-[#E8F3FF] text-[#1B64DA]",
        red: "bg-red-50 text-red-600",
        black: "bg-gray-100 text-gray-800", // Or black text? 'black' usually implies dark. Let's make it bg-black text-white or similar? No, Badge style seems soft. Let's use gray-800/gray-200 or similar. Wait, user wants distinction.
        // Let's go with standard soft badges:
        // Completed (Black/Dark): bg-gray-100 text-gray-900?
        green: "bg-green-50 text-green-700",
    };

    return (
        <span className={`inline-flex items-center px-[6px] py-[2px] rounded-[4px] text-[12px] font-medium leading-[1.5] ${variants[variant] || variants.gray}`}>
            {children}
        </span>
    );
};

export default Badge;
