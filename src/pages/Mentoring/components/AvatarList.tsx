import * as S from "./styles/AvatarList.styled";
import { useState } from "react";
import userImg from "../../../assets/dummy/userImg.png";
import type { AvatarItem } from './types/AvatarList.types';
import kebabMenu from "../../../assets/mentoringImg/kebab.png";

interface AvatarListItemProps {
  item: AvatarItem;
  isClicked: boolean;
  onClick: () => void;
}

function AvatarListItem({ item, isClicked, onClick }: AvatarListItemProps) {
  
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
      <S.Kebab src={kebabMenu}/>
    </S.container>
  );
}


export default function AvatarList() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const data: AvatarItem[] = [
    {
      id: 1,
      type: "single" as const,
      name: "이도연 멘토",
      userImg,
    },
    {
      id: 2,
      type: "batch" as const,
      name: "9기 멘토",
      users: [
        { id: 1, img: userImg },
        { id: 2, img: userImg },
        { id: 3, img: userImg },
        { id: 4, img: userImg },
      ],
    },
  ];

  return (
    <>
      {data.map((item) => (
        <AvatarListItem
          key={item.id}
          item={item}
          isClicked={selectedId === item.id}
          onClick={() => setSelectedId(item.id)}
        />
  ))}

    </>
  );
}