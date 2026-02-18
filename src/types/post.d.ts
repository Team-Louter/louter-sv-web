export interface MainPost {
  id: number;
  title: string;
  viewCount: number;
}
  
export type Post = {
  id: number;
  category: string;
  tag: string;
  title: string;
  content: string;
  views: number;
  likes: number;
  comments: number;
  author: string;
  createdAt: string;
  isPinned: boolean;
  isHearted: boolean;
}