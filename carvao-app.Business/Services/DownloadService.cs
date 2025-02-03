using carvao_app.Business.Interfaces;
using carvao_app.Models.Enum;
using carvao_app.Repository.Maps;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.IO;
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

        public byte[] DownloadFiltro(string filtro, string dtInicio, string dtFim, ETipoDownload tipoDownload, UsuarioMap usuarioMap, int? nPedido,int? vendedor)
        {
            if (tipoDownload == ETipoDownload.GestaoPedidos)
            {
                return GetXlsxGestaoPedidos(filtro, dtInicio, dtFim, usuarioMap, nPedido, vendedor);
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

        private byte[] GetXlsxGestaoPedidos(string filtro, string dtInicio, string dtFim, UsuarioMap usuarioMap, int? nPedido, int? vendedor)
        {
            var dados = _servicePedidos.BuscarTodosPedidos(filtro, dtInicio, dtFim, usuarioMap, nPedido, vendedor);
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Gestão de Pedidos");

                // Cabeçalhos
                worksheet.Cell(1, 1).Value = "Número Pedido";
                worksheet.Cell(1, 2).Value = "Nome Cliente";
                worksheet.Cell(1, 3).Value = "Nome Vendedor";
                worksheet.Cell(1, 4).Value = "Localidade";
                worksheet.Cell(1, 5).Value = "Data do Pedido";
                worksheet.Cell(1, 6).Value = "Valor Total Pedidos (R$)";
                worksheet.Cell(1, 7).Value = "Saldo Devedor (R$)";
                worksheet.Cell(1, 8).Value = "Status Pedido";
                worksheet.Cell(1, 9).Value = "Status Pagamento";

                // Preenchendo os dados
                int linha = 2;
                foreach (var produto in dados.Pedidos)
                {
                    var statusPedido = dados.StatusPedido.FirstOrDefault(x => x.Status_pedido_id == produto.Status_pedido_id) ?? new();
                    var statusPagamento = dados.StatusPagamento.FirstOrDefault(x => x.Status_pagamento_id == produto.Status_pagamento_id) ?? new();

                    worksheet.Cell(linha, 1).Value = produto.Pedido_id;
                    worksheet.Cell(linha, 2).Value = produto.NomeCliente;
                    worksheet.Cell(linha, 3).Value = produto.NomeVendedor;
                    worksheet.Cell(linha, 4).Value = produto.Localidade;
                    worksheet.Cell(linha, 5).Value = produto.Data_pedido;
                    worksheet.Cell(linha, 5).Style.DateFormat.Format = "dd/MM/yyyy hh:mm:ss";
                    worksheet.Cell(linha, 6).Value = produto.Valor_total;
                    worksheet.Cell(linha, 6).Style.NumberFormat.Format = "R$ #,##0.00";
                    worksheet.Cell(linha, 7).Value = produto.Saldo_devedor;
                    worksheet.Cell(linha, 7).Style.NumberFormat.Format = "R$ #,##0.00";
                    worksheet.Cell(linha, 8).Value = statusPedido.Nome;
                    worksheet.Cell(linha, 9).Value = statusPagamento.Nome;

                    linha++;
                }

                // Autoajuste das colunas
                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }

        private byte[] GetByteGestaoPedidos(string filtro, string dtInicio, string dtFim, UsuarioMap usuarioMap, int? nPedido, int? vendedor)
        {
            var dados = _servicePedidos.BuscarTodosPedidos(filtro, dtInicio, dtFim, usuarioMap, nPedido, vendedor);
            var cblc = "Numero Pedido;Nome Cliente;Nome Vendedor;Localidade;Data Do Pedid;Valor Total Pedidos(R$;Saldo Devedor(R$);Status Pedido;Status Pagameto";

            StringBuilder texto = new();
            texto.AppendLine(cblc);
            for (int i = 0; i < dados.Pedidos.Count; i++)
            {
                var produto = dados.Pedidos[i];
                var statusPedido = dados.StatusPedido.FirstOrDefault(x => x.Status_pedido_id == produto.Status_pedido_id) ?? new();
                var statusPagamento = dados.StatusPagamento.FirstOrDefault(x => x.Status_pagamento_id == produto.Status_pagamento_id) ?? new();

                texto.AppendLine($"{produto.Pedido_id};{produto.NomeCliente};{produto.NomeVendedor};{produto.Localidade};{produto.Data_pedido};{produto.Valor_total};{produto.Saldo_devedor};{statusPedido.Nome};{statusPagamento.Nome}");
            }

            byte[] fileBytes = Encoding.Latin1.GetBytes(texto.ToString());
            return fileBytes;
        }

    }
}
