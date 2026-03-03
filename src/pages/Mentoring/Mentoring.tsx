import QuestionList from "./components/QuestionList";
import AvatarList from "./components/AvatarList";
import QnaList from "./components/QnaList";
import type { Comment } from "./components/types/Qna.types";
import type { AvatarItem } from "./components/types/AvatarList.types";
import userImg from "../../assets/dummy/userImg.png";
import QnaInput from "./components/QnaInput";
import * as S from "./Mentoring.styled";
import Add from "../../assets/mentoringImg/add.png";
import Category from "./components/Category";
import RoomModal from "./components/modal/RoomModal";
import { useState } from "react";

const dummyComments: Comment[] = [
  {
    id: 1,
    userName: "멘토A",
    content: "이 부분은 이렇게 접근하는 게 좋아요.",
    time: "01.15. 오후 6:40",
    images: [userImg],
    profileUrl: userImg,
    replies: [
      {
        id: 2,
        userName: "멘티B",
        content:
          "음\n```tsx\nexport function QnaItem({ comment, isReply = false }: Props) {\n ``` \n 아 진짜 어렵네\n ```tsx\nexport function QnaItem({ comment, isReply = false }: Props) {\n ```",
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
        id: 4,
        userName: "멘티B",
        content: "`print('hello world')`",
        time: "01.15. 오후 6:47",
        profileUrl: userImg,
        replies: [],
      },
      {
        id: 5,
        userName: "멘티B",
        content: "`print('hello world')`",
        time: "01.15. 오후 6:47",
        profileUrl: userImg,
        replies: [],
      },
      {
        id: 6,
        userName: "멘티B",
        content: "`print('hello world')`",
        time: "01.15. 오후 6:47",
        profileUrl: userImg,
        replies: [],
      },
    ],
  },
];

const dummyAvatars: AvatarItem[] = [
  {
    id: 1,
    type: "single",
    name: "이도연 멘토",
    userImg,
  },
  {
    id: 2,
    type: "batch",
    name: "9기 멘토",
    users: [
      { id: 1, img: userImg },
      { id: 2, img: userImg },
      { id: 3, img: userImg },
      { id: 4, img: userImg },
    ],
  },
];

const dummyQuestions = [
  {
    title: "CRUD가 뭐예요?",
    date: "01.15. 오후 7:01",
    status: "답변 중" as const,
  },
  {
    title: "CRUD가 뭐예요?",
    date: "01.15. 오후 7:01",
    status: "답변 중" as const,
  },
  {
    title: "CRUD가 뭐예요?",
    date: "01.15. 오후 7:01",
    status: "답변 중" as const,
  },
  {
    title: "REST API가 뭐예요?",
    date: "01.16. 오후 3:00",
    status: "답변 완료" as const,
  },
  {
    title: "REST API가 뭐예요?",
    date: "01.16. 오후 3:00",
    status: "답변 완료" as const,
  },
  {
    title: "REST API가 뭐예요?",
    date: "01.16. 오후 3:00",
    status: "답변 완료" as const,
  },
];

export default function Mentoring() {
  const [role, setRole] = useState<"mentor" | "mentee">("mentor");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <S.body>
        <S.CategoryWrap>
          <Category selected={role} onSelect={setRole} />
          해당하는 역할을 선택해 주세요!
        </S.CategoryWrap>

        <S.container>
          <S.LeftArea>
            <S.AvatarContainer>
              <S.TitleAddContainer>
                {role === "mentee" && "멘토"}
                {role === "mentor" && (
                  <>
                    멘티
                    <S.AddButton src={Add} onClick={() => setIsModalOpen(true)} />
                  </>
                )}
              </S.TitleAddContainer>
              <AvatarList data={dummyAvatars} />
            </S.AvatarContainer>
            <S.QnaContainer>
              질문
              <S.QuestionListScroll>
                <QuestionList questions={dummyQuestions} />
              </S.QuestionListScroll>
            </S.QnaContainer>
          </S.LeftArea>
          <S.RightContainer>
            {role === "mentee" && (
              <S.AddContainer>
                <S.AddButton src={Add} />
              </S.AddContainer>
            )}
            {role === "mentor" && (
              <S.EndContainer>
                <S.EndWrap>
                  질문에 대한 답변이 끝났나요? 답변 완료 버튼을 눌러주세요.
                  <S.End>답변완료</S.End>
                </S.EndWrap>
              </S.EndContainer>
            )}

            <S.QnaListWrapper>
              <QnaList comments={dummyComments} />
            </S.QnaListWrapper>

            <QnaInput />
          </S.RightContainer>
        </S.container>

        <RoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </S.body>
    </>
  );
}