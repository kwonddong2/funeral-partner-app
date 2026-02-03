import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';
import { Camera, FileText, ChevronRight } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        zipcode: '',
        address: '',
        detailAddress: ''
    });

    // Load saved data
    useEffect(() => {
        const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
            setFormData(JSON.parse(savedProfile));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('user_profile', JSON.stringify(formData));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="pb-24 bg-brand-bg min-h-screen relative">
            <Top
                title="내 정보 수정"
                showBack={true}
                onBack={() => navigate('/dashboard')}
            />

            <Toast message="저장되었습니다" isVisible={showToast} onClose={() => setShowToast(false)} />

            <div className="px-[20px] pt-[20px] space-y-8">

                {/* 1. Account Info */}
                <Section title="정산 계좌 정보">
                    <Input
                        label="은행명"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="예: 신한은행"
                    />
                    <Input
                        label="계좌번호"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="- 없이 숫자만 입력"
                        type="number"
                    />
                </Section>

                {/* 2. Documents (Mock UI) */}
                <Section title="제출 서류">
                    <div className="grid grid-cols-2 gap-3">
                        <UploadBox label="사업자등록증" />
                        <UploadBox label="통장 사본" />
                    </div>
                </Section>

                {/* 3. Shipping Address */}
                <Section title="배송지 정보">
                    <Input
                        label="우편번호"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        placeholder="우편번호 검색"
                    />
                    <Input
                        label="주소"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="기본 주소"
                    />
                    <Input
                        label="상세 주소"
                        name="detailAddress"
                        value={formData.detailAddress}
                        onChange={handleChange}
                        placeholder="나머지 주소 입력"
                    />
                </Section>

            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#F2F4F6] p-[20px] pb-[34px] z-10">
                <Button onClick={handleSave}>
                    저장하기
                </Button>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div>
        <h2 className="text-[18px] font-bold text-brand-black mb-4">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-[14px] font-medium text-[#6B7684] mb-2">{label}</label>
        <input
            className="w-full h-[52px] px-4 rounded-[16px] bg-white border border-[#E5E8EB] focus:border-brand-orange outline-none text-[16px] text-brand-black placeholder:text-[#B0B8C1]"
            {...props}
        />
    </div>
);

const UploadBox = ({ label }) => (
    <div className="aspect-[4/3] bg-white border border-dashed border-[#D1D6DB] rounded-[16px] flex flex-col items-center justify-center cursor-pointer active:bg-[#F9FAFB]">
        <Camera size={24} className="text-[#B0B8C1] mb-2" />
        <span className="text-[14px] font-medium text-[#8B95A1]">{label}</span>
    </div>
);

export default Profile;
