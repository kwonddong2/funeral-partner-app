import React, { useState } from 'react';
import { Send, User, MapPin, Phone, FileText, CheckCircle } from 'lucide-react';

const AdminDispatch = () => {
    const [formData, setFormData] = useState({
        customerName: '홍길동',
        phone: '010-3791-6598',
        location: '경기 하남시',
        deathLocation: '자택 (호스피스 병동 퇴원)',
        relation: '동생',
        notes: '장례 최대한 간소화하게 치르고 싶어하시는 고객님이셔서, 불필요하다고 생각하는 부분에 대해서는 공제 필요합니다.',
        funeralHome: '하남시 마루공원 무빈소장 희망',
        jangji: '화장 : 성남 화장장 관외',
        sangjo: '2026 고이 무빈소장 159'
    });

    const [isSent, setIsSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSend = () => {
        const dispatchData = {
            ...formData,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage to trigger event in other tabs
        // We use a specific key that the Dashboard listens to
        localStorage.setItem('dispatch_request_v2', JSON.stringify(dispatchData));

        // Also force a storage event for current window if needed, 
        // but typically storage event fires on OTHER tabs.
        // To be safe for same-browser testing, we can also set a flag or just rely on the user having two tabs open.

        setIsSent(true);
        setTimeout(() => setIsSent(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-10 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-[#1B64DA] p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">본사 관제 시스템 (Simulated)</h1>
                        <p className="text-white/80 mt-1">파트너에게 전송할 배정 정보를 입력하세요.</p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        Admin Mode
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">배정 정보 입력</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="고객명(상주)">
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </InputGroup>
                            <InputGroup label="연락처">
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </InputGroup>
                        </div>

                        <InputGroup label="장례 희망 지역">
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </InputGroup>

                        <InputGroup label="임종 위치">
                            <input
                                name="deathLocation"
                                value={formData.deathLocation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </InputGroup>

                        <div className="grid grid-cols-1 gap-4">
                            <InputGroup label="장례식장 희망">
                                <input
                                    name="funeralHome"
                                    value={formData.funeralHome}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </InputGroup>
                            <InputGroup label="장지 / 상조 상품">
                                <input
                                    name="sangjo"
                                    value={formData.sangjo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-2"
                                    placeholder="상품 정보"
                                />
                                <input
                                    name="jangji"
                                    value={formData.jangji}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="장지 정보"
                                />
                            </InputGroup>
                        </div>

                        <InputGroup label="파트너 전달사항 (특이사항)">
                            <div className="relative">
                                <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                        </InputGroup>

                        <button
                            onClick={handleSend}
                            className={`w-full py-4 text-lg font-bold text-white rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                                ${isSent ? 'bg-green-500 hover:bg-green-600' : 'bg-[#1B64DA] hover:bg-blue-600'}
                            `}
                        >
                            {isSent ? (
                                <>
                                    <CheckCircle size={24} /> 전송 완료!
                                </>
                            ) : (
                                <>
                                    <Send size={24} /> 출동 요청 전송하기
                                </>
                            )}
                        </button>
                        <p className="text-center text-sm text-gray-500">
                            * 버튼을 누르면 파트너 앱(다른 탭)에 즉시 모달이 뜹니다.
                        </p>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">전송 데이터 미리보기</h2>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm font-mono text-sm text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(formData, null, 2)}
                        </div>

                        <div className="mt-6">
                            <h3 className="font-bold text-gray-800 mb-2">사용 가이드</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                <li>이 페이지는 <b>본사 관리자</b> 화면을 시뮬레이션 합니다.</li>
                                <li>새 탭을 열어 <b>localhost:5173</b> (도메인 루트)에 접속해두세요.</li>
                                <li>이 곳에서 [전송하기]를 누르면 파트너 앱에 모달이 뜹니다.</li>
                                <li>실제 서비스에서는 서버 Push 알림으로 동작합니다.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, children }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

export default AdminDispatch;
