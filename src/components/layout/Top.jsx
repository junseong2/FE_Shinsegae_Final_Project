import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../App.css'; // 경로 확인 필수!

function Top() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartPopup, setShowCartPopup] = useState(false); // 팝업 상태
  const [cartItems, setCartItems] = useState([]); // 장바구니 아이템 상태
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 사용자 정보를 가져오는 함수
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
      console.log('응답 상태:', response.status);
      console.log('사용자 정보:', data);

      setUserId(data.userId);
      setUserName(data.userName);

      // 사용자 정보를 가져온 후 장바구니 불러오기
      loadCart(data.userId);
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error.message);
    }
  };

  // 장바구니를 불러오는 함수
  const loadCart = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/cart?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('장바구니 불러오기 실패');
      }

      const data = await response.json();
      console.log('장바구니 데이터:', data);

      if (data.cartItems) {
        setCartItems(data.cartItems);
      }
    } catch (error) {
      console.error('장바구니 불러오기 오류:', error.message);
    }
  };

  const handleSignInClick = async () => {
    const currentUrl = location.pathname + location.search;
    console.log('현재 URL:', currentUrl);

    await fetch('http://localhost:5000/save-redirect-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirectUrl: currentUrl }),
      credentials: 'include',
    });

    navigate('/signin');
  };

  const handleLogoutClick = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUserId(null);
    setUserName(null);
    setCartItems([]); // 로그아웃 시 장바구니 초기화
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 장바구니 마우스 오버 핸들러
  const handleMouseEnter = () => {
    setShowCartPopup(true); // 팝업을 보여줌
  };

  const handleMouseLeave = () => {
    setShowCartPopup(false); // 팝업을 숨김
  };

  const getCartItemList = () => {
    if (cartItems.length === 0) {
      return <p>장바구니가 비어 있습니다.</p>;
    }

    return (
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            상품명:{item.name} / {item.price}원 (수량: {item.quantity}),({item.cartid})
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className='top-bar'>
      {/* 검색창 */}
      &nbsp; &nbsp; Top bar&nbsp;
      <form className='search-form' onSubmit={handleSearch}>
        <input
          type='text'
          className='search-input'
          placeholder='검색어를 입력하세요.'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type='submit' className='search-button'>
          🔍
        </button>
      </form>
      {/* 유저 정보 및 버튼 그룹 */}
      <div className='user-info-container'>
        {userId && userName && (
          <p className='welcome-message'>
            {userName}님, <span>유저 ID: {userId}</span>
          </p>
        )}
      </div>
      <div className='button-container'>
        {userId ? (
          <>
            <button className='TopSigninBt' onClick={handleLogoutClick}>
              로그아웃
            </button>
            <button className='MypageBt' onClick={() => navigate('/mypage')}>
              마이페이지
            </button>
            <button
              className='MypageBt'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/cart')}
            >
              장바구니
            </button>
            {/* 장바구니 팝업 */}
            {showCartPopup && <div className='cart-popup'>{getCartItemList()}</div>}
          </>
        ) : (
          <button className='TopSigninBt' onClick={handleSignInClick}>
            로그인
          </button>
        )}
      </div>
    </div>
  );
}

export default Top;
