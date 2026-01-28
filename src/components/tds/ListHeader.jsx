import React from 'react';

const ListHeader = ({ children, right }) => {
    return (
        <div className="flex items-center justify-between pt-[24px] pb-[8px] px-[24px]">
            <div className="text-[18px] font-bold text-brand-black">{children}</div>
            {right && <div>{right}</div>}
        </div>
    );
};

export default ListHeader;
