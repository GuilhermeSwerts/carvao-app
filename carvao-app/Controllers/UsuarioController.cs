using carvao_app.Business.Interfaces;
using carvao_app.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace carvao_app.Controllers
{
    public class UsuarioController : Controller
    {
        private readonly IUsuario _service;
        public UsuarioController(IUsuario service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("/Usuario/Login")]
        public async Task<IActionResult> GetLogin([FromQuery] string cpf,string senha)
        {
            try
            {
                if (string.IsNullOrEmpty(cpf) || string.IsNullOrEmpty(senha))
                {
                    throw new System.Exception("Email ou Senha inválidos!");
                }

                var user = _service.Login(cpf, senha);

                user.Token = Auth.GenerateToken(user);

                Response.Headers.Add("access_token", user.Token);

                return Ok(user);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
