import QnaItem from "../QnaItem/QnaItem";
import type { Comment } from "@/types/mentoring";

interface QnaListProps {
  comments: Comment[];
}

export default function QnaList({ comments }: QnaListProps) {
  if (!comments.length) return null;

  return (
    <>
      {comments.map((comment, index) => (
        <QnaItem key={comment.id} comment={comment} isFirst={index === 0} />
      ))}
    </>
  );
}
