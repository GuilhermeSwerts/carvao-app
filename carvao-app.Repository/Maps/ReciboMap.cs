using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class ReciboMap
    {
        public int recibo_id { get; set; }
        public int pedido_id { get; set; }
        public DateTime data_recibo { get; set; }
        public decimal valor_pago { get; set; }
        public int forma_pagamento { get; set; }
        public string observacoes { get; set; }
        public string nome_pagador { get; set; }
        public bool ativo { get; set; }

        public string justificativa { get; set; }

        public string hash_recibo { get; set; }
    }
}
