import React, { useEffect, useState } from 'react';
import { api } from '../../components/api/api';
import Logo from '../../imgs/logo_branco.png';
import ModalEsqueciSenha from '../../components/Modals/Usuario/ModalEsqueciSenha';
import { Alert } from '../../util/Alertas';

const ResetarSenha = ({ onLogin }) => {
    const [token, setToken] = useState('');
    const [senhaNova, setsenhaNova] = useState('');
    const [senhaConfirmaNova, setConfirmaNova] = useState('');
    const [verSenhas, setVerSenhas] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (senhaNova != senhaConfirmaNova) {
            Alert('As senhas não coincidem.', false, true);
            setsenhaNova('');
            setsenhaAntiga('');
            return;
        }

        var data = new FormData();
        data.append("obj",JSON.stringify({ senhaNova, token }))

        api.post(`Usuario/EsqueciSenha`, data, res => {
            Alert('Senha alterada com sucesso!,você será redirecionado em 3 segundos.');
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        }, err => {
            Alert('Houve um erro ao trocar a senha: ' + err.response.data, false)
        })

    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("token");
        if (!t || t == '') window.location.href = '/login';

        setToken(t);
    }, [])

    return (
        <section id='login'>
            <div className='login-container-main'>
                <div className="login">
                    <div class="login-triangle"></div>
                    <h2 class="login-header">
                        <img src={Logo} alt="logo" width={350} style={{ background: "transparent" }} />
                    </h2>

                    <form onSubmit={handleSubmit} className="login-container">
                        <label>Senha Nova:</label>
                        <input required type={verSenhas ? 'text' : 'password'} className='form-control' value={senhaNova} onChange={e => setsenhaNova(e.target.value)} /><br />
                        <label>Confirma Nova Senha:</label>
                        <input required type={verSenhas ? 'text' : 'password'} className='form-control' value={senhaConfirmaNova} onChange={e => setConfirmaNova(e.target.value)} /><br />
                        <div style={{ display: "flex", justifyContent: 'start', alignItems: 'center', gap: 5 }}>
                            <input style={{ width: '5%' }} type="checkbox" onChange={e => setVerSenhas(!verSenhas)} />
                            <label htmlFor="">Ver senhas</label>
                        </div>
                        <br />
                        <input type="submit" value="ALTERAR SENHA" />
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetarSenha;
