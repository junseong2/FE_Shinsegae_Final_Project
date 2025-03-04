import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // 스타일 적용

function CartPage() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchCartItems();
  }, []);

  // 🔹 사용자 정보 가져오기
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
      setUserId(data.userId);
      setUserName(data.userName);
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error.message);
    }
  };

  // 🛒 장바구니 아이템 가져오기
  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/cart', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('장바구니 불러오기 실패');
      }

      const data = await response.json();
      setCartItems(data.items || []);
    } catch (error) {
      console.error('장바구니 로드 오류:', error.message);
    }
  };

  return (
    <div className='shopping-cart-new-layout'>
      <h2>🛒 장바구니</h2>

      {/* 현재 로그인된 사용자 정보 출력 */}
      {userId && userName ? (
        <p>
          현재 로그인된 사용자: {userName} (ID: {userId})
        </p>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}

      <table className='cartTable cartTable-v2'>
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
            <th>총가격</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody id='cartTable-sku' className='cart-bundle-list'>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <tr key={index} className='cart-deal-item'>
                <td className='product-box'>
                  <a href='#' className='moveProduct'>
                    {item.name}
                  </a>
                </td>
                <td className='option-price-part'>
                  <span>{item.price}원</span>
                </td>
                <td>
                  <input type='number' min='1' defaultValue='1' className='quantity-input' />
                </td>
                <td className='unit-total-sale-price'>
                  <span>{item.price}원</span>
                </td>
                <td>
                  <button className='remove-item-btn' onClick={() => removeItemFromCart(index)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='5'>장바구니가 비어 있습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 장바구니 비우기 버튼 */}
      <button className='clear-cart-btn' onClick={clearCart}>
        장바구니 비우기
      </button>

      {/* 홈으로 이동 버튼 */}
      <button className='back-btn' onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default CartPage;
