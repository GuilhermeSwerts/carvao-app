import React, { useEffect, useState } from 'react';
import { GetDataUser } from '../../util/GetDataUser';
import { Row, Col } from 'react-bootstrap';
import InputMask from "react-input-mask";
import { api } from '../../components/api/api';

function CadUsuario() {
    const usuario = GetDataUser();
    const [tiposUsuarios, setTiposUsuarios] = useState([]);
    const initialForm = {
        nome: '',
        cpf: '',
        email: '',
        tipo: 1,
    };
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (!usuario.IsMaster)
            window.location.href = "/";

        api.get("Usuario/TiposUsuarios", res => {
            setTiposUsuarios(res.data);
        })

    }, [])

    const onChangeInputValue = e => setForm((prevForm) => ({
        ...prevForm,
        [e.target.name]: e.target.value,
    }));

    const handdleSubmit = () => {
        var data = new FormData();
        data.append("data", JSON.stringify(form));
        api.post("Usuario", data, res => {
            alert("Cadastro realizada com sucesso!")
            setForm(initialForm);
            document.getElementById("tipo").value = "1";
        }, erro => {
            alert(erro.response ? erro.response.data : "Houve um erro na solicitação.")
        })
    }

    return (
        <section id='login'>
            <div className='login-container-main'>
                <div className="login">
                    <div class="login-triangle"></div>
                    <h2 class="login-header">Novo Usuário</h2>
                    <form className="login-container" onSubmit={e => { e.preventDefault(); handdleSubmit() }}>
                        <p>
                            <Row>
                                <Col md={6}>
                                    <span>Nome do usuário:</span>
                                    <input
                                        value={form.nome}
                                        onChange={onChangeInputValue}
                                        name='nome'
                                        required
                                        placeholder='Nome do usuário'
                                        type="text"
                                        className='form-control' />
                                </Col>
                                <Col md={6}>
                                    <span>Email do usuário:</span>
                                    <input
                                        value={form.email}
                                        onChange={onChangeInputValue}
                                        name='email'
                                        required
                                        placeholder='Email do usuário'
                                        type="email"
                                        className='form-control' />
                                </Col>
                            </Row>
                        </p>
                        <p>
                            <Row>
                                <Col md={6}>
                                    <span>Tipo de usuário</span>
                                    <select name='tipo' id='tipo' onChange={onChangeInputValue} className='form-control'>
                                        {tiposUsuarios.map(tipo => (
                                            <option value={tipo.tipo_usuario_id}>{tipo.nome}</option>
                                        ))}
                                    </select>
                                </Col>
                                <Col md={6}>
                                    <span>Cpf do usuário:</span>
                                    <InputMask
                                        value={form.cpf}
                                        onChange={onChangeInputValue}
                                        name='cpf'
                                        required
                                        className="form-control"
                                        mask={"999.999.999-99"}
                                        placeholder={"CPF do usuário"}
                                    />
                                </Col>
                            </Row>
                        </p>
                        <p>
                            <Row>
                                <Col md={12}>
                                    <button style={{ width: '100%' }} className='btn btn-primary'>CADASTRAR</button>
                                </Col>
                            </Row>
                        </p>
                        <p>
                            <span>Senha padão: P@drao123</span>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default CadUsuario;