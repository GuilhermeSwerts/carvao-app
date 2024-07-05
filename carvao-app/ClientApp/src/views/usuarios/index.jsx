import React, { useEffect, useState } from 'react';
import { FaPencil, FaPlus, FaTrash, FaUserPen, FaUsers, FaUserSlash } from 'react-icons/fa6';
import { GetDataUser } from '../../util/GetDataUser';
import { api } from '../../components/api/api';
import { RiUserFollowFill } from "react-icons/ri";
import { FaUserTimes } from 'react-icons/fa';

function Usuarios() {
    const usuario = GetDataUser();
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltro, setUsuariosFiltro] = useState([]);
    const [filtroNome, setFiltroNome] = useState();
    const [editingIndex, setEditingIndex] = useState(null);
    const [tiposUsuario, setTipoUsuario] = useState([]);

    const BuscarTiposUsuario = () => {
        api.get("Usuario/TiposUsuarios", res => {
            setTipoUsuario(res.data);
        })
    }

    const BuscarTodosUsuarios = () => {
        api.get("Usuario/BuscarTodosUsuarios", res => {
            setUsuarios(res.data);
            setUsuariosFiltro(res.data);
        }, err => {
            alert("Houve um erro ao buscar os usuários")
        })
    }

    useEffect(() => {
        if (!usuario.IsMaster)
            window.location.href = "/";

        BuscarTodosUsuarios();
        BuscarTiposUsuario();
    }, [])

    const FiltroNome = e => {
        setFiltroNome(e.target.value);
        setUsuariosFiltro(usuarios.filter(usuario => usuario.nome.toUpperCase().includes(e.target.value.toUpperCase())))
    }

    function maskCPF(CPF) {
        return CPF.substring(0, 3) + "." + CPF.substring(3, 6) + "." + CPF.substring(6, 9) + "-" + CPF.substring(9, 11);
    }


    const handleEditClick = (index) => {
        setEditingIndex(index);
    };

    const handleSaveClick = async (index) => {

        const nome = document.getElementById('nome' + index);
        if (!nome || nome.value === "") {
            alert("Digite um nome");
            return;
        }
        const email = document.getElementById('email' + index);
        if (!email || email.value === "") {
            alert("Digite um email");
            return;
        }
        const cpf = document.getElementById('cpf' + index);
        if (!cpf || cpf.value === "") {
            alert("Digite um cpf");
            return;
        }
        const tipo = document.getElementById('tipo' + index);
        if (!tipo || tipo.value === "") {
            alert("Selecione um tipo de usuario");
            return;
        }

        const form = {
            nome: nome.value,
            cpf: cpf.value,
            email: email.value,
            tipo: tipo.value,
            id: usuarios[index].usuarioId
        }

        if (await window.confirm("Deseja realmente salvar as informações?")) {
            var data = new FormData();
            data.append("data", JSON.stringify(form));
            api.put("Usuario/AtualizarUsuario", data, res => {
                setEditingIndex(null);
                BuscarTodosUsuarios();
                alert("Usuário atualizado com sucesso!")
            }, err => {
                alert("Houve um erro ao atualizar o usuário.")
            })
        }
    };

    const AlterarStatusCliente = async (usuarioId, novoStatus, ativar = false, inativar = false, excluir = false) => {
        if (await window.confirm(`Deseja realmente ${ativar ? "ativar " : inativar ? "inativar " : excluir ? "excluir " : "alterar status d"}o usuário?`)) {
            api.put(`Usuario/AtualizarStatusUsuario/${usuarioId}?status=${novoStatus}`, {}, res => {
                BuscarTodosUsuarios();
                alert(`Usuário ${ativar ? "ativado" : inativar ? "inativado" : excluir ? "excluido" : "alterado"} com sucesso!`)
            }, err => {
                alert("Houve um erro ao atualizar o status do usuário.")
            })
        }
    }


    return (
        <section className='content'>
            <h1>Usuários <FaUsers /></h1>
            <div className="container-table">
                <div style={{
                    padding: '1rem',
                    background: '#28d',
                    color: '#fff',
                    width: '100%',
                    margin: '0'
                }}
                    className='row'
                >
                    <div style={{ display: 'flex', justifyContent: 'end', marginRight: 20 }}>
                        <button
                            className="btn btn-success"
                            onClick={() => window.location.href = '/novousuario'}
                        >
                            Novo do usuário <FaPlus size={20} color='#fff' />
                        </button>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: '10px' }}>
                        <label for="validationTooltipUsername">Filtros:</label>
                        {<div class="input-group">
                            <input
                                type="text"
                                placeholder="Nome do produto"
                                value={filtroNome}
                                className='form-control'
                                onChange={FiltroNome}
                            />
                        </div>}
                    </div>
                </div>
                <br />
                <div className='row'>
                    <div className="col-md-12">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Cpf</th>
                                    <th>Email</th>
                                    <th>Data Cadastro</th>
                                    <th>Tipo Usuario</th>
                                    <th>Situação</th>
                                    <th>Editar</th>
                                    <th>Inativar/Ativar</th>
                                    <th>Excluir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltro.map((usuario, i) => {

                                    const date = new Date(usuario.dataCadastro);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const hours = String(date.getHours()).padStart(2, '0');
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    const seconds = String(date.getSeconds()).padStart(2, '0');
                                    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

                                    const isEditing = editingIndex === i;
                                    return (
                                        <tr key={usuario.usuarioId}>
                                            <td data-label="Id">{usuario.usuarioId}</td>
                                            <td data-label="Nome">
                                                {isEditing ? (
                                                    <input type="text" id={'nome' + i} className='form-control' defaultValue={usuario.nome} />
                                                ) : (
                                                    usuario.nome
                                                )}
                                            </td>
                                            <td data-label="Cpf">
                                                {isEditing ? (
                                                    <input max={11} type="text" id={'cpf' + i} className='form-control' defaultValue={usuario.cpf} />
                                                ) : (
                                                    maskCPF(usuario.cpf)
                                                )}
                                            </td>
                                            <td data-label="Email">
                                                {isEditing ? (
                                                    <input type="text" id={'email' + i} className='form-control' defaultValue={usuario.email} />
                                                ) : (
                                                    usuario.email
                                                )}
                                            </td>
                                            <td data-label="Data Cadastro">
                                                {formattedDateTime}
                                            </td>
                                            <td data-label="Tipo Usuario">
                                                <select className='form-control' id={'tipo' + i} disabled={!isEditing}>
                                                    {tiposUsuario.map(tipo => {
                                                        if (tipo.tipo_usuario_id == usuario.tipoUsuario) {
                                                            return <option selected value={tipo.tipo_usuario_id}>{tipo.nome}</option>
                                                        } else {
                                                            return <option value={tipo.tipo_usuario_id}>{tipo.nome}</option>
                                                        }
                                                    })}
                                                </select>
                                            </td>
                                            <td data-label="Situação">{usuario.habilitado === 1 ? "Ativo" : usuario.habilitado === 0 ? "Inativo" : 'Excluido'}</td>
                                            <td data-label="Editar">
                                                {isEditing ? (
                                                    <div style={{ display: 'flex', gap: 5 }}>
                                                        <button className='btn btn-primary' onClick={() => handleSaveClick(i)}>Salvar</button>
                                                        <button className='btn btn-danger' onClick={() => setEditingIndex(null)}>Cancelar</button>
                                                    </div>
                                                ) : (
                                                    <button className='btn btn-warning' onClick={() => handleEditClick(i)}><FaUserPen color='#fff' /></button>
                                                )}
                                            </td>
                                            <td data-label="Inativar/Ativar">
                                                {usuario.habilitado === 1 && <button onClick={() => AlterarStatusCliente(usuario.usuarioId, 0, false, true)} className='btn btn-info'><FaUserSlash /></button>}
                                                {usuario.habilitado === 0 && <button onClick={() => AlterarStatusCliente(usuario.usuarioId, 1, true)} className='btn btn-info'><RiUserFollowFill /></button>}
                                            </td>
                                            <td data-label="Excluir"><button className='btn btn-danger' onClick={() => AlterarStatusCliente(usuario.usuarioId, 2, false, false, true)}><FaUserTimes /></button></td>
                                        </tr>
                                    );
                                })}
                                {usuariosFiltro.length === 0 && (
                                    <tr>
                                        <td><span>Não foi encontrado nenhum usuário...</span></td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Usuarios;