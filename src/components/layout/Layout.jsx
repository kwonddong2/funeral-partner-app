import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-mobile min-h-screen bg-brand-bg shadow-2xl overflow-hidden relative">
                {children}
            </div>
        </div>
    );
};

export default Layout;
