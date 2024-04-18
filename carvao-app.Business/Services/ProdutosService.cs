using carvao_app.Business.Interfaces;
using carvao_app.Models.Dtos;
using carvao_app.Models.Enum;
using carvao_app.Models.Requests;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Services
{
    public class ProdutosService : IProdutosService
    {
        private readonly IProdutoRepository _repository;

        public ProdutosService(IProdutoRepository repository)
        {
            _repository = repository;
        }

        public object BuscarTiposPagamento()
        {
            return _repository.BuscarTiposPagamento();
        }

        public object BuscarTodosProdutos()
        {
            var produtos = _repository.BuscarTodosProdutos();
            return new ProdutoDto().ToDtoList(produtos);
        }

        public void DeletaProduto(int id)
        {
            _repository.DeletaProduto(id);
        }

        public void EditarProduto(ProdutoRequest request)
        {
            _repository.EditarProduto(new ProdutoMap
            {
                Nome = request.Nome,
                Data_cadastro = DateTime.Now,
                Valor_desconto_maximo = request.ValorMinimo,
                Valor = request.Valor,
                Produto_id = request.Id
            });
        }

        public void NovoProduto(ProdutoRequest request)
        {
            _repository.NovoProduto(new ProdutoMap
            {
                Nome = request.Nome,
                Data_cadastro = DateTime.Now,
                Valor_desconto_maximo = request.ValorMinimo,
                Valor = request.Valor,
            });
        }
    }
}
