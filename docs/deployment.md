# Guía de Despliegue

## Requisitos
- Python 3.10+
- Node.js 18+
- PostgreSQL

## Pasos para desplegar

1. Clona el repositorio.
2. Configura el backend:
   - Crea y activa un entorno virtual.
   - Instala dependencias: `pip install -r requirements.txt`
   - Configura la base de datos en `backend/settings.py`.
   - Ejecuta migraciones: `python manage.py migrate`
   - Inicia el servidor: `python manage.py runserver`
3. Configura el frontend:
   - Ve a la carpeta `frontend`.
   - Instala dependencias: `npm install`
   - Ejecuta: `npm start`

## Notas
- El API estará en `/api/` y la documentación en `/api/docs/`.
- El frontend estará en `http://localhost:3000`.
