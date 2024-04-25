using carvao_app.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Requests
{
    public class GerarReciboRequest
    {
        public int pedido_id { get; set; }
        public decimal valor_pago { get; set; }
        public int forma_pagamento { get; set; }
        public string nome_pagador{ get; set; }
        public string observacoes { get; set; }
        public int Id { get; set; }

        public string hash_recibo { get; set; }


    }
}
