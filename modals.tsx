
import React, { useState } from 'react';
import { UserProfile, Applicant, Post, TripEvent } from './types';
import { AlertTriangle, X, Camera, CheckCircle, Smartphone, Copy, Folder, FileCode, ChevronRight, ChevronDown, Database, Code } from 'lucide-react';
import { AvatarWithGender } from './components';

export const ApplyModal = ({ eventTitle, onClose, onConfirm }: { eventTitle: string, onClose: () => void, onConfirm: (intro: string) => void }) => {
  const [intro, setIntro] = useState('');

  return (
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
               autoFocus
               value={intro}
               onChange={e => setIntro(e.target.value)}
               placeholder="简单介绍一下自己，比如：性格随和、有驾照、经常参加此类活动等。这能大大提高通过率哦！"
               className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-all resize-none"
             />
          </div>

          <div className="bg-orange-50 p-3 rounded-lg flex items-start text-xs text-orange-800 mb-4 border border-orange-100">
             <AlertTriangle size={16} className="mr-2 shrink-0 mt-0.5" />
             <span className="font-medium">为了维护局内成员的时间和利益，加入后不可退出，请慎重考虑。</span>
          </div>

          <button 
             onClick={() => {
                if(!intro.trim()) {
                   alert("请填写自我介绍，让发起人更了解你");
                   return;
                }
                onConfirm(intro);
             }}
             className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-brand-700 active:scale-95 transition-transform"
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
    e.applicants.some(a => a.userId === user.id && a.status === 'approved')
  );

  const postedEventIds = existingPosts.filter(p => p.author.id === user.id).map(p => p.relatedEventId);
  const eligibleEvents = participatedEvents.filter(e => !postedEventIds.includes(e.id));
  
  const [selectedEventId, setSelectedEventId] = useState(eligibleEvents.length > 0 ? eligibleEvents[0].id : '');
  const [content, setContent] = useState('');
  const [hasImage, setHasImage] = useState(false);

  const handleSubmit = () => {
     if (!selectedEventId) {
       alert("请选择一个活动");
       return;
     }
     if (!content.trim()) {
       alert("请填写内容");
       return;
     }
     if (!hasImage) {
        alert("请上传一张精彩图片");
        return;
     }

     const event = eligibleEvents.find(e => e.id === selectedEventId);
     if (event) {
        onSubmit({
           eventId: event.id,
           eventTitle: event.title,
           content: content,
           image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&auto=format&fit=crop&q=60'
        });
     }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
       <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 animate-scale-in shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">发布精彩瞬间</h3>
            <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
          </div>

          {eligibleEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
               <Camera size={48} className="mx-auto mb-2 text-gray-200" />
               <p>暂无由您参与且未发布过的活动</p>
               <button onClick={onClose} className="mt-4 text-brand-600 text-sm font-bold">关闭</button>
            </div>
          ) : (
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">选择活动</label>
                 <select 
                   value={selectedEventId}
                   onChange={e => setSelectedEventId(e.target.value)}
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-brand-500"
                 >
                   {eligibleEvents.map(e => (
                     <option key={e.id} value={e.id}>{e.title}</option>
                   ))}
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">分享您的体验</label>
                 <textarea 
                   value={content}
                   onChange={e => setContent(e.target.value)}
                   placeholder="活动怎么样？认识了新朋友吗？"
                   className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-brand-500 resize-none"
                 />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">上传照片</label>
                  <div 
                    onClick={() => setHasImage(true)}
                    className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${hasImage ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                     {hasImage ? (
                        <>
                          <CheckCircle size={32} className="mb-2" />
                          <span className="text-xs font-bold">已添加图片 (模拟)</span>
                        </>
                     ) : (
                        <>
                          <Camera size={32} className="mb-2" />
                          <span className="text-xs">点击上传图片</span>
                        </>
                     )}
                  </div>
               </div>

               <button 
                 onClick={handleSubmit}
                 className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-brand-700 mt-2"
               >
                 发布
               </button>
            </div>
          )}
       </div>
    </div>
  );
};

