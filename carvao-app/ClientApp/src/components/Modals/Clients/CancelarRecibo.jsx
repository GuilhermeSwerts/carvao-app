import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { api } from '../../../components/api/api';
import { Alert } from '../../../util/Alertas';

function CancelarReciboModal({ show, onHide, onCancelRecibo, recibo, onReload }) {
    const [justificativa, setJustificativa] = useState('');


    const handleCancelarClick = () => {
        if (!justificativa.trim()) {
            Alert('A justificativa para o cancelamento é obrigatória.', false, true);
            return;
        }
        const form = new FormData();
        const data = {
            id: recibo.recibo_id, justificativa: justificativa
        }

        form.append("data", JSON.stringify(data))


        console.log(recibo);

        api.post('/api/Recibo/CancelarReciboPorId', form, res => {
            Alert('Recibo cancelado com sucesso');
            onReload();
        }, error => {
            Alert('Erro ao cancelar recibo: ' + error.response.data ? error.response.data : error.message, false);
        })
        onCancelRecibo(justificativa);

    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Cancelar Recibo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Justificativa para cancelamento:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows="3"
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Fechar</Button>
                <Button variant="danger" onClick={handleCancelarClick}>Confirmar Cancelamento</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CancelarReciboModal;
