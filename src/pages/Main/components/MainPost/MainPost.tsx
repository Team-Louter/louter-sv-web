import * as S from "./MainPost.styled";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { formatNumberWithComma } from "@/utils/FormatNumbers";
import type { mainProps } from "@/types/post";

export default function MainPost ({ title, viewCount }:mainProps) {
    return (
        <>
            <S.PostContainer>
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