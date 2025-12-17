
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
  // Sort posts by likes descending
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);

  return (
    <div className="pb-20">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">精彩瞬间</h1>
          <p className="text-xs text-gray-500 mt-1">看看大家的活动记录</p>
        </div>
        <button 
          onClick={onLeaderboardClick}
          className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg transition-colors border border-yellow-200 shadow-sm"
        >
           <Trophy size={20} className="mb-0.5" />
           <span className="text-[10px] font-bold">荣誉榜单</span>
        </button>
      </div>
      <div className="bg-gray-50">
        {sortedPosts.map((post) => (
          <GalleryCard 
             key={post.id} 
             post={post} 
             onClick={() => onPostClick(post)}
          />
        ))}
      </div>
      <FloatingActionButton onClick={onCreateClick} icon={Camera} label="晒照" />
    </div>
  );
};
