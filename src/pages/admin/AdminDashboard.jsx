import React from 'react';
import { Users, Send, DollarSign, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    // Mock Stats
    const stats = [
        { label: '활동 중 파트너', value: '12명', icon: <Users size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
        { label: '금주 출동 건수', value: '4건', icon: <Send size={20} className="text-orange-500" />, bg: 'bg-orange-50' },
        { label: '정산 예정 금액', value: '345만원', icon: <DollarSign size={20} className="text-green-500" />, bg: 'bg-green-50' },
        { label: '처리 필요 이슈', value: '1건', icon: <AlertCircle size={20} className="text-red-500" />, bg: 'bg-red-50' },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                        <div>
                            <div className="text-sm text-gray-500 font-medium mb-1">{stat.label}</div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Mock */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">최근 출동 현황</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-medium text-gray-800">김철수 고객님 (서울아산병원)</div>
                                    <div className="text-xs text-gray-500">담당자: 김지훈 파트너</div>
                                </div>
                                <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-bold">진행 중</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">정산 이슈 알림</h3>
                    <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-500 mt-0.5" size={20} />
                        <div>
                            <div className="font-bold text-red-700 text-sm">김*호 고객님 클레임 접수됨</div>
                            <div className="text-xs text-red-600 mt-1">사유: 접객 도우미 태도 불량... (확인 필요)</div>
                            <button className="mt-2 text-xs bg-white border border-red-200 text-red-600 px-3 py-1 rounded shadow-sm hover:bg-red-50">
                                정산 관리로 이동
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
