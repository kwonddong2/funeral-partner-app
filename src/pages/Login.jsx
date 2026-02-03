import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center px-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-20%] w-[250px] h-[250px] bg-orange-50 rounded-full blur-3xl opacity-60"></div>

            <div className="z-10 w-full max-w-sm mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                        장례파트너
                    </h1>
                    <p className="text-gray-500 font-medium">파트너님, 오늘도 힘내세요!</p>
                </div>

                <div className="space-y-4">
                    {/* Partner Login */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-black text-white h-[56px] rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        <span>파트너 로그인</span>
                        <div className="mt-1">→</div>
                    </button>

                    {/* Admin Login (Ghost Style) */}
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full bg-white text-gray-500 h-[56px] rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-all"
                    >
                        관리자 로그인
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-300">
                        Copyright © GOI Funeral. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
