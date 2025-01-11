import React, { useEffect, useState } from 'react';
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6';
import { GetDataUser } from '../../util/GetDataUser';
import { api } from '../../components/api/api';
import Produto from '../../components/Modals/Produto/Produto';
import Filter from '../../components/filter/filter';
import { FaBoxes } from 'react-icons/fa';
import { Alert, Pergunta } from '../../util/Alertas';

function Produtos() {
    const usuario = GetDataUser();
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltro, setProdutosFiltro] = useState([]);
    const [filtroNome, setFiltroNome] = useState();

    useEffect(() => {
        if (!usuario.IsMaster)
            window.location.href = "/";

        BuscarTodosProdutos();
    }, [])

    const BuscarTodosProdutos = () => {
        api.get("/api/Produto/BuscarTodos", res => {
            setProdutos(res.data);
            setProdutosFiltro(res.data);
        }, erro => {
            Alert(erro.mensage, false)
        })
    }


    const FiltroNome = e => {
        setFiltroNome(e.target.value);
        setProdutosFiltro(produtos.filter(produto => produto.nome.toUpperCase().includes(e.target.value.toUpperCase())))
    }

    const NovoProduto = (produto) => {
        if (produto.valor < produto.valorMinimo) {
            Alert("Valor do produto deve ser maior que o valor minimo", false, true)
            return;
        }

        produto.valor = (produto.valor + '').replaceAll(',', '.')
        produto.valorMinimo = (produto.valorMinimo + '').replaceAll(',', '.')

        var data = new FormData();
        data.append("data", JSON.stringify(produto));
        api.post("api/Produto", data, res => {
            BuscarTodosProdutos();
            const loader = document.getElementById(`loadingpanel`);
            if (loader)
                loader.style.display = 'none';
            Alert('Produto adicionado com sucesso!', true);
        }, erro => {
            Alert(erro.response ? erro.response.data : "Houve um erro na solicitação!", false)
        })
    }

    const EditarProduto = (produto) => {
        if (parseFloat(produto.valor) < parseFloat(produto.valorMinimo)) {
            Alert("Valor do produto deve ser maior que o valor minimo", false, true)
            return;
        }

        produto.valor = (produto.valor + '').replaceAll(',', '.')
        produto.valorMinimo = (produto.valorMinimo + '').replaceAll(',', '.')
        produto.valor = parseFloat(produto.valor);
        produto.valorMinimo = parseFloat(produto.valorMinimo);

        var data = new FormData();
        data.append("data", JSON.stringify(produto));
        api.post("api/Produto/Editar", data, res => {
            BuscarTodosProdutos();
            const loader = document.getElementById(`loadingpanel`);
            if (loader)
                loader.style.display = 'none';
            Alert('Produto editado com sucesso!');
        }, erro => {
            Alert(erro.response ? erro.response.data : "Houve um erro na solicitação!", false, true)
        })
    }

    const ExcluirProduto = async (id) => {
        var excluir = await Pergunta("Deseja realmente excluir esse produto?")
        if (excluir) {
            api.delete(`api/Produto/${id}`, res => {
                BuscarTodosProdutos();
                const loader = document.getElementById(`loadingpanel`);
                if (loader)
                    loader.style.display = 'none';
                Alert('Produto excluído com sucesso!');
            }, erro => {
                Alert(erro.response ? erro.response.data : "Houve um erro na solicitação!", false)
            })
        }
    }

    return (
        <section className='content'>
            <div className="container-table">
                <div style={{
                    padding: '1rem',
                    background: 'var(--cor-principal)',
                    color: '#fff',
                    width: '100%',
                    margin: '0'
                }}
                    className='row'
                >
                    <div style={{ display: 'flex', justifyContent: 'end', marginRight: 20 }}>
                        <Produto
                            top={true}
                            textSubmit="Cadastrar Produto"
                            classButton="btn btn-success"
                            onSubmit={NovoProduto}
                            tooltip='Novo Produto'
                            icon={<FaPlus size={20} color='#fff' />} />
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
                                    <th>Id</th>
                                    <th>Nome Do Produto</th>
                                    <th>Valor Do Produto (R$)</th>
                                    <th>Valor Mínimo Do Produto (R$)</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtosFiltro.map((produto, i) => {
                                    produto.produto_id = produto.id
                                    return (
                                        <tr>
                                            <td data-label="Id">{produto.produto_id}</td>
                                            <td data-label="Nome Do Produto">{produto.nome}</td>
                                            <td data-label="Valor Do Produto">R$ {produto.valor.toFixed(2).replaceAll('.', ',')}</td>
                                            <td data-label="Valor Mínimo">R$ {produto.valorMinimo.toFixed(2).replaceAll('.', ',')}</td>
                                            <td data-label="Ações" style={{ display: 'flex', gap: 10 }}>
                                                <Produto
                                                    textSubmit="Atualizar Produto"
                                                    classButton="btn btn-success"
                                                    onSubmit={EditarProduto}
                                                    tooltip='Editar Produto'
                                                    Produto={produto}
                                                    top={true}
                                                    icon={<FaPencil size={20} color='#fff' />}
                                                />
                                                <button onClick={() => ExcluirProduto(produto.id)} className='btn btn-danger'><FaTrash size={20} /></button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {produtosFiltro.length == 0 && <tr>
                                    <td><span>Não foi encontrado nenhum produto...</span></td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Produtos;