using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class HistoricoMap
    {
        public int Id { get; set; }
        public decimal ValorTotal { get; set; }
        public DateTime DataPedido { get; set; }
        public string StatusPedido { get; set; }
        public string StatusPagamento { get; set; }
    }
}
