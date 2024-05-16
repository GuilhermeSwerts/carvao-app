import React from 'react';
import { FaCartPlus } from 'react-icons/fa';
import { FaHistory } from "react-icons/fa";
import ButtonTooltip from '../../components/Inputs/ButtonTooltip';

function ClientePedidoTable({
    clientes, handleAbrirModal, ShowModalHistoricoPedidos
}) {
    return (
        <div className='row'>
            <div className="col-md-12">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Valor Total Pedidos (R$)</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td data-label="Nome">{cliente.nome}</td>
                                <td data-label="Email">{cliente.email}</td>
                                <td data-label="Telefone">{cliente.telefone}</td>
                                <td data-label="Valor Total Pedidos (R$)">R$ {cliente.valorTotalPedidos.toFixed(2).replaceAll('.', ',')}</td>
                                <td data-label="Ação" style={{ display: 'flex', gap: 10 }}>
                                    <ButtonTooltip
                                        text="Novo Pedido"
                                        textButton={<FaCartPlus size={20} color='#fff' />}
                                        className='btn btn-primary'
                                        top={true}
                                        onClick={() => handleAbrirModal(cliente)}
                                    />
                                    <ButtonTooltip
                                        text="Histórico de Pedidos"
                                        textButton={<FaHistory size={20} color='#fff' />}
                                        className='btn btn-success'
                                        top={true}
                                        onClick={() => ShowModalHistoricoPedidos(cliente)}
                                    />
                                </td>
                            </tr>
                        ))}
                        {clientes.length == 0 && <tr>
                            <td><span>Não foi encontrado nenhum cliente...</span></td>
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

export default ClientePedidoTable;