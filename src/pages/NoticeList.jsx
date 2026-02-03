import React from 'react';
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import { ChevronRight, Megaphone, Calendar } from 'lucide-react';

const NoticeList = () => {
    const navigate = useNavigate();

    // Mock Data
    const notices = [
        {
            id: 1,
            title: '11월 1주차 정산금 지급 안내 (주간 정산 도입)',
            date: '2024.11.01',
            isImportant: true
        },
        {
            id: 2,
            title: '서버 점검 예정 안내 (11/05 02:00~04:00)',
            date: '2024.10.30',
            isImportant: false
        },
        {
            id: 3,
            title: '개인정보처리방침 개정 안내',
            date: '2024.10.15',
            isImportant: false
        }
    ];

    return (
        <div className="pb-12 bg-gray-50 min-h-screen">
            <Top
                title="공지사항"
                showBack={true}
                onBack={() => navigate(-1)}
            />

            <div className="px-5 pt-4">
                <div className="space-y-3">
                    {notices.map((notice) => (
                        <div
                            key={notice.id}
                            onClick={() => navigate(`/notice/${notice.id}`)}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
                        >
                            {notice.isImportant && (
                                <div className="absolute top-0 left-0 w-[4px] h-full bg-brand-orange"></div>
                            )}
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                    <h3 className={`text-[16px] font-bold mb-2 leading-snug ${notice.isImportant ? 'text-brand-black' : 'text-gray-700'}`}>
                                        {notice.isImportant && <span className="text-brand-orange mr-1">[필독]</span>}
                                        {notice.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} /> {notice.date}
                                    </p>
                                </div>
                                <ChevronRight size={20} className="text-gray-300 shrink-0 mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoticeList;
