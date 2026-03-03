import * as S from "./styles/AvatarList.styled";
import type { AvatarItem } from "./types/AvatarList.type";
import kebabMenu from "../../../assets/mentoringImg/kebab.png";
import { useKebab } from "@/hooks/useKebab";
import KebabMenu from "@/pages/Community/components/KebabMenu/KebabMenu";

interface AvatarListItemProps {
  item: AvatarItem;
  isClicked: boolean;
  onClick: () => void;
  onEdit: (item: AvatarItem) => void;
  onDelete: (id: number) => void;
}

function AvatarListItem({ item, isClicked, onClick, onEdit, onDelete }: AvatarListItemProps) {
  const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab();

  const kebabItems = [
    { 
      label: "수정", 
      onClick: () => {
        onEdit(item);
        setIsKebabOpen(false);
      } 
    },
    { 
      label: "삭제", 
      onClick: () => {
        if (window.confirm("정말 이 멘토링 방을 삭제하시겠습니까?")) {
          onDelete(item.id);
        }
        setIsKebabOpen(false);
      } 
    },
  ];

  const handleKebabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsKebabOpen(!isKebabOpen);
  };

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
      
      <S.KebabWrapper ref={kebabRef}>
        <S.Kebab src={kebabMenu} onClick={handleKebabClick} />
        {isKebabOpen && <KebabMenu items={kebabItems} />}
      </S.KebabWrapper>
    </S.container>
  );
}

interface AvatarListProps {
  data: AvatarItem[];
  selectedId: number | null;
  onSelect: (item: AvatarItem) => void;
  onEdit: (item: AvatarItem) => void;
  onDelete: (id: number) => void;
}

export default function AvatarList({ data, selectedId, onSelect, onEdit, onDelete }: AvatarListProps) {
  return (
    <>
      {data.map((item) => (
        <AvatarListItem
          key={item.id}
          item={item}
          isClicked={selectedId === item.id}
          onClick={() => onSelect(item)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
