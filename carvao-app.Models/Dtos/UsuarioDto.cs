using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Dtos
{
    public class UsuarioDto
    {
        public int UsuarioId { get; set; }
        public int TipoUsuario { get; set; }
        public string Token { get; set; }
    }
}
