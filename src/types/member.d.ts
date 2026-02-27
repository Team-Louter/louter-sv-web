interface MemberProps {
    memberInfo: Member;
  }

export type Member = {
    "userId": number,
    "userName": string,
    "profileImageUrl": string,
    "majors": string[],
    "role": string,
    "generation": number,
    "githubUrl": string,
    "linkedinUrl": string,
    "hakbun": number,
    "grade": number,
    "classRoom": number,
    "number": number,
    "userEmail": string
}