-- Estructura de la base de datos Django generada (extracto relevante)
-- Usa `python manage.py inspectdb` para obtener el SQL completo según tu motor de BD

CREATE TABLE "auth_user" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" varchar(128) NOT NULL,
    "last_login" datetime NULL,
    "is_superuser" bool NOT NULL,
    "username" varchar(150) NOT NULL UNIQUE,
    "first_name" varchar(150) NOT NULL,
    "last_name" varchar(150) NOT NULL,
    "email" varchar(254) NOT NULL,
    "is_staff" bool NOT NULL,
    "is_active" bool NOT NULL,
    "date_joined" datetime NOT NULL
);

CREATE TABLE "users_profile" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL UNIQUE REFERENCES "auth_user" ("id"),
    "nombre_completo" varchar(255) NOT NULL,
    "telefono" varchar(20) NOT NULL,
    "direccion" varchar(255) NOT NULL,
    "metodo_pago" varchar(50) NOT NULL
);

CREATE TABLE "products_product" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" varchar(255) NOT NULL,
    "description" text NOT NULL,
    "price" decimal(10,2) NOT NULL,
    "stock" integer NOT NULL,
    "category_id" integer REFERENCES "products_category" ("id"),
    "featured" bool NOT NULL
);

CREATE TABLE "orders_order" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL REFERENCES "auth_user" ("id"),
    "created_at" datetime NOT NULL,
    "updated_at" datetime NOT NULL,
    "status" varchar(20) NOT NULL,
    "total" decimal(10,2) NOT NULL
);

CREATE TABLE "orders_orderitem" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" integer NOT NULL REFERENCES "orders_order" ("id"),
    "product_id" integer NOT NULL REFERENCES "products_product" ("id"),
    "quantity" integer NOT NULL,
    "price" decimal(10,2) NOT NULL
);

-- Hay más tablas para imágenes, reseñas, boletines, etc. según tus apps.
-- Consulta el modelo y migrations para detalles exactos de cada campo y relación.
