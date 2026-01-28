import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Top = ({ title, onBack, rightAction }) => {
    return (
        <header className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-sm h-[56px] flex items-center justify-between px-[20px]">
            <div className="flex items-center min-w-[40px]">
                {onBack && (
                    <button onClick={onBack} className="p-1 -ml-2">
                        <ChevronLeft size={24} className="text-brand-black" />
                    </button>
                )}
            </div>

            <div className="flex-1 text-center">
                {title && (
                    <h1 className="text-[17px] font-bold text-brand-black leading-tight">
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center justify-end min-w-[40px]">
                {rightAction}
            </div>
        </header>
    );
};

export default Top;
