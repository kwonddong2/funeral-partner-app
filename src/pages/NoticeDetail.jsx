import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Top from '../components/tds/Top';
import { Calendar } from 'lucide-react';

const NoticeDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock Data (Usually fetched by ID)
    const noticeDetails = {
        1: {
            title: '11월 1주차 정산금 지급 안내 (주간 정산 도입)',
            date: '2024.11.01',
            content: `안녕하세요, 파트너님.\n고이장례연구소입니다.\n\n기존 월 1회 진행되던 정산 시스템이 파트너님들의 편의를 위해 11월부터 '주간 정산' 시스템으로 변경되었습니다.\n\n[주간 정산 안내]\n- 정산 주기: 매주 월요일 ~ 일요일 행사 마감 \n- 지급일: 차주 화요일\n\n이번 11월 1주차 정산(10/28 ~ 11/03)은 11/05(화) 순차적으로 입금될 예정입니다.\n\n자세한 내용은 '내 정산금' 메뉴에서 확인 가능합니다.\n감사합니다.`
        },
        2: {
            title: '서버 점검 예정 안내 (11/05 02:00~04:00)',
            date: '2024.10.30',
            content: `안녕하세요.\n안정적인 서비스 제공을 위해 서버 점검이 진행될 예정입니다.\n\n[점검 안내]\n- 일시: 11월 5일(화) 02:00 ~ 04:00 (2시간)\n- 내용: DB 최적화 및 보안 패치\n\n점검 시간 동안은 앱 접속 및 일부 기능 사용이 제한될 수 있습니다.\n양해 부탁드립니다.`
        },
        3: {
            title: '개인정보처리방침 개정 안내',
            date: '2024.10.15',
            content: `개인정보처리방침이 일부 개정되어 안내드립니다.\n...\n(상세 내용 생략)`
        }
    };

    const notice = noticeDetails[id] || { title: '존재하지 않는 공지입니다.', content: '', date: '-' };

    return (
        <div className="pb-12 bg-white min-h-screen">
            <Top
                title="공지사항"
                showBack={true}
                onBack={() => navigate(-1)}
            />

            <div className="px-5 pt-4">
                <div className="border-b border-gray-100 pb-4 mb-5">
                    <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2">
                        {notice.title}
                    </h2>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar size={14} /> {notice.date}
                    </p>
                </div>

                <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;
