import React, { useState } from 'react';
import { ChevronLeft, Copy, CheckCircle2, UserPlus, TrendingUp, QrCode, X } from 'lucide-react';
import QRCode from "react-qr-code";
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import Toast from '../components/tds/Toast';

const BusinessInvite = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    const [showQrModal, setShowQrModal] = useState(false);

    // Mock Data
    const inviteLink = "https://goi.kr/invite/P202502";
    const stats = {
        totalEarned: 480000,
        signupCount: 5,
        dispatchCount: 2,
        history: [
            { id: 1, name: '박*수', date: '2024.01.28', status: 'dispatch', amount: 170000 },
            { id: 2, name: '이*영', date: '2024.01.25', status: 'signup', amount: 30000 },
            { id: 3, name: '최*민', date: '2024.01.20', status: 'dispatch', amount: 170000 },
            { id: 4, name: '김*호', date: '2024.01.15', status: 'signup', amount: 30000 },
            { id: 5, name: '정*우', date: '2024.01.10', status: 'signup', amount: 30000 },
        ]
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="pb-12 bg-gray-50 min-h-screen">
            <Top
                title="현장 가입 링크"
                leftAction={
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ChevronLeft size={24} className="text-gray-800" />
                    </button>
                }
            />
            <Toast message="링크가 복사되었습니다" isVisible={showToast} onClose={() => setShowToast(false)} />

            <div className="px-5 pt-4 space-y-6">

                {/* 1. Header Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                        고객님을 초대하고<br />
                        <span className="text-brand-orange">추가 수익</span>을 만들어보세요
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        가입 시 3만원 + 출동 시 17만원 (총 20만원)
                    </p>
                </div>

                {/* 2. Link Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                        <span className="text-gray-600 font-medium truncate mr-2 text-sm">{inviteLink}</span>
                        <button
                            onClick={copyToClipboard}
                            className="text-brand-orange font-bold text-sm whitespace-nowrap flex items-center gap-1"
                        >
                            <Copy size={16} /> 복사
                        </button>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="w-full bg-brand-black text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform"
                    >
                        링크 공유하기
                    </button>
                    <button
                        onClick={() => setShowQrModal(true)}
                        className="w-full mt-3 bg-white border border-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    >
                        <QrCode size={20} /> QR 코드로 보여주기
                    </button>
                </div>

                {/* 3. Stats Dashboard */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <TrendingUp size={20} className="text-gray-400" /> 내 리워드 현황
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 col-span-2">
                            <div className="text-gray-500 text-sm font-medium mb-1">총 누적 수익</div>
                            <div className="text-3xl font-bold text-brand-orange">
                                {stats.totalEarned.toLocaleString()}원
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
                                <UserPlus size={16} /> 가입 완료
                            </div>
                            <div className="text-xl font-bold text-gray-800">{stats.signupCount}건</div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
                                <CheckCircle2 size={16} /> 출동 완료
                            </div>
                            <div className="text-xl font-bold text-gray-800">{stats.dispatchCount}건</div>
                        </div>
                    </div>
                </div>

                {/* 4. History List */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-3 mt-6">최근 활동 내역</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {stats.history.map((item, index) => (
                            <div key={item.id} className={`p-4 flex justify-between items-center ${index !== stats.history.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-800">{item.name} 고객님</span>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${item.status === 'dispatch'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-green-100 text-green-600'
                                            }`}>
                                            {item.status === 'dispatch' ? '출동 완료' : '가입 완료'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400">{item.date}</div>
                                </div>
                                <div className="font-bold text-gray-800">
                                    +{item.amount.toLocaleString()}원
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* QR Code Modal */}
                {showQrModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5 animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center animate-scale-in relative">
                            <button
                                onClick={() => setShowQrModal(false)}
                                className="absolute right-4 top-4 text-gray-400 p-2"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-xl font-bold text-brand-black mb-2">QR 코드 스캔</h3>
                            <p className="text-gray-500 text-center mb-6 text-sm">
                                고객님의 휴대폰 카메라로<br />
                                아래 QR 코드를 비춰주세요
                            </p>

                            <div className="bg-white p-4 rounded-2xl border-2 border-brand-orange shadow-sm mb-6">
                                <QRCode value={inviteLink} size={200} />
                            </div>

                            <div className="text-brand-orange font-bold text-sm bg-orange-50 px-4 py-2 rounded-full mb-2">
                                {inviteLink}
                            </div>

                            <button
                                onClick={() => setShowQrModal(false)}
                                className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default BusinessInvite;
