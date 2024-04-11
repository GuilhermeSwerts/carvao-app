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

        public List<ProdutoMap> BuscarProdutosByClienteId(int id)
        {
            var retorno = DataBase.Execute<ProdutoMap>(_configuration, "select * from produto", new DynamicParameters());

            return retorno.OrderBy(c => c.Nome).ToList();
        }

        public object BuscarTiposPagamento()
        {
            var retorno = DataBase.Execute<TtipoPagamentoMap>(_configuration, "select * from tipo_pagamento", new DynamicParameters());
            return retorno.OrderBy(c => c.Tipo_pagamento_id).ToList();
        }
    }
}
