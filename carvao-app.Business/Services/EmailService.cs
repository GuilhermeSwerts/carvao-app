using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using carvao_app.Business.Interfaces;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

namespace carvao_app.Business.Services
{
    public class EmailService : IEmail
    {
        private readonly IConfiguration _config;
        private readonly string smtpUser;
        private readonly string smtpPass;
        private readonly string smtpServer;


        public EmailService(IConfiguration config)
        {
            _config = config;
            smtpUser = config["USUARIO_EMAIL"];
            smtpPass = config["SENHA_EMAIL"];
            smtpServer = config["SERVER_EMAIL"];
        }

        public bool EnviarEmail(string email, string body,string assunto, List<string> copy)
        {
            try
            {
                int smtpPort = 587;

                ServicePointManager.ServerCertificateValidationCallback =
              delegate (object s, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
              { return true; };

                MailMessage mensagem = new MailMessage();
                mensagem.From = new MailAddress(smtpUser);
                mensagem.To.Add(new MailAddress(email));
                mensagem.Subject = assunto;
                mensagem.Body = body;
                mensagem.IsBodyHtml = body.Contains("html");

                foreach (var ccEmail in copy)
                {
                    mensagem.CC.Add(new MailAddress(ccEmail));
                }

                SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort);
                smtpClient.Credentials = new NetworkCredential(smtpUser, smtpPass);
                smtpClient.EnableSsl = true;

                smtpClient.Send(mensagem);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao enviar e-mail: " + ex.Message);
                throw;
            }
        }
    }
}
