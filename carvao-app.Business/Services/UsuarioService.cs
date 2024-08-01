using carvao_app.Business.Interfaces;
using carvao_app.Helper;
using carvao_app.Models.Dtos;
using carvao_app.Models.Modelos;
using carvao_app.Models.Requests;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace carvao_app.Business.Services
{
    public class UsuarioService : IUsuario
    {
        private readonly IUsuarioRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly IEmail _email;
        private readonly IMemoryCache _cache;

        public UsuarioService(IUsuarioRepository repository, IConfiguration configuration, IEmail email, IMemoryCache cache)
        {
            _repository = repository;
            _configuration = configuration;
            _email = email;
            _cache = cache;
        }

        public void NovoUsuarios(NovoUsuarioRequest request)
        {
            try
            {
                _repository.NovoUsuarios(new UsuarioMap
                {
                    Cpf = request.Cpf,
                    Data_cadastro = DateTime.Now,
                    Email = request.Email,
                    Habilitado = 1,
                    Nome = request.Nome,
                    Tipo_usuario_id = request.Tipo,
                    Senha = Cripto.Encrypt("P@drao123")
                });
            }
            catch (Exception)
            {
                throw;
            }
        }

        public object BuscarTiposUsuarios()
        {
            return _repository.BuscarTiposUsuarios();
        }

        public UsuarioDto Login(string cpf, string senha)
        {
            try
            {
                var usuario = _repository.Login(cpf, senha);
                return new UsuarioDto
                {
                    TipoUsuario = usuario.Tipo_usuario_id,
                    UsuarioId = usuario.Usuario_id
                };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public object BuscarTodosUsuarios(bool retornarSenha = false)
        {
            try
            {
                var usuario = _repository.BuscarTodosUsuarios();
                return usuario.Select(usr => new UsuarioDto
                {
                    Senha = retornarSenha ? usr.Senha : "",
                    UsuarioId = usr.Usuario_id,
                    TipoUsuario = usr.Tipo_usuario_id,
                    Nome = usr.Nome,
                    Email = usr.Email,
                    DataCadastro = usr.Data_cadastro,
                    Habilitado = usr.Habilitado,
                    Cpf = usr.Cpf,
                }).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void EditarUsuario(NovoUsuarioRequest request)
        {
            try
            {
                _repository.AtualizarUsuario(new UsuarioMap
                {
                    Usuario_id = request.Id ?? 0,
                    Cpf = request.Cpf,
                    Data_cadastro = DateTime.Now,
                    Email = request.Email,
                    Nome = request.Nome,
                    Tipo_usuario_id = request.Tipo
                });
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void AtualizarStatusUsuario(int usuarioId, int status)
        {
            _repository.AlterarStatusUsuario(usuarioId, status);
        }

        public void ResetaSenhaUsuario(int id)
        {
            _repository.ResetaSenhaUsuario(id, Cripto.Encrypt("P@drao123"));
        }

        public void TrocaSenhaUsuario(string senhaAtual, string senhaNova, UsuarioMap usuarioMap)
        {
            var usuario = ((List<UsuarioDto>)BuscarTodosUsuarios(true)).First(x => x.UsuarioId == usuarioMap.Usuario_id);
            if (senhaAtual != Cripto.Decrypt(usuario.Senha))
                throw new Exception("Senha atual incorreta!");

            _repository.ResetaSenhaUsuario(usuario.UsuarioId, Cripto.Encrypt(senhaNova));
        }

        public void EmailEsqueciSenha(string cpf, string email, string ip)
        {
            try
            {
                if (IsBlocked(ip))
                    throw new Exception("Você está temporariamente bloqueado devido a múltiplas tentativas de recuperação de senha. Tente novamente mais tarde.");

                var usuario = ((List<UsuarioDto>)BuscarTodosUsuarios(true))
                    .FirstOrDefault(x => x.Cpf == cpf.Replace(".", "").Replace("-", "") && x.Email.ToLower() == email.ToLower())
                    ?? throw new Exception("Email ou Cpf inválidos.");

                var token = Cripto.Encrypt($"USUARIO:{usuario.UsuarioId}");

                var modelo = ModeloEmail.EsqueciSenha;
                modelo = modelo.Replace("URL_IMAGEM", _configuration["URL_IMAGEM"]);
                modelo = modelo.Replace("URL_DE_REDEFINICAO", $"{_configuration["URL_DE_REDEFINICAO"]}/ResetarSenha?token={token}");
                modelo = modelo.Replace("<NOME>", usuario.Nome.Contains(' ') ? usuario.Nome.Split(' ')[0] : usuario.Nome);

                var enviou = _email.EnviarEmail(usuario.Email, modelo, "Recuperação de Senha - Carvao Kompleto", new List<string>());
                if (!enviou)
                    throw new Exception("Não foi possível enviar o email, por favor tente novamente mais tarde.");

                ResetAttempts(ip); // Reseta as tentativas em caso de sucesso
            }
            catch (Exception ex)
            {
                if (ex.Message == "Email ou Cpf inválidos.")
                {
                    var remainingAttempts = IncrementAttempts(ip);

                    var mensagemFinal = remainingAttempts > 1 ? $"Restam {remainingAttempts} tentativas."
                        : remainingAttempts > 0 ? $"Restam {remainingAttempts} tentativa." : $"Você foi temporariamente bloqueado devido a múltiplas tentativas de recuperação de senha. Tente novamente mais tarde.";

                    throw new Exception($"Email ou Cpf inválidos: {mensagemFinal}");
                }

                throw;
            }
        }

        public void EsqueciSenha(EsqueciSenha request)
        {
            try
            {
                var str_token = request.Token.Substring(0, 1) == "$" ? request.Token : "$" + request.Token;

                var token = Cripto.Decrypt(str_token.Replace(" ", "+").Substring(1));

                int id = int.Parse(token.Split(":")[1]);

                var usuario = ((List<UsuarioDto>)BuscarTodosUsuarios(true)).FirstOrDefault(x => x.UsuarioId == id)
                            ?? throw new Exception("Usuário inválido.");

                TrocaSenhaUsuario(Cripto.Decrypt(usuario.Senha), request.SenhaNova, new UsuarioMap { Usuario_id = id });

            }
            catch (Exception)
            {
                throw;
            }
        }

        private bool IsBlocked(string ip)
        {
            return _cache.TryGetValue(GetBlockKey(ip), out _);
        }

        private int IncrementAttempts(string ip)
        {
            string attemptsKey = GetAttemptsKey(ip);
            if (_cache.TryGetValue(attemptsKey, out int attempts))
            {
                attempts++;
                if (attempts >= 3)
                {
                    // Bloqueia o IP por 30 minutos
                    _cache.Set(GetBlockKey(ip), true, TimeSpan.FromMinutes(30));
                    _cache.Remove(attemptsKey);
                    return 0; // Zero tentativas restantes após bloqueio
                }
                else
                {
                    _cache.Set(attemptsKey, attempts, TimeSpan.FromMinutes(30));
                    return 3 - attempts; // Retorna as tentativas restantes
                }
            }
            else
            {
                _cache.Set(attemptsKey, 1, TimeSpan.FromMinutes(30));
                return 2; // Dois restantes após a primeira tentativa falha
            }
        }

        private void ResetAttempts(string ip)
        {
            _cache.Remove(GetAttemptsKey(ip));
        }

        private string GetAttemptsKey(string ip) => $"Attempts_{ip}";
        private string GetBlockKey(string ip) => $"Blocked_{ip}";
    }
}
