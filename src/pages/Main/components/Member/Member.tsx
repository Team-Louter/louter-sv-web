import * as S from "./Member.styled";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import type { MemberProps } from "@/types/member";

export default function Member ({memberInfo}: MemberProps) {
    return (
        <S.MemberCard>
            <S.ProfileImgDiv>
                <S.ProfileImg src={memberInfo.profileImageUrl} />
            </S.ProfileImgDiv>
            <S.ForColumn>
                <S.Position $position={memberInfo.role}>{memberInfo.generation}기 {memberInfo.role === 'LEADER' ? '부장' : '부원'}</S.Position>
                <S.StudentName>
                {memberInfo.userName} ({memberInfo.majors.length > 0 ? `${memberInfo.majors.join(" & ")} ` : ""}Developer)
                </S.StudentName>
                <S.SocialMedia>
                    {memberInfo.githubUrl && 
                        <a href={memberInfo.githubUrl} target="_blank" rel="noopener noreferrer">
                            <FaGithub size={18} style={{cursor: 'pointer'}}/>
                        </a>}
                    {memberInfo.linkedinUrl && 
                        <a href={memberInfo.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={18} style={{cursor: 'pointer'}}/>
                        </a>}
                </S.SocialMedia>
                <S.From>Louter {memberInfo.generation}기</S.From>
            </S.ForColumn>
        </S.MemberCard>
    )
}