using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class ReciboMap
    {
        public int Recibo_id { get; set; }
        public int Pedido_id { get; set; }
        public DateTime Data_recibo { get; set; }
        public decimal Valor_pago { get; set; }
        public int Forma_pagamento { get; set; }
        public string Observacoes { get; set; }
        public string Nome_pagador { get; set; }
        public bool Ativo { get; set; }

        public string justificativa { get; set; }
    }
}
