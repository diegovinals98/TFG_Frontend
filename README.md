
# FAMILY SERIES TRACK

## Descripción
TFGSERIES Tracker es una aplicación desarrollada para el seguimiento de series. Esta aplicación permite a los usuarios llevar un registro de las series que están viendo, las que han completado, y descubrir nuevas series para ver.

## Estructura del Proyecto

- `.expo`: Configuraciones específicas de Expo.
- `.vscode`: Configuraciones para el editor de código VSCode.
- `android`: Código fuente nativo para la plataforma Android.
- `assets`: Recursos estáticos como imágenes, fuentes, etc.
- `data`: Scripts o datos que la aplicación puede utilizar.
- `docker`: Archivos relacionados con Docker, incluyendo `Dockerfile` y `docker-compose.yml`.
- `ios`: Código fuente nativo para la plataforma iOS.
- `node_modules`: Módulos de Node.js instalados.
- `Pantallas`: Componentes de React Native que representan las pantallas de la aplicación.
- `App.js`: Punto de entrada principal de la aplicación React Native.
- `app.json`: Configuración de Expo y metadatos de la aplicación.
- `babel.config.js`: Configuraciones para Babel.
- `backend.js`: Lógica de backend de la aplicación.
- `eas.json`: Configuración para EAS Build, el servicio de compilación de Expo.
- `estilosGlobales.js`: Estilos globales utilizados en toda la aplicación.
- `index.js`: Archivo de arranque para el paquete.
- `package-lock.json`: Versión bloqueada de las dependencias para garantizar la consistencia entre instalaciones.
- `package.json`: Define las dependencias y scripts de la aplicación.
- `userContext.js`: Contexto de React para manejar el estado del usuario a través de la aplicación.

## Configuración

Para ejecutar este proyecto localmente, sigue estos pasos:

1. Clona este repositorio.
2. Instala [Node.js](https://nodejs.org/).
3. Instala Expo CLI globalmente con `npm install -g expo-cli`.
4. Navega al directorio del proyecto y ejecuta `npm install` para instalar las dependencias.
5. Inicia el servidor de desarrollo con `expo start`.
6. Asegura en backend.js y el resto de archivos que la ip coincide on tu ip local.
7. Iniciar el backend con `node backend.js`

## Uso de Docker

Para usar Docker en el desarrollo:

1. Asegúrate de tener [Docker](https://www.docker.com/) instalado.
2. Ejecuta `docker-compose up` para construir y ejecutar el contenedor.
3. Usuario = root


