using carvao_app.Repository.Maps;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace carvao_app.Controllers
{
    [Authorize]
    public class PrivateController : Controller
    {
        public UsuarioMap Usuario => GetUser();
        [HttpGet]
        public UsuarioMap GetUser()
        {
            if (User != null)
            {
                if (User.Claims.Count() == 0) { return null; }

                UsuarioMap usuario = new();

                var userdata = User.Claims.First(x => x.Type.Contains("userdata"));

                var role = User.Claims.First(x => x.Type.Contains("role"));

                if (userdata != null)
                {
                    usuario.Usuario_id = int.Parse(userdata.Value);
                    usuario.Tipo_usuario_id = int.Parse(role.Value);

                    return usuario;
                }
            }
            return null;
        }
    }
}
