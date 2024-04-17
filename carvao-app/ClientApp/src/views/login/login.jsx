import React, { useEffect, useState } from 'react';
import "./login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { api } from '../../components/api/api';
import InputMask from "react-input-mask";

const Login = ({ onLogin }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPsw, setShowPsw] = useState(false);


  useEffect(() => {
    document.querySelector(".menu").style.display = 'none';
  }, [1])

  const handleSubmit = async (e) => {
    e.preventDefault();

    api.get(`Usuario/Login?Cpf=${cpf}&Senha=${password}`, response => {
      localStorage.setItem("access_token", response.data.token);
      window.location.href = "/";
    }, erro => {
      setError(erro.response ? erro.response.data : erro.message);
    })
  }

  return (
    <section id='login'>
      <div className='login-container-main'>
        <div className="login">
          <div class="login-triangle"></div>
          <h2 class="login-header">Log in</h2>

          <form onSubmit={handleSubmit} className="login-container">
            <p>
              <InputMask
                required
                mask={"999.999.999-99"}
                style={{ borderColor: '#bbb' }}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder={"CPF"}
                minLength={14}
                maxLength={15}
              />
            </p>
            <p>
              <input type={showPsw ? "text" : "password"} id="password" placeholder='Senha' name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className='login-eye-container'>
                <button onClick={() => setShowPsw(!showPsw)} type='button' className='login-eye'>{showPsw ? <FaEye size={20} /> : <FaEyeSlash size={20} />}</button>
              </div>
            </p>
            <p>
              <input type="submit" value="Log in" />
            </p>
          </form>
          {error && <div className="error-message-login">* {error} *</div>}
        </div>
      </div>
    </section>
  );
};

export default Login;
