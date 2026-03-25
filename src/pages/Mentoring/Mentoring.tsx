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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

const getQuestionCreatedTime = (question: QuestionWithComments) =>
  new Date(question.createdAt).getTime();

const sortQuestionsByStatusAndActivity = (
  questionList: QuestionWithComments[],
) => {
  const activeQuestions = questionList
    .filter((question) => question.status !== "답변 완료")
    .sort(
      (a, b) =>
        getLatestActivityTime(b) - getLatestActivityTime(a) ||
        getQuestionCreatedTime(b) - getQuestionCreatedTime(a) ||
        b.id - a.id,
    );

  const completedQuestions = questionList
    .filter((question) => question.status === "답변 완료")
    .sort(
      (a, b) =>
        getQuestionCreatedTime(b) - getQuestionCreatedTime(a) || b.id - a.id,
    );

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
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [editingRoom, setEditingRoom] = useState<AvatarItem | null>(null);
  const [isRoomsLoading, setIsRoomsLoading] = useState(false);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadedQuestionRoomId, setLoadedQuestionRoomId] = useState<number | null>(
    null,
  );

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

  const fetchQuestions = useCallback(async () => {
    if (!selectedRoomId || !me) {
      setQuestions([]);
      setIsQuestionsLoading(false);
      setLoadedQuestionRoomId(null);
      return;
    }

    setIsQuestionsLoading(true);
    setLoadedQuestionRoomId(null);
    try {
      const [questionsRes, messagesRes] = await Promise.all([
        mentoringApi.getQuestions(),
        mentoringApi.getMessages(),
      ]);
      const data = extractArray(questionsRes);
      const messages = extractArray(messagesRes);
      setAllMessages(messages);

      const mappedQuestions: QuestionWithComments[] = data
        .filter((q: any) => Number(q.mentoringId) === Number(selectedRoomId))
        .map((q: any) => {
          const isMe = Number(q.userId) === Number(me.userId);
          const info = allMembers.find((m) => Number(m.userId) === Number(q.userId));

          return {
            id: Number(q.questionId),
            roomId: Number(q.mentoringId),
            authorId: Number(q.userId),
            title: q.title,
            date: formatDate(q.createdAt),
            createdAt: q.createdAt,
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
                    userName: isMe ? me.userName || "나" : info?.userName || "질문자",
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

      setQuestions(mappedQuestions);
    } catch (error) {
      console.error("질문 목록 로딩 실패:", error);
    } finally {
      setLoadedQuestionRoomId(selectedRoomId);
      setIsQuestionsLoading(false);
    }
  }, [selectedRoomId, me, extractArray, allMembers]);

  const applySelectedQuestionMessages = useCallback(
    (messages: any[]) => {
      if (!selectedQuestionId || isWritingNew || !me) {
        setIsMessagesLoading(false);
        return;
      }

      const selectedQuestionMessages = messages.filter(
        (message: any) => Number(message.questionId) === Number(selectedQuestionId),
      );

      const serverComments: Comment[] = selectedQuestionMessages.map((m: any) => {
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
      });

      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== selectedQuestionId) return q;

          const questionComment = q.comments.find((comment) => comment.id === q.id);
          const nextComments = questionComment
            ? [questionComment, ...serverComments]
            : serverComments;

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
            comments: nextComments.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            ),
          };
        }),
      );
      setIsMessagesLoading(false);
    },
    [selectedQuestionId, isWritingNew, me, allMembers],
  );

  const fetchSelectedQuestionMessages = useCallback(async () => {
    if (!selectedQuestionId || isWritingNew || !me) {
      setIsMessagesLoading(false);
      return;
    }

    if (allMessages.length > 0) {
      applySelectedQuestionMessages(allMessages);
      return;
    }

    setIsMessagesLoading(true);
    try {
      const res = await mentoringApi.getMessages();
      const data = extractArray(res);
      setAllMessages(data);
      applySelectedQuestionMessages(data);
    } catch (error) {
      console.error("메시지 로딩 실패:", error);
      setIsMessagesLoading(false);
    }
  }, [
    selectedQuestionId,
    isWritingNew,
    me,
    allMessages,
    extractArray,
    applySelectedQuestionMessages,
  ]);

  // 내 정보 및 전체 멤버 조회
  useEffect(() => {
    const init = async () => {
      setIsInitialLoading(true);
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
      } finally {
        setIsInitialLoading(false);
      }
    };
    init();
  }, [authUser, fetchMyRooms]);

  // 방 선택 시 질문 목록 조회
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // 질문 선택 시 메시지 조회
  useEffect(() => {
    fetchSelectedQuestionMessages();
  }, [fetchSelectedQuestionMessages]);

  const roomQuestions = selectedRoomId
    ? sortQuestionsByStatusAndActivity(
        questions.filter((q) => Number(q.roomId) === Number(selectedRoomId)),
      )
    : [];

  useEffect(() => {
    if (isWritingNew) return;

    if (roomQuestions.length === 0) {
      setSelectedQuestionId(null);
      return;
    }

    const hasSelectedQuestion = roomQuestions.some(
      (question) => question.id === selectedQuestionId,
    );

    if (!hasSelectedQuestion) {
      setSelectedQuestionId(roomQuestions[0].id);
    }
  }, [roomQuestions, selectedQuestionId, isWritingNew]);

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
      await fetchQuestions();
      setSelectedQuestionId(Number(res.questionId));
      setIsWritingNew(false);
      await fetchSelectedQuestionMessages();
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

      await mentoringApi.createMessage(
        selectedQuestionId,
        content,
        validFiles,
      );
      await fetchQuestions();
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
  const selectedRoom = avatars.find((avatar) => avatar.id === selectedRoomId) ?? null;
  const canCreateRoom = me?.role !== "MENTEE";
  const canCompleteAnswer = selectedRoom?.myRole === "MENTOR";
  const hasSelectedRoom = selectedRoomId !== null && selectedRoom !== null;
  const hasNoRooms =
    !isInitialLoading && !isRoomsLoading && avatars.length === 0;
  const hasLoadedCurrentRoomQuestions =
    hasSelectedRoom && loadedQuestionRoomId === selectedRoomId;
  const isWaitingForAutoSelection =
    !isWritingNew &&
    hasLoadedCurrentRoomQuestions &&
    roomQuestions.length > 0 &&
    selectedQuestionObj === null;
  const isRoomSectionLoading = isInitialLoading || isRoomsLoading;
  const isQuestionSectionLoading =
    !hasNoRooms &&
    hasSelectedRoom &&
    (isInitialLoading ||
      isQuestionsLoading ||
      !hasLoadedCurrentRoomQuestions);
  const isDetailSectionLoading =
    !hasNoRooms &&
    hasSelectedRoom &&
    (isInitialLoading ||
      isQuestionsLoading ||
      !hasLoadedCurrentRoomQuestions ||
      isMessagesLoading ||
      isWaitingForAutoSelection);
  const shouldShowQuestionEmpty = hasNoRooms || !hasSelectedRoom || roomQuestions.length === 0;
  const shouldShowDetailEmpty = hasNoRooms || !hasSelectedRoom || !selectedQuestionObj;

  const roomSkeletons = Array.from({ length: 4 }, (_, index) => (
    <div
      key={`room-skeleton-${index}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.9375rem 1.25rem",
        border: "1px solid #f1e1b6",
        borderRadius: "0.75rem",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flex: 1 }}>
        <Skeleton circle width={35} height={35} baseColor="#f5f5f5" highlightColor="#ececec" />
        <Skeleton height={16} width="42%" baseColor="#f5f5f5" highlightColor="#ececec" />
      </div>
      <Skeleton width={3} height={15} baseColor="#f0f0f0" highlightColor="#e7e7e7" />
    </div>
  ));

  const questionSkeletons = Array.from({ length: 4 }, (_, index) => (
    <div
      key={`question-skeleton-${index}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.6rem 1.25rem",
        border: "1px solid #f1e1b6",
        borderRadius: "0.75rem",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Skeleton height={16} width="48%" baseColor="#f5f5f5" highlightColor="#ececec" />
          <Skeleton height={14} width={72} baseColor="#f5f5f5" highlightColor="#ececec" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Skeleton height={14} width={24} baseColor="#f5f5f5" highlightColor="#ececec" />
          <Skeleton height={14} width={54} baseColor="#f5f5f5" highlightColor="#ececec" />
        </div>
      </div>
      <Skeleton width={3} height={15} baseColor="#f0f0f0" highlightColor="#e7e7e7" />
    </div>
  ));

  const messageSkeletons = Array.from({ length: 3 }, (_, index) => (
    <div
      key={`message-skeleton-${index}`}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        padding: "0.75rem 0",
      }}
    >
      <Skeleton circle width={35} height={35} baseColor="#f5f5f5" highlightColor="#ececec" />
      <div style={{ flex: 1 }}>
        <Skeleton height={16} width={68} baseColor="#f5f5f5" highlightColor="#ececec" />
        <div
          style={{
            marginTop: 10,
            display: "inline-flex",
            flexDirection: "column",
            gap: 8,
            border: `1px solid ${index === 0 ? "#ffd26f" : "#ececec"}`,
            borderRadius: "0.75rem",
            padding: "12px 15px",
            backgroundColor: "#ffffff",
            minWidth: index === 0 ? "22rem" : "18rem",
          }}
        >
          <Skeleton height={16} width={index === 0 ? 260 : 210} baseColor="#f5f5f5" highlightColor="#ececec" />
          <Skeleton height={16} width={index === 0 ? 180 : 150} baseColor="#f5f5f5" highlightColor="#ececec" />
        </div>
      </div>
      <div style={{ paddingTop: 58 }}>
        <Skeleton height={14} width={70} baseColor="#f5f5f5" highlightColor="#ececec" />
      </div>
    </div>
  ));

  return (
    <>
      <S.body>
        <S.container>
          <S.LeftArea>
            <S.AvatarContainer>
              <S.TitleAddContainer>
                방
                {canCreateRoom && (
                  <S.AddButton type="button" onClick={() => setIsModalOpen(true)}>
                    <S.AddIcon src={Add} alt="방 추가" />
                  </S.AddButton>
                )}
              </S.TitleAddContainer>
              <S.AvatarListScroll>
                {isRoomSectionLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {roomSkeletons}
                  </div>
                ) : hasNoRooms ? (
                  <S.EmptyState>
                    <S.EmptyText>방이 없어요.</S.EmptyText>
                  </S.EmptyState>
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
                {isQuestionSectionLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {questionSkeletons}
                  </div>
                ) : !shouldShowQuestionEmpty ? (
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
                  <S.EmptyState>
                    <S.EmptyText>등록된 질문이 없어요.</S.EmptyText>
                  </S.EmptyState>
                )}
              </S.QuestionListScroll>
            </S.QnaContainer>
          </S.LeftArea>

            <S.RightContainer>
              <S.TopActionRow>
                {canCompleteAnswer &&
                  selectedQuestionObj &&
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

                <S.AddContainer>
                  <S.AddButton type="button" onClick={handleAddButtonClick}>
                    <S.AddIcon src={Add} alt="질문 추가" />
                  </S.AddButton>
                </S.AddContainer>
              </S.TopActionRow>

            <S.QnaListWrapper>
              {isDetailSectionLoading ? (
                <div>{messageSkeletons}</div>
              ) : isWritingNew ? (
                <S.EmptyState>
                  <S.EmptyText>질문을 시작해보세요.</S.EmptyText>
                </S.EmptyState>
              ) : !shouldShowDetailEmpty ? (
                <QnaList
                  key={selectedQuestionId ?? "empty-question"}
                  comments={selectedQuestionObj?.comments ?? []}
                />
              ) : (
                <S.EmptyState>
                  <S.EmptyText>선택된 질문이 없어요.</S.EmptyText>
                </S.EmptyState>
              )}
            </S.QnaListWrapper>

            {(isWritingNew ||
              (selectedQuestionObj &&
                selectedQuestionObj.status !== "답변 완료")) && (
              <QnaInput
                onSubmit={isWritingNew ? handleFirstSubmit : handleReplySubmit}
                placeholder={
                  isWritingNew ? "질문을 남겨보세요." : "답변을 남겨보세요."
                }
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
