
import React from 'react';
import { Post } from '../types';
import { Camera } from 'lucide-react';
import { GalleryCard, FloatingActionButton } from '../components';

export const GalleryView = ({ 
  posts, 
  onCreateClick,
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
        {/* Honor Leaderboard hidden as per request */}
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
