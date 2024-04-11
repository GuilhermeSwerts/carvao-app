using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class PedidoMap
    {
        public int Pedido_id { get; set; }
        public int Vendedorusuarioid { get; set; }
        public int? Atendenteusuarioid { get; set; }
        public int Cliente_id { get; set; }
        public decimal Valor_total { get; set; }
        public decimal? Valor_desconto { get; set; }
        public decimal? Percentual_desconto { get; set; }
        public int Status_pedido_id { get; set; }
        public DateTime? Data_pedido { get; set; }
        public DateTime? Data_atendimento { get; set; }
        public DateTime? Data_atualizacao { get; set; }
        public string Observacao { get; set; }
        public int Status_pagamento_id { get; set; }
        public List<PedidoProdutoMap> Produtos { get; set; } = new();
        public string NomeCliente { get; set; } 
        public string NomeVendedor { get; set; }
        public string Localidade { get; set; }
        public decimal Saldo_devedor { get; set; }
    }
}
