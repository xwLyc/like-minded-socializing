
import React, { useState, useMemo } from 'react';
import { TripEvent, UserProfile, Comment, Applicant } from '../types';
import { ArrowLeft, Clock, MapPin, CheckCircle, Users, User, Send, AlertCircle, Clock as ClockIcon, MessageCircle } from 'lucide-react';
import { AvatarWithGender, ConsultationThread } from '../components';
import { ApplyModal, ManageApplicantsModal } from '../modals';

export const EventDetailView = ({ 
  event, 
  onBack, 
  requirePhoneBinding, 
  user,
  onUpdateEvent,
  onCreateChat 
}: { 
  event: TripEvent, 
  onBack: () => void, 
  requirePhoneBinding: () => void, 
  user: UserProfile,
  onUpdateEvent: (e: TripEvent) => void,
  onCreateChat: (e: TripEvent) => void
}) => {
  const [comments, setComments] = useState(event.comments || []);
  const [newQuestion, setNewQuestion] = useState('');
  const [applicants, setApplicants] = useState(event.applicants || []);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const isOrganizer = user.id === event.organizer.id;
  const myApplication = applicants.find(a => a.userId === user.id);
  const applicationStatus = myApplication?.status;
  const pendingCount = applicants.filter(a => a.status === 'pending').length;
  const enrolledCount = applicants.filter(a => a.status === 'approved').length;
  const isFull = event.status === 'full' || enrolledCount >= event.capacity;

  // Logic to organize comments into threads per Inquirer
  const threads = useMemo(() => {
    const threadMap = new Map<string, Comment[]>();
    const inquirerInfoMap = new Map<string, { userId: string, userName: string, userAvatar: string, gender: 'male' | 'female' }>();

    // 1. Identify all unique users who are NOT the organizer (Inquirers)
    comments.forEach(c => {
       if (c.userId !== event.organizer.id) {
          if (!inquirerInfoMap.has(c.userId)) {
             inquirerInfoMap.set(c.userId, { 
                userId: c.userId, 
                userName: c.userName, 
                userAvatar: c.userAvatar,
                gender: 'male' // Mock
             });
          }
       }
    });

    // 2. Distribute comments to threads
    comments.forEach(c => {
       let threadOwnerId = '';
       if (c.userId === event.organizer.id) {
          // If organizer replying, use the replyToUserId
          threadOwnerId = c.replyToUserId || '';
       } else {
          // If inquirer asking, they own the thread
          threadOwnerId = c.userId;
       }

       if (threadOwnerId && inquirerInfoMap.has(threadOwnerId)) {
          if (!threadMap.has(threadOwnerId)) {
             threadMap.set(threadOwnerId, []);
          }
          threadMap.get(threadOwnerId)?.push(c);
       }
    });

    return Array.from(threadMap.entries()).map(([ownerId, msgs]) => ({
       owner: inquirerInfoMap.get(ownerId)!,
       // SORT LOGIC FIXED: We rely on the natural array order (chronological insertion).
       // Previously, sorting by ID string caused new numeric timestamp IDs (e.g., "17...") to appear 
       // before mock string IDs (e.g., "c1..."), breaking the chat flow.
       messages: msgs
    }));
  }, [comments, event.organizer.id]);

  const hasActiveThread = threads.some(t => t.owner.userId === user.id);

  const handleStartNewConsultation = () => {
    if (!newQuestion.trim()) return;
    if (!user.isPhoneVerified) {
      requirePhoneBinding();
      return;
    }
    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newQuestion,
      timestamp: '刚刚',
      // No replyToUserId because this starts a thread
    };
    setComments([...comments, comment]);
    setNewQuestion('');
  };

  const handleReplyToThread = (threadOwnerId: string, text: string) => {
     if (!user.isPhoneVerified) {
        requirePhoneBinding();
        return;
     }
     const comment: Comment = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: text,
        timestamp: '刚刚',
        replyToUserId: threadOwnerId // Critical: Links this message to the thread
     };
     setComments([...comments, comment]);
  };

  const handleApplyConfirm = (intro: string) => {
     const newApp: Applicant = {
       userId: user.id,
       userName: user.name,
       userAvatar: user.avatar,
       userGender: user.gender,
       status: 'pending',
       applyTime: '刚刚',
       intro: intro
     };
     setApplicants([...applicants, newApp]);
     setShowApplyModal(false);
  };

  const handleApprove = (userId: string) => {
    const updatedApplicants = applicants.map(a => a.userId === userId ? { ...a, status: 'approved' } : a) as Applicant[];
    setApplicants(updatedApplicants);
    
    const newEnrolled = updatedApplicants.filter(a => a.status === 'approved').length;
    if (newEnrolled >= event.capacity) {
       const updatedEvent = { ...event, applicants: updatedApplicants, status: 'full' as const, enrolled: newEnrolled };
       onUpdateEvent(updatedEvent);
       onCreateChat(updatedEvent);
       alert("人数已满，自动成团！已创建群聊。");
    } else {
       onUpdateEvent({ ...event, applicants: updatedApplicants, enrolled: newEnrolled });
    }
  };

  const handleReject = (userId: string) => {
    const updatedApplicants = applicants.map(a => a.userId === userId ? { ...a, status: 'rejected' } : a) as Applicant[];
    setApplicants(updatedApplicants);
    onUpdateEvent({ ...event, applicants: updatedApplicants });
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative z-[60]">
       <div className="bg-white sticky top-0 flex items-center p-4 border-b border-gray-100 shadow-sm z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
             <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-lg ml-2">活动详情</span>
       </div>

       <div className="p-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm">
             <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 leading-snug flex-1">{event.title}</h1>
                {isFull && (
                   <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold whitespace-nowrap ml-2 mt-1">
                      已成团
                   </span>
                )}
             </div>
             
             <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-medium border border-brand-100">
                      {tag}
                   </span>
                ))}
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                   {enrolledCount}/{event.capacity}人
                </span>
             </div>

             <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                   <Clock size={16} className="text-brand-500 mr-3" />
                   <span className="text-gray-900 font-medium">{event.date}</span>
                </div>
                <div className="flex items-center">
                   <MapPin size={16} className="text-brand-500 mr-3" />
                   <span className="text-gray-900 font-medium">{event.destination}</span>
                </div>
             </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
             <div className="flex items-center space-x-3">
                <AvatarWithGender user={event.organizer} size="w-12 h-12" />
                <div>
                   <div className="font-bold text-gray-900 flex items-center">
                      {event.organizer.name}
                      {event.organizer.isPhoneVerified && <CheckCircle size={14} className="text-blue-500 ml-1" fill="currentColor" color="white"/>}
                   </div>
                   <div className="text-xs text-gray-500">发起人信用良好</div>
                </div>
             </div>
             {!isOrganizer && (
               <div className="text-xs text-gray-400">发起人</div>
             )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm">
             <h3 className="font-bold text-gray-900 mb-3 border-l-4 border-brand-500 pl-3">活动详情</h3>
             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
             <div className="mt-4 pt-4 border-t border-gray-50 flex gap-4 text-xs text-gray-500">
                <div className="flex items-center"><Users size={14} className="mr-1"/> 年龄: {event.ageRange}</div>
                <div className="flex items-center"><User size={14} className="mr-1"/> 性别: {event.genderReq}</div>
             </div>
          </div>

          {/* Consultation Section */}
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-l-4 border-brand-500 pl-3 flex justify-between items-center">
               <span>咨询与回复</span>
               <span className="text-xs text-gray-400 font-normal">({threads.length} 个会话)</span>
            </h3>
            
            {threads.length === 0 ? (
               <div className="text-center py-6 text-gray-400 text-sm">暂无留言，有什么问题快来问问吧~</div>
            ) : (
               <div className="mb-4">
                  {threads.map((thread) => {
                     // Check if current user can reply in this thread
                     // Condition 1: User is Organizer
                     // Condition 2: User is the thread owner (Inquirer)
                     const canReply = isOrganizer || user.id === thread.owner.userId;

                     return (
                        <ConsultationThread 
                           key={thread.owner.userId}
                           inquirer={thread.owner}
                           organizerId={event.organizer.id}
                           comments={thread.messages}
                           onReply={(text) => handleReplyToThread(thread.owner.userId, text)}
                           canReply={canReply}
                        />
                     );
                  })}
               </div>
            )}

            {/* General Input for New Inquiry (Only visible if not organizer AND user doesn't have an active thread) */}
            {!isOrganizer && !hasActiveThread && (
               <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border border-gray-200 mt-2">
                  <div className="bg-brand-100 p-2 rounded-full text-brand-600">
                     <MessageCircle size={16} />
                  </div>
                  <input 
                    value={newQuestion}
                    onChange={e => setNewQuestion(e.target.value)}
                    className="flex-1 bg-transparent px-2 text-sm outline-none"
                    placeholder="发起一个新的提问..."
                  />
                  <button 
                    onClick={handleStartNewConsultation}
                    disabled={!newQuestion.trim()}
                    className={`p-2 rounded-full transition-colors ${newQuestion.trim() ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                  >
                    <Send size={16} />
                  </button>
               </div>
            )}
            
            {/* Tip for users who already asked */}
            {!isOrganizer && hasActiveThread && (
               <div className="text-center text-xs text-gray-400 mt-2">
                  您已发起咨询，请在上方您的会话框中继续沟通
               </div>
            )}
          </div>
          
           <div className="bg-orange-50 p-4 rounded-xl flex items-start text-xs text-orange-800">
              <AlertCircle size={16} className="mr-2 shrink-0 mt-0.5" />
              此活动由用户自发组织，请大家在参与过程中注意人身及财产安全，谨防诈骗。
           </div>
       </div>

       {applicationStatus === 'approved' || (isFull && !isOrganizer) ? null : (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             {isOrganizer ? (
               <button 
                  onClick={() => setShowManageModal(true)}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex justify-center items-center"
               >
                  管理报名
                  {pendingCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>}
               </button>
             ) : (
                <>
                  {applicationStatus === 'pending' ? (
                     <button 
                        disabled
                        className="w-full bg-gray-300 text-white py-3 rounded-xl font-bold text-lg cursor-not-allowed flex justify-center items-center"
                     >
                        <ClockIcon size={20} className="mr-2"/>
                        等待审核
                     </button>
                  ) : applicationStatus === 'rejected' ? (
                     <button 
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-bold text-lg cursor-not-allowed"
                     >
                        申请未通过
                     </button>
                  ) : (
                     <button 
                        onClick={() => {
                           if (!user.isPhoneVerified) {
                              requirePhoneBinding();
                           } else {
                              setShowApplyModal(true);
                           }
                        }}
                        className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-brand-700 active:scale-95 transition-transform"
                     >
                        申请加入
                     </button>
                  )}
                </>
             )}
          </div>
       )}

       {showManageModal && (
          <ManageApplicantsModal 
            applicants={applicants}
            capacity={event.capacity}
            onClose={() => setShowManageModal(false)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
       )}
       {showApplyModal && (
          <ApplyModal 
            eventTitle={event.title}
            onClose={() => setShowApplyModal(false)}
            onConfirm={handleApplyConfirm}
          />
       )}
    </div>
  );
};
