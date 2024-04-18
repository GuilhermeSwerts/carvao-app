import React, { useEffect, useState } from 'react';
import ButtonTooltip from '../../Inputs/ButtonTooltip';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';

function Produto({ classButton, Produto = null, tooltip = "", icon, onSubmit = () => { }, top = true, textSubmit }) {
    const [show, setShow] = useState(false);
    const initialProduto = {
        nome: '',
        valor: '',
        valorMinimo: ''
    };
    const [produto, setProduto] = useState(initialProduto);

    useEffect(() => {
        if (Produto)
            setProduto(Produto);
    }, [])

    const onChangeInputValue = e => setProduto((prevForm) => ({
        ...prevForm,
        [e.target.name]: e.target.value.replaceAll('R$ ', ''),
    }));

    return (
        <>
            <ButtonTooltip text={tooltip} textButton={icon} className={classButton} top={top} onClick={() => setShow(true)} />
            <Modal show={show}>
                <Modal.Header>
                    <h2>{tooltip.toUpperCase()}</h2>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <label>Nome Do Produto</label>
                            <input
                                onChange={onChangeInputValue}
                                name='nome'
                                value={produto.nome}
                                className='form-control'
                                type="text" />
                        </Col>
                        <Col>
                            <label>Valor Do Produto</label>
                            <input
                                onChange={onChangeInputValue}
                                name='valor'
                                value={"R$ " + produto.valor}
                                className='form-control'
                                type="text" />
                        </Col>
                        <Col>
                            <label>Valor Mínimo</label>
                            <input
                                onChange={onChangeInputValue}
                                name='valorMinimo'
                                value={`R$ ${produto.valorMinimo}`}
                                className='form-control'
                                type="text" />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-danger' onClick={() => { setShow(false) }}>Cancelar</button>
                    <button className='btn btn-primary' type='button' onClick={() => { onSubmit(produto); setShow(false) }}>{textSubmit}</button>
                </Modal.Footer>
            </Modal >
        </>
    );
}

export default Produto;