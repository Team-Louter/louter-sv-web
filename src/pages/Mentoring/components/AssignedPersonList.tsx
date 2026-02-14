import * as S from "./styles/AssignedPersonList.styled";
import { useState } from "react";
import userImg from "../../../assets/dummy/userImg.png";

export default function AssignedPersonList() {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <S.container
        $isClicked={isClicked}
        onClick={() => setIsClicked(!isClicked)}>
          <S.personItem>
            <S.userImg src={userImg}/>
            <S.userName>이도연 멘토</S.userName>
          </S.personItem>
      </S.container>
    </>
  )
}