import { QnaItem } from "./QnaItem";
import type { Comment } from "./types/Qna.type";

interface Props {
  comments: Comment[];
}

export default function QnaList({ comments }: Props) {
  if (!comments.length) return null;

  return (
    <>
      {comments.map((comment, index) => (
        <QnaItem key={comment.id} comment={comment} isFirst={index === 0} />
      ))}
    </>
  );
}