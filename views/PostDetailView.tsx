
import React, { useState } from 'react';
import { Post, UserProfile, Comment } from '../types';
import { ArrowLeft, Heart, MessageSquare, Send, Share2 } from 'lucide-react';
// These components are now exported in components.tsx
import { AvatarWithGender, SocialCommentRow } from '../components';

export const PostDetailView = ({ 
  post, 
  user,
  onBack, 
}: { 
  post: Post, 
  user: UserProfile,
  onBack: () => void 
}) => {
  const [comments, setComments] = useState(post.postComments || []);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  
  // State for handling replies
  // If null, we are commenting on the post. If set, we are replying to a specific user.
  const [replyTarget, setReplyTarget] = useState<{ id: string, name: string } | null>(null);

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newComment,
      timestamp: '刚刚',
      // Store the target user ID if it's a reply
      replyToUserId: replyTarget ? replyTarget.id : undefined 
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    setReplyTarget(null); // Reset target after sending
  };

  const handleLike = () => {
    if (liked) {
      setLikesCount(p => p - 1);
    } else {
      setLikesCount(p => p + 1);
    }
    setLiked(!liked);
  };

  const handleShare = () => {
    alert("分享功能已触发：可以将链接发送给微信好友！");
  };

  // Map userIds to names for quick lookup when rendering replies
  const getUserName = (id: string) => {
      // First check comments
      const foundInComments = comments.find(c => c.userId === id);
      if (foundInComments) return foundInComments.userName;
      // Then check author or current user
      if (post.author.id === id) return post.author.name;
      if (user.id === id) return user.name;
      return '未知用户';
  };

  return (
    /* Changed class to className */
    <div className="fixed inset-0 z-[70] bg-white flex flex-col animate-slide-up overflow-hidden">
       {/* Header */}
       <div className="bg-white/90 backdrop-blur-sm p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <AvatarWithGender user={post.author} size="w-8 h-8" />
            <span className="font-bold text-sm text-gray-900">{post.author.name}</span>
          </div>
          <button onClick={handleShare} className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Share2 size={24} />
          </button>
       </div>

       <div className="flex-1 overflow-y-auto pb-20">
          {/* Images (Scrollable) */}
          <div className="flex overflow-x-auto snap-x snap-mandatory bg-black">
             {post.images.map((img, idx) => (
                <div key={idx} className="w-full shrink-0 snap-center flex items-center justify-center min-h-[50vh]">
                   <img src={img} className="max-w-full max-h-[70vh] object-contain" />
                </div>
             ))}
          </div>

          <div className="p-4">
             {/* Content */}
             <div className="mb-4">
                <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
                <div className="text-xs text-gray-400 mt-2">2小时前 · {post.relatedEventTitle || '自由活动'}</div>
             </div>

             {/* Interaction Bar */}
             <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-4">
                <div className="flex items-center space-x-6">
                   <button onClick={handleLike} className={`flex items-center space-x-1.5 ${liked ? 'text-red-500' : 'text-gray-600'}`}>
                      <Heart size={24} fill={liked ? "currentColor" : "none"} />
                      <span className="text-sm font-medium">{likesCount}</span>
                   </button>
                   <button className="flex items-center space-x-1.5 text-gray-600">
                      <MessageSquare size={24} />
                      <span className="text-sm font-medium">{comments.length}</span>
                   </button>
                </div>
             </div>

             {/* Social Style Comments */}
             <div className="space-y-2">
                <h3 className="font-bold text-gray-900 mb-4">全部评论 ({comments.length})</h3>
                {comments.length === 0 ? (
                   <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl">
                      快来抢占沙发，发表第一条评论吧~
                   </div>
                ) : (
                   <div className="bg-gray-50 rounded-xl p-4">
                      {comments.map((comment) => (
                        <SocialCommentRow 
                           key={comment.id} 
                           comment={comment}
                           replyToName={comment.replyToUserId ? getUserName(comment.replyToUserId) : undefined}
                           onClick={() => {
                              // Click to reply to this user
                              setReplyTarget({ id: comment.userId, name: comment.userName });
                           }}
                        />
                      ))}
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* Bottom Input */}
       <div className="bg-white p-3 border-t border-gray-100 flex items-center space-x-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <input 
             value={newComment}
             onInput={e => setNewComment((e.target as any).value)}
             className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400" 
             placeholder={replyTarget ? `回复 @${replyTarget.name} :` : "说点好听的..."} 
             /* Fixed autofocus to autoFocus */
             autoFocus={!!replyTarget}
             onBlur={() => {}}
          />
          {replyTarget && (
             <button 
                onClick={() => setReplyTarget(null)} 
                className="text-xs text-gray-400 p-2 whitespace-nowrap"
             >
                取消
             </button>
          )}
          <button 
             onClick={handleSendComment}
             disabled={!newComment.trim()}
             className={`p-2.5 rounded-full transition-colors ${newComment.trim() ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}
          >
             <Send size={20} />
          </button>
       </div>
    </div>
  );
};
