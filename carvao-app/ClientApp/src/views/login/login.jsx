import React, { useEffect, useState } from 'react';
import "./login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { api } from '../../components/api/api';
import InputMask from "react-input-mask";
import Logo from '../../imgs/logo.png';
import ModalEsqueciSenha from '../../components/Modals/Usuario/ModalEsqueciSenha';
import { Alert } from '../../util/Alertas';

const Login = ({ onLogin }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPsw, setShowPsw] = useState(false);
  const [show, setShow] = useState(false);
  const [ip, setIp] = useState('');

  const GetIp = () => {
    api.get("https://api.integraall.com/api/Login/meuip", res => {
      setIp(res.data);
    })
  }

  useEffect(() => { GetIp() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    api.get(`Usuario/Login?Cpf=${cpf}&Senha=${password}`, response => {
      localStorage.setItem("access_token", response.data.token);
      window.location.href = "/";
    }, erro => {
      Alert(erro.response ? erro.response.data : erro.message, false);
    })
  }

  return (
    <div className="backgroud-login">
      <ModalEsqueciSenha setShow={setShow} show={show} ip={ip} />
      <div className="login-page">
        <div className="left-container-login">
          <img src={Logo} width={350} alt="logo" />
          <div style={{ width: '100%' }}>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-email">
                <InputMask
                  required
                  className='form-control'
                  mask={"999.999.999-99"}
                  style={{ borderColor: '#bbb' }}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder={"CPF"}
                  minLength={14}
                  maxLength={15}
                />
              </div>
              <br />
              <div className="input-group mb-3">
                <input className='form-control' style={{ width: '100%' }} type={showPsw ? "text" : "password"} id="password" placeholder='Senha' name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <div className="input-group-prepend" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                  <button style={{ background: 'none', border: 'none', position: 'absolute', right: '.5rem', zIndex: 1100 }} onClick={() => setShowPsw(!showPsw)} type='button' className='login-eye'>{showPsw ? <FaEye size={20} /> : <FaEyeSlash size={20} />}</button>
                </div>
              </div>
              <br />
              <p style={{ display: 'flex', justifyContent: "start", alignItems: "center" }}>Esqueceu a senha? <button type='button' onClick={() => setShow(true)} className='btn btn-link'>Clique aqui!</button></p>

              <button style={{ width: '100%', background: '#cf2a3b' }} className='btn btn-danger' type="submit">ENTRAR</button>
            </form>
          </div>
        </div>
        <div className="right-container-login">
          <div>
            <h1>Bem-vindo!</h1><br />
            <h1>Unidos, conquistamos mais com carvão vegetal</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
