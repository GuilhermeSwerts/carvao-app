using carvao_app.Models.Enum;
using carvao_app.Repository.Conexao;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using Dapper;
using Microsoft.Extensions.Configuration;
using Mysqlx.Crud;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Services
{
    public class ReciboRepository : IReciboRepository
    {
        private readonly IConfiguration _configuration;
        private readonly IPedidoRepository _pedidoRepository;

        public ReciboRepository(IConfiguration configuration, IPedidoRepository pedidoRepository)
        {
            _configuration = configuration;
            _pedidoRepository = pedidoRepository;
        }

        public object BuscarRecibosId(int pedidoId)
        {
            return DataBase.Execute<ReciboMap>(_configuration, "SELECT * FROM recibo WHERE pedido_id = @Id And ativo = 1", new {Id = pedidoId }).ToList();
        }

        public object CancelarReciboPorId(int reciboId, string mensagem)
        {
            var recibo = DataBase.Execute<ReciboMap>(_configuration, "SELECT * FROM recibo WHERE recibo_id = @Id And ativo = 1", new { Id = reciboId }).FirstOrDefault();

            string QueryUpdate = "Update recibo Set justificativa = @justificativa, ativo = 0 where recibo_id = @Id";
            var param = new DynamicParameters();
            param.Add("@justificativa", mensagem);
            param.Add("@Id", reciboId);
            DataBase.Execute(_configuration, QueryUpdate, param);

            param = new DynamicParameters();
            param.Add("@Saldo", recibo.Valor_pago);
            DataBase.Execute(_configuration, "UPDATE pedido set saldo_devedor = saldo_devedor + @Saldo", param);

            return 0;
        }

        public int GerarRecibo(GerarReciboRequestRepository recibo)
        {
            var reciboMap = new ReciboMap
            {
                Data_recibo = DateTime.Now,
                Forma_pagamento = recibo.FormaPagamento,
                Nome_pagador = recibo.NomePagador,
                Observacoes = recibo.Observacao,
                Pedido_id = recibo.Id,
                Valor_pago = recibo.ValorPagar
            };
            var param = new DynamicParameters();
            param.Add("@PedidoId", reciboMap.Pedido_id);
            param.Add("@DataRecibo", reciboMap.Data_recibo);
            param.Add("@ValorPago", reciboMap.Valor_pago);
            param.Add("@FormaPag", reciboMap.Forma_pagamento);
            param.Add("@Obs", reciboMap.Observacoes);
            param.Add("@Nome", reciboMap.Nome_pagador);
            var sql = @"INSERT INTO recibo
            (pedido_id, data_recibo, valor_pago, forma_pagamento, observacoes, nome_pagador)
            VALUES(@PedidoId, @DataRecibo, @ValorPago, @FormaPag, @Obs, @Nome); SELECT LAST_INSERT_ID();";

            var id = DataBase.Execute<int>(_configuration, sql, param).FirstOrDefault();

            var pedido = _pedidoRepository.BuscarPedidoId(recibo.Id);

            var saldoDevedor = pedido.Pedido.Saldo_devedor - recibo.ValorPagar;
            var idStatus = saldoDevedor == 0 ? (int)StatusPagamentoEnum.Concluido : (int)StatusPagamentoEnum.Parcial;

            param = new DynamicParameters();
            param.Add("@SaldoDevedor", saldoDevedor);
            param.Add("@StatusPedido", idStatus);
            param.Add("@Id", recibo.Id);
            sql = "update pedido set saldo_devedor = @SaldoDevedor,status_pagamento_id = @StatusPedido where pedido_id = @Id";
            DataBase.Execute(_configuration, sql, param);

            return id;
        }
    }
}
