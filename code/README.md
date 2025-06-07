# API de Autenticación y Gestión de Usuarios

Esta es una API RESTful desarrollada con FastAPI que proporciona funcionalidades de autenticación JWT y gestión de usuarios con roles.

## Características

- Autenticación mediante tokens JWT
- Gestión de usuarios con diferentes roles (admin, user, guest)
- Documentación interactiva con Swagger UI
- Endpoint de salud para monitoreo
- Estructura de proyecto en capas (arquitectura limpia)
- Tests unitarios y de integración

## Estructura del Proyecto

```
code/
├── app/
│   ├── api/
│   │   ├── api_v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   └── users.py
│   │   │   └── api.py
│   │   └── deps.py
│   ├── core/
│   │   └── config.py
│   ├── db/
│   │   ├── init_db.py
│   │   └── session.py
│   ├── models/
│   │   ├── base.py
│   │   └── user.py
│   ├── schemas/
│   │   └── user.py
│   ├── services/
│   │   ├── auth.py
│   │   └── user.py
│   └── utils/
├── tests/
│   ├── conftest.py
│   ├── test_api.py
│   ├── test_auth_service.py
│   └── test_user_service.py
├── .env
├── main.py
├── requirements.txt
└── run.py
```

## Instalación y Configuración

1. Clonar el repositorio
2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno (o usar el archivo `.env` incluido)
4. Ejecutar la aplicación:

```bash
python run.py
```

## Endpoints API

### Autenticación

- `POST /api/v1/auth/login` - Iniciar sesión y obtener token JWT

### Usuarios

- `POST /api/v1/users/register` - Registro público de usuarios
- `GET /api/v1/users/` - Listar todos los usuarios (admin)
- `POST /api/v1/users/` - Crear un nuevo usuario (admin)
- `GET /api/v1/users/me` - Obtener información del usuario actual
- `PUT /api/v1/users/me` - Actualizar información del usuario actual
- `GET /api/v1/users/{user_id}` - Obtener un usuario por ID
- `PUT /api/v1/users/{user_id}` - Actualizar un usuario (admin)
- `DELETE /api/v1/users/{user_id}` - Eliminar un usuario (admin)

### Otros

- `GET /health` - Verificar el estado de la API

## Documentación

La documentación interactiva está disponible en:

- Swagger UI: `/docs`
- ReDoc: `/redoc`

## Tests

Para ejecutar los tests:

```bash
pytest
```
