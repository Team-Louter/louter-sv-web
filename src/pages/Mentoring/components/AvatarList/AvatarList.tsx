import { useState } from "react";
import * as S from "./AvatarList.styled";
import type { AvatarItem } from "@/types/mentoring";
import kebabMenu from "@/assets/mentoringImg/kebab.png";
import KebabMenu from "@/components/common/KebabMenu/KebabMenu";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";

interface AvatarListItemProps {
  item: AvatarItem;
  isClicked: boolean;
  showKebab: boolean;
  onClick: () => void;
  onEdit: (item: AvatarItem) => void;
  onDelete: (id: number) => void;
}

function AvatarListItem({
  item,
  isClicked,
  showKebab,
  onClick,
  onEdit,
  onDelete,
}: AvatarListItemProps) {
  const isMentee = item.myRole === "MENTEE";

  const kebabItems = [
    {
      label: "수정",
      onClick: () => {
        onEdit(item);
      },
    },
    {
      label: "삭제",
      onClick: () => {
        onDelete(item.id);
      },
    },
  ];

  return (
    <S.container $isClicked={isClicked} onClick={onClick}>
      <S.profile>
        <S.avatarArea>
          {item.type === "single" ? (
            <S.userImg src={item.userImg} />
          ) : (
            <S.avatarGroup>
              {item.users.slice(0, 4).map((u) => (
                <S.userImg key={u.id} src={u.img} $isGroup={true} />
              ))}
            </S.avatarGroup>
          )}
        </S.avatarArea>
        <S.userName>{item.name}</S.userName>
      </S.profile>

      {showKebab && !isMentee && (
        <KebabMenu items={kebabItems} trigger={<S.Kebab src={kebabMenu} />} />
      )}
    </S.container>
  );
}

interface AvatarListProps {
  data: AvatarItem[];
  selectedId: number | null;
  showKebab?: boolean;
  onSelect: (item: AvatarItem) => void;
  onEdit: (item: AvatarItem) => void;
  onDelete: (id: number) => void;
}

export default function AvatarList({
  data,
  selectedId,
  showKebab = true,
  onSelect,
  onEdit,
  onDelete,
}: AvatarListProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  return (
    <>
      <S.list>
        {data.map((item) => (
          <AvatarListItem
            key={item.id}
            item={item}
            isClicked={selectedId === item.id}
            showKebab={showKebab}
            onClick={() => onSelect(item)}
            onEdit={onEdit}
            onDelete={setDeleteTargetId}
          />
        ))}
      </S.list>

      <ConfirmModal
        open={deleteTargetId !== null}
        message="이 멘토링 방을 삭제하시겠습니까?"
        cancelLabel="취소"
        confirmLabel="삭제"
        confirmColor="#e05c5c"
        confirmLabelColor="white"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId === null) return;
          onDelete(deleteTargetId);
          setDeleteTargetId(null);
        }}
      />
    </>
  );
}
