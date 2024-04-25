using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Services
{
    public class GerarReciboRequestRepository
    {
        public decimal ValorPagar { get; set; }
        public int FormaPagamento { get; set; }
        public string NomePagador { get; set; }
        public string Observacao { get; set; }
        public int Id { get; set; }
        public string HashRecibo { get; set; } 

    }
}
