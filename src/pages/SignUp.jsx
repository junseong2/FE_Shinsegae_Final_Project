import { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.text();
      alert(result);

      if (response.ok) {
        window.location.href = '/signin'; // 회원가입 성공 시 로그인 페이지로 이동
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='signup-container'>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름:</label>
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>주소:</label>
          <input
            type='text'
            name='address'
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>전화번호:</label>
          <input type='text' name='phone' value={formData.phone} onChange={handleChange} required />
        </div>
        <button type='submit'>회원가입</button>
      </form>
    </div>
  );
}

export default SignUp;
