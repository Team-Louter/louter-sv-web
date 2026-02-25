import * as S from "./MainPost.styled";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { formatNumberWithComma } from "@/utils/FormatNumbers";
import type { mainProps } from "@/types/post";
import { useNavigate } from "react-router-dom";

export default function MainPost ({ title, viewCount, id }:mainProps) {
    const navigate = useNavigate();

    return (
        <>
            <S.PostContainer onClick={() => navigate(`/community/${id}`)}>
                <S.Title>
                    {title}
                </S.Title>
                <S.ViewsCount>
                    <MdOutlineRemoveRedEye />
                    <S.Views>{formatNumberWithComma(viewCount)}</S.Views>
                </S.ViewsCount>
            </S.PostContainer>
        </>
    )
}