import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { api } from '../../../components/api/api';

function ModalEditarStatusPedido({ pedido, statusPedido, onHide, onEdit, onReload }) {
    const [novoStatus, setNovoStatus] = useState('');
    const [progresso, setProgresso] = useState(0);

    useEffect(() => {
        setProgresso(0);
    }, [pedido]);

    const handleEditarStatus = async () => {
        if (novoStatus) {
            const data = new FormData();
            const obj = JSON.stringify({
                PedidoId: pedido.pedido_id,
                StatusPedidoId: novoStatus
            });
            data.append("obj", obj);

            try {
                await api.post('/api/pedidos/AtualizarStatusPedido', data, {
                    onUploadProgress: progressEvent => {
                        const progressoAtual = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgresso(progressoAtual);
                    }
                });
                alert('Status do pedido atualizado com sucesso!');
                if (onReload) {
                    onReload();
                }
            } catch (error) {
                alert('Erro ao alterar Status do Pedido:', error);
            }

            onEdit(pedido.pedido_id, novoStatus);
            onHide();
        } else {
            alert('Por favor, selecione um novo status para o pedido.');
        }
    };

    const handleStatusChange = (e) => {
        setNovoStatus(e.target.value);
        setProgresso(0); // Reseta o progresso ao selecionar um novo status
    };

    return (
        <Modal show={true} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title><FaEdit /> Editar Status do Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formStatus">
                        <Form.Label>Novo Status do Pedido</Form.Label>
                        <Form.Control as="select" value={novoStatus} onChange={handleStatusChange}>
                            <option value="">Selecione...</option>
                            {statusPedido.map((status) => (
                                <option key={status.status_pedido_id} value={status.status_pedido_id}>{status.nome}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {progresso > 0 && <ProgressBar now={progresso} label={`${progresso}%`} />}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="primary" onClick={handleEditarStatus}>Salvar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEditarStatusPedido;
