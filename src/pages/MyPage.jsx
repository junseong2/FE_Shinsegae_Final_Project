import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function MyPage() {
  const [userId, setUserId] = useState(null);
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['']);
  const [addresses, setAddresses] = useState([
    { address1: '', address2: '', post: '', isDefault: false },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    // ✅ 로그인 상태 확인 후, 로그인 안 되어 있으면 /signin 이동
    if (userName === null) {
      navigate('/signin');
    }
  }, [userName, navigate]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('로그인 정보 조회 실패');
      }

      const data = await response.json();
      console.log('📢 서버에서 받은 데이터:', data);

      setUserId(data.userId);
      setUserName(data.userName);
      setEmails(data.emails || ['']);
      setPhones(data.phones || ['']);
      setAddresses(data.addresses || [{ address1: '', address2: '', post: '', isDefault: false }]); // 객체 배열로 초기화

      console.log('🔄 상태 업데이트 후 userId:', data.userId);
    } catch (error) {
      console.error('회원 정보 로드 오류:', error);
    }
  };

  useEffect(() => {
    console.log('📌 최신 userId 상태 변경 감지:', userId);
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log('📢 서버로 보낼 userId:', userId);

    if (!userId) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    const requestData = {
      userId: Number(userId),
      email: emails[0],
      password,
      phones: phones.filter(Boolean),
      addresses: addresses.map((addr) => ({
        address1: addr.address1,
        address2: addr.address2,
        post: addr.post,
        isDefault: addr.isDefault,
      })),
    };

    console.log('📢 서버로 보낼 데이터:', requestData);

    try {
      const response = await fetch('http://localhost:5000/auth/update-userinfo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`회원 정보 수정 실패: ${errorText}`);
      }

      alert('회원 정보가 수정되었습니다!');
    } catch (error) {
      console.error('❌ 회원 정보 수정 오류:', error);
      alert(`오류 발생: ${error.message}`);
    }
  };

  return (
    <div className='mypage-container'>
      <h2>마이페이지</h2>
      <form onSubmit={handleUpdate} className='mypage-form'>
        <label>이름:</label>

        <input type='text' value={userName} disabled />
        <br></br>
        <label>비밀번호:</label>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <br></br>
        <label>이메일:</label>
        {emails.map((email, index) => (
          <input
            key={index}
            type='email'
            value={email}
            onChange={(e) => {
              const newEmails = [...emails];
              newEmails[index] = e.target.value;
              setEmails(newEmails);
            }}
            required
          />
        ))}
        <button type='button' onClick={() => setEmails([...emails, ''])}>
          이메일 추가
        </button>
        <br></br>
        <label>전화번호:</label>
        {phones.map((phone, index) => (
          <input
            key={index}
            type='text'
            value={phone}
            onChange={(e) => {
              const newPhones = [...phones];
              newPhones[index] = e.target.value;
              setPhones(newPhones);
            }}
          />
        ))}
        <button type='button' onClick={() => setPhones([...phones, ''])}>
          전화번호 추가
        </button>

        <label>주소:</label>
        {addresses.map((address, index) => (
          <div key={index}>
            <input
              type='text'
              placeholder='주소1'
              value={address.address1}
              onChange={(e) => {
                const newAddresses = [...addresses];
                newAddresses[index].address1 = e.target.value;
                setAddresses(newAddresses);
              }}
            />
            <input
              type='text'
              placeholder='주소2'
              value={address.address2}
              onChange={(e) => {
                const newAddresses = [...addresses];
                newAddresses[index].address2 = e.target.value;
                setAddresses(newAddresses);
              }}
            />
            <input
              type='text'
              placeholder='우편번호'
              value={address.post}
              onChange={(e) => {
                const newAddresses = [...addresses];
                newAddresses[index].post = e.target.value;
                setAddresses(newAddresses);
              }}
            />
            <label>
              <input
                type='checkbox'
                checked={address.isDefault}
                onChange={() => {
                  const newAddresses = [...addresses];
                  newAddresses[index].isDefault = !newAddresses[index].isDefault;
                  setAddresses(newAddresses);
                }}
              />
              기본 주소
            </label>
          </div>
        ))}
        {addresses.length < 3 && (
          <button
            type='button'
            onClick={() =>
              setAddresses([
                ...addresses,
                { address1: '', address2: '', post: '', isDefault: false },
              ])
            }
          >
            주소 추가
          </button>
        )}
        <br></br>
        <button type='submit' className='update-btn'>
          정보 수정
        </button>
      </form>

      <button className='back-btn' onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default MyPage;
