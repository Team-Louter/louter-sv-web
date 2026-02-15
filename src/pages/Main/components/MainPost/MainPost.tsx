import * as S from "./MainPost.styled";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { formatNumberWithComma } from "@/utils/FormatNumbers";

type props = {
    title: string,
    viewCount: number
}

export default function MainPost ({ title, viewCount }:props) {
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