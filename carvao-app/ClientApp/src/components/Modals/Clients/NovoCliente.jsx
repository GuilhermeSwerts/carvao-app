import React, { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col } from 'react-bootstrap';

function ModalNovoCliente(props) {

    const { modalAberto, setModalAberto, setIsPessoaFisica,
        clienteData,
        setClienteData,
        handleSalvarCliente,
        InputMask,
        isPessoaFisica, clienteSelecionado } = props;
        
    const onChangeTipoPessoa = (e) => {
        if (e.target.value == "0") {
            setIsPessoaFisica(true);
            setClienteData({
                ...clienteData,
                cpf: "",
                proprietario: "",
                dataCadastro: "",
                inscricaoEstadual: "",
                inscricaoMunicipal: "",
                responsavelCompra: "",
                responsavelCompraEmail: "",
                responsavelCompraTelefone: "",
                responsavelCompraTelefoneFixo: "",
                pessoaFisica: isPessoaFisica
            });
        } else {
            setIsPessoaFisica(false);
            setClienteData({
                ...clienteData,
                cnpj: "",
                email: "",
                telefone: "",
                responsavelCompra: "",
                responsavelCompraEmail: "",
                responsavelCompraTelefone: "",
                responsavelCompraTelefoneFixo: "",
                pessoaFisica: isPessoaFisica
            });
        }
    }

    const getLogadouro = (event) => {
        let cep = event.target.value;
        const url = `https://viacep.com.br/ws/${cep.replace('.', '').replace('.', '').replace('-', '')}/json/`;
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setClienteData({
                    ...clienteData,
                    cep: cep,
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    localidade: data.localidade,
                    uf: data.uf
                })
            }).catch(erro => console.log(erro))
    }

    return (
        <Modal show={modalAberto}>
            <Modal.Header style={{ flexDirection: 'column', gap: 0 }}>
                <h2 style={{ textAlign: 'center', width: '100%' }}>Formulário de {isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica"} </h2><br />
                <small style={{ textAlign: 'center', width: '100%', color: 'red' }}>Campos com "*" são obrigatórios!</small><br />
            </Modal.Header>
            <form onSubmit={e => { e.preventDefault(); handleSalvarCliente() }}>
                <Modal.Body>
                    <Container style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Row>
                            <Col md={12}>
                                <label htmlFor="nome">*Nome:</label>
                                <input
                                    className='form-control'
                                    required
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
                                <label htmlFor="isPessoaFisica">*Tipo de Cliente:</label>
                                <select className='form-control' name="tipo" id="tipo" onChange={onChangeTipoPessoa}>
                                    <option value="0" selected>Pessoa Física</option>
                                    <option value="1">Pessoa Jurídica</option>
                                </select>
                            </Col>
                            <Col md={6}>
                                <label htmlFor="cnpjCpf">*{isPessoaFisica ? 'CPF' : 'CNPJ'}:</label>
                                <InputMask
                                    required
                                    className="form-control"
                                    mask={
                                        isPessoaFisica ? "999.999.999-99" : "99.999.999/9999-99"
                                    }
                                    value={isPessoaFisica ? clienteData.cpf : clienteData.cnpj}
                                    onChange={(e) => isPessoaFisica ?
                                        setClienteData({
                                            ...clienteData,
                                            cpf: e.target.value
                                        }) :
                                        setClienteData({
                                            ...clienteData,
                                            cnpj: e.target.value
                                        })
                                    }
                                    placeholder={isPessoaFisica ? "CPF" : "CNPJ"}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <label htmlFor="email">*Email:</label>
                                <input
                                    required
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
                                <label htmlFor="telefone">*Telefone:</label>
                                <InputMask
                                    required
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
                            <Col md={4}>
                                <label htmlFor="cep">*CEP:</label>
                                <InputMask
                                    required
                                    mask="99.999-999"
                                    className="form-control"
                                    value={clienteData.cep}
                                    onChange={(e) => {
                                        setClienteData({
                                            ...clienteData,
                                            cep: e.target.value,
                                        }); getLogadouro(e)
                                    }
                                    }
                                    placeholder="Cep"
                                />
                            </Col>
                            <Col md={8}>
                                <label htmlFor="logradouro">*Logradouro:</label>
                                <input
                                    disabled
                                    required
                                    placeholder='logradouro'
                                    className="form-control"
                                    id="logradouro"
                                    value={clienteData.logradouro}
                                    onChange={(e) =>
                                        setClienteData({
                                            ...clienteData,
                                            logradouro: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3}>
                                <label htmlFor="numero">*Numero:</label>
                                <input
                                    required
                                    className="form-control"
                                    id="numero"
                                    placeholder='Numero'
                                    value={clienteData.numero}
                                    onChange={(e) =>
                                        setClienteData({
                                            ...clienteData,
                                            numero: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={6}>
                                <label htmlFor="localidade">*Localidade:</label>
                                <input
                                    required
                                    disabled
                                    placeholder='localidade'
                                    className="form-control"
                                    id="localidade"
                                    value={clienteData.localidade}
                                    onChange={(e) =>
                                        setClienteData({
                                            ...clienteData,
                                            localidade: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={3}>
                                <label htmlFor="uf">*Uf:</label>
                                <input
                                    disabled
                                    required
                                    placeholder='Uf'
                                    className="form-control"
                                    id="uf"
                                    value={clienteData.uf}
                                    onChange={(e) =>
                                        setClienteData({
                                            ...clienteData,
                                            uf: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <label htmlFor="complemento">Complemento:</label>
                                <input
                                    className="form-control"
                                    id="complemento"
                                    placeholder='Complemento'
                                    value={clienteData.complemento}
                                    onChange={(e) =>
                                        setClienteData({
                                            ...clienteData,
                                            complemento: e.target.value,
                                        })
                                    }
                                ></input>
                            </Col>
                            <Col md={6}>
                                <label htmlFor="bairro">*Bairro:</label>
                                <input
                                    required
                                    className="form-control"
                                    id="bairro"
                                    placeholder='bairro'
                                    value={clienteData.bairro}
                                    onChange={(e) =>
                                        setClienteData({
                                            ...clienteData,
                                            bairro: e.target.value,
                                        })
                                    }
                                ></input>
                            </Col>
                        </Row>
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
                    <button className='btn btn-primary' type='submit'>Salvar Cliente</button>
                </Modal.Footer>
            </form>
        </Modal >
    );
}

export default ModalNovoCliente;