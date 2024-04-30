import axios from 'axios';

const API_URL = 'https://localhost:7161/api';

export const GetCliente = async (clienteId) => {
  try {
    const response = await axios.get(`${API_URL}/Cliente/${clienteId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

export const GetAllCliente = async () => {
  try {
    const response = await axios.get(`${API_URL}/Cliente/clienteAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os clientes:', error);
    throw error;
  }
};

export const inserirCliente = async (cliente) => {
  try {
    const response = await axios.post(`${API_URL}/Cliente/InserirCliente`, cliente, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    throw error; 
  }
};

export const atualizarCliente = async (cliente) => {
  try {
    const response = await axios.put(`${API_URL}/Cliente/AtualizarCliente`, cliente, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro aoatualizar cliente:', error);
    throw error; 
  }
}

export const desativarCliente = async (clienteId) => {
  try {
    await axios.delete(`${API_URL}/Cliente/${clienteId}`, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
  } catch (error) {
    console.error('Erro ao desativar cliente:', error);
    throw error;
  }
};

export const getAllProdutos = async () => {
  try {
    const response = await axios.get(`${API_URL}/Produto/GetAllProdutos`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os produtos:', error);
    throw error;
  }
};

export const salvarPedido = async (pedido) => {
  try {
    const response = await axios.post(`${API_URL}/Pedido`, pedido, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar pedido:', error);
    throw error; 
  }
};

export const buscarPedidosPorCliente = async (clienteId) => {
  try {
    const response = await axios.get(`${API_URL}/Pedido/buscar-por-cliente?clienteId=${clienteId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const atualizarStatusPedido = async (pedido) => {
  try {
      const response = await axios.post(`${API_URL}/Pedido/AtualizarStatusPedido`, pedido, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error; 
  }
}

export const buscarClientesPorNome = async (nome) => {
  try {
    const response = await axios.get(`${API_URL}/Cliente/buscar-por-nome?nome=${nome}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const enviarPedido = async (pedidoDTO) => {
  try {
    const response = await axios.post(
      `${API_URL}/Pedido/enviarPedido`,
      pedidoDTO,
      {
        headers: {
          'Content-Type': 'application/json', 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar pedido:', error);
    throw error; 
  }
};

export const atualizarPedido = async (pedidoDTO) => {
  try {
    const response = await axios.post(
      `${API_URL}/Pedido/atualizarPedido`,
      pedidoDTO,
      {
        headers: {
          'Content-Type': 'application/json', 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar pedido:', error);
    throw error; 
  }
};

export const buscarProdutosDoPedido = async (pedidoId) => {
  try {
    const response = await axios.get(`${API_URL}/pedido/buscar-produtos/${pedidoId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarTodosStatusPedido = async () => {
  try {
    const response = await axios.get(`${API_URL}/pedido/buscar-todos-status-pedido/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarTodosStatusPagamento = async () => {
  try {
    const response = await axios.get(`${API_URL}/pedido/buscar-todos-status-pagamento/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};