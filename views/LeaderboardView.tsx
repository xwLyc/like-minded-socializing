
import React, { useState } from 'react';
import { Post, HistoryChampion } from '../types';
import { MOCK_HISTORY_CHAMPIONS } from '../mockData';
import { ArrowLeft, Trophy, Crown, Medal } from 'lucide-react';
import { AvatarWithGender } from '../components';

export const LeaderboardView = ({ 
  currentMonthPosts, 
  onBack, 
  onPostClick
}: { 
  currentMonthPosts: Post[], 
  onBack: () => void,
  onPostClick: (post: Post) => void
}) => {
  const [tab, setTab] = useState<'current' | 'history'>('current');

  // Filter and sort for current month
  const sortedPosts = [...currentMonthPosts].sort((a, b) => b.likes - a.likes);

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy size={20} className="text-yellow-500" fill="currentColor" />;
    if (index === 1) return <Medal size={20} className="text-gray-400" fill="currentColor" />;
    if (index === 2) return <Medal size={20} className="text-orange-600" fill="currentColor" />;
    return <span className="text-sm font-bold text-gray-500">{index + 1}</span>;
  };

  // Shared Render Row Logic
  const renderRow = (
    id: string, 
    rank: number, 
    image: string, 
    title: string, 
    desc: string, 
    user: any, 
    likes: number,
    onClick: () => void
  ) => (
     <div 
       key={id} 
       onClick={onClick}
       className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden mb-3"
     >
        {/* Rank Badge */}
        <div className="w-8 flex justify-center mr-2 shrink-0">
           {getRankBadge(rank)}
        </div>

        {/* Thumbnail */}
        <div className="mr-4 relative shrink-0">
           <img src={image} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
           <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-full p-0.5 shadow-sm">
              <AvatarWithGender user={user} size="w-full h-full" />
           </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pr-2">
           <h3 className="font-bold text-sm text-gray-900 mb-0.5 truncate">{title}</h3>
           <p className="text-xs text-gray-500 line-clamp-1 mb-1">{desc}</p>
        </div>

        {/* Likes */}
        <div className="text-right shrink-0 min-w-[3rem]">
           <div className="text-lg font-bold text-brand-600 font-mono">{likes}</div>
           <div className="text-[10px] text-gray-400">赞</div>
        </div>
     </div>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col animate-slide-up">
       <div className="bg-white p-4 border-b border-gray-100 flex items-center shadow-sm z-10 sticky top-0">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 text-center pr-10">
             <h2 className="font-bold text-lg flex items-center justify-center text-gray-900">
               <Trophy size={20} className="text-yellow-500 mr-2" fill="currentColor"/>
               荣誉榜单
             </h2>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex bg-white mb-2 shadow-sm">
          <button 
             onClick={() => setTab('current')}
             className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'current' ? 'text-brand-600 border-brand-600' : 'text-gray-400 border-transparent'}`}
          >
             本月战况
          </button>
          <button 
             onClick={() => setTab('history')}
             className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'history' ? 'text-brand-600 border-brand-600' : 'text-gray-400 border-transparent'}`}
          >
             历史殿堂
          </button>
       </div>

       <div className="flex-1 overflow-y-auto p-4 pb-20">
         {tab === 'current' ? (
           <>
             <div className="text-center text-xs text-gray-400 mb-4">* 实时更新 · 月底结算 · 榜首免单 *</div>
             {sortedPosts.map((post, index) => renderRow(
                post.id,
                index,
                post.images[0],
                post.author.name,
                post.content,
                post.author,
                post.likes,
                () => onPostClick(post)
             ))}
             {sortedPosts.length === 0 && (
                <div className="text-center py-20 text-gray-400">暂无数据</div>
             )}
           </>
         ) : (
           <>
             {MOCK_HISTORY_CHAMPIONS.map((hist, index) => renderRow(
                hist.id,
                index, // History mock usually only shows champions, but using index logic works if list expands
                hist.postImages[0],
                hist.month,
                hist.postContent,
                hist.winner,
                hist.likes,
                () => {
                    // Adapt history item to Post type for detail view
                    onPostClick({
                        id: hist.id,
                        author: hist.winner,
                        images: hist.postImages,
                        content: hist.postContent,
                        likes: hist.likes,
                        comments: 0,
                        isChallengeActive: false
                    });
                }
             ))}
           </>
         )}
       </div>
    </div>
  );
};
