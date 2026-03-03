import QuestionList from "./components/QuestionList";
import AvatarList from "./components/AvatarList";
import QnaList from "./components/QnaList";
import type { Comment } from "./components/types/Qna.type";
import type { AvatarItem } from "./components/types/AvatarList.type";
import type { Question } from "./components/types/QuestionList.type";
import userImg from "../../assets/dummy/userImg.png";
import QnaInput from "./components/QnaInput";
import * as S from "./Mentoring.styled";
import Add from "../../assets/mentoringImg/add.png";
import Category from "./components/Category";
import RoomModal from "./components/modal/RoomModal";
import type { AttachedImage } from "./components/types/QnaInput.type";
import { useState, useEffect } from "react";
import { mentoringApi } from "@/api/Mentoring";
import { getUser } from "@/api/User";
import type { User } from "@/types/user";

interface QuestionWithComments extends Question {
  comments: Comment[];
}

const formatDate = (date: string | Date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "오후" : "오전";
  const h = hours % 12 || 12;
  return `${month}.${day}. ${ampm} ${h}:${minutes}`;
};

export default function Mentoring() {
  const [role, setRole] = useState<"mentor" | "mentee">("mentor");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [questions, setQuestions] = useState<QuestionWithComments[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<AvatarItem | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionWithComments | null>(null);
  const [isWritingNew, setIsWritingNew] = useState(false);
  const [me, setMe] = useState<User | null>(null);

  // 내 정보 조회
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const userData = await getUser();
        setMe(userData);
      } catch (error) {
        console.error("내 정보 조회 실패:", error);
      }
    };
    fetchMe();
  }, []);

  // 유연한 데이터 파싱 헬퍼 함수
  const extractArray = (resData: any): any[] => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (resData.data && Array.isArray(resData.data)) return resData.data;
    if (resData.content && Array.isArray(resData.content)) return resData.content;
    return [];
  };

  // 1. 방 목록 조회
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await mentoringApi.getMentorings();
        const data = extractArray(res.data);
        const rooms: AvatarItem[] = data.map(room => ({
          id: room.mentoringId,
          roomId: room.mentoringId,
          name: room.mentoringName,
          type: "single", 
          userImg: userImg,
        }));
        setAvatars(rooms);
        if (rooms.length > 0 && !selectedRoom) {
          setSelectedRoom(rooms[0]);
        }
      } catch (error) {
        console.error("방 목록 로딩 실패:", error);
      }
    };
    fetchRooms();
  }, []);

  // 2. 선택된 방의 질문 목록 조회
  useEffect(() => {
    if (!selectedRoom) return;
    const fetchQuestions = async () => {
      try {
        const res = await mentoringApi.getQuestions();
        const data = extractArray(res.data);
        const mappedQuestions: QuestionWithComments[] = data.map(q => ({
          id: q.questionId,
          roomId: q.mentoringId,
          title: q.title,
          date: formatDate(q.createdAt),
          status: q.status === "DONE" ? "답변 완료" : q.status === "ACTIVE" ? "답변 중" : "답변 대기",
          comments: []
        }));
        setQuestions(mappedQuestions);
      } catch (error) {
        console.error("질문 목록 로딩 실패:", error);
      }
    };
    fetchQuestions();
  }, [selectedRoom]);

  // 3. 선택된 질문의 메시지(댓글) 조회
  useEffect(() => {
    if (!selectedQuestion) return;
    const fetchMessages = async () => {
      try {
        const res = await mentoringApi.getMessages();
        const data = extractArray(res.data);
        const comments: Comment[] = data.map(m => ({
          id: m.messageId,
          userName: m.userName,
          content: m.content,
          time: formatDate(m.createdAt),
          profileUrl: m.profileUrl || userImg,
          images: m.images || [],
          replies: [] 
        }));
        
        setQuestions(prev => prev.map(q => 
          q.id === selectedQuestion.id ? { ...q, comments } : q
        ));
      } catch (error) {
        console.error("메시지 로딩 실패:", error);
      }
    };
    fetchMessages();
  }, [selectedQuestion]);

  const roomQuestions = selectedRoom 
    ? questions.filter((q) => q.roomId === selectedRoom.roomId)
    : [];

  const handleSelectRoom = (item: AvatarItem) => {
    setSelectedRoom(item);
    setSelectedQuestion(null);
    setIsWritingNew(false);
  };

  const handleCreateRoom = async (name: string, memberIds: number[]) => {
    try {
      const res = await mentoringApi.createMentoring({ mentoringName: name, memberIds });
      const resData = res.data as any;
      const actualData = resData.data || resData.content || resData;

      const newAvatar: AvatarItem = {
        id: actualData.mentoringId,
        roomId: actualData.mentoringId,
        name: actualData.mentoringName,
        type: memberIds.length > 1 ? "batch" : "single",
        ...(memberIds.length > 1
          ? { users: memberIds.map((id) => ({ id, img: userImg })) }
          : { userImg: userImg }),
      } as AvatarItem;

      setAvatars((prev) => [...prev, newAvatar]);
      setSelectedRoom(newAvatar);
    } catch (error) {
      console.error("방 생성 실패:", error);
    }
  };

  const handleAddButtonClick = () => {
    setIsWritingNew(true);
    setSelectedQuestion(null);
  };

  const handleFirstSubmit = async (content: string, _images: AttachedImage[]) => {
    if (!selectedRoom) return;
    try {
      const res = await mentoringApi.createQuestion(
        selectedRoom.roomId, 
        content.length > 20 ? content.slice(0, 20) + "..." : content,
        content
      );
      
      const resData = res.data as any;
      const actualData = resData.data || resData.content || resData;

      const newQuestion: QuestionWithComments = {
        id: actualData.questionId,
        roomId: actualData.mentoringId,
        title: actualData.title,
        date: formatDate(actualData.createdAt),
        status: "답변 대기",
        comments: []
      };
      
      setQuestions((prev) => [newQuestion, ...prev]);
      setSelectedQuestion(newQuestion);
      setIsWritingNew(false);
    } catch (error) {
      console.error("질문 등록 실패:", error);
    }
  };

  const handleReplySubmit = async (content: string, _images: AttachedImage[]) => {
    if (!selectedQuestion) return;
    try {
      const res = await mentoringApi.createMessage(selectedQuestion.id, content);
      const resData = res.data as any;
      const actualData = resData.data || resData.content || resData;

      const newComment: Comment = {
        id: actualData.messageId,
        userName: actualData.userName || me?.userName || "나",
        content: actualData.content,
        time: formatDate(actualData.createdAt),
        profileUrl: actualData.profileUrl || me?.profileImageUrl || userImg,
        images: actualData.images || [],
        replies: [],
      };
      
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === selectedQuestion.id
            ? { ...q, comments: [...q.comments, newComment] }
            : q,
        ),
      );
    } catch (error) {
      console.error("답변 등록 실패:", error);
    }
  };

  const handleUpdateStatus = async (status: "DONE") => {
    if (!selectedQuestion) return;
    try {
      await mentoringApi.updateStatus(selectedQuestion.id, status);
      setQuestions(prev => prev.map(q => 
        q.id === selectedQuestion.id ? { ...q, status: "답변 완료" } : q
      ));
    } catch (error) {
      console.error("상태 업데이트 실패:", error);
    }
  };

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

              <AvatarList
                data={avatars}
                selectedId={selectedRoom?.id ?? null}
                onSelect={handleSelectRoom}
              />
            </S.AvatarContainer>
            <S.QnaContainer>
              질문
              <S.QuestionListScroll>
                {roomQuestions.length > 0 ? (
                  <QuestionList
                    questions={roomQuestions}
                    selectedId={selectedQuestion?.id ?? null}
                    onSelect={(q) => {
                      setSelectedQuestion(q as QuestionWithComments);
                      setIsWritingNew(false);
                    }}
                  />
                ) : (
                  <S.EmptyText>등록된 질문이 없어요.</S.EmptyText>
                )}
              </S.QuestionListScroll>
            </S.QnaContainer>
          </S.LeftArea>

          <S.RightContainer>
            {role === "mentee" && (
              <S.AddContainer>
                <S.AddButton src={Add} onClick={handleAddButtonClick} />
              </S.AddContainer>
            )}
            {role === "mentor" && selectedQuestion && selectedQuestion.status !== "답변 완료" && (
              <S.EndContainer>
                <S.EndWrap>
                  질문에 대한 답변이 끝났나요? 답변 완료 버튼을 눌러주세요.
                  <S.End onClick={() => handleUpdateStatus("DONE")}>답변완료</S.End>
                </S.EndWrap>
              </S.EndContainer>
            )}

            <S.QnaListWrapper>
              {(isWritingNew || selectedQuestion) ? (
                <QnaList
                  comments={
                    questions.find((q) => q.id === selectedQuestion?.id)?.comments ?? []
                  }
                />
              ) : (
                <S.EmptyText>
                  {roomQuestions.length > 0 ? "선택된 질문이 없어요." : "등록된 질문이 없어요."}
                </S.EmptyText>
              )}
            </S.QnaListWrapper>

            {(isWritingNew || selectedQuestion) && (
              <QnaInput
                onSubmit={
                  role === "mentee"
                    ? isWritingNew
                      ? handleFirstSubmit
                      : handleReplySubmit
                    : handleReplySubmit
                }
              />
            )}
          </S.RightContainer>
        </S.container>

        <RoomModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onCreate={handleCreateRoom}
        />
      </S.body>
    </>
  );
}
