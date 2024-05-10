using carvao_app.Models.Enum;
using carvao_app.Repository.Conexao;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using Dapper;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
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
    
            var query = "select * from produto";

            var retorno = DataBase.Execute<ProdutoMap>(_configuration, query, new());

            return retorno.OrderBy(c => c.Produto_id).ToList();
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

        public void NovoProduto(ProdutoMap request)
        {
            bool exist = DataBase.Execute<ProdutoMap>(_configuration, "select * from produto where  nome = @Nome ", new
            {
                request.Nome
            }).Any();
            if (exist) throw new Exception("Produto já cadastrado.");

            var query = @"INSERT INTO produto
            (nome, descricao, data_cadastro, valor, valor_desconto_maximo,link_foto,codigo_barra,quantidade)
            VALUES(@Nome, @Nome, now(), @Valor, @ValorMinimo,'','',999);";
            var parameters = new DynamicParameters();
            parameters.Add("@Nome", request.Nome);
            parameters.Add("@Valor", request.Valor);
            parameters.Add("@ValorMinimo", request.Valor_desconto_maximo);

            DataBase.Execute(_configuration, query, parameters);
        }

        public void DeletaProduto(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            DataBase.Execute(_configuration, "DELETE from produto where produto_id = @Id", parameters);
        }

        public void EditarProduto(ProdutoMap request)
        {
            var query = @"UPDATE produto
            SET nome = @Nome,descricao=@Nome,valor=@Valor,valor_desconto_maximo=@ValorMinimo WHERE produto_id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("@Id", request.Produto_id);
            parameters.Add("@Nome", request.Nome);
            parameters.Add("@Valor", request.Valor);
            parameters.Add("@ValorMinimo", request.Valor_desconto_maximo);
            
            DataBase.Execute(_configuration, query, parameters);
        }
    }
}
