import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const Toast = ({ message, isVisible, onClose, duration = 3000 }) => {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        setShow(isVisible);
        if (isVisible) {
            const timer = setTimeout(() => {
                setShow(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!show) return null;

    return (
        <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-[999] w-full max-w-[420px] px-5 animate-fade-in-up pointer-events-none">
            <div className="bg-[#333D4B]/95 backdrop-blur-sm text-white px-5 py-4 rounded-[16px] shadow-lg flex items-center justify-between pointer-events-auto">
                <span className="text-[15px] font-semibold">{message}</span>
                <CheckCircle2 size={20} className="text-[#36f]" /> {/* Brand Blue or Green */}
            </div>
        </div>
    );
};

export default Toast;
