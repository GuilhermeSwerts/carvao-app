import React from 'react';
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaPencilAlt } from 'react-icons/fa';
import { FaUsers, FaShoppingCart, FaCartPlus } from "react-icons/fa";
import ButtonTooltip from '../../components/Inputs/ButtonTooltip';
import { AiFillDislike, AiFillLike } from "react-icons/ai";

function ClienteListViewTable(props) {
    const { clientes,
        handleAbrirModal,
        handleAbrirModalDetalhe,
        toggleStatus } = props;
    return (
        <div className='row'>
            <div className="col-md-12">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Situação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td data-label="Nome" >{cliente.nome}</td>
                                <td data-label="Email" >{cliente.email}</td>
                                <td data-label="Telefone" >{cliente.telefone}</td>
                                <td data-label="Situação" >{cliente.inativo ? 
                                    <button onClick={() => toggleStatus(cliente.inativo, cliente.id)} className='btn btn-danger'>Inativo</button> 
                                    : <button onClick={() => toggleStatus(cliente.inativo, cliente.id)} className='btn btn-success'>Ativo</button>}</td>
                                <td data-label="Ações" className="action-buttons" style={{ display: 'flex', gap: 10 }}>
                                    <ButtonTooltip
                                        text="Editar"
                                        textButton={<FaPencilAlt size={20} color='#fff' />}
                                        className="btn btn-warning"
                                        onClick={() => handleAbrirModal(cliente)}
                                        top={true}
                                    />
                                    <ButtonTooltip
                                        text="Detalhes"
                                        textButton={<MdOutlineMoreHoriz size={20} color='#fff' />}
                                        className='btn btn-primary'
                                        top={true}
                                        onClick={() => handleAbrirModalDetalhe(cliente)}
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

export default ClienteListViewTable;