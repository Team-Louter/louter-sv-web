import type { Member } from "@/types/member";
import * as S from "./Member.styled";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface MemberProps {
    memberInfo: Member;
    isLoading: boolean;
}

export default function Member ({memberInfo, isLoading}: MemberProps) {
    return (
        <S.MemberCard>
            <S.ProfileImgDiv>
                {isLoading
                    ? <S.ImgSkeleton/>
                    : <S.ProfileImg src={memberInfo.profileImageUrl} />
                }
            </S.ProfileImgDiv>
            <S.ForColumn>
                {isLoading? <Skeleton height={22} width={80}/> : <S.Position $position={memberInfo.role}>{memberInfo.generation}기 {memberInfo.role === 'LEADER' ? '부장' : '부원'}</S.Position>}
                {isLoading 
                    ? <Skeleton width={200} height={35}/> 
                    : <S.StudentName>
                        {memberInfo.userName} ({memberInfo.majors.length > 0 ? `${memberInfo.majors.join(" & ")} ` : ""}Developer)
                    </S.StudentName> 
                }
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
                {isLoading 
                    ? <Skeleton height={20} width={60}/> 
                    : <S.From>Louter {memberInfo.generation}기</S.From>
                }
            </S.ForColumn>
        </S.MemberCard>
    )
}