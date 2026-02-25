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

export interface postProps {
  post: Post;
  selectedCategory: string;
}

export interface Comment {
  id: number;
  postId: number;
  author: string; 
  content: string;
  createdAt: string;
}

export type commentProps = {
  comment: Comment;
}

export type mainProps = {
  title: string,
  viewCount: number
}