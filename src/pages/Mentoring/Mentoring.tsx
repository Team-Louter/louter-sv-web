import QuestionList from "./components/QuestionList/QuestionList";
import AvatarList from "./components/AvatarList/AvatarList";
import QnaList from "./components/QnaList/QnaList";
import type {
  AttachedImage,
  AvatarItem,
  Comment,
  Question,
  QuestionWithComments,
} from "@/types/mentoring";
import userImg from "@/assets/anonymousProfile.png";
import QnaInput from "./components/QnaInput/QnaInput";
import * as S from "./Mentoring.styled";
import Add from "@/assets/mentoringImg/add.png";
import RoomModal from "./components/modal/RoomModal";
import { useState, useEffect, useCallback } from "react";
import { mentoringApi } from "@/api/Mentoring";
import { getUser } from "@/api/User";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";
import type { Member } from "@/types/member";
import { toast } from "@/store/toastStore";

const getQuestionStatus = (
  status: string,
  questionId: number,
  messages: any[],
  questionAuthorId: number,
): Question["status"] => {
  if (status === "DONE") return "답변 완료";

  const hasReplyFromOthers = messages.some(
    (message) =>
      Number(message.questionId) === questionId &&
      Number(message.userId) !== questionAuthorId,
  );

  if (hasReplyFromOthers) return "답변 중";
  return "답변 대기";
};

const getLatestActivityTime = (question: QuestionWithComments) => {
  if (question.comments.length === 0) return 0;

  return Math.max(
    ...question.comments.map((comment) =>
      new Date(comment.createdAt).getTime(),
    ),
  );
};

