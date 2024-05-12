import React, { useEffect, useState } from 'react';
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6';
import { GetDataUser } from '../../util/GetDataUser';
import { api } from '../../components/api/api';
import Produto from '../../components/Modals/Produto/Produto';

function Produtos() {
    const usuario = GetDataUser();
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        if (!usuario.IsMaster)
            window.location.href = "/";

        BuscarTodosProdutos();
    }, [])

    const BuscarTodosProdutos = () => {
        api.get("/api/Produto/BuscarTodos", res => {
            setProdutos(res.data);
        }, erro => {
            alert(erro.mensage)
        })
    }

    const NovoProduto = (produto) => {
        if (produto.valor < produto.valorMinimo) {
            alert("Valor do produto deve ser maior que o valor minimo")
            return;
        }

        produto.valor = (produto.valor + '').replaceAll(',', '.')
        produto.valorMinimo = (produto.valor + '').replaceAll(',', '.')

        var data = new FormData();
        data.append("data", JSON.stringify(produto));
        api.post("api/Produto", data, res => {
            BuscarTodosProdutos();
            const loader = document.getElementById(`loadingpanel`);
            if (loader)
                loader.style.display = 'none';
            alert('Produto adicionado com sucesso!');
        }, erro => {
            alert(erro.response ? erro.response.data : "Houve um erro na solicitação!")
        })
    }

    const EditarProduto = (produto) => {
        if (produto.valor < produto.valorMinimo) {
            alert("Valor do produto deve ser maior que o valor minimo")
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
            alert('Produto editado com sucesso!');
        }, erro => {
            alert(erro.response ? erro.response.data : "Houve um erro na solicitação!")
        })
    }

    const ExcluirProduto = async (id) => {
        var excluir = await window.confirm("Deseja realmente excluir esse produto?")
        if (excluir) {
            api.delete(`api/Produto/${id}`, res => {
                BuscarTodosProdutos();
                const loader = document.getElementById(`loadingpanel`);
                if (loader)
                    loader.style.display = 'none';
                alert('Produto excluído com sucesso!');
            }, erro => {
                alert(erro.response ? erro.response.data : "Houve um erro na solicitação!")
            })
        }
    }

    return (
        <section className='content'>
            <div className='row'>
                <div className="col-md-12">
                    <div style={{ display: 'flex', justifyContent: 'end', marginRight: 20 }}>
                        <Produto
                            top={false}
                            textSubmit="Cadastrar Produto"
                            classButton="btn btn-primary"
                            onSubmit={NovoProduto}
                            tooltip='Novo Produto'
                            icon={<FaPlus size={20} color='#fff' />} />
                    </div>
                    <br />
                    <br />
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
                            {produtos.map((produto, i) => {
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
                            {produtos.length == 0 && <tr>
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
        </section>
    );
}

export default Produtos;