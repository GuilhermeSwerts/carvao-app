import Api from './api'; // Importe a classe Api corretamente

const api = new Api(); // Crie uma instância da classe Api

export const buscarClientes = async (query, dtInicio, dtFim) => {
    
    try {
        const response = await api.getSync(`api/Cliente/BuscarClientes`, {
            params: {
                q: query || "",
                dtInicio: dtInicio || "",
                dtFim: dtFim || ""
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
