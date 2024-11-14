# Gestor de Tareas

## Descripción

Esta es una aplicación de gestión de tareas creada con **Angular 18** y **Angular Material**. Permite crear, editar y eliminar tareas, así como visualizar el estado de cada tarea (Pendiente, En Progreso, En pruebas, Completada). La API se simula utilizando **json-server** para simular el backend.



## Características

- **Visualización de tareas**: Listado de tareas con su estado y detalles.
- **Edición de tareas**: Permite modificar los detalles de las tareas existentes.
- **Creación de tareas**: Formulario para agregar nuevas tareas.
- **Interfaz atractiva**: Uso de Angular Material para una UI moderna.



## Requisitos previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu entorno de desarrollo:

- **Node.js**: [Descargar e instalar Node.js](https://nodejs.org/)
- **npm**: Node Package Manager, que se instala automáticamente con Node.js.

Para comprobar si tienes `node` y `npm` instalados, puedes ejecutar los siguientes comandos en tu terminal:

```bash
node -v
npm -v
```

- La versión de **node.js** deben de ser superior a la **18.13.0** para ser compatible con Angular 18.


## Clonación del proyecto

1. Clona el repositorio en tu máquina local.
2. Accede al directorio del proyecto.


## Instalación

Una vez clonado el repositorio, necesitas instalar las dependencias necesarias utilizando npm. Para ello, ejecuta el siguiente comando dentro del directorio del proyecto:

```
npm install
```

Esto instalará todas las dependencias definidas en el archivo `package.json`.


## Ejecución del proyecto

Para ejecutar el proyecto:

1. Inicia json-server para el backend:

```
npm run json-server
```

2. En una nueva terminal, inicia la aplicación Angular:

```
npm start
```

La aplicación estará disponible en `http://localhost:4200`.


