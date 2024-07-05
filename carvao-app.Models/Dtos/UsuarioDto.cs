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
        public string Nome { get; set; }
        public string Email { get; set; }
        public DateTime DataCadastro { get; set; }
        public int Habilitado { get; set; }
        public string Perfil { get; set; }
        public string Cpf { get; set; }

    }
}