export const PhoneBindModal = ({ onClose, onBind }: { onClose: () => void, onBind: () => void }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 animate-scale-in">
        <div className="text-center mb-6">
          <div className="bg-brand-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
            <Smartphone size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">实名认证</h3>
          <p className="text-gray-500 text-sm mt-2">
            为了保障线下活动的安全，发布活动或申请加入前，请先绑定手机号。
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <input type="tel" placeholder="请输入手机号" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-brand-500" />
          <div className="flex space-x-2">
            <input type="text" placeholder="验证码" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-brand-500" />
            <button className="px-4 py-3 text-brand-600 font-medium text-sm bg-brand-50 rounded-lg whitespace-nowrap">获取验证码</button>
          </div>
        </div>

        <button 
          onClick={onBind}
          className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-brand-700"
        >
          立即绑定
        </button>
        <button 
          onClick={onClose}
          className="w-full mt-3 text-gray-400 text-sm py-2"
        >
          暂不绑定
        </button>
      </div>
    </div>
  );
};

export const ManageApplicantsModal = ({ applicants, capacity, onClose, onApprove, onReject }: { applicants: Applicant[], capacity: number, onClose: () => void, onApprove: (id: string) => void, onReject: (id: string) => void }) => {
  const approvedCount = applicants.filter(a => a.status === 'approved').length;
  
  return (
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
                    <div className="bg-gray-50 p-2 rounded-lg text-sm text-gray-600 mb-3">
                       <span className="font-bold text-gray-400 text-xs block mb-1">投名状:</span>
                       {app.intro}
                    </div>
                    
                    {app.status === 'pending' ? (
                       <div className="flex space-x-2">
                          <button 
                             onClick={() => onReject(app.userId)}
                             className="flex-1 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50"
                          >
                             婉拒
                          </button>
                          <button 
                             onClick={() => onApprove(app.userId)}
                             className="flex-1 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 shadow-sm"
                          >
                             通过
                          </button>
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

// --- Native Code Generator Component ---

type FileStructure = {
   name: string;
   type: 'folder' | 'file';
   children?: FileStructure[];
   content?: string;
   isOpen?: boolean;
};

export const ExportCodeModal = ({ onClose }: { onClose: () => void }) => {
   const [selectedFileContent, setSelectedFileContent] = useState<string>('// 请选择左侧文件查看代码');
   const [selectedFileName, setSelectedFileName] = useState<string>('');
   
   // --- Mock Project Data Generator ---
   
   const PROJECT_FILES: FileStructure[] = [
      {
         name: 'cloudfunctions',
         type: 'folder',
         isOpen: true,
         children: [
            {
               name: 'login',
               type: 'folder',
               children: [
                  { 
                     name: 'index.js', 
                     type: 'file', 
                     content: `// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}` 
                  },
                  { name: 'package.json', type: 'file', content: `{"name": "login", "version": "1.0.0", "dependencies": {"wx-server-sdk": "latest"}}` }
               ]
            },
            {
               name: 'getEvents',
               type: 'folder',
               children: [
                  { 
                     name: 'index.js', 
                     type: 'file', 
                     content: `// cloudfunctions/getEvents/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { tag } = event
  const _ = db.command
  
  let query = db.collection('events')
  if (tag && tag !== '全部') {
     query = query.where({ tags: tag })
  }
  
  // 返回最新的活动
  return await query.orderBy('createTime', 'desc').get()
}` 
                  }
               ]
            }
         ]
      },
      {
         name: 'miniprogram',
         type: 'folder',
         isOpen: true,
         children: [
            {
               name: 'app.json',
               type: 'file',
               content: `{
  "pages": [
    "pages/index/index",
    "pages/detail/detail",
    "pages/profile/profile",
    "pages/create/create"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "友伴旅行",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "color": "#9ca3af",
    "selectedColor": "#16a34a",
    "backgroundColor": "#ffffff",
    "list": [
      { "pagePath": "pages/index/index", "text": "广场", "iconPath": "icons/map.png", "selectedIconPath": "icons/map-active.png" },
      { "pagePath": "pages/profile/profile", "text": "我的", "iconPath": "icons/user.png", "selectedIconPath": "icons/user-active.png" }
    ]
  },
  "sitemapLocation": "sitemap.json"
}`
            },
            {
               name: 'app.js',
               type: 'file',
               content: `// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 替换为你的环境ID
        traceUser: true,
      })
    }
    
    // 登录获取 OpenID
    wx.cloud.callFunction({
       name: 'login',
       success: res => {
          this.globalData.openid = res.result.openid
       }
    })
  },
  globalData: {
    userInfo: null,
    openid: null
  }
})`
            },
            {
               name: 'pages',
               type: 'folder',
               children: [
                  {
                     name: 'index',
                     type: 'folder',
                     isOpen: true,
                     children: [
                        {
                           name: 'index.wxml',
                           type: 'file',
                           content: `<!-- pages/index/index.wxml -->
<view class="container">
  <!-- 搜索栏 -->
  <view class="header">
     <view class="search-bar">
        <icon type="search" size="14"></icon>
        <input placeholder="搜索活动、地点..." bindconfirm="onSearch" />
     </view>
     <scroll-view scroll-x class="tags-row" enable-flex>
        <view wx:for="{{tags}}" wx:key="*this" 
              class="tag {{currentTag===item ? 'active' : ''}}" 
              bindtap="onTagTap" data-tag="{{item}}">
           {{item}}
        </view>
     </scroll-view>
  </view>

  <!-- 活动列表 -->
  <scroll-view scroll-y class="event-list" refresher-enabled bindrefresherrefresh="onRefresh" refresher-triggered="{{triggered}}">
    <block wx:for="{{events}}" wx:key="_id">
       <view class="card" bindtap="goToDetail" data-id="{{item._id}}">
          <view class="card-header">
             <text class="title">{{item.title}}</text>
             <text wx:if="{{item.status === 'full'}}" class="badge">已满</text>
          </view>
          
          <view class="tags-mini">
             <text wx:for="{{item.tags}}" wx:for-item="t" wx:key="*this" class="t-tag">{{t}}</text>
          </view>

          <view class="info-row">
             <text>📅 {{item.date}}</text>
             <text>📍 {{item.destination}}</text>
          </view>

          <view class="footer">
             <image src="{{item.organizer.avatar}}" class="avatar"></image>
             <text class="name">{{item.organizer.name}}</text>
             <text class="count">{{item.enrolled}}/{{item.capacity}}人</text>
          </view>
       </view>
    </block>
    <view wx:if="{{events.length === 0}}" class="empty">暂无活动</view>
  </scroll-view>
  
  <view class="fab" bindtap="goToCreate">+</view>
</view>`
                        },
                        {
                           name: 'index.js',
                           type: 'file',
                           content: `// pages/index/index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    events: [],
    tags: ['全部', '旅行', '棋牌', '运动', '读书'],
    currentTag: '全部',
    triggered: false
  },

  onLoad: function() {
     this.fetchEvents();
  },

  onRefresh() {
     this.fetchEvents().then(() => {
        this.setData({ triggered: false })
     })
  },

  fetchEvents: function() {
    wx.showLoading({ title: '加载中' })
    return wx.cloud.callFunction({
       name: 'getEvents',
       data: { tag: this.data.currentTag }
    }).then(res => {
       this.setData({ events: res.result.data })
       wx.hideLoading()
    }).catch(err => {
       console.error(err)
       wx.hideLoading()
    })
  },

  onTagTap: function(e) {
     const tag = e.currentTarget.dataset.tag;
     this.setData({ currentTag: tag }, () => {
        this.fetchEvents();
     });
  },

  goToDetail: function(e) {
     const id = e.currentTarget.dataset.id;
     wx.navigateTo({
        url: '/pages/detail/detail?id=' + id
     });
  },

  goToCreate: function() {
     wx.navigateTo({ url: '/pages/create/create' });
  }
})`
                        },
                        {
                           name: 'index.wxss',
                           type: 'file',
                           content: `/** pages/index/index.wxss */
.container {
   background-color: #f3f4f6;
   min-height: 100vh;
}
.header {
   background: white;
   padding: 12px 16px;
   position: sticky;
   top: 0;
   z-index: 10;
}
.search-bar {
   background: #f3f4f6;
   border-radius: 99px;
   padding: 8px 16px;
   display: flex;
   align-items: center;
   margin-bottom: 12px;
}
.search-bar input {
   margin-left: 8px;
   font-size: 14px;
   width: 100%;
}
.tags-row {
   display: flex;
   white-space: nowrap;
   height: 32px;
}
.tag {
   display: inline-block;
   padding: 4px 16px;
   background: #f9fafb;
   border: 1px solid #e5e7eb;
   color: #4b5563;
   border-radius: 99px;
   font-size: 13px;
   margin-right: 8px;
}
.tag.active {
   background: #22c55e;
   color: white;
   border-color: #22c55e;
}
.card {
   background: white;
   margin: 12px 16px;
   padding: 16px;
   border-radius: 12px;
   box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.card-header {
   display: flex;
   justify-content: space-between;
   font-weight: bold;
   font-size: 16px;
   margin-bottom: 8px;
}
.badge {
   font-size: 10px;
   background: #fee2e2;
   color: #dc2626;
   padding: 2px 6px;
   border-radius: 4px;
}
.tags-mini {
   display: flex;
   gap: 6px;
   margin-bottom: 8px;
}
.t-tag {
   font-size: 10px;
   background: #f0fdf4;
   color: #15803d;
   padding: 2px 6px;
   border-radius: 4px;
}
.info-row {
   display: flex;
   gap: 12px;
   font-size: 12px;
   color: #6b7280;
   margin-bottom: 12px;
}
.footer {
   display: flex;
   align-items: center;
   border-top: 1px solid #f3f4f6;
   padding-top: 8px;
}
.avatar {
   width: 24px;
   height: 24px;
   border-radius: 50%;
   margin-right: 8px;
   background: #ddd;
}
.name {
   font-size: 12px;
   color: #374151;
   flex: 1;
}
.count {
   font-size: 12px;
   color: #9ca3af;
}
.fab {
   position: fixed;
   bottom: 40px;
   right: 20px;
   width: 50px;
   height: 50px;
   background: #16a34a;
   color: white;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 30px;
   box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}`
                        }
                     ]
                  },
                  {
                     name: 'detail',
                     type: 'folder',
                     children: [
                        {
                           name: 'detail.js',
                           type: 'file',
                           content: `// pages/detail/detail.js
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    event: null,
    userInfo: null,
    isOrganizer: false
  },

  onLoad: function(options) {
     this.getEvent(options.id);
     // 获取全局用户信息
     const app = getApp()
     this.setData({ userInfo: app.globalData.userInfo })
  },

  getEvent(id) {
     db.collection('events').doc(id).get().then(res => {
        const event = res.data
        const app = getApp()
        this.setData({ 
           event,
           isOrganizer: event._openid === app.globalData.openid
        })
     })
  },

  onApply() {
     // 申请加入逻辑：更新 applicants 数组
     if (!this.data.userInfo) return wx.getUserProfile({...}) // 需处理授权
     
     const newApplicant = {
        userId: this.data.userInfo.id,
        name: this.data.userInfo.nickName,
        avatar: this.data.userInfo.avatarUrl,
        status: 'pending'
     }
     
     db.collection('events').doc(this.data.event._id).update({
        data: {
           applicants: _.push(newApplicant)
        }
     }).then(() => {
        wx.showToast({ title: '申请已发送' })
        this.getEvent(this.data.event._id)
     })
  }
})`
                        }
                     ]
                  }
               ]
            }
         ]
      }
   ];

   const [files, setFiles] = useState(PROJECT_FILES);

   const toggleFolder = (folderName: string, parentChildren: FileStructure[]) => {
      // Simple recursive toggle for demo, assumes unique names or simple depth
      // For this MVP prototype, we just force update the state structure directly if it matches top level
      // A real tree view would need IDs.
      const newFiles = [...files];
      // simplified toggle logic for the demo:
      const toggleRecursive = (list: FileStructure[]) => {
         for (const item of list) {
            if (item.name === folderName && item.type === 'folder') {
               item.isOpen = !item.isOpen;
               return true;
            }
            if (item.children) {
               if (toggleRecursive(item.children)) return true;
            }
         }
         return false;
      };
      toggleRecursive(newFiles);
      setFiles(newFiles);
   };

   const renderTree = (items: FileStructure[], depth = 0) => {
      return items.map((item, idx) => (
         <div key={idx}>
            <div 
               className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-800 transition-colors ${selectedFileName === item.name ? 'bg-brand-900 text-brand-400' : 'text-gray-400'}`}
               style={{ paddingLeft: `${depth * 12 + 8}px` }}
               onClick={() => {
                  if (item.type === 'folder') {
                     toggleFolder(item.name, items);
                  } else {
                     setSelectedFileName(item.name);
                     setSelectedFileContent(item.content || '');
                  }
               }}
            >
               <span className="mr-1">
                  {item.type === 'folder' && (
                     item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                  )}
               </span>
               <span className="mr-2">
                  {item.type === 'folder' 
                     ? (item.name === 'cloudfunctions' ? <Database size={14} className="text-orange-400"/> : <Folder size={14} className="text-blue-400"/>)
                     : <FileCode size={14} className={item.name.endsWith('json') ? 'text-yellow-400' : item.name.endsWith('wxss') ? 'text-pink-400' : 'text-green-400'} />
                  }
               </span>
               <span className="text-xs font-mono">{item.name}</span>
            </div>
            {item.type === 'folder' && item.isOpen && item.children && (
               <div>{renderTree(item.children, depth + 1)}</div>
            )}
         </div>
      ));
   };

   return (
      <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col animate-scale-in">
         {/* Header */}
         <div className="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2">
               <div className="bg-brand-600 w-8 h-8 rounded flex items-center justify-center">
                  <Code className="text-white" size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-gray-100 text-sm">原生小程序生成器</h3>
                  <p className="text-[10px] text-gray-400">Project: travel-buddy-mvp</p>
               </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full">
               <X size={20} className="text-gray-400"/>
            </button>
         </div>

         <div className="flex-1 flex overflow-hidden">
            {/* Sidebar File Tree */}
            <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
               <div className="p-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Explorer</div>
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {renderTree(files)}
               </div>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 bg-[#0d1117] flex flex-col min-w-0">
               {/* Tab Bar */}
               {selectedFileName ? (
                  <div className="flex bg-gray-800 overflow-x-auto">
                     <div className="px-4 py-2 bg-[#0d1117] text-gray-200 text-xs border-t-2 border-brand-500 flex items-center min-w-fit">
                        <FileCode size={12} className="mr-2 text-gray-400"/>
                        {selectedFileName}
                        <span className="ml-4 text-gray-500 cursor-pointer hover:text-white">×</span>
                     </div>
                  </div>
               ) : (
                  <div className="bg-gray-800 h-9"></div>
               )}

               {/* Code Content */}
               <div className="flex-1 overflow-auto relative group">
                  <pre className="p-4 text-xs font-mono leading-relaxed text-gray-300">
                     <code>{selectedFileContent}</code>
                  </pre>
                  
                  {selectedFileName && (
                     <button 
                        onClick={() => {
                           navigator.clipboard.writeText(selectedFileContent);
                           // Simple toast feedback could go here
                        }}
                        className="absolute top-4 right-4 bg-gray-700/50 hover:bg-brand-600 text-white p-2 rounded transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                        title="Copy to Clipboard"
                     >
                        <Copy size={16} />
                     </button>
                  )}

                  {!selectedFileName && (
                     <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <Code size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">Select a file from the explorer to view code</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
         
         <div className="bg-brand-900/30 border-t border-gray-800 p-2 text-center text-[10px] text-gray-500">
            * 仅供参考。请在微信开发者工具中创建相应文件并粘贴代码。需开启【云开发】环境。
         </div>
      </div>
   );
};
