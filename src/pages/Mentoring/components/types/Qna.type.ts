export interface Comment {
  id: number;
  userName: string;
  content: string;
  time: string;
  createdAt: string;
  profileUrl: string;
  images?: string[];
  replies: Comment[];
}