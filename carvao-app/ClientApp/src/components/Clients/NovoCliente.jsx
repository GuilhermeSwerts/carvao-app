import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col } from 'react-bootstrap';

function ModalNovoCliente(props) {

    const { modalAberto, setModalAberto, setIsPessoaFisica,
        clienteData,
        setClienteData,
        handleSalvarCliente,
        InputMask,
        isPessoaFisica, } = props;

    const onChangeTipoPessoa = (e) => {
        if (e.target.value == "0") {
            setIsPessoaFisica(true);
            setClienteData({
                ...clienteData,
                cnpjCpf: "",
                proprietario: "",
                dataCadastro: "",
                inscricaoEstadual: "",
                inscricaoMunicipal: "",
                responsavelCompra: "",
                responsavelCompraEmail: "",
                responsavelCompraTelefone: "",
                responsavelCompraTelefoneFixo: "",
            });
        } else {
            setIsPessoaFisica(false);
            setClienteData({
                ...clienteData,
                email: "",
                telefone: "",
                responsavelCompra: "",
                responsavelCompraEmail: "",
                responsavelCompraTelefone: "",
                responsavelCompraTelefoneFixo: "",
            });
        }
    }

    return (
        <Modal show={modalAberto}>
            <Modal.Header>
                <h2 style={{ textAlign: 'center', width: '100%' }}>Formulário de {isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica"} </h2><br />
            </Modal.Header>
            <Modal.Body>
                <Container style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Row>
                        <Col md={12}>
                            <label htmlFor="nome">Nome:</label>
                            <input
                                className='form-control'
                                type="text"
                                id="nome"
                                value={clienteData.nome}
                                onChange={(e) =>
                                    setClienteData({ ...clienteData, nome: e.target.value })
                                }
                                placeholder="Nome do Cliente"
                                maxLength="100"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <label htmlFor="isPessoaFisica">Tipo de Cliente:</label>
                            <select className='form-control' name="tipo" id="tipo" onChange={onChangeTipoPessoa}>
                                <option value="0" selected>Pessoa Física</option>
                                <option value="1">Pessoa Jurídica</option>
                            </select>
                        </Col>
                        <Col md={6}>
                            <label htmlFor="cnpjCpf">{isPessoaFisica ? 'CPF' : 'CNPJ'}:</label>
                            <InputMask
                                className="form-control"
                                mask={
                                    isPessoaFisica ? "999.999.999-99" : "99.999.999/9999-99"
                                }
                                value={clienteData.cnpjCpf}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        cnpjCpf: e.target.value,
                                    })
                                }
                                placeholder={isPessoaFisica ? "CPF" : "CNPJ"}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <label htmlFor="email">Email:</label>
                            <input
                                className='form-control'
                                type="email"
                                id="email"
                                value={clienteData.email}
                                onChange={(e) =>
                                    setClienteData({ ...clienteData, email: e.target.value })
                                }
                                placeholder="E-mail"
                                maxLength="254"
                            />
                        </Col>
                        <Col md={6}>
                            <label htmlFor="telefone">Telefone:</label>
                            <InputMask
                                className="form-control"
                                mask="(99) 99999-9999"
                                value={clienteData.telefone}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        telefone: e.target.value,
                                    })
                                }
                                placeholder="Telefone"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <label htmlFor="responsavelCompra">
                                Responsável pela Compra:
                            </label>
                            <input
                                type="text"
                                id="responsavelCompra"
                                className="form-control"
                                value={clienteData.responsavelCompra}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        responsavelCompra: e.target.value,
                                    })
                                }
                                placeholder="Responsável pela Compra"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <label htmlFor="responsavelCompraEmail">
                                Email do Responsável pela Compra:
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="responsavelCompraEmail"
                                value={clienteData.responsavelCompraEmail}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        responsavelCompraEmail: e.target.value,
                                    })
                                }
                                placeholder="E-mail do Responsável pela Compra"
                                maxLength="254"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <label htmlFor="responsavelCompraTelefone">
                                Telefone do Responsável pela Compra:
                            </label>
                            <InputMask
                                className="form-control"
                                mask="(99) 99999-9999"
                                value={clienteData.responsavelCompraTelefone}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        responsavelCompraTelefone: e.target.value,
                                    })
                                }
                                placeholder="Telefone do Responsável pela Compra"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <label htmlFor="responsavelCompraTelefoneFixo">
                                Telefone Fixo do Responsável pela Compra:
                            </label>
                            <InputMask
                                mask="(99) 9999-9999"
                                className="form-control"
                                value={clienteData.responsavelCompraTelefoneFixo}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        responsavelCompraTelefoneFixo: e.target.value,
                                    })
                                }
                                placeholder="Telefone Fixo do Responsável pela Compra"
                            />
                        </Col>
                    </Row>
                    {!isPessoaFisica && <Row>
                        <Col md={12}>
                            <label htmlFor="proprietario">Proprietário:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="proprietario"
                                value={clienteData.proprietario}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        proprietario: e.target.value,
                                    })
                                }
                            />
                        </Col>
                    </Row>}
                    {!isPessoaFisica && <Row>
                        <Col md={6}>
                            <label htmlFor="inscricaoEstadual">
                                Inscrição Estadual:
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="inscricaoEstadual"
                                value={clienteData.inscricaoEstadual}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        inscricaoEstadual: e.target.value,
                                    })
                                } />
                        </Col>
                        <Col md={6}>
                            <label htmlFor="inscricaoMunicipal">
                                Inscrição Municipal:
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="inscricaoMunicipal"
                                value={clienteData.inscricaoMunicipal}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        inscricaoMunicipal: e.target.value,
                                    })
                                }
                            />
                        </Col>
                    </Row>}
                    <Row>
                        <Col md={12}>
                            <label htmlFor="observacao">Observação:</label>
                            <textarea
                                className="form-control"
                                id="observacao"
                                value={clienteData.observacao}
                                onChange={(e) =>
                                    setClienteData({
                                        ...clienteData,
                                        observacao: e.target.value,
                                    })
                                }
                            ></textarea>
                        </Col>
                    </Row>

                </Container>
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    className='btn btn-danger'
                    style={{ marginLeft: "10px" }}
                    type="button"
                    onClick={() => setModalAberto(false)}
                >
                    Cancelar
                </button>
                <button className='btn btn-primary' onClick={handleSalvarCliente}>Salvar Cliente</button>
            </Modal.Footer>
        </Modal >
    );
}

export default ModalNovoCliente;