import Calendar from "@/components/common/Calendar/Calendar";
import * as S from "./Main.styled.ts"
import Profile from "./components/Profile/Profile.tsx";
import { dummyMembers } from "@/constants/dummy.ts";
import { getGenerations } from "@/utils/FormatFilters.ts";
import { useState } from "react";
import Member from "./components/Member/Member.tsx";

export default function Main() {
    const [selectedGen, setSelectedGen] = useState<string>("전체"); // 선택된 기수

    return (
        <>
            <S.Container>
                <S.Scroll>
                    <S.CalendarDiv>
                        <Calendar readOnly={true}/>
                    </S.CalendarDiv>

                    <S.ForColumn>
                        <Profile/>
                    </S.ForColumn>
                </S.Scroll>

                <S.Line/>

                <S.MemberContainer>
                    <S.Title>Louter Member</S.Title>
                    <S.FilterContainer>
                        {getGenerations(dummyMembers).map((gen) => (
                            <S.GenFilter
                                key={gen}
                                onClick={() => setSelectedGen(gen)}
                                $isSelected={selectedGen === gen}>{gen}</S.GenFilter>
                        ))}
                    </S.FilterContainer>
                    <S.MemberScroll>
                        {dummyMembers
                            .filter((member) => 
                                selectedGen === '전체' || selectedGen === `${member.generation}기`
                            )
                            .map((member) => (
                                <Member key={member.id} memberInfo={member}/>
                            ))}
                    </S.MemberScroll>
                </S.MemberContainer>
                <S.Footer>
                    <S.Louter>Louter(라우터) / 대구소프트웨어마이스터고</S.Louter>
                    <S.Github><a href="https://github.com/Team-Louter" target="_blank" rel="noopener noreferrer">Github</a></S.Github>
                </S.Footer>
            </S.Container>
        </>
    )
}