import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './FindAccount.styled';

type Tab = 'id' | 'password';
type IdStep = 'form' | 'result';
type PwStep = 'email' | 'code' | 'newPassword';

function FindAccount() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('id');

  // 아이디 찾기 상태
  const [hakbun, setHakbun] = useState('');
  const [userName, setUserName] = useState('');
  const [idStep, setIdStep] = useState<IdStep>('form');

  // 비밀번호 찾기 상태
  const [pwEmail, setPwEmail] = useState('');
  const [pwStep, setPwStep] = useState<PwStep>('email');
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const inputCode = codes.join('');
  const isCodeComplete = inputCode.length === 6;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIdStep('form');
    setHakbun('');
    setUserName('');
    setPwStep('email');
    setPwEmail('');
    setCodes(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleFindId = () => {
    if (!hakbun.trim() || !userName.trim()) return;
    // TODO: API 호출
  };

  const handleSendCode = () => {
    if (!pwEmail.trim()) return;
    // TODO: API 호출
  };

  const handleVerifyCode = () => {
    if (!isCodeComplete) return;
    setPwStep('newPassword');
  };

  const handleResetPassword = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) return;
    // TODO: API 호출
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...codes];
    next[index] = value.slice(-1);
    setCodes(next);
  };

  return (
    <S.Container>
      <S.Card>
        <S.AuthMainImgContainer />
        <S.Content>
          <S.TabRow>
            <S.Tab
              $active={activeTab === 'id'}
              onClick={() => handleTabChange('id')}
            >
              아이디 찾기
            </S.Tab>
            <S.Tab
              $active={activeTab === 'password'}
              onClick={() => handleTabChange('password')}
            >
              비밀번호 찾기
            </S.Tab>
          </S.TabRow>

          {/* ── 아이디 찾기 ── */}
          {activeTab === 'id' && (
            <S.TabContent>
              {idStep === 'form' ? (
                <>
                  <S.FormContent>
                    <S.Title>아이디 찾기</S.Title>
                    <S.Subtitle>
                      가입 시 사용한 학번과 이름을 입력해 주세요.
                    </S.Subtitle>
                    <S.Form>
                      <S.Input
                        type="text"
                        inputMode="numeric"
                        placeholder="학번"
                        value={hakbun}
                        onChange={(e) => setHakbun(e.target.value)}
                      />
                      <S.Input
                        type="text"
                        placeholder="이름"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </S.Form>
                  </S.FormContent>
                  <S.SubmitButton
                    $disabled={!hakbun.trim() || !userName.trim()}
                    disabled={!hakbun.trim() || !userName.trim()}
                    onClick={handleFindId}
                  >
                    아이디 찾기
                  </S.SubmitButton>
                </>
              ) : (
                <>
                  <S.FormContent>
                    <S.Title>아이디 찾기</S.Title>
                    <S.Subtitle>가입된 이메일 주소를 확인해 주세요.</S.Subtitle>
                    <S.ResultBox>
                      <S.ResultLabel>가입된 이메일</S.ResultLabel>
                      <S.ResultEmail>user@example.com</S.ResultEmail>
                    </S.ResultBox>
                  </S.FormContent>
                  <S.SubmitButton onClick={() => navigate('/auth/signin')}>
                    로그인하러 가기
                  </S.SubmitButton>
                </>
              )}
            </S.TabContent>
          )}

          {/* ── 비밀번호 찾기 ── */}
          {activeTab === 'password' && (
            <S.TabContent>
              {pwStep === 'email' && (
                <>
                  <S.FormContent>
                    <S.Title>비밀번호 찾기</S.Title>
                    <S.Subtitle>
                      가입 시 사용한 이메일을 입력해주세요.
                    </S.Subtitle>
                    <S.Form>
                      <S.Input
                        type="email"
                        placeholder="이메일"
                        value={pwEmail}
                        onChange={(e) => setPwEmail(e.target.value)}
                      />
                    </S.Form>
                  </S.FormContent>
                  <S.SubmitButton
                    $disabled={!pwEmail.trim()}
                    disabled={!pwEmail.trim()}
                    onClick={handleSendCode}
                  >
                    비밀번호 찾기
                  </S.SubmitButton>
                </>
              )}

              {pwStep === 'code' && (
                <>
                  <S.FormContent>
                    <S.Title>코드를 입력하세요</S.Title>
                    <S.Subtitle>
                      이메일로 전송된 6자리 코드를 입력하세요.
                    </S.Subtitle>
                    <S.CodeInputRow>
                      {codes.map((val, i) => (
                        <S.CodeBox
                          key={i}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={val}
                          $filled={val !== ''}
                          onChange={(e) => handleCodeChange(i, e.target.value)}
                        />
                      ))}
                    </S.CodeInputRow>
                  </S.FormContent>
                  <S.SubmitButton
                    $disabled={!isCodeComplete}
                    disabled={!isCodeComplete}
                    onClick={handleVerifyCode}
                  >
                    다음
                  </S.SubmitButton>
                </>
              )}

              {pwStep === 'newPassword' && (
                <>
                  <S.FormContent>
                    <S.Title>새 비밀번호 설정</S.Title>
                    <S.Subtitle>사용할 새 비밀번호를 입력해 주세요.</S.Subtitle>
                    <S.Form>
                      <S.Input
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <S.Input
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </S.Form>
                  </S.FormContent>
                  <S.SubmitButton
                    $disabled={!newPassword.trim() || !confirmPassword.trim()}
                    disabled={!newPassword.trim() || !confirmPassword.trim()}
                    onClick={handleResetPassword}
                  >
                    비밀번호 변경
                  </S.SubmitButton>
                </>
              )}
            </S.TabContent>
          )}

          <S.BackLink onClick={() => navigate('/auth/signin')}>
            로그인으로 돌아가기
          </S.BackLink>
        </S.Content>
      </S.Card>
    </S.Container>
  );
}

export default FindAccount;
