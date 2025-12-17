
import React from 'react';
import { UserProfile } from '../types';
import { Users2, MessageCircle, LogOut, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { AvatarWithGender } from '../components';

export const LoginView = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-brand-500 to-purple-600 flex flex-col items-center justify-center p-8 text-white">
     <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl text-brand-600">
        <Users2 size={48} />
     </div>
     <h1 className="text-3xl font-bold mb-2">搭子社区</h1>
     <p className="text-brand-100 mb-10 text-center">找玩伴，组局子，让退休生活更精彩</p>
     
     <button 
       onClick={onLogin}
       className="w-full bg-white text-brand-600 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center"
     >
       <MessageCircle size={24} className="mr-2" />
       微信一键登录
     </button>
     <p className="text-xs text-white/60 mt-6 text-center">
        登录即代表同意《用户协议》和《隐私政策》
     </p>
  </div>
);

export const ProfileView = ({ 
  user, 
  onLogout, 
}: { 
  user: UserProfile, 
  onLogout: () => void, 
  onBindPhone: () => void, // Kept in prop signature to avoid breaking parent, but unused
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-6 mb-4">
        <div className="flex items-center space-x-4">
          <AvatarWithGender user={user} size="w-16 h-16" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${user.gender === 'male' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-pink-200 text-pink-600 bg-pink-50'}`}>
                {user.gender === 'male' ? '男' : '女'}
              </span>
              <span className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <ShieldCheck size={12} className="mr-1"/> 微信已认证
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-4">
         <div className="py-4 border-b border-gray-100 flex justify-between items-center active:bg-gray-50">
            <span className="text-gray-700">我的发布</span>
            <ChevronRight size={20} className="text-gray-300" />
         </div>
         <div className="py-4 border-b border-gray-100 flex justify-between items-center active:bg-gray-50">
            <span className="text-gray-700">我的加入</span>
            <ChevronRight size={20} className="text-gray-300" />
         </div>
         <div className="py-4 border-b border-gray-100 flex justify-between items-center active:bg-gray-50">
            <span className="text-gray-700">联系客服</span>
            <ChevronRight size={20} className="text-gray-300" />
         </div>
      </div>

      <div className="mt-8 px-4">
        <button 
          onClick={onLogout}
          className="w-full bg-white text-red-500 py-3 rounded-xl font-medium shadow-sm border border-gray-200 flex items-center justify-center active:bg-gray-50"
        >
          <LogOut size={18} className="mr-2" />
          退出登录
        </button>
      </div>
    </div>
  );
};
