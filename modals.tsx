
import React, { useState } from 'react';
import { UserProfile, Applicant, Post, TripEvent } from './types';
import { AlertTriangle, X, Camera, CheckCircle, Smartphone, Copy, Folder, FileCode, ChevronRight, ChevronDown, Database, Code, FileJson } from 'lucide-react';
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

// --- Taro Code Generator Component ---

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
   
   // --- Mock Taro Project Data Generator ---
   
   const PROJECT_FILES: FileStructure[] = [
      {
         name: 'package.json',
         type: 'file',
         content: `{
  "name": "travel-buddy-taro",
  "version": "1.0.0",
  "private": true,
  "description": "友伴旅行 - Taro小程序",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "sass"
  },
  "scripts": {
    "build:weapp": "taro build --type weapp",
    "dev:weapp": "taro build --type weapp --watch"
  },
  "dependencies": {
    "@tarojs/components": "3.6.0",
    "@tarojs/react": "3.6.0",
    "@tarojs/runtime": "3.6.0",
    "@tarojs/taro": "3.6.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`
      },
      {
         name: 'src',
         type: 'folder',
         isOpen: true,
         children: [
            {
               name: 'app.config.ts',
               type: 'file',
               content: `export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '友伴旅行',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#9ca3af",
    selectedColor: "#16a34a",
    backgroundColor: "#ffffff",
    list: [
      { pagePath: "pages/index/index", text: "广场", iconPath: "assets/map.png", selectedIconPath: "assets/map-active.png" },
      { pagePath: "pages/profile/index", text: "我的", iconPath: "assets/user.png", selectedIconPath: "assets/user-active.png" }
    ]
  }
})`
            },
            {
               name: 'app.tsx',
               type: 'file',
               content: `import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    // 初始化云开发
    if(process.env.TARO_ENV === 'weapp') {
       Taro.cloud.init({
          env: 'your-env-id',
          traceUser: true
       })
    }
  })
  return children
}
export default App`
            },
            {
               name: 'app.scss',
               type: 'file',
               content: `@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* 自定义全局样式 */
page {
   background-color: #f3f4f6;
}`
            },
            {
               name: 'pages',
               type: 'folder',
               isOpen: true,
               children: [
                  {
                     name: 'index',
                     type: 'folder',
                     isOpen: true,
                     children: [
                        {
                           name: 'index.config.ts',
                           type: 'file',
                           content: `export default definePageConfig({
  navigationBarTitleText: '广场'
})`
                        },
                        {
                           name: 'index.tsx',
                           type: 'file',
                           content: `import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Index() {
  const [events, setEvents] = useState([])
  
  useEffect(() => {
     fetchEvents()
  }, [])

  const fetchEvents = async () => {
     Taro.showLoading({ title: '加载中' })
     try {
       const res = await Taro.cloud.callFunction({ name: 'getEvents' })
       setEvents(res.result.data)
     } finally {
       Taro.hideLoading()
     }
  }

  const goDetail = (id) => {
     Taro.navigateTo({ url: \`/pages/detail/index?id=\${id}\` })
  }

  return (
    <View className="container">
      {/* 顶部搜索 */}
      <View className="header">
         <View className="search-bar">
            <Input placeholder="搜索活动..." className="input" />
         </View>
      </View>

      {/* 列表 */}
      <ScrollView scrollY className="list">
         {events.map((item: any) => (
            <View key={item._id} className="card" onClick={() => goDetail(item._id)}>
               <View className="flex justify-between mb-2">
                  <Text className="text-lg font-bold">{item.title}</Text>
                  {item.status === 'full' && <Text className="tag-full">已满</Text>}
               </View>
               <View className="flex gap-2 mb-2">
                  {item.tags.map(t => <Text key={t} className="tag">{t}</Text>)}
               </View>
               <View className="text-gray-500 text-sm mb-2">
                  <Text>{item.date} · {item.destination}</Text>
               </View>
               <View className="flex items-center pt-2 border-t border-gray-100">
                  <Image src={item.organizer.avatar} className="avatar" />
                  <Text className="text-sm ml-2">{item.organizer.name}</Text>
               </View>
            </View>
         ))}
      </ScrollView>
    </View>
  )
}`
                        }
                     ]
                  },
                  {
                     name: 'detail',
                     type: 'folder',
                     isOpen: true,
                     children: [
                        {
                           name: 'index.tsx',
                           type: 'file',
                           content: `import React, { useEffect, useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'

// 朋友圈风格评论组件
const SocialCommentRow = ({ comment, replyToName, onClick }) => (
  <View className="comment-row" onClick={onClick}>
     <Text className="name">{comment.userName}</Text>
     {replyToName && (
       <>
         <Text className="reply-txt">回复</Text>
         <Text className="name">{replyToName}</Text>
       </>
     )}
     <Text className="content">：{comment.content}</Text>
  </View>
)

export default function Detail() {
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [inputVal, setInputVal] = useState('')
  const [replyTarget, setReplyTarget] = useState<any>(null)

  useEffect(() => {
     if(router.params.id) {
        // Mock fetch
        Taro.cloud.database().collection('events').doc(router.params.id).get()
           .then(res => {
              setEvent(res.data)
              setComments(res.data.comments || [])
           })
     }
  }, [router.params.id])

  const handleReplyClick = (user, userId) => {
     setReplyTarget({ name: user, id: userId })
  }

  const handleSend = () => {
     if(!inputVal) return
     const newComment = {
        userId: 'currentUser', // Mock
        userName: '我',
        content: inputVal,
        replyToUserName: replyTarget ? replyTarget.name : null
     }
     setComments([...comments, newComment])
     setInputVal('')
     setReplyTarget(null)
     // TODO: Update Cloud DB
  }

  if(!event) return <View>Loading...</View>

  return (
    <View className="detail-container">
       <View className="card">
          <Text className="title">{event.title}</Text>
          <Text className="desc">{event.description}</Text>
       </View>

       {/* 评论区 (Social Style) */}
       <View className="comments-section">
          <Text className="section-title">留言板</Text>
          <View className="comment-list">
             {comments.map((item, idx) => (
                <SocialCommentRow 
                   key={idx}
                   comment={item}
                   replyToName={item.replyToUserName}
                   onClick={() => handleReplyClick(item.userName, item.userId)}
                />
             ))}
          </View>
       </View>

       <View className="footer-bar">
          <Input 
             className="input"
             placeholder={replyTarget ? \`回复 \${replyTarget.name}\` : "说点什么..."}
             value={inputVal}
             onInput={e => setInputVal(e.detail.value)}
          />
          <Button className="btn-send" onClick={handleSend}>发送</Button>
       </View>
    </View>
  )
}`
                        },
                        {
                           name: 'index.scss',
                           type: 'file',
                           content: `.detail-container { padding-bottom: 100px; }
.card { background: white; padding: 20px; margin-bottom: 10px; }
.title { font-size: 20px; font-weight: bold; display: block; margin-bottom: 10px; }
.desc { color: #333; line-height: 1.6; }

/* 朋友圈风格 */
.comments-section { background: white; padding: 20px; }
.section-title { font-weight: bold; margin-bottom: 10px; display: block; }
.comment-row { margin-bottom: 5px; font-size: 14px; padding: 2px 0; }
.comment-row:active { background: #f0f0f0; }
.name { color: #576b95; font-weight: bold; }
.reply-txt { margin: 0 4px; color: #666; }
.content { color: #333; }

.footer-bar {
   position: fixed; bottom: 0; width: 100%;
   background: white; padding: 10px; display: flex;
   border-top: 1px solid #eee;
}
.input { flex: 1; background: #f5f5f5; padding: 8px 12px; border-radius: 20px; font-size: 14px; }
.btn-send { margin-left: 10px; background: #16a34a; color: white; font-size: 14px; padding: 0 20px; border-radius: 20px; line-height: 2.5; }`
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
      const newFiles = [...files];
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
                     ? (item.name === 'src' ? <Code size={14} className="text-blue-400"/> : <Folder size={14} className="text-yellow-400"/>)
                     : item.name.endsWith('json') ? <FileJson size={14} className="text-yellow-300"/> : <FileCode size={14} className={item.name.endsWith('tsx') ? 'text-blue-300' : item.name.endsWith('scss') ? 'text-pink-400' : 'text-gray-400'} />
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
                  <h3 className="font-bold text-gray-100 text-sm">Taro (React) 代码生成器</h3>
                  <p className="text-[10px] text-gray-400">Project: travel-buddy-taro</p>
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
            * 推荐使用 Taro v3.6+。请先安装 Taro CLI: npm install -g @tarojs/cli
         </div>
      </div>
   );
};
