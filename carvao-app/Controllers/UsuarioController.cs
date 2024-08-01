using carvao_app.Business.Interfaces;
using carvao_app.Helper;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Bcpg.OpenPgp;
using System.Net.Http;
using System.Threading.Tasks;

namespace carvao_app.Controllers
{
    public class UsuarioController : PrivateController
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

        [HttpGet]
        [Route("/Usuario/TiposUsuarios")]
        public async Task<IActionResult> GetTiposUsuarios()
        {
            try
            {
                var tipos = _service.BuscarTiposUsuarios();
                return Ok(tipos);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("/Usuario")]
        public async Task<IActionResult> Post([FromForm] string data)
        {
            try
            {
                NovoUsuarioRequest request = JsonConvert.DeserializeObject<NovoUsuarioRequest>(data);
                _service.NovoUsuarios(request);
                return Ok(true);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("/Usuario/AtualizarUsuario")]
        public async Task<IActionResult> Put([FromForm] string data)
        {
            try
            {
                NovoUsuarioRequest request = JsonConvert.DeserializeObject<NovoUsuarioRequest>(data);
                _service.EditarUsuario(request);
                return Ok(true);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("/Usuario/AtualizarStatusUsuario/{usuarioId}")]
        public async Task<IActionResult> PutAtualizarStatusUsuario([FromRoute] int usuarioId, [FromQuery] int status)
        {
            try
            {
                _service.AtualizarStatusUsuario(usuarioId, status);
                return Ok(true);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("/Usuario/BuscarTodosUsuarios")]
        public async Task<IActionResult> BuscarTodosUsuarios()
        {
            try
            {
                var usuarios = _service.BuscarTodosUsuarios();
                return Ok(usuarios);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("/Usuario/ResetaSenha")]
        public IActionResult ResetaSenhaUsuario([FromBody] int id)
        {
            try
            {
                _service.ResetaSenhaUsuario(id);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("/Usuario/TrocaSenha")]
        public IActionResult TrocaSenha([FromQuery] string senhaAtual, string senhaNova)
        {
            try
            {
                _service.TrocaSenhaUsuario(senhaAtual, senhaNova,GetUser());
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("/Usuario/EsqueciSenha/Email")]
        public IActionResult EmailEsqueciSenha([FromQuery] string cpf,string email,string ip)
        {
            try
            {
                _service.EmailEsqueciSenha(cpf, email, ip);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/Usuario/EsqueciSenha")]
        public IActionResult EsqueciSenha([FromForm] string obj)
        {
            try
            {

                var request = JsonConvert.DeserializeObject<EsqueciSenha>(obj);
                _service.EsqueciSenha(request);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("/Usuario/Ip")]
        public async Task<IActionResult> GetIp()
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    var response = await httpClient.GetAsync("https://meuip.com/api/meuip.php");

                    if(response.IsSuccessStatusCode)
                        return Ok(response);

                    return Ok("123.123.123");
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
