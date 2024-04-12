import React from 'react';
import { format } from 'date-fns';
import ButtonTooltip from '../../components/Inputs/ButtonTooltip';
import { FaPencil } from 'react-icons/fa6';
import { FaReceipt } from "react-icons/fa";
import { LiaReceiptSolid } from "react-icons/lia";
import { CgDetailsMore } from "react-icons/cg";

function GestaoTable(props) {

    const {
        pedidos,
        statusPedido,
        statusPagamento,
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
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((produto) => {
                            return (
                                <tr key={produto.pedido_id}>
                                    <td data-label="Id">{produto.pedido_id}</td>
                                    <td data-label="Nome Cliente">{produto.nomeCliente}</td>
                                    <td data-label="Nome Vendedor">{produto.nomeVendedor}</td>
                                    <td data-label="Localidade">{produto.localidade}</td>
                                    <td data-label="Data Do Pedido">{format(produto.data_pedido, "dd/MM/yyyy")}</td>
                                    <td data-label="Valor Total Pedidos (R$)">R$ {produto.valor_total.toFixed(2)}</td>
                                    <td data-label="Saldo Devedor (R$)">R$ {produto.saldo_devedor.toFixed(2)}</td>
                                    <td data-label="Status Pedido">{statusPedido.filter(x => x.status_pedido_id === produto.status_pedido_id)[0].nome}</td>
                                    <td data-label="Status Pagameto">{statusPagamento.filter(x => x.status_pagamemto_id === produto.status_pagamemto_id)[0].nome}</td>
                                    <td data-label="Ação" style={{ display: 'flex', gap: 10 }}>
                                        <ButtonTooltip
                                            text="Detalhes do Pedido"
                                            textButton={<CgDetailsMore size={20} color='#fff' />}
                                            className='btn btn-warning'
                                            top={true}
                                            onClick={() => () => { }}
                                        />
                                        <ButtonTooltip
                                            text="Editar Pedido"
                                            textButton={<FaPencil size={20} color='#fff' />}
                                            className='btn btn-success'
                                            top={true}
                                            onClick={() => () => { }}
                                        />
                                        <ButtonTooltip
                                            text="Gerar Recibo"
                                            textButton={<LiaReceiptSolid size={23} color='#fff' />}
                                            className='btn btn-primary'
                                            top={true}
                                            onClick={() => window.location.href = `/recibo?pedidoId=${produto.pedido_id}`}
                                        />
                                        <ButtonTooltip
                                            text="Histórico de Recibo"
                                            textButton={<FaReceipt size={20} color='#fff' />}
                                            className='btn btn-danger'
                                            top={true}
                                            onClick={() => window.location.href = `/recibos?pedidoId=${produto.pedido_id}`}
                                        />
                                    </td>
                                </tr>
                            )
                        })}
                        {pedidos.length == 0 && <tr>
                            <td><span>Não foi encontrado nenhum cliente...</span></td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GestaoTable;