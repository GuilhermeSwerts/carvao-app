using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Requests
{
    public class EsqueciSenha
    {
        public string SenhaNova { get; set; }
        public string Token { get; set; }
    }
}
