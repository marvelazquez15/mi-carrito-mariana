# Carrito

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

# Sistema de Carrito de Compras - Angular 2026

¡Bienvenido al proyecto de Carrito de Compras! Esta es una aplicación web moderna (SPA) desarrollada con Angular para simular un flujo completo de e-commerce: catálogo de productos, autenticación de usuarios, gestión de un carrito local y administración de pedidos en tiempo real conectados a una API.

## Enlace del Proyecto en Vivo
Puedes interactuar con la aplicación completamente desplegada en internet haciendo clic aquí:
[Visitar Carrito de Compras en Vivo](https://marvelazquez15.github.io/mi-carrito-mariana/)

---

## Credenciales de Acceso (Prueba para Cliente)
Utiliza los siguientes datos en la pantalla de **Login**:

* **Usuario:** `mariana`
* **Contraseña:** `123123@@`

---

## Credenciales de Acceso (Prueba para Gerente)
Utiliza los siguientes datos en la pantalla de **Login**:

* **Usuario:** `gerente`
* **Contraseña:** `123123@@`

---

## Guía de botones
La interfaz se divide en las siguientes pantallas y funciones clave:

### 1. Botones Superiores
* **Botón Login:** Abre el formulario de inicio de sesión. 
* *Nota: Al iniciar sesión con las credenciales, aparecen automáticamente los botones de **Tienda**, **Mi carrito**, **Mis pedidos** y **Logout**.*

* **Botón Tienda:** Te lleva al catálogo público de productos.
* **Botón Mi Carrito:** Te lleva a la lista de productos que agregaste a tu carrito. 
* Muestra el desglose de los artículos añadidos, permitiendo aumentar o disminuir cantidades directamente con los botones `+` y `-`.
* Calcula de manera automática los subtotales y el precio total de la compra antes de procesar el pedido.
* **Botón Mis pedidos:** Te lleva a la lista de productos que finalizaste la compra.
* Renderiza una tabla limpia que consume los datos guardados en el servidor, mostrando el número de orden, fecha y el estado de las compras completadas.

### 4. Productos

* **Botón Nuevo Producto:** Abre un formulario en modalidad de ventana emergente para dar de alta un nuevo artículo especificando nombre, precio, stock y categoría.
* **Botón Editar:** Permite modificar los datos de un producto existente.
* **Botón Eliminar:** Remueve el artículo seleccionado de la lista actual.

* *Nota: Estos botones solo aparecen al iniciar sesion con las credenciales del gerente. Si ingresa a un boton de los superiores y quiere regresar de nuevo a la lista de productos solo ingrese o cambie al final de la URL /productos*

---

## Servidor de Desarrollo
Si clona el repositorio, también se podrá ingresar a la página web local de la siguiente manera:

1. Abra la terminal y asegúrese de ingresar a la carpeta donde se encuentra guardado el proyecto.
2. Ejecute el siguiente comando para arrancar el servidor local:
```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abra su navegador y acceda a http://localhost:4200/. La aplicación se recargará automáticamente cada vez que modifique alguno de los archivos fuente.

## Recursos Adicionales

Para obtener más información sobre el uso de Angular CLI, incluidas referencias detalladas de comandos, visite la página  [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
