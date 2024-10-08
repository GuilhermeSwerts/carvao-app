﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Requests
{
    public class NovoUsuarioRequest
    {
        public int? Id { get; set; }
        public string Nome { get; set; }
        public string Cpf { get; set; }
        public string Email { get; set; }
        public int Tipo { get; set; }
        public int? PercentualComissao { get; set; }
    }
}
