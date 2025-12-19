
import React, { useState } from 'react';
import { UserProfile, Applicant, Post, TripEvent } from './types';
import { AlertTriangle, X, Camera, CheckCircle, Smartphone, Trash2, PlusCircle } from 'lucide-react';
import { AvatarWithGender } from './components';

export const ApplyModal = ({ eventTitle, onClose, onConfirm }: { eventTitle: string, onClose: () => void, onConfirm: (intro: string) => void }) => {
  const [intro, setIntro] = useState('');

  return (
    /* Changed class to className */
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
       <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 animate-scale-in shadow-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-1">申请加入</h3>
          <p className="text-sm text-gray-500 mb-4">"{eventTitle}"</p>
          
          <div className="mb-4">
             <label className="block text-sm font-bold text-gray-700 mb-2">
                自我介绍（投名状）<span className="text-red-500">*</span>
             </label>
             <textarea 
               /* Changed autofocus to autoFocus */
               autoFocus
               value={intro}
               onInput={e => setIntro((e.target as any).value)}
               placeholder="简单介绍一下自己，性格、特长等。"
               className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-brand-500 transition-all resize-none"
             />
          </div>

          <button 
             onClick={() => {
                if(!intro.trim()) {
                   alert("请填写自我介绍");
                   return;
                }
                onConfirm(intro);
             }}
             className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
             发送申请
          </button>
          <button onClick={onClose} className="w-full mt-3 text-gray-400 text-sm py-2">取消</button>
       </div>
    </div>
  );
};

export const CreatePostModal = ({ 
  user, 
  existingPosts, 
  allEvents, 
  onClose, 
  onSubmit 
}: { 
  user: UserProfile, 
  existingPosts: Post[], 
  allEvents: TripEvent[], 
  onClose: () => void, 
  onSubmit: (postData: { eventId: string, eventTitle: string, content: string, image: string }) => void 
}) => {
  const participatedEvents = allEvents.filter(e => 
    e.applicants.some(a => a.userId === user.id && a.status === 'approved') || e.organizer.id === user.id
  );

  const postedEventIds = existingPosts.filter(p => p.author.id === user.id).map(p => p.relatedEventId);
  const eligibleEvents = participatedEvents.filter(e => !postedEventIds.includes(e.id));
  
  const [selectedEventId, setSelectedEventId] = useState(eligibleEvents.length > 0 ? eligibleEvents[0].id : '');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const addImage = () => {
    if (images.length >= 9) {
      alert("最多上传9张图片");
      return;
    }
    // 模拟添加图片
    const newImg = `https://images.unsplash.com/photo-${1500000000000 + images.length}?w=400&q=80`;
    setImages([...images, newImg]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
     if (!selectedEventId) return alert("请选择活动");
     if (!content.trim()) return alert("请填写内容");
     if (images.length === 0) return alert("请至少上传一张照片");

     const event = eligibleEvents.find(e => e.id === selectedEventId);
     if (event) {
        onSubmit({
           eventId: event.id,
           eventTitle: event.title,
           content: content,
           image: images[0] // 演示仅取首图，实际可传全量
        });
     }
  };

  return (
    /* Changed class to className */
    <div className="fixed inset-0 z-[120] bg-white flex flex-col p-6 overflow-y-auto animate-slide-up">
       <div className="flex justify-between items-center mb-6 shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-400"><X size={24} /></button>
          <h2 className="text-xl font-black">发布瞬间</h2>
          <button 
             onClick={handleSubmit}
             className={`px-6 py-2 rounded-full font-black text-sm transition-all ${content && images.length ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'}`}
          >
             发布
          </button>
       </div>

       {eligibleEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
             <Camera size={64} className="text-gray-100 mb-4" />
             <p className="text-gray-400 font-bold">暂无可发布瞬间的活动<br/>快去参加一场吧！</p>
          </div>
       ) : (
          <div className="space-y-8 pb-10">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">关联活动</label>
                <select 
                  value={selectedEventId}
                  onInput={e => setSelectedEventId((e.target as any).value)}
                  className="w-full bg-gray-50 p-4 rounded-2xl font-bold outline-none border border-transparent focus:bg-white focus:border-brand-500"
                >
                   {eligibleEvents.map(e => (
                     <option key={e.id} value={e.id}>{e.title}</option>
                   ))}
                </select>
             </div>

             <div className="space-y-2">
                <textarea 
                  value={content}
                  onInput={e => setContent((e.target as any).value)}
                  placeholder="这一刻的想法..."
                  className="w-full h-40 bg-transparent text-lg font-bold outline-none resize-none placeholder:text-gray-300"
                />
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">照片集 ({images.length}/9)</label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                   {images.map((img, idx) => (
                      <div key={idx} className="aspect-square relative group">
                         <img src={img} className="w-full h-full object-cover rounded-xl border border-gray-100" />
                         <button 
                           onClick={() => removeImage(idx)}
                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                         >
                            <X size={12} strokeWidth={3} />
                         </button>
                      </div>
                   ))}
                   {images.length < 9 && (
                      <button 
                        onClick={addImage}
                        className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 active:bg-brand-50 active:border-brand-200 active:text-brand-500 transition-all"
                      >
                         <PlusCircle size={32} strokeWidth={1} />
                         <span className="text-[10px] mt-1 font-bold">上传</span>
                      </button>
                   )}
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export const ManageApplicantsModal = ({ applicants, capacity, onClose, onApprove, onReject }: { applicants: Applicant[], capacity: number, onClose: () => void, onApprove: (id: string) => void, onReject: (id: string) => void }) => {
  const approvedCount = applicants.filter(a => a.status === 'approved').length;
  
  return (
    /* Changed class to className */
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
       <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 animate-scale-in shadow-2xl max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 shrink-0">
             <div>
                <h3 className="text-xl font-bold text-gray-900">管理报名</h3>
                <p className="text-sm text-gray-500">已通过: {approvedCount}/{capacity}</p>
             </div>
             <button onClick={onClose}><X size={24} className="text-gray-400"/></button>
          </div>
          <div className="overflow-y-auto flex-1 space-y-4">
             {applicants.length === 0 ? (
               <div className="text-center py-8 text-gray-400 text-sm">暂无申请</div>
             ) : (
               applicants.map(app => (
                 <div key={app.userId} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center space-x-2">
                          <AvatarWithGender user={{ name: app.userName, avatar: app.userAvatar, gender: app.userGender }} />
                          <span className="font-bold text-gray-800">{app.userName}</span>
                       </div>
                       <span className="text-xs text-gray-400">{app.applyTime}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg text-sm text-gray-600 mb-3">{app.intro}</div>
                    {app.status === 'pending' ? (
                       <div className="flex space-x-2">
                          <button onClick={() => onReject(app.userId)} className="flex-1 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm font-medium">婉拒</button>
                          <button onClick={() => onApprove(app.userId)} className="flex-1 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-medium shadow-sm">通过</button>
                       </div>
                    ) : (
                       <div className={`text-center py-1.5 rounded-lg text-sm font-bold ${app.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {app.status === 'approved' ? '已通过' : '已拒绝'}
                       </div>
                    )}
                 </div>
               ))
             )}
          </div>
       </div>
    </div>
  );
};
