using carvao_app.Repository.Conexao;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;

namespace carvao_app.Repository.Services
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly IConfiguration _configuration;

        public ProdutoRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<ProdutoMap> BuscarTodosProdutos()
        {
            var retorno = DataBase.Execute<ProdutoMap>(_configuration, "select * from produto", new DynamicParameters());

            return retorno.OrderBy(c => c.Nome).ToList();
        }

        public List<PedidoProdutoMap> BuscarProdutosByClienteId(int id)
        {
            var retorno = DataBase.Execute<PedidoProdutoMap>(_configuration, "select DISTINCT pp.* from produto p join pedido_produto pp on p.produto_id  = pp.produto_id join pedido p2 on pp.pedido_id = p2.pedido_id where p2.cliente_id  = @Id", new { Id = id });

            return retorno.OrderBy(c => c.Pedido_id).ToList();
        }

        public object BuscarTiposPagamento()
        {
            var retorno = DataBase.Execute<TtipoPagamentoMap>(_configuration, "select * from tipo_pagamento", new DynamicParameters());
            return retorno.OrderBy(c => c.Tipo_pagamento_id).ToList();
        }
    }
}