const sortQuestionsByStatusAndActivity = (
  questionList: QuestionWithComments[],
) => {
  const activeQuestions = questionList
    .filter((question) => question.status !== "답변 완료")
    .sort((a, b) => getLatestActivityTime(b) - getLatestActivityTime(a));

  const completedQuestions = questionList
    .filter((question) => question.status === "답변 완료")
    .sort((a, b) => getLatestActivityTime(b) - getLatestActivityTime(a));

  return [...activeQuestions, ...completedQuestions];
};

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
  const { user: authUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [questions, setQuestions] = useState<QuestionWithComments[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  );
  const [isWritingNew, setIsWritingNew] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [editingRoom, setEditingRoom] = useState<AvatarItem | null>(null);
  const [isRoomsLoading, setIsRoomsLoading] = useState(false);

  const extractArray = useCallback((data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.content && Array.isArray(data.content)) return data.content;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  }, []);

  const fetchMyRooms = useCallback(
    async (currentMe: User, membersList: Member[]) => {
      setIsRoomsLoading(true);
      try {
        const allRoomsRes = await mentoringApi.getMentorings();
        const roomsData = extractArray(allRoomsRes);

        const roomsWithMembership = await Promise.all(
          roomsData.map(async (room: any) => {
            try {
              const [leadersRes, mentorsRes, menteesRes] = await Promise.all([
                mentoringApi.getMembers(room.mentoringId, "LEADER"),
                mentoringApi.getMembers(room.mentoringId, "MENTOR"),
                mentoringApi.getMembers(room.mentoringId, "MENTEE"),
              ]);

              const leaders = extractArray(leadersRes);
              const mentors = extractArray(mentorsRes);
              const mentees = extractArray(menteesRes);

              const leaderIds = leaders.map((m) => Number(m.userId));
              const mentorIds = mentors.map((m) => Number(m.userId));
              const menteeIds = mentees.map((m) => Number(m.userId));

              const myId = Number(currentMe.userId);

              const isLeader = leaderIds.includes(myId);
              const isMentor = mentorIds.includes(myId);
              const isMentee = menteeIds.includes(myId);
              const isMyRoom = isLeader || isMentor || isMentee;

              if (!isMyRoom) return null;

              const myRole = isLeader
                ? "LEADER"
                : isMentor
                  ? "MENTOR"
                  : "MENTEE";

              const roomMemberIds = Array.from(
                new Set([...leaderIds, ...mentorIds, ...menteeIds]),
              );

              const membersInRoom = roomMemberIds.map((uid) => {
                const info = membersList.find(
                  (m) => Number(m.userId) === Number(uid),
                );
                const isActuallyMe =
                  currentMe && Number(uid) === Number(currentMe.userId);
                return {
                  id: Number(uid),
                  name: isActuallyMe
                    ? currentMe.userName || "나"
                    : info?.userName || "알 수 없음",
                  img: isActuallyMe
                    ? currentMe.profileImageUrl || userImg
                    : info?.profileImageUrl || userImg,
                };
              });

              const otherMembers = membersInRoom.filter(
                (m) => String(m.id) !== String(currentMe.userId),
              );
              const isBatch = otherMembers.length >= 2;

              return {
                id: Number(room.mentoringId),
                roomId: Number(room.mentoringId),
                name: room.mentoringName || "이름 없는 방",
                type: isBatch ? "batch" : "single",
                userImg: otherMembers[0]?.img || userImg,
                users: membersInRoom,
                myRole,
              } as AvatarItem;
            } catch (err) {
              console.warn(`방(ID:${room.mentoringId}) 멤버 조회 실패:`, err);
              return null;
            }
          }),
        );

        const filteredRooms = roomsWithMembership.filter(
          (r): r is AvatarItem => r !== null,
        );
        setAvatars(filteredRooms);

        setSelectedRoomId((prev) => {
          if (filteredRooms.length === 0) return null;
          if (!prev || !filteredRooms.some((r) => r.id === prev))
            return filteredRooms[0].id;
          return prev;
        });
      } catch (error) {
        console.error("방 목록 로딩 실패:", error);
      } finally {
        setIsRoomsLoading(false);
      }
    },
    [extractArray],
  );

  // 내 정보 및 전체 멤버 조회
  useEffect(() => {
    const init = async () => {
      try {
        const [userData, membersData] = await Promise.all([
          getUser(),
          mentoringApi.getAllMembers(),
        ]);

        setMe(userData);
        setAllMembers(membersData);

        fetchMyRooms(userData, membersData);
      } catch (error) {
        console.error("초기 데이터 로딩 실패:", error);
      }
    };
    init();
  }, [authUser, fetchMyRooms]);

  // 방 선택 시 질문 목록 조회
  useEffect(() => {
    if (!selectedRoomId || !me) {
      setQuestions([]);
      return;
    }
    const fetchQuestions = async () => {
      try {
        const [questionsRes, messagesRes] = await Promise.all([
          mentoringApi.getQuestions(),
          mentoringApi.getMessages(),
        ]);
        const data = extractArray(questionsRes);
        const messages = extractArray(messagesRes);

        const mappedQuestions: QuestionWithComments[] = data
          .filter((q: any) => Number(q.mentoringId) === Number(selectedRoomId))
          .map((q: any) => {
            const isMe = me && Number(q.userId) === Number(me.userId);
            const info = allMembers.find(
              (m) => Number(m.userId) === Number(q.userId),
            );

            return {
              id: Number(q.questionId),
              roomId: Number(q.mentoringId),
              authorId: Number(q.userId),
              title: q.title,
              date: formatDate(q.createdAt),
              status: getQuestionStatus(
                q.status,
                Number(q.questionId),
                messages,
                Number(q.userId),
              ),
              comments: q.content
                ? [
                    {
                      id: q.questionId,
                      userName: isMe
                        ? me.userName || "나"
                        : info?.userName || "질문자",
                      content: q.content,
                      time: formatDate(q.createdAt),
                      createdAt: q.createdAt,
                      profileUrl: isMe
                        ? me.profileImageUrl || userImg
                        : info?.profileImageUrl || userImg,
                      images: q.files?.map((f: any) => f.fileUrl) || [],
                      replies: [],
                    },
                  ]
                : [],
            };
          });

        setQuestions((prev) => {
          return mappedQuestions.map((newQ) => {
            const existing = prev.find((p) => p.id === newQ.id);
            return existing ? { ...newQ, comments: existing.comments } : newQ;
          });
        });
      } catch (error) {
        console.error("질문 목록 로딩 실패:", error);
      }
    };
    fetchQuestions();
  }, [selectedRoomId, extractArray, me, allMembers]);

  // 질문 선택 시 메시지 조회
  useEffect(() => {
    if (!selectedQuestionId || isWritingNew || !me) return;

    const fetchMessages = async () => {
      try {
        const res = await mentoringApi.getMessages();
        const data = extractArray(res);
        const selectedQuestionMessages = data.filter(
          (message: any) =>
            Number(message.questionId) === Number(selectedQuestionId),
        );

        const serverComments: Comment[] = selectedQuestionMessages.map(
          (m: any) => {
            const isMe = Number(m.userId) === Number(me.userId);
            const info = allMembers.find(
              (member) => Number(member.userId) === Number(m.userId),
            );

            return {
              id: Number(m.messageId),
              userName: isMe ? me.userName || "나" : info?.userName || "익명",
              content: m.content,
              time: formatDate(m.createdAt),
              createdAt: m.createdAt,
              profileUrl: isMe
                ? me.profileImageUrl || userImg
                : info?.profileImageUrl || userImg,
              images: m.files?.map((f: any) => f.fileUrl) || [],
              replies: [],
            };
          },
        );

        if (serverComments.length > 0) {
          setQuestions((prev) =>
            prev.map((q) => {
              if (q.id !== selectedQuestionId) return q;
              const combined = [...q.comments];
              serverComments.forEach((sc) => {
                if (!combined.some((pc) => pc.id === sc.id)) combined.push(sc);
              });
              return {
                ...q,
                status: getQuestionStatus(
                  q.status === "답변 완료"
                    ? "DONE"
                    : q.status === "답변 중"
                      ? "ACTIVE"
                      : "PENDING",
                  q.id,
                  selectedQuestionMessages,
                  q.authorId,
                ),
                comments: combined.sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime(),
                ),
              };
            }),
          );
        }
      } catch (error) {
        console.error("메시지 로딩 실패:", error);
      }
    };
    fetchMessages();
  }, [selectedQuestionId, isWritingNew, extractArray, me, allMembers]);

  const roomQuestions = selectedRoomId
    ? sortQuestionsByStatusAndActivity(
        questions.filter((q) => Number(q.roomId) === Number(selectedRoomId)),
      )
    : [];

  const handleSelectRoom = (item: AvatarItem) => {
    setSelectedRoomId(item.id);
    setSelectedQuestionId(null);
    setIsWritingNew(false);
  };

  const handleEditClick = (item: AvatarItem) => {
    setEditingRoom(item);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await mentoringApi.deleteMentoring(id);
      if (me) fetchMyRooms(me, allMembers);
      toast.success("방이 삭제되었습니다.");
    } catch (error) {
      console.error("방 삭제 실패:", error);
      toast.error("방 삭제에 실패했습니다.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleCreateRoom = async (name: string, memberIds: number[]) => {
    try {
      await mentoringApi.createMentoring({ mentoringName: name, memberIds });
      if (me) fetchMyRooms(me, allMembers);
      toast.success("방이 생성되었습니다.");
    } catch (error) {
      console.error("방 생성 실패:", error);
      toast.error("방 생성에 실패했습니다.");
    }
  };

  const handleUpdateRoom = async (
    id: number,
    name: string,
    memberIds: number[],
  ) => {
    try {
      await mentoringApi.updateMentoring(id, {
        mentoringName: name,
        memberIds,
      });
      if (me) fetchMyRooms(me, allMembers);
      toast.success("방 정보가 수정되었습니다.");
    } catch (error) {
      console.error("방 수정 실패:", error);
      toast.error("방 수정에 실패했습니다.");
    }
  };

  const handleAddButtonClick = () => {
    setIsWritingNew(true);
    setSelectedQuestionId(null);
  };

  const handleFirstSubmit = async (
    content: string,
    images: AttachedImage[],
  ) => {
    if (!selectedRoomId) return;
    try {
      const uploadedFiles = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            const res = await mentoringApi.uploadFile(img.file);
            return {
              targetType: "QUESTION",
              targetId: 0,
              fileUrl: res.url,
              fileName: img.name,
              fileType: img.file.type,
              fileSize: img.file.size,
            };
          }
          return null;
        }),
      );

      const validFiles = uploadedFiles.filter((f): f is any => f !== null);

      const title =
        content.length > 20 ? content.slice(0, 20) + "..." : content;
      const res = await mentoringApi.createQuestion(
        selectedRoomId,
        title,
        content,
        validFiles,
      );

      const newQuestion: QuestionWithComments = {
        id: Number(res.questionId),
        roomId: Number(res.mentoringId),
        authorId: Number(me?.userId ?? res.userId ?? 0),
        title: res.title,
        date: formatDate(res.createdAt),
        status: "답변 대기",
        comments: [
          {
            id: res.questionId,
            userName: me?.userName || "나",
            content: content,
            time: formatDate(res.createdAt),
            createdAt: res.createdAt,
            profileUrl: me?.profileImageUrl || userImg,
            images: res.files?.map((f: any) => f.fileUrl) || [],
            replies: [],
          },
        ],
      };
      setQuestions((prev) => [newQuestion, ...prev]);
      setSelectedQuestionId(newQuestion.id);
      setIsWritingNew(false);
      toast.success("질문이 등록되었습니다.");
    } catch (error) {
      console.error("질문 등록 실패:", error);
      toast.error("질문 등록에 실패했습니다.");
      throw error;
    }
  };

  const handleReplySubmit = async (
    content: string,
    images: AttachedImage[],
  ) => {
    if (!selectedQuestionId) return;
    try {
      const uploadedFiles = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            const res = await mentoringApi.uploadFile(img.file);
            return {
              targetType: "QUESTION",
              targetId: 0,
              fileUrl: res.url,
              fileName: img.name,
              fileType: img.file.type,
              fileSize: img.file.size,
            };
          }
          return null;
        }),
      );

      const validFiles = uploadedFiles.filter((f): f is any => f !== null);

      const res = await mentoringApi.createMessage(
        selectedQuestionId,
        content,
        validFiles,
      );
      const newComment: Comment = {
        id: Number(res.messageId),
        userName: me?.userName || "나",
        content: res.content,
        time: formatDate(res.createdAt),
        createdAt: res.createdAt,
        profileUrl: me?.profileImageUrl || userImg,
        images: res.files?.map((f: any) => f.fileUrl) || [],
        replies: [],
      };
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === selectedQuestionId
            ? { ...q, comments: [...q.comments, newComment] }
            : q,
        ),
      );
      toast.success("답변이 등록되었습니다.");
    } catch (error) {
      console.error("답변 등록 실패:", error);
      toast.error("답변 등록에 실패했습니다.");
      throw error;
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await mentoringApi.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => Number(q.id) !== Number(id)));
      if (selectedQuestionId === id) {
        setSelectedQuestionId(null);
      }
      toast.success("질문이 삭제되었습니다.");
    } catch (error) {
      console.error("질문 삭제 실패:", error);
      toast.error("질문 삭제에 실패했습니다.");
    }
  };

  const handleUpdateStatus = async (status: "DONE") => {
    if (!selectedQuestionId) return;
    try {
      await mentoringApi.updateStatus(selectedQuestionId, status);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === selectedQuestionId ? { ...q, status: "답변 완료" } : q,
        ),
      );
      toast.success("상태가 업데이트되었습니다.");
    } catch (error) {
      console.error("상태 업데이트 실패:", error);
      toast.error("상태 업데이트에 실패했습니다.");
    }
  };

  const selectedQuestionObj =
    questions.find((q) => q.id === selectedQuestionId) ?? null;

  return (
    <>
      <S.body>
        <S.container>
          <S.LeftArea>
            <S.AvatarContainer>
              <S.TitleAddContainer>
                방
                <S.AddButton src={Add} onClick={() => setIsModalOpen(true)} />
              </S.TitleAddContainer>
              <S.AvatarListScroll>
                {isRoomsLoading ? (
                  <div style={{ padding: "20px", textAlign: "center" }}>
                    로딩 중...
                  </div>
                ) : (
                  <AvatarList
                    data={avatars}
                    selectedId={selectedRoomId}
                    showKebab={true}
                    onSelect={handleSelectRoom}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteRoom}
                  />
                )}
              </S.AvatarListScroll>
            </S.AvatarContainer>
            <S.QnaContainer>
              질문
              <S.QuestionListScroll>
                {roomQuestions.length > 0 ? (
                  <QuestionList
                    questions={roomQuestions}
                    selectedId={selectedQuestionId}
                    onSelect={(q) => {
                      setSelectedQuestionId(q.id);
                      setIsWritingNew(false);
                    }}
                    onDelete={handleDeleteQuestion}
                  />
                ) : (
                  <S.EmptyText>등록된 질문이 없어요.</S.EmptyText>
                )}
              </S.QuestionListScroll>
            </S.QnaContainer>
          </S.LeftArea>

          <S.RightContainer>
            <S.AddContainer>
              <S.AddButton src={Add} onClick={handleAddButtonClick} />
            </S.AddContainer>

            {selectedQuestionObj &&
              selectedQuestionObj.status !== "답변 완료" && (
                <S.EndContainer>
                  <S.EndWrap>
                    질문에 대한 답변이 끝났나요? 답변 완료 버튼을 눌러주세요.
                    <S.End onClick={() => handleUpdateStatus("DONE")}>
                      답변완료
                    </S.End>
                  </S.EndWrap>
                </S.EndContainer>
              )}

            <S.QnaListWrapper>
              {isWritingNew || selectedQuestionObj ? (
                <QnaList comments={selectedQuestionObj?.comments ?? []} />
              ) : (
                <S.EmptyText>
                  {roomQuestions.length > 0
                    ? "선택된 질문이 없어요."
                    : "등록된 질문이 없어요."}
                </S.EmptyText>
              )}
            </S.QnaListWrapper>

            {(isWritingNew || selectedQuestionObj) && (
              <QnaInput
                onSubmit={isWritingNew ? handleFirstSubmit : handleReplySubmit}
              />
            )}
          </S.RightContainer>
        </S.container>

        <RoomModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onCreate={handleCreateRoom}
          onUpdate={handleUpdateRoom}
          initialData={editingRoom}
        />
      </S.body>
    </>
  );
}
