import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SignIn() {
  console.log('SignIn 컴포넌트 렌더링됨'); // ✅ 확인용 로그 추가
  const location = useLocation();
  const navigate = useNavigate(); // ✅ useNavigate 선언 추가

  const [userName, setUserName] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('/');
  const [email, setEmail] = useState(''); // ✅ 이메일 상태 추가
  const [password, setPassword] = useState(''); // ✅ 비밀번호 상태 추가

  // 로그인 후 리디렉션될 URL을 서버에서 가져오기
  const getRedirectUrl = async () => {
    try {
      console.log('리디렉션 URL 가져오는 중...'); // ✅ 확인용 로그 추가
      const response = await fetch('http://localhost:5000/auth/get-redirect-url', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('서버에서 리디렉션 URL을 가져오지 못함');
      }

      const data = await response.json();
      console.log('가져온 리디렉션 URL:', data.redirectUrl); // ✅ 확인용 로그 추가
      setRedirectUrl(data.redirectUrl);
    } catch (error) {
      console.error('리디렉션 URL 가져오기 실패:', error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      console.log('로그인 상태 확인 중...'); // ✅ 확인용 로그 추가
      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('로그인된 사용자 정보:', data); // ✅ 확인용 로그 추가
        setUserName(data.userName);

        // 로그인된 상태이면 홈으로 이동
        navigate('/');
      }
    } catch (error) {
      console.error('로그인 상태 확인 실패:', error);
    }
  };

  useEffect(() => {
    console.log('SignIn useEffect 실행됨'); // ✅ 확인용 로그 추가
    checkLoginStatus(); // 로그인 확인 후 홈 리디렉션 처리

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const userName = params.get('userName');

    console.log('URL Params:', { userId, userName }); // ✅ 확인용 로그 추가

    if (userId && userName) {
      setUserName(userName);
    }
  }, [location.search]);

  // 로컬 로그인 요청
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/locallogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: 'include', // 세션 유지
      });

      const result = await response.json();

      if (response.ok) {
        alert('로그인 성공!');
        setUserName(result.username); // ✅ 로그인한 유저 이름 저장
        navigate('/'); // ✅ 로그인 후 홈으로 이동
      } else {
        alert('로그인 실패: ' + result.message);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    console.log('SignIn useEffect 실행됨'); // ✅ 확인용 로그 추가
    getRedirectUrl();

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const userName = params.get('userName');

    console.log('URL Params:', { userId, userName }); // ✅ 확인용 로그 추가

    if (userId && userName) {
      setUserName(userName);
    }
  }, [location.search]);

  const handleKakaoLogin = () => {
    window.location.href = `http://localhost:5000/auth/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = 'http://localhost:5000/auth/naver';
  };

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:5000/auth/google`;
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className='signin-container'>
      {/* ✅ 로컬 로그인 폼 추가 */}
      <h2>로컬 로그인</h2>
      <input
        type='email'
        placeholder='이메일 입력'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='비밀번호 입력'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className='login-btn'>
        로그인
      </button>
      <button onClick={handleSignUpRedirect} className='signup-redirect-btn'>
        회원가입
      </button>

      <h1>
        또는<br></br>소셜 로그인
      </h1>
      <button onClick={handleKakaoLogin} className='login-btn'>
        카카오 로그인
      </button>
      <button onClick={handleNaverLogin} className='login-btn'>
        네이버 로그인
      </button>
      {/* 
<button onClick={handleGoogleLogin} className="login-btn">
    구글 로그인
</button>
*/}

      {userName && <div className='topbar'>환영합니다, {userName}님!</div>}
    </div>
  );
}

export default SignIn;
