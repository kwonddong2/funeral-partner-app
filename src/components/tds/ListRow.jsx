import React from 'react';
import { ChevronRight } from 'lucide-react';

const ListRow = ({ left, contents, right, onClick, hasArrow = true, className = '' }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between py-[16px] px-[24px] cursor-pointer active:bg-black/5 transition-colors ${className}`}
        >
            <div className="flex items-center gap-[12px] flex-1">
                {left && <div className="shrink-0">{left}</div>}
                <div className="flex flex-col flex-1">
                    {contents}
                </div>
            </div>

            <div className="flex items-center gap-[8px] pl-[12px]">
                {right && <div className="text-[15px] text-[#8B95A1]">{right}</div>}
                {hasArrow && <ChevronRight size={20} className="text-[#C5CCD5]" />}
            </div>
        </div>
    );
};

export default ListRow;
