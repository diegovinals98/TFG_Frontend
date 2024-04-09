// globalStyles.js
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f7f7f7', // Un fondo claro para la accesibilidad
        //backgroundColor:'#ffffff'
        
      },
      
      button: {
        display: 'flex', // 'display: flex' es el valor predeterminado en React Native, así que no es necesario.
        width: '80%', // En React Native usamos unidades sin 'px'.
        height: '5%',
        justifyContent: 'center', // En React Native usamos camelCase en lugar de guiones.
        alignItems: 'center',
        backgroundColor: '#005f99', // Ejemplo de color azul, ya que no especificaste un color.
        borderRadius: 10, // Si quieres mantener los bordes redondeados como en tu estilo original.
        margin: '2%', // Para dar un poco de padding vertical si es necesario.
      },
      buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#005f99',
        display: 'flex', // 'display: flex' es el valor predeterminado en React Native, así que no es necesario.
        width: '80%', // En React Native usamos unidades sin 'px'.
        height: '5%',
        justifyContent: 'center', // En React Native usamos camelCase en lugar de guiones.
        alignItems: 'center',
        
        borderRadius: 10, // Si quieres mantener los bordes redondeados como en tu estilo original.
        margin: '2%', // Para dar un poco de padding vertical si es necesario.
      },
      buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black'
      },
  // más estilos comunes
});
