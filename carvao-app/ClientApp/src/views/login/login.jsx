import React, { useEffect, useState } from 'react';
import "./login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { api } from '../../components/api/api';
import InputMask from "react-input-mask";
import Logo from '../../imgs/logo_branco.png';

const Login = ({ onLogin }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPsw, setShowPsw] = useState(false);


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
          <h2 class="login-header">
            <img src={Logo} alt="logo" width={350} style={{ background: "transparent" }} />
          </h2>

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
            <p style={{ display: 'flex', justifyContent: "start", alignItems: "center" }}>Esqueceu a senha? <button onClick={() => alert('Função ainda em desenvolvimento')} className='btn btn-link'>Clique aqui!</button></p>
            <p>
              <input type="submit" value="ENTRAR" />
            </p>
          </form>
          {error && <div className="error-message-login">* {error} *</div>}
        </div>
      </div>
    </section>
  );
};

export default Login;
