﻿using carvao_app.Business.Interfaces;
using carvao_app.Helper;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
    }
}
