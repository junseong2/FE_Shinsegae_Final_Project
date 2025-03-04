import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // 스타일 적용
import './CartPage.css'; // 추가 스타일

function CartPage() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    console.log('장바구니 데이터:', cartItems);
  }, [cartItems]);

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
      loadCart(data.userId);
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error.message);
    }
  };

  const loadCart = async (userId) => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5000/cart?userId=${userId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('장바구니 조회 실패');
        }

        const data = await response.json();
        setCartItems(data.cartItems || []);
      } catch (error) {
        console.error('장바구니 조회 오류:', error.message);
      }
    } else {
      console.log('사용자 ID가 없습니다. 장바구니를 조회할 수 없습니다.');
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/cart/clear?userId=${userId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('장바구니 비우기 실패');
      }

      setCartItems([]);
    } catch (error) {
      console.error('장바구니 비우기 오류:', error.message);
    }
  };

  const removeItemFromCart = async (cartId) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/remove?cartId=${cartId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('아이템 삭제 오류: 장바구니에서 아이템 삭제 실패');
      }

      const data = await response.json();
      console.log(data.message); // 성공 메시지 출력
      // 삭제 후 장바구니 재로드
      loadCart(userId);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className='cart-container'>
      <h2 className='cart-title'>🛒 장바구니</h2>
      {userId && userName ? (
        <p className='user-info'>
          현재 로그인된 사용자: {userName} (ID: {userId})
        </p>
      ) : (
        <p className='login-prompt'>로그인이 필요합니다.</p>
      )}

      <table className='cartTable'>
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
            <th>총가격</th>
            <th>삭제</th>
            <th>장바구니 ID</th>
            <th>상품 ID</th>
          </tr>
        </thead>
        <tbody id='cartTable-sku' className='cart-bundle-list'>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <tr key={item.cartId} className='cart-deal-item'>
                <td className='product-box'>{item.name || '상품명 없음'}</td>
                <td className='option-price-part'>{item.price || 0}원</td>
                <td>{item.quantity}</td>
                <td>{(item.price || 0) * item.quantity}원</td>
                <td>
                  <button onClick={() => removeItemFromCart(item.cartId)}>삭제</button>
                </td>
                <td>{item.cartId}</td>
                <td>{item.productId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='7'>장바구니가 비어 있습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='cart-actions'>
        <button className='clear-cart-btn' onClick={clearCart}>
          장바구니 비우기
        </button>
        <button className='back-btn' onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
        <button>결제</button>
      </div>
    </div>
  );
}

export default CartPage;
