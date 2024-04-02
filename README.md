
# FAMILY SERIES TRACK

## Descripción
FamilySeriesTrack es una aplicación desarrollada para el seguimiento de series. Esta aplicación permite a los usuarios llevar un registro de las series que están viendo, las que han completado, y descubrir nuevas series para ver.

## Estructura de Directorios
- `assets`: Archivos estáticos como imágenes, fuentes, etc., utilizados en la aplicación.
- `Pantallas`: Este directorio contiene las diferentes pantallas de la aplicación, implementadas como archivos JavaScript:
  - `AnadirGrupo.js`: Pantalla para añadir nuevos grupos.
  - `Calendario.js`: Pantalla de calendario para mostrar los episodios programados de series de televisión.
  - `EditarGrupo.js`: Pantalla para editar detalles de grupos.
  - `HomeScreen.js`: La pantalla principal de la aplicación.
  - `LogInScreen.js`: Pantalla para el inicio de sesión de usuarios.
  - `PantallaDetalles.js`: Pantalla con detalles para visualizar información de series de televisión o episodios.
  - `Settings.js`: Pantalla de ajustes para la aplicación.
  - `SignUp.js`: Pantalla para el registro de nuevos usuarios.
  - `TemporadaDetalle.js`: Pantalla que muestra detalles de una temporada específica de una serie.
  - `WelcomeScreen.js`: Pantalla de bienvenida para usuarios nuevos o que regresan.
- `.gitignore`: Especifica archivos que Git ignorará intencionadamente.
- `App.js`: Punto de entrada principal de la aplicación.
- `app.json`: Archivo de configuración de la aplicación.
- `babel.config.js`: Archivo de configuración para Babel, un compilador de JavaScript.
- `eas.json`: Archivo de configuración para los Servicios de Aplicaciones de Expo.
- `estilosGlobales.js`: Contiene estilos globales para la aplicación.
- `index.js`: Otro posible punto de entrada o archivo del componente raíz.
- `metro.config.js`: Configuración para Metro, el empaquetador de JavaScript para React Native.
- `package-lock.json`: Archivo generado automáticamente para cualquier operación donde NPM modifica el árbol de node_modules o el package.json.
- `package.json`: Lista todas las dependencias y scripts disponibles para el proyecto.
- `README.md`: Este archivo, que incluye instrucciones y detalles sobre el proyecto.
- `userContext.js`: Presumiblemente un archivo de contexto para manejar el estado del usuario en la aplicación.

## Configuración y Uso

Para ejecutar este proyecto localmente, sigue estos pasos:

1. Clona este repositorio.
2. Instala [Node.js](https://nodejs.org/).
3. Instala Expo CLI globalmente con `npm install -g expo-cli`.
4. Navega al directorio del proyecto y ejecuta `npm install` para instalar las dependencias.
5. Inicia el servidor de desarrollo con `npx expo start`



