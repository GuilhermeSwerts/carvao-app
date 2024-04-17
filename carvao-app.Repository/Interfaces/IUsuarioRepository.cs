using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Interfaces
{
    public interface IUsuarioRepository
    {
        UsuarioMap Login(string cpf, string senha);
    }
}
