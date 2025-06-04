# Panadero Digital 🥖

## Descripción
Panadero Digital es un sistema integral de gestión para panaderías que permite administrar ventas, inventario, productos, insumos y usuarios. El sistema está construido con una arquitectura moderna fullstack utilizando Spring Boot para el backend y React para el frontend.

## Características Principales 🌟
- Gestión de ventas con generación de tickets
- Control de inventario y alertas de stock
- Administración de productos e insumos
- Sistema de usuarios con roles y autenticación
- Reportes y estadísticas de ventas
- Dashboard interactivo
- Gestión de pedidos

## Tecnologías Utilizadas 🛠️

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- Maven

### Frontend
- React.js
- React Bootstrap
- Chart.js
- React Icons
- Axios para peticiones HTTP

## Estructura del Proyecto 📁

### Backend (`src/`)
```
src/main/java/com/example/panaderodigitalback/
├── controlador/     # Controladores REST
├── servicio/        # Lógica de negocio
├── modelo/          # Entidades JPA
├── repositorio/     # Interfaces de acceso a datos
├── security/        # Configuración de seguridad
├── dto/             # Objetos de transferencia de datos
└── auth/            # Autenticación y autorización
```

### Frontend (`vista/`)
```
vista/src/
├── components/
│   ├── Dashboard.js         # Panel principal
│   ├── Login.js            # Autenticación de usuarios
│   ├── ProductosCRUD.js    # Gestión de productos
│   ├── InsumosCRUD.js      # Gestión de insumos
│   ├── VentasCRUD.js       # Gestión de ventas
│   ├── TicketVenta.js      # Generación de tickets
│   ├── PedidosCRUD.js      # Gestión de pedidos
│   ├── UsuariosCRUD.js     # Gestión de usuarios
│   ├── ReportesVentas.js   # Reportes y estadísticas
│   └── Inventario.js       # Control de inventario
```

## Instalación y Configuración 🚀

### Requisitos Previos
- Java 17 o superior
- Node.js 14 o superior
- MySQL 8.0 o superior
- Maven 3.6 o superior

### Configuración del Backend
1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Configurar la base de datos en `application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/panadero_digital
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

3. Ejecutar el backend
```bash
mvn spring-boot:run
```

### Configuración del Frontend
1. Navegar al directorio del frontend
```bash
cd vista
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar la aplicación
```bash
npm start
```

## Uso del Sistema 💻

### Acceso al Sistema
1. Acceder a `http://localhost:3000`
2. Iniciar sesión con las credenciales proporcionadas

### Funcionalidades Principales
- **Ventas**: Registro y gestión de ventas con generación automática de tickets
- **Inventario**: Control de stock de productos e insumos con alertas de nivel bajo
- **Reportes**: Visualización de estadísticas de ventas, productos más vendidos y estado del inventario
- **Usuarios**: Administración de usuarios y roles del sistema

---
Desarrollado con ❤️ por Jhon Anderson Vargas y Julian David Perez para la asignatura de Ingenieria De Software I 
