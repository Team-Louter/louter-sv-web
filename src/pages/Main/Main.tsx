import Calendar from "@/components/common/Calendar/Calendar";
import * as S from "./Main.styled.ts"
import Profile from "./components/Profile/Profile.tsx";
import { getGenerations } from "@/utils/FormatFilters.ts";
import { useEffect, useState } from "react";
import Member from "./components/Member/Member.tsx";
import { getMember } from "@/api/Member.ts";
import type { Member as MemberType } from "@/types/member.js";

export default function Main() {
    const [selectedGen, setSelectedGen] = useState<string>("전체"); // 선택된 기수
    const [members, setMembers] = useState<MemberType[]|null>(null);
    const [allMembers, setAllMembers] = useState<MemberType[] | null>(null);
    const [isLoading, setisLoading] = useState<boolean>(true);
    
    const getMemberInfo = async () => {
        setisLoading(true);
        try{
            const data = await getMember(selectedGen, null);
            setMembers(data);

            if (selectedGen === "전체" && !allMembers) {
                setAllMembers(data);
            }
        } catch(err) {
        } finally {
            setisLoading(false);
        }
    };

    useEffect(() => {
        getMemberInfo();
    }, [selectedGen])

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
                        {getGenerations(allMembers).map((gen) => (
                            <S.GenFilter
                                key={gen}
                                onClick={() => setSelectedGen(gen)}
                                $isSelected={selectedGen === gen}>{gen}</S.GenFilter>
                        ))}
                    </S.FilterContainer>
                    <S.MemberScroll>
                        {members
                            ?.map((member) => (
                                <Member key={member.userId} memberInfo={member} isLoading={isLoading}/>
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