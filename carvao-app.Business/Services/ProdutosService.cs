using carvao_app.Business.Interfaces;
using carvao_app.Models.Dtos;
using carvao_app.Models.Enum;
using carvao_app.Repository.Interfaces;
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
    }
}
