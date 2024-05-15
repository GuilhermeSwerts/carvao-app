import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ButtonTooltip from '../../components/Inputs/ButtonTooltip';
import { FaPencil } from 'react-icons/fa6';
import { FaReceipt } from "react-icons/fa";
import { LiaReceiptSolid } from "react-icons/lia";
import { FaBoxOpen, FaTruck, FaTimes, FaCheckCircle, FaBoxes } from 'react-icons/fa';
import DetalhesPedido from '../../components/Modals/Clients/DetalhesPedido';
import ModalEditarPedido from '../../components/Modals/Pedido/EditarPedido';
import ModalEditarStatusPedido from '../../components/Modals/Pedido/ModalEditarStatusPedido';

function GestaoTable(props) {

    const [showEditarStatusModal, setShowEditarStatusModal] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [statusPedidoIcon, setStatusPedidoIcon] = useState({});

    useEffect(() => {
        setStatusPedidoIcon(getStatusButtonProps());
    }, [pedidoSelecionado]);

    const handleShowEditarStatusModal = (pedido) => {
        setPedidoSelecionado(pedido);
        setShowEditarStatusModal(true);
    };

    const handleHideEditarStatusModal = () => {
        setShowEditarStatusModal(false);
        setPedidoSelecionado(null);
    };

    const handleEditarStatusPedido = (pedidoId, novoStatus) => {
        console.log('Pedido ID:', pedidoId);
        console.log('Novo Status:', novoStatus);
        handleHideEditarStatusModal();
        window.location.reload(); 
    };

    const getStatusButtonProps = (statusPedidoId) => {
        console.log("Status Pedido ID:", statusPedidoId);

        switch (statusPedidoId) {
            case 1:
                return { text: "Aberto", color: "btn btn-info", icon: <FaBoxOpen /> };
            case 2:
                return { text: "Separação", color: "btn btn-success", icon: <FaBoxes /> }
            case 3:
                return { text: "Despachado", color: "btn btn-warning", icon: <FaTruck /> };
            case 4:
                return { text: "Concluído", color: "btn btn-success", icon: <FaCheckCircle /> };
            case 5:
                return { text: "Cancelado", color: "btn btn-danger", icon: <FaTimes /> };
            default:
                return { text: "Desconhecido", color: "btn btn-secondary", icon: <FaPencil /> };
        }
    };

    const {
        pedidos,
        statusPedido,
        statusPagamento,
        produtos,
        ReloadPage
    } = props;

    return (
        <div className='row'>
            <div className="col-md-12">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome Cliente</th>
                            <th>Nome Vendedor</th>
                            <th>Localidade</th>
                            <th>Data Do Pedido</th>
                            <th>Valor Total Pedidos (R$)</th>
                            <th>Saldo Devedor (R$)</th>
                            <th>Status Pedido</th>
                            <th>Status Pagameto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((produto, index) => (
                            <tr key={produto.pedido_id}>
                                <td data-label="Id">{index + 1}</td>
                                <td data-label="Nome Cliente">{produto.nomeCliente}</td>
                                <td data-label="Nome Vendedor">{produto.nomeVendedor}</td>
                                <td data-label="Localidade">{produto.localidade}</td>
                                <td data-label="Data Do Pedido">{format(produto.data_pedido, "dd/MM/yyyy")}</td>
                                <td data-label="Valor Total Pedido (R$)">R$ {produto.valor_total.toFixed(2).replaceAll('.', ',')}</td>
                                <td data-label="Saldo Devedor (R$)">R$ {produto.saldo_devedor.toFixed(2).replaceAll('.', ',')}</td>
                                <td data-label="Status Pedido">{statusPedido.filter(x => x.status_pedido_id === produto.status_pedido_id)[0].nome}</td>
                                <td data-label="Status Pagamento">{statusPagamento.filter(x => x.status_pagamento_id === produto.status_pagamento_id)[0].nome}</td>
                                <td data-label="Ações" style={{ display: 'flex', gap: 10 }}>
                                    <DetalhesPedido observacao={produto.observacao} Pedido={produto} produtos={produtos} historico={produto.produtos} />
                                    <ModalEditarPedido reloadPage={ReloadPage} PedidoId={produto.pedido_id} Pedido={produto} Produtos={produtos} Historico={produto.produtos} />
                                    <ButtonTooltip
                                        text="Histórico de Recibo"
                                        textButton={<FaReceipt size={20} color='#fff' />}
                                        className='btn btn-danger'
                                        top={true}
                                        onClick={() => window.location.href = `/recibos?pedidoId=${produto.pedido_id}`}
                                    />
                                    {produto.saldo_devedor !== 0 &&
                                        <ButtonTooltip
                                            text={"Gerar Recibo"}
                                            textButton={<LiaReceiptSolid size={23} color='#fff' />}
                                            className='btn btn-primary'
                                            top={true}
                                            onClick={() => window.location.href = `/recibo?pedidoId=${produto.pedido_id}`}
                                        />
                                    }
                                    <ButtonTooltip
                                        text={"Editar Status Pedido"}
                                        textButton={getStatusButtonProps(produto.status_pedido_id).icon}
                                        className={`btn ${getStatusButtonProps(produto.status_pedido_id).color}`}
                                        top={true}
                                        onClick={() => handleShowEditarStatusModal(produto)}
                                    />
                                </td>
                            </tr>
                        ))}
                        {pedidos.length === 0 && <tr>
                            <td colSpan="10"><span>Não foi encontrado nenhum pedido...</span></td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            {showEditarStatusModal && (
                <ModalEditarStatusPedido
                    pedido={pedidoSelecionado}
                    statusPedido={statusPedido}
                    onHide={handleHideEditarStatusModal}
                    onEdit={handleEditarStatusPedido}
                />
            )}
        </div>
    );
}

export default GestaoTable;
