using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class UsuarioMap
    {
        public int Usuario_id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public DateTime Data_cadastro { get; set; }
        public int Tipo_usuario_id { get; set; } 
        public bool Habilitado { get; set; } 
        public string Perfil { get; set; }
        public string Cpf { get; set; }
    }
}
