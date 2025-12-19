
import React from 'react';
import { Post } from '../types';
import { Camera, Trophy } from 'lucide-react';
import { GalleryCard, FloatingActionButton } from '../components';

export const GalleryView = ({ 
  posts, 
  onCreateClick,
  onLeaderboardClick,
  onPostClick
}: { 
  posts: Post[], 
  onCreateClick: () => void,
  onLeaderboardClick: () => void,
  onPostClick: (post: Post) => void
}) => {
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);

  return (
    <div className="pb-24">
      {/* Changed class to className */}
      <div className="bg-white/90 backdrop-blur-md p-6 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">精彩瞬间</h1>
          <p className="text-xs text-gray-500 mt-1 font-bold">看看大家的活动记录</p>
        </div>
        <button 
          onClick={onLeaderboardClick}
          className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl transition-colors border border-yellow-200 shadow-sm"
        >
           <Trophy size={20} className="mb-0.5" />
           <span className="text-[10px] font-black">荣誉榜单</span>
        </button>
      </div>
      <div className="bg-gray-50 p-4">
        {sortedPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
            <GalleryCard 
               post={post} 
               onClick={() => onPostClick(post)}
            />
          </div>
        ))}
      </div>
      <FloatingActionButton onClick={onCreateClick} icon={Camera} label="晒照" />
    </div>
  );
};
