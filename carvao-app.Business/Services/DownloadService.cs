using carvao_app.Business.Interfaces;
using carvao_app.Models.Enum;
using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Services
{
    public class DownloadService : IDownloadService
    {
        private readonly IPedidosService _servicePedidos;
        private readonly IClientesService _serviceClientes;
        public DownloadService(IPedidosService servicePedidos, IClientesService serviceClientes)
        {
            _servicePedidos = servicePedidos;
            _serviceClientes = serviceClientes;
        }

        public byte[] DownloadFiltro(string filtro, string dtInicio, string dtFim, ETipoDownload tipoDownload, UsuarioMap usuarioMap)
        {
            if (tipoDownload == ETipoDownload.GestaoPedidos)
            {
                return GetByteGestaoPedidos(filtro, dtInicio, dtFim, usuarioMap);
            }

            if (tipoDownload == ETipoDownload.Clientes)
            {
                return GetByteClientes(filtro, dtInicio, dtFim, usuarioMap);
            }

            throw new Exception("Tela do filtro não definida: campo 'tipoDownload' ");
        }

        private byte[] GetByteClientes(string filtro, string dtInicio, string dtFim, UsuarioMap usuarioMap)
        {
            var dados = _serviceClientes.BuscarClientes(filtro, dtInicio, dtFim, false);
            var cblc = "cliente_id;nome;Cnpj;email;telefone;proprietario;data_cadastro;inscricao_estadual;inscricao_municipal;responsavel_compra;responsavel_compra_email;responsavel_compra_telefone;responsavel_compra_telefone_fixo;observacao;pessoaFisica;Inativo;Cpf\n";

            string texto = cblc;
            for (int i = 0; i < dados.Count; i++)
            {
                var cliente = dados[i];
                texto += $"{cliente.Id};{cliente.Nome};{cliente.Cnpj};{cliente.Email};{cliente.Telefone};{cliente.Proprietario};{cliente.DataCadastro};{cliente.InscricaoEstadual};{cliente.InscricaoMunicipal};{cliente.ResponsavelCompra};{cliente.ResponsavelCompraEmail};{cliente.ResponsavelCompraTelefone};{cliente.ResponsavelCompraTelefoneFixo};{cliente.Observacao};{cliente.PessoaFisica};{cliente.Inativo};{cliente.Cpf}";
                texto += "\n";
            }

            byte[] fileBytes = Encoding.Latin1.GetBytes(texto);
            return fileBytes;
        }

        private byte[] GetByteGestaoPedidos(string filtro, string dtInicio, string dtFim, UsuarioMap usuarioMap)
        {
            var dados = _servicePedidos.BuscarTodosPedidos(filtro, dtInicio, dtFim, usuarioMap);
            var cblc = "Nome Cliente;Nome Vendedor;Localidade;Data Do Pedid;Valor Total Pedidos(R$;Saldo Devedor(R$);Status Pedido;Status Pagameto\n";

            string texto = cblc;
            for (int i = 0; i < dados.Pedidos.Count; i++)
            {
                var produto = dados.Pedidos[i];
                var statusPedido = dados.StatusPedido.FirstOrDefault(x => x.Status_pedido_id == produto.Status_pedido_id) ?? new();
                var statusPagamento = dados.StatusPagamento.FirstOrDefault(x => x.Status_pagamento_id == produto.Status_pagamento_id) ?? new();

                texto += $"{produto.NomeCliente};{produto.NomeVendedor};{produto.Localidade};{produto.Data_pedido};{produto.Valor_total};{produto.Saldo_devedor};{statusPedido.Nome};{statusPagamento.Nome}";
                texto += "\n";
            }

            byte[] fileBytes = Encoding.Latin1.GetBytes(texto);
            return fileBytes;
        }

    }
}
