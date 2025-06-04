import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Tab, Table, Card, Row, Col, Button } from 'react-bootstrap';
import { FaChartLine, FaChartBar, FaBoxes } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportesVentas = ({ show, onHide }) => {
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mensual');

    useEffect(() => {
        if (show) {
            cargarDatos();
        }
    }, [show]);

    const cargarDatos = async () => {
        try {
            // Cargar ventas
            const responseVentas = await fetch('http://localhost:8080/api/ventas/list');
            const dataVentas = await responseVentas.json();
            setVentas(dataVentas);

            // Cargar productos
            const responseProductos = await fetch('http://localhost:8080/api/productos/list');
            const dataProductos = await responseProductos.json();
            setProductos(dataProductos);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

    // Procesar datos para el reporte de ingresos
    const procesarIngresosPorPeriodo = () => {
        const ventasOrdenadas = [...ventas].sort((a, b) => 
            new Date(a.fechaVenta) - new Date(b.fechaVenta)
        );

        const ingresosPorPeriodo = {};
        
        ventasOrdenadas.forEach(venta => {
            const fecha = new Date(venta.fechaVenta);
            let key;

            if (periodoSeleccionado === 'diario') {
                key = fecha.toISOString().split('T')[0];
            } else if (periodoSeleccionado === 'semanal') {
                const primerDiaSemana = new Date(fecha);
                primerDiaSemana.setDate(fecha.getDate() - fecha.getDay());
                key = primerDiaSemana.toISOString().split('T')[0];
            } else { // mensual
                key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            }

            ingresosPorPeriodo[key] = (ingresosPorPeriodo[key] || 0) + venta.montoTotal;
        });

        return {
            labels: Object.keys(ingresosPorPeriodo),
            data: Object.values(ingresosPorPeriodo)
        };
    };

    // Procesar datos para productos más vendidos
    const procesarProductosMasVendidos = () => {
        const ventasPorProducto = {};

        ventas.forEach(venta => {
            venta.productos.forEach(producto => {
                if (!ventasPorProducto[producto.productoId]) {
                    ventasPorProducto[producto.productoId] = {
                        nombre: producto.nombre,
                        cantidad: 0,
                        total: 0
                    };
                }
                ventasPorProducto[producto.productoId].cantidad += producto.cantidad;
                ventasPorProducto[producto.productoId].total += producto.subtotal;
            });
        });

        return Object.values(ventasPorProducto)
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5); // Top 5 productos
    };

    // Procesar datos para el inventario
    const procesarDatosInventario = () => {
        // Clasificar productos por nivel de stock
        const clasificacion = {
            critico: productos.filter(p => p.stock <= 5).length,
            bajo: productos.filter(p => p.stock > 5 && p.stock <= 10).length,
            normal: productos.filter(p => p.stock > 10).length
        };

        return {
            labels: ['Stock Crítico (≤5)', 'Stock Bajo (6-10)', 'Stock Normal (>10)'],
            data: [clasificacion.critico, clasificacion.bajo, clasificacion.normal],
            colores: ['#dc3545', '#ffc107', '#198754']
        };
    };

    const datosIngresos = procesarIngresosPorPeriodo();
    const datosProductos = procesarProductosMasVendidos();
    const datosInventario = procesarDatosInventario();

    const datosGraficoIngresos = {
        labels: datosIngresos.labels,
        datasets: [{
            label: 'Ingresos',
            data: datosIngresos.data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const datosGraficoProductos = {
        labels: datosProductos.map(p => p.nombre),
        datasets: [{
            label: 'Cantidad Vendida',
            data: datosProductos.map(p => p.cantidad),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
        }]
    };

    const datosGraficoInventario = {
        labels: datosInventario.labels,
        datasets: [{
            data: datosInventario.data,
            backgroundColor: datosInventario.colores,
            borderWidth: 1
        }]
    };

    return (
        <Modal show={show} onHide={onHide} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Reportes de Ventas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="ingresos" className="mb-4">
                    {/* Tab de Ingresos */}
                    <Tab eventKey="ingresos" title={<span><FaChartLine className="me-2" />Ingresos</span>}>
                        <Card className="mb-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="btn-group">
                                        <Button
                                            variant={periodoSeleccionado === 'diario' ? 'primary' : 'outline-primary'}
                                            onClick={() => setPeriodoSeleccionado('diario')}
                                        >
                                            Diario
                                        </Button>
                                        <Button
                                            variant={periodoSeleccionado === 'semanal' ? 'primary' : 'outline-primary'}
                                            onClick={() => setPeriodoSeleccionado('semanal')}
                                        >
                                            Semanal
                                        </Button>
                                        <Button
                                            variant={periodoSeleccionado === 'mensual' ? 'primary' : 'outline-primary'}
                                            onClick={() => setPeriodoSeleccionado('mensual')}
                                        >
                                            Mensual
                                        </Button>
                                    </div>
                                </div>
                                <Line data={datosGraficoIngresos} options={{ 
                                    responsive: true,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: function(value) {
                                                    return '$' + value.toLocaleString('es-CO');
                                                }
                                            }
                                        }
                                    }
                                }} />
                            </Card.Body>
                        </Card>
                    </Tab>

                    {/* Tab de Productos Más Vendidos */}
                    <Tab eventKey="productos" title={<span><FaChartBar className="me-2" />Productos Más Vendidos</span>}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Bar data={datosGraficoProductos} options={{ 
                                            responsive: true,
                                            scales: {
                                                y: {
                                                    beginAtZero: true
                                                }
                                            }
                                        }} />
                                    </Col>
                                    <Col md={6}>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Cantidad Vendida</th>
                                                    <th>Total Ventas</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {datosProductos.map((producto, idx) => (
                                                    <tr key={idx}>
                                                        <td>{producto.nombre}</td>
                                                        <td>{producto.cantidad}</td>
                                                        <td>${producto.total.toLocaleString('es-CO')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Tab>

                    {/* Tab de Inventario */}
                    <Tab eventKey="inventario" title={<span><FaBoxes className="me-2" />Niveles de Inventario</span>}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <div className="text-center mb-4">
                                            <h5>Distribución del Inventario</h5>
                                            <Doughnut 
                                                data={datosGraficoInventario}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'bottom'
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Stock Actual</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productos.map((producto, idx) => (
                                                    <tr key={idx}>
                                                        <td>{producto.nombre}</td>
                                                        <td>{producto.stock}</td>
                                                        <td>
                                                            <span className={`badge bg-${
                                                                producto.stock <= 5 ? 'danger' : 
                                                                producto.stock <= 10 ? 'warning' : 
                                                                'success'
                                                            }`}>
                                                                {producto.stock <= 5 ? 'Crítico' : 
                                                                 producto.stock <= 10 ? 'Bajo' : 
                                                                 'Normal'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
};

export default ReportesVentas; 