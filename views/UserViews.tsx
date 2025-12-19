
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Users2, MessageCircle, ChevronRight, User, Calendar, Smile, Edit, ShieldCheck, Heart, ArrowLeft, Camera } from 'lucide-react';
import { AvatarWithGender } from '../components';
import { AGE_RANGES } from '../mockData';

export const LoginView = ({ onLogin }: { onLogin: () => void }) => (
  /* Changed class to className */
  <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-700 flex flex-col items-center justify-center p-8 text-white">
     <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl text-brand-600 animate-bounce">
        <Users2 size={48} />
     </div>
     <h1 className="text-4xl font-black mb-4 tracking-tighter">友伴旅行</h1>
     <p className="text-brand-100 mb-12 text-center text-lg font-medium">找好搭子，开启精彩退休生活</p>
     
     <button 
       onClick={onLogin}
       className="w-full bg-white text-brand-600 py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center"
     >
       <MessageCircle size={24} className="mr-3" />
       微信一键登录
     </button>
     <p className="text-xs text-white/40 mt-8 text-center font-medium">
        登录即代表同意《用户协议》和《隐私政策》
     </p>
  </div>
);

export const ProfileView = ({ 
  user,
  onEditProfile
}: { 
  user: UserProfile,
  onEditProfile: () => void
}) => {
  return (
    /* Changed class to className */
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-white p-8 pb-12 mb-4 shadow-sm border-b border-gray-100 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 bg-brand-50 w-40 h-40 rounded-full opacity-50"></div>
        <div className="flex flex-col items-center relative z-10 pt-4">
          <AvatarWithGender user={user} size="w-24 h-24" />
          <h2 className="text-2xl font-black text-gray-900 mt-4 mb-1">{user.name}</h2>
          <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold">
             <span>{user.ageGroup || '60后'}</span>
             <span>·</span>
             <span>山东 烟台</span>
          </div>
          
          <button 
            onClick={onEditProfile}
            className="mt-6 bg-brand-50 text-brand-600 px-6 py-2 rounded-full font-black text-sm flex items-center space-x-2 active:scale-95 transition-all border border-brand-100"
          >
             <Edit size={16} />
             <span>编辑个人资料</span>
          </button>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 divide-y divide-gray-50">
           <div className="p-6 flex justify-between items-center active:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                 </div>
                 <span className="text-gray-800 font-black">我发起的活动</span>
              </div>
              <ChevronRight size={20} className="text-gray-200" />
           </div>
           <div className="p-6 flex justify-between items-center active:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                    <Users2 size={20} />
                 </div>
                 <span className="text-gray-800 font-black">我参加的活动</span>
              </div>
              <ChevronRight size={20} className="text-gray-200" />
           </div>
           <div className="p-6 flex justify-between items-center active:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
                    <Heart size={20} />
                 </div>
                 <span className="text-gray-800 font-black">我的收藏</span>
              </div>
              <ChevronRight size={20} className="text-gray-200" />
           </div>
        </div>
      </div>
    </div>
  );
};

export const EditProfileView = ({ 
  user, 
  onBack, 
  onSave 
}: { 
  user: UserProfile, 
  onBack: () => void, 
  onSave: (u: UserProfile) => void 
}) => {
  const [tempUser, setTempUser] = useState(user);

  const handleSave = () => {
    onSave(tempUser);
    onBack();
    alert('资料已更新');
  };

  return (
    /* Changed class to className */
    <div className="fixed inset-0 bg-white z-[110] flex flex-col p-6 overflow-y-auto">
       <div className="flex justify-between items-center mb-10">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400"><ArrowLeft size={24}/></button>
          <h2 className="text-xl font-black">编辑资料</h2>
          <button onClick={handleSave} className="text-brand-600 font-black">保存</button>
       </div>

       <div className="space-y-8">
          <div className="flex flex-col items-center">
             <div className="relative group cursor-pointer">
                <AvatarWithGender user={tempUser} size="w-24 h-24" />
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera size={24} />
                </div>
             </div>
             <span className="text-xs text-gray-400 mt-3 font-bold">点击更换头像</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">昵称</label>
               <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl">
                  <Smile size={20} className="text-brand-500" />
                  <input 
                    value={tempUser.name}
                    onInput={(e) => setTempUser({...tempUser, name: (e.target as any).value})}
                    className="bg-transparent flex-1 font-black outline-none"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">性别</label>
               <div className="flex bg-gray-50 p-2 rounded-2xl">
                  <button 
                    onClick={() => setTempUser({...tempUser, gender: 'male'})}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${tempUser.gender === 'male' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400'}`}
                  >男</button>
                  <button 
                    onClick={() => setTempUser({...tempUser, gender: 'female'})}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${tempUser.gender === 'female' ? 'bg-white text-pink-600 shadow-md' : 'text-gray-400'}`}
                  >女</button>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">出生年代</label>
               <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl">
                  <Calendar size={20} className="text-brand-500" />
                  <select 
                    value={tempUser.ageGroup}
                    onInput={(e) => setTempUser({...tempUser, ageGroup: (e.target as any).value})}
                    className="bg-transparent flex-1 font-black outline-none appearance-none"
                  >
                     {AGE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
}
