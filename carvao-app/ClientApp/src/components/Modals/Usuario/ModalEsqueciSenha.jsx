import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import InputMask from "react-input-mask";
import { api } from '../../../components/api/api';
import { Alert } from '../../../util/Alertas';


function ModalEsqueciSenha({ show, setShow,ip }) {
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');

    const init = () => {
        setEmail('');
        setCpf('');
    }

    const handleTrocaSenha = () => {
        api.get(`Usuario/EsqueciSenha/Email?cpf=${cpf}&email=${email}&ip=${ip}`, res => {
            Alert('Email enviado com sucesso!');
            init();
            setShow(false);
        }, err => {
            Alert('Houve um erro: ' + err.response.data, false)
        })

    }

    return (
        <Modal show={show}>
            <form onSubmit={e => { e.preventDefault(); handleTrocaSenha() }}>
                <Modal.Header>
                    <Modal.Title>Troca Senha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>Cpf:</label>
                    <InputMask
                        required
                        mask={"999.999.999-99"}
                        style={{ borderColor: '#bbb' }}
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder={"xxx.xxx.xxx-xx"}
                        className='form-control'
                        minLength={14}
                        maxLength={15}
                    />
                    <label>E-mail</label>
                    <input value={email} placeholder='email@endereco.com' onChange={e => setEmail(e.target.value)} type="text" className='form-control' />
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' variant="secondary" onClick={e => { setShow(false); init() }}>Fechar</Button>
                    <Button variant="primary" type='submit'>Solcitar e-mail</Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export default ModalEsqueciSenha;
