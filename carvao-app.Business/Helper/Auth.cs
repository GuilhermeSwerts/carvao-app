using carvao_app.Models.Dtos;
using carvao_app.Repository.Maps;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace carvao_app.Helper
{
    public class Auth
    {
        public static class Settings
        {
            public static string Secret = "aisohfpsadhfasdfbsadkfasfasdbfsa";
        }

        public static string GenerateToken(UsuarioDto usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Settings.Secret);

            List<Claim> claimsIdentity = new()
            {
                    new Claim(ClaimTypes.Name, ""),
                    new Claim(ClaimTypes.UserData,usuario.UsuarioId.ToString()),
                    new Claim(ClaimTypes.Role, usuario.TipoUsuario.ToString()),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claimsIdentity),
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
