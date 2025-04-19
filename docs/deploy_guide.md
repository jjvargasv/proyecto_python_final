# Guía Rápida de Despliegue

Esta guía te ayudará a desplegar el proyecto **ecommerce-react-django** en un entorno local.

## 1. Requisitos
- Python 3.9+ y pip
- Node.js 16+ y npm
- PostgreSQL o SQLite (por defecto)

## 2. Instalación Backend (Django)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Opcional, para admin
python manage.py runserver
```

## 3. Instalación Frontend (React)
```bash
cd ../frontend
npm install
npm start
```

## 4. Acceso
- Backend API: http://localhost:8000/api/
- Frontend: http://localhost:3000/
- Admin Django: http://localhost:8000/admin/

## 5. Variables de entorno
- Configura las variables en `.env` si es necesario (por ejemplo, para la base de datos o JWT).

---

**¡Listo! Tu proyecto debería estar corriendo en local.**

Para producción, consulta la documentación oficial de Django y React para despliegue en servidores o servicios cloud.
