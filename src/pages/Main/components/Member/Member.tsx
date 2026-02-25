import * as S from "./Member.styled";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import type { MemberProps } from "@/types/member";

export default function Member ({memberInfo}: MemberProps) {
    return (
        <S.MemberCard>
            <S.ProfileImg />
            <S.ForColumn>
                <S.Position $position={memberInfo.role}>{memberInfo.generation}기 {memberInfo.role === 'LEADER' ? '부장' : '부원'}</S.Position>
                <S.StudentName>{memberInfo.userName} ({memberInfo.majors} Developer)</S.StudentName>
                <S.SocialMedia>
                    <FaGithub size={18}/>
                    <FaLinkedin size={18}/>
                </S.SocialMedia>
                <S.From>Louter {memberInfo.generation}기</S.From>
            </S.ForColumn>
        </S.MemberCard>
    )
}