import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './FindAccount.styled';
import { findEmail, sendPasswordResetCode } from '@/api/Auth';
import { toast } from '@/store/toastStore';
import CopyIcon from '@/assets/AuthImg/copy.svg';

type Tab = 'id' | 'password';
type IdStep = 'form' | 'result';
type PwStep = 'email' | 'sent';

function FindAccount() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('id');

  // 아이디 찾기 상태
  const [hakbun, setHakbun] = useState('');
  const [userName, setUserName] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const [idStep, setIdStep] = useState<IdStep>('form');
  const [isIdLoading, setIsIdLoading] = useState(false);

  // 비밀번호 찾기 상태
  const [pwEmail, setPwEmail] = useState('');
  const [pwStep, setPwStep] = useState<PwStep>('email');
  const [isPwLoading, setIsPwLoading] = useState(false);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIdStep('form');
    setHakbun('');
    setUserName('');
    setFoundEmail('');
    setPwStep('email');
    setPwEmail('');
  };

  // ── 아이디 찾기 ──────────────────────────────────────────────────
  const handleFindId = async () => {
    const num = Number(hakbun);
    if (!hakbun.trim() || !userName.trim() || isNaN(num)) return;
    setIsIdLoading(true);
    try {
      const data = await findEmail(num, userName.trim());
      console.log('API Response:', data);
      setFoundEmail(data.email as string);
      setIdStep('result');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? '일치하는 계정을 찾을 수 없습니다.';
      toast.error(msg);
    } finally {
      setIsIdLoading(false);
    }
  };

  // ── 이메일 복사 ────────────────────────────────────────────────
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(foundEmail);
      toast.success('이메일이 복사되었습니다.');
    } catch {
      toast.error('복사에 실패했습니다.');
    }
  };

  // ── 비밀번호 찾기 ─────────────────────────────────────────────────
  const handleSendCode = async () => {
    if (!pwEmail.trim()) return;
    setIsPwLoading(true);
    try {
      await sendPasswordResetCode(pwEmail.trim());
      setPwStep('sent');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? '비밀번호 재설정 링크 전송에 실패했습니다.';
      toast.error(msg);
    } finally {
      setIsPwLoading(false);
    }
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
                      가입 시 사용한 학번과 이름을 입력해 주세요
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
                    $disabled={
                      !hakbun.trim() || !userName.trim() || isIdLoading
                    }
                    disabled={!hakbun.trim() || !userName.trim() || isIdLoading}
                    onClick={handleFindId}
                  >
                    {isIdLoading ? <S.ButtonSpinner /> : '아이디 찾기'}
                  </S.SubmitButton>
                </>
              ) : (
                <>
                  <S.FormContent>
                    <S.Title>아이디 찾기</S.Title>
                    <S.Subtitle>가입된 이메일 주소를 확인해 주세요</S.Subtitle>
                    <S.ResultBox>
                      <S.ResultLabel>가입된 이메일</S.ResultLabel>
                      <S.EmailContentWrapper>
                        <S.CopyIconButton
                          onClick={handleCopyEmail}
                          title="복사"
                        >
                          <img src={CopyIcon} alt="복사" />
                        </S.CopyIconButton>
                        <S.ResultEmail onClick={handleCopyEmail}>
                          {foundEmail}
                        </S.ResultEmail>
                      </S.EmailContentWrapper>
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
                      가입 시 사용한 이메일을 입력해주세요
                    </S.Subtitle>
                    <S.Form>
                      <S.Input
                        type="email"
                        placeholder="이메일"
                        value={pwEmail}
                        onChange={(e) => setPwEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && pwEmail.trim())
                            handleSendCode();
                        }}
                      />
                    </S.Form>
                  </S.FormContent>
                  <S.SubmitButton
                    $disabled={!pwEmail.trim() || isPwLoading}
                    disabled={!pwEmail.trim() || isPwLoading}
                    onClick={handleSendCode}
                  >
                    {isPwLoading ? <S.ButtonSpinner /> : '비밀번호 찾기'}
                  </S.SubmitButton>
                </>
              )}

              {pwStep === 'sent' && (
                <>
                  <S.FormContent>
                    <S.Title>비밀번호 찾기</S.Title>
                    <S.ResultBox>
                      <S.ResultLabel>다음 단계</S.ResultLabel>
                      <S.ResultEmail>
                        메일을 확인하고 재설정 링크를 클릭해주세요
                      </S.ResultEmail>
                    </S.ResultBox>
                    <S.Subtitle>
                      재설정 링크는 발송 후 30분간 유효합니다
                    </S.Subtitle>
                  </S.FormContent>
                  <S.SubmitButton onClick={() => navigate('/auth/signin')}>
                    돌아가기
                  </S.SubmitButton>
                </>
              )}
            </S.TabContent>
          )}
        </S.Content>
      </S.Card>
    </S.Container>
  );
}

export default FindAccount;
