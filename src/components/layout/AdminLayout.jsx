import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Send, DollarSign, Users, Bell, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
        { id: 'dispatch', label: '출동 관리', icon: <Send size={20} />, path: '/admin/dispatch' },
        { id: 'settlement', label: '정산 관리', icon: <DollarSign size={20} />, path: '/admin/settlement' },
        { id: 'partners', label: '파트너 관리', icon: <Users size={20} />, path: '/admin/partners' },
        { id: 'notice', label: '공지사항', icon: <Bell size={20} />, path: '/admin/notices' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className="w-[240px] bg-slate-900 text-white flex flex-col shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight">GOI Admin</h1>
                    <p className="text-xs text-slate-400 mt-1">고이장례연구소 통합관리</p>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                                    ? 'bg-brand-orange text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full px-2 py-2"
                    >
                        <LogOut size={16} /> 앱으로 돌아가기
                    </button>
                    <div className="text-[10px] text-slate-600 mt-2 px-2">
                        v1.0.0 (Manager Mode)
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <h2 className="font-bold text-gray-800">
                        {menuItems.find(item => isActive(item.path))?.label || '관리자 페이지'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            관리자 님
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
