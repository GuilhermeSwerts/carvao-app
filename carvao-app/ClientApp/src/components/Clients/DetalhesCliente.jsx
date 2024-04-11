import React from 'react';

import { Modal } from 'react-bootstrap';

function DetalhesDoCliente(props) {
    const { modalDetalhesAberto, setModalDetalhesAberto, clienteSelecionado } = props;

    return (
        <Modal show={modalDetalhesAberto}>
            <Modal.Header>
                <h2>Detalhes do Cliente</h2>
            </Modal.Header>
            <Modal.Body>
                {clienteSelecionado && (
                    <div>
                        <p>
                            <strong>Nome:</strong> {clienteSelecionado.nome}
                        </p>
                        <p>
                            <strong>CPF/CNPJ:</strong> {clienteSelecionado.cnpjCpf}
                        </p>
                        <p>
                            <strong>Email:</strong> {clienteSelecionado.email}
                        </p>
                        <p>
                            <strong>Telefone:</strong> {clienteSelecionado.telefone}
                        </p>
                        <p>
                            <strong>Proprietário:</strong>{" "}
                            {clienteSelecionado.proprietario}
                        </p>
                        <p>
                            <strong>Data de Cadastro:</strong>{" "}
                            {clienteSelecionado.dataCadastro}
                        </p>
                        <p>
                            <strong>Inscrição Estadual:</strong>{" "}
                            {clienteSelecionado.inscricaoEstadual}
                        </p>
                        <p>
                            <strong>Inscrição Municipal:</strong>{" "}
                            {clienteSelecionado.inscricaoMunicipal}
                        </p>
                        <p>
                            <strong>Responsável pela Compra:</strong>{" "}
                            {clienteSelecionado.responsavelCompra}
                        </p>
                        <p>
                            <strong>Email do Responsável pela Compra:</strong>{" "}
                            {clienteSelecionado.responsavelCompraEmail}
                        </p>
                        <p>
                            <strong>Telefone do Responsável pela Compra:</strong>{" "}
                            {clienteSelecionado.responsavelCompraTelefone}
                        </p>
                        <p>
                            <strong>Telefone Fixo do Responsável pela Compra:</strong>{" "}
                            {clienteSelecionado.responsavelCompraTelefoneFixo}
                        </p>
                        <p>
                            <strong>Observação:</strong> {clienteSelecionado.observacao}
                        </p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-danger' onClick={() => setModalDetalhesAberto(false)}>
                    Fechar
                </button>
            </Modal.Footer >
        </Modal >
    );
}

export default DetalhesDoCliente;