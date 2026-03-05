import styled from "styled-components";
import * as token from "@/styles/values/token";

export const MemberCard = styled.div`
    width: 80%;
    height: 160px;
    border-bottom: 2px solid ${token.colors.line.light};
    ${token.flexLeft};
    flex-shrink: 0;
`

export const ProfileImgDiv = styled.div`
    height: 120px;
    aspect-ratio: 3/2;
    border: 1px solid ${token.colors.line.normal};
    border-radius: 10px;
`

export const ProfileImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
`

export const ForColumn = styled.div`
    ${token.flexColumn};
    margin-left: 30px;
    height: 120px;
    justify-content: space-evenly;
`

export const Position = styled.span<{$position:string}>`
    ${token.typography('caption', 'lg', 'medium')};
    color: ${token.colors.text.dark};
    background-color: ${({$position}) => $position === 'LEADER' ? token.colors.background.yellow : '#F3F4F6'};
    border-radius: 4px;
    width: 80px;
    height: 22px;
    ${token.flexCenter}
`

export const StudentName = styled.h5`
    ${token.typography('heading', 'md', 'semibold')};
    color: ${token.colors.text.dark};
`

export const SocialMedia = styled.div`
    ${token.flexLeft};
    gap: 5px;
    color: ${token.colors.fill.slate};
`

export const From = styled.span`
    ${token.typography('caption', 'lg', 'medium')};
    color: ${token.colors.text.coolGray};
`