import api from 'api';

export const buscarClientes = async (query, dtInicio, dtFim) => {
    try {
        api.get(`api/Cliente/BuscarClientes?q=${query ? query : ""}&dtInicio=${dtInicio ? dtInicio : ""}&dtFim=${dtFim ? dtFim : ""}`, res => {
            return res.data;
        });
    } catch (error) {
        throw error;
    }
};