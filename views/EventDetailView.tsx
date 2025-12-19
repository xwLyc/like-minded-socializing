
import React, { useState, useRef } from 'react';
import { TripEvent, UserProfile, Applicant, Comment } from '../types';
import { ArrowLeft, MapPin, Calendar, Users, Send, CheckCircle, X } from 'lucide-react';
import { AvatarWithGender, ConsultationThread } from '../components';
import { ApplyModal, ManageApplicantsModal } from '../modals';

export const EventDetailView = ({ 
  event, 
  onBack, 
  user,
  onUpdateEvent,
  onCreateChat
}: { 
  event: TripEvent, 
  onBack: () => void, 
  user: UserProfile, 
  onUpdateEvent: (e: TripEvent) => void,
  onCreateChat: (e: TripEvent) => void
}) => {
  const [showApply, setShowApply] = useState(false);
  const [showManage, setShowManage] = useState(false);
  
  // 咨询状态
  const [consultText, setConsultText] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ id: string, name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOrganizer = user.id === event.organizer.id;
  const myApp = event.applicants.find(a => a.userId === user.id);

  const handleSendConsult = () => {
    if (!consultText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: consultText,
      timestamp: '刚刚',
      replyToUserId: replyTarget?.id,
      replyToUserName: replyTarget?.name
    };

    onUpdateEvent({
      ...event,
      comments: [...event.comments, newComment]
    });

    setConsultText('');
    setReplyTarget(null);
  };

  const startReply = (target: { id: string, name: string }) => {
    if (!isOrganizer) return; // 只有发起人可以点击留言回复
    setReplyTarget(target);
    inputRef.current?.focus();
  };

  const handleApply = (intro: string) => {
    const newApp: Applicant = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userGender: user.gender,
      status: 'pending',
      applyTime: '刚刚',
      intro
    };
    onUpdateEvent({ ...event, applicants: [...event.applicants, newApp] });
    setShowApply(false);
    alert('申请已提交，请耐心等待！');
  };

  const handleApprove = (userId: string) => {
    const updatedApps = event.applicants.map(a => a.userId === userId ? { ...a, status: 'approved' as const } : a);
    const enrolled = updatedApps.filter(a => a.status === 'approved').length;
    const isFull = enrolled >= event.capacity;
    const updatedEvent: TripEvent = { 
      ...event, 
      applicants: updatedApps, 
      enrolled, 
      status: isFull ? 'full' : 'recruiting' 
    };
    onUpdateEvent(updatedEvent);
    if (isFull) onCreateChat(updatedEvent);
  };

  return (
    <div className="min-h-screen bg-white pb-32 relative z-[60] flex flex-col">
       <div className="bg-white/80 backdrop-blur-md sticky top-0 flex items-center p-6 z-10 border-b border-gray-50">
          <button onClick={onBack} className="p-2 -ml-4 text-gray-900"><ArrowLeft size={24} /></button>
          <span className="font-black text-lg ml-2">活动详情</span>
       </div>

       <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          <section>
             <h1 className="text-3xl font-black text-gray-900 mb-6 leading-tight">{event.title}</h1>
             <div className="flex flex-col space-y-3">
                <div className="flex items-center text-brand-600 font-black"><Calendar size={18} className="mr-3" />{event.date}</div>
                <div className="flex items-center text-brand-600 font-black"><MapPin size={18} className="mr-3" />{event.destination}</div>
                <div className="flex items-center text-brand-600 font-black"><Users size={18} className="mr-3" />{event.enrolled}/{event.capacity} 人</div>
             </div>
          </section>

          <section className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
             <div className="flex items-center space-x-3 mb-4">
                <AvatarWithGender user={event.organizer} />
                <div>
                   <div className="font-black text-gray-900 flex items-center">
                      {event.organizer.name}
                      <CheckCircle size={14} className="text-blue-500 ml-1" />
                   </div>
                   <div className="text-[10px] text-gray-400 font-bold">发起人 · 信用分 98</div>
                </div>
             </div>
             <p className="text-gray-700 leading-relaxed font-medium">{event.description}</p>
          </section>

          <section>
             <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">咨询动态</h3>
                {isOrganizer && (
                  <span className="text-[10px] text-brand-600 font-black italic">提示：点击下方文字可快速回复</span>
                )}
             </div>
             <ConsultationThread 
                comments={event.comments} 
                organizerId={event.organizer.id}
                onReply={isOrganizer ? startReply : undefined} 
             />
          </section>
       </div>

       {/* 底部咨询/操作栏 */}
       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 space-y-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[70]">
          {/* 回复提示 */}
          {replyTarget && (
            <div className="flex items-center justify-between bg-brand-50 px-4 py-2 rounded-2xl border border-brand-100 animate-slide-up">
              <span className="text-xs font-black text-brand-700 italic">正在回复 @{replyTarget.name}</span>
              <button onClick={() => setReplyTarget(null)} className="p-1 hover:bg-brand-100 rounded-full transition-colors">
                <X size={14} className="text-brand-400"/>
              </button>
            </div>
          )}

          <div className="flex items-center space-x-3">
             <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-4 py-3 border border-transparent focus-within:border-brand-500 transition-all">
                <input 
                  ref={inputRef}
                  value={consultText}
                  onInput={(e) => setConsultText((e.target as any).value)}
                  placeholder={replyTarget ? "输入回复内容..." : "问问发起人细节..."} 
                  className="bg-transparent flex-1 text-sm outline-none font-bold text-gray-800 placeholder:text-gray-400"
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendConsult()}
                />
                <button 
                  onClick={handleSendConsult} 
                  disabled={!consultText.trim()}
                  className={`transition-all ${consultText.trim() ? 'text-brand-600 scale-110' : 'text-gray-300'}`}
                >
                   <Send size={20} />
                </button>
             </div>
             
             <div className="shrink-0 w-32">
                {isOrganizer ? (
                   <button onClick={() => setShowManage(true)} className="w-full bg-gray-900 text-white py-3 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">
                      管理 ({event.applicants.filter(a => a.status === 'pending').length})
                   </button>
                ) : myApp ? (
                   <button disabled className={`w-full py-3 rounded-2xl font-black text-xs ${myApp.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {myApp.status === 'approved' ? '已加入' : '审核中'}
                   </button>
                ) : (
                   <button 
                     onClick={() => setShowApply(true)} 
                     disabled={event.status === 'full'}
                     className={`w-full py-3 rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 ${event.status === 'full' ? 'bg-gray-100 text-gray-400' : 'bg-brand-600 text-white'}`}
                   >
                      {event.status === 'full' ? '已满' : '加入'}
                   </button>
                )}
             </div>
          </div>
       </div>

       {showApply && <ApplyModal eventTitle={event.title} onClose={() => setShowApply(false)} onConfirm={handleApply} />}
       {showManage && <ManageApplicantsModal 
          applicants={event.applicants} 
          capacity={event.capacity} 
          onClose={() => setShowManage(false)} 
          onApprove={handleApprove} 
          onReject={(id) => onUpdateEvent({ ...event, applicants: event.applicants.map(a => a.userId === id ? { ...a, status: 'rejected' as const } : a)})} 
       />}
    </div>
  );
};
