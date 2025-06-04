import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import { FaReceipt } from 'react-icons/fa';

const TicketVenta = ({ venta, show, onHide }) => {
    if (!venta) return null;

    const fecha = new Date(venta.fechaVenta).toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <Modal show={show} onHide={onHide} size="sm">
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="w-100 text-center">
                    <FaReceipt className="me-2" />
                    Ticket de Venta
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-white">
                <div className="ticket-container" style={{ fontFamily: 'monospace' }}>
                    {/* Encabezado */}
                    <div className="text-center mb-3">
                        <h5 className="mb-1">Panadero Digital</h5>
                        <small className="d-block">NIT: XXX-XXX-XXX</small>
                        <small className="d-block">Tel: (XX) XXXX-XXXX</small>
                        <small className="d-block">Dirección: XXXXX</small>
                        <hr />
                    </div>

                    {/* Información de la venta */}
                    <div className="mb-3">
                        <small className="d-block">Fecha: {fecha}</small>
                        <small className="d-block">Vendedor: {venta.nombresVendedor}</small>
                        <small className="d-block">Ticket #: {venta.idVenta?.substring(0, 8)}</small>
                    </div>

                    {/* Productos */}
                    <div className="mb-3">
                        <Table size="sm" borderless className="ticket-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-end">Cant.</th>
                                    <th className="text-end">Precio</th>
                                    <th className="text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {venta.productos.map((producto, idx) => (
                                    <tr key={idx}>
                                        <td>{producto.nombre}</td>
                                        <td className="text-end">{producto.cantidad}</td>
                                        <td className="text-end">
                                            ${producto.precioUnitario.toLocaleString('es-CO')}
                                        </td>
                                        <td className="text-end">
                                            ${producto.subtotal.toLocaleString('es-CO')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Total */}
                    <div className="text-end mb-3">
                        <hr />
                        <h5>Total: ${venta.montoTotal.toLocaleString('es-CO')}</h5>
                    </div>

                    {/* Pie de página */}
                    <div className="text-center mt-4">
                        <small className="d-block">¡Gracias por su compra!</small>
                        <small className="d-block">Vuelva pronto</small>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default TicketVenta; 