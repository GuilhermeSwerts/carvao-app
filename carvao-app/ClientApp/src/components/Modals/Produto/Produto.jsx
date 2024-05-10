import React, { Component } from 'react';
import ButtonTooltip from '../../Inputs/ButtonTooltip';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';

class Produto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            produto: {
                nome: '',
                valor: '',
                valorMinimo: ''
            }
        };
    }

    Open = produto => {
        if (produto) {
            produto.valor = (produto.valor + '').replaceAll('.', ',');
            this.setState({ produto: produto });
        } else {
            this.setState({
                produto: {
                    nome: '',
                    valor: '',
                    valorMinimo: ''
                }
            });
        }
        this.setState({ show: true });
    }

    onChangeInputValue = (e) => {
        const { produto } = this.state;
        this.setState({
            produto: {
                ...produto,
                [e.target.name]: e.target.value.replaceAll('R$ ', '').replaceAll('.', ',')
            }
        });
    };

    render() {
        const { classButton, tooltip, icon, top, textSubmit, onSubmit } = this.props;
        const { show, produto } = this.state;
        return (
            <>
                <ButtonTooltip text={tooltip} textButton={icon} className={classButton} top={top} onClick={() => this.Open(this.props.Produto)} />
                <Modal show={show}>
                    <Modal.Header>
                        <h2>{tooltip.toUpperCase()}</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <label>Nome Do Produto</label>
                                <input
                                    onChange={this.onChangeInputValue}
                                    name='nome'
                                    value={produto.nome}
                                    className='form-control'
                                    type="text"
                                />
                            </Col>
                            <Col>
                                <label>Valor Do Produto</label>
                                <input
                                    onChange={this.onChangeInputValue}
                                    name='valor'
                                    value={"R$ " + produto.valor}
                                    className='form-control'
                                    type="text"
                                />
                            </Col>
                            <Col>
                                <label>Valor Mínimo</label>
                                <input
                                    onChange={this.onChangeInputValue}
                                    name='valorMinimo'
                                    value={`R$ ${produto.valorMinimo}`}
                                    className='form-control'
                                    type="text"
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' onClick={() => this.setState({ show: false })}>Cancelar</button>
                        <button className='btn btn-primary' type='button' onClick={() => { onSubmit(produto); this.setState({ show: false }) }}>{textSubmit}</button>
                    </Modal.Footer>
                </Modal >
            </>
        );
    }
}

export default Produto;
