﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Requests
{
    public class GerarReciboRequest
    {
        public int ValorPagar { get; set; }
        public int FormaPagamento { get; set; }
        public string NomePagador { get; set; }
        public string Observacao { get; set; }
        public int Id { get; set; }
    }
}
