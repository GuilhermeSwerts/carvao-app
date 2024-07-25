import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import ButtonTooltip from '../../Inputs/ButtonTooltip';
import { FaPencil } from 'react-icons/fa6';
import { api } from '../../api/api';
import { Alert } from '../../../util/Alertas';

function ModalEditarEstoque({ ProdutoId, Quantidade, AtualizaTela }) {
    const [show, setShow] = useState(false);
    const [qtd, setQtd] = useState(0);

    useEffect(() => {
        setQtd(Quantidade);
    }, [])

    const onSubmit = () => {
        api.put(`api/Estoque/${ProdutoId}?qtd=` + qtd, {}, res => { AtualizaTela(); setShow(false); Alert('Estoque atualizado com sucesso!') },
            err => Alert('Houve um erro ao atualizar o estoque', false))
    }

    return (
        <>
            <ButtonTooltip text="Editar Estoque" textButton={<FaPencil size={20} color='#fff' />} className='btn btn-success' top={true} onClick={() => setShow(true)} />
            <Modal show={show}>
                <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
                    <Modal.Header>
                        <h2>Editar Estoque #{ProdutoId}</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <label htmlFor="">Quantidade</label>
                        <input type="number" required className='form-control' min={1} value={qtd} onChange={e => setQtd(e.target.value)} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' type='button' onClick={() => { setQtd(Quantidade); setShow(false) }}>Cancelar</button>
                        <button className='btn btn-primary' type='submit'>Atualizar Estoque</button>
                    </Modal.Footer>
                </form>
            </Modal >
        </>
    );
}

export default ModalEditarEstoque;