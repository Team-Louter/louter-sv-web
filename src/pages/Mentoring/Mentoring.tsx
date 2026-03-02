import QuestionList from "./components/QuestionList";
import AssignedPersonList from "./components/AvatarList";
import QnaList from "./components/QnaList";
import type { Comment } from "./components/types/Qna.types";
import userImg from "../../assets/dummy/userImg.png";
import QnaInput from "./components/QnaInput";


const dummyComments: Comment[] = [
  {
    id: 1,
    userName: "멘토A",
    content: "이 부분은 이렇게 접근하는 게 좋아요.",
    time: "01.15. 오후 6:40",
    profileUrl: userImg,
    replies: [
      {
        id: 2,
        userName: "멘티B",
        content: "음\n```tsx\nexport function QnaItem({ comment, isReply = false }: Props) {\n ``` \n 아 진짜 어렵네\n ```tsx\nexport function QnaItem({ comment, isReply = false }: Props) {\n ```",
        time: "01.15. 오후 6:45",
        profileUrl: userImg,
        replies: [],
      },
      {
        id: 3,
        userName: "멘토A",
        content: "내일 할 일:최초 질문 크기 확대하기.",
        time: "01.15. 오후 6:47",
        profileUrl: userImg,
        replies: [],
      },
      {
        id:4,
        userName: "멘티B",
        content: "`print('hello world')`",
        time: "01.15. 오후 6:47",
        profileUrl: userImg,
        replies: [],
      },
    ],
  },
];


export default function Mentoring() {
  return (
    <>
      <QuestionList
        question={{
          title: "CRUD가 뭐예요?",
          date: "01.15. 오후 7:01",
          status: "답변 중",
        }}
      />
      <AssignedPersonList />
      <QnaList comments={dummyComments} />
      <QnaInput />
    </>
  );
}
