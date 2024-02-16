// Importaciones de React y elementos de React Native.
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

// Obtener las dimensiones de la ventana del dispositivo.
const windowHeigh = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// Componente funcional HomeScreen.
export default function HomeScreen() {
  // Estados del componente.
  // data: Almacena datos de usuarios.
  const [data, setData] = useState([]);
  // seriesData: Almacena datos generales de las series.
  const [seriesData, setSeriesData] = useState([]);
  // serieDetalle: Almacena detalles específicos de una serie seleccionada.
  const [serieDetalle, setSerieDetalle] = useState([]);
  
  // useEffect se ejecuta después de la renderización del componente.
  useEffect(() => {
    // Llamada a la API local para obtener datos de usuarios de la base de datos del servidor
    fetch('http://10.0.0.36:3000/usuario_grupo')
    .then((response) => response.json())
    .then((json) => setData(json))
    .catch((error) => console.error(error));
  
    // Llamada a la API de TMDb para obtener información de una serie específica.
    const serie_a_buscar = 'Masters of the air';
    let apiSeries = `https://api.themoviedb.org/3/search/tv?api_key=c51082efa7d62553e4c05812ebf6040e&language=es-ES&page=1&query=${serie_a_buscar}&include_adult=false`;
  
    fetch(apiSeries)
      .then(response => response.json())
      .then(data => {
        const serieId = data.results[0].id;

        // Obteniendo los detalles completos de la serie usando su ID.
        const apiSerieDetalle = `https://api.themoviedb.org/3/tv/${serieId}?api_key=c51082efa7d62553e4c05812ebf6040e&language=es-ES`;
        return fetch(apiSerieDetalle);
      })
      .then(response => response.json())
      .then(serieDetalle => {
        // Almacenando los detalles de la serie en el estado serieDetalle.
        setSerieDetalle(serieDetalle);
      })
      .catch(error => console.error('Error:', error));
  }, []); // El array vacío asegura que useEffect se ejecute solo una vez después del montaje inicial.



  // Renderizado del componente.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos los items de la tabla Usuarios:</Text>
      
      {/* Renderizado de la información de usuarios. */}
      {data.map((item) => (
        <Text key={item.Id}>{item.Nombre}</Text>
      ))}
      {data.map((item) => (
        <Text key={item.Id}>Usuario: {item.Usuario}, Contraseña: {item.Contraseña} de todos</Text>
      ))}

      {/* Renderizado de los detalles de la serie. */}
      {serieDetalle.name && (
        <View style={styles.serieDetailContainer}>
          <Text style={styles.serieTitle}>Titulo: {serieDetalle.name}</Text>
          <Text style={styles.serieOverview}>Descripcion: {serieDetalle.overview}</Text>
          {/* Renderizado de los detalles de cada temporada. */}
          {serieDetalle.seasons && serieDetalle.seasons.map((season) => (
            <Text key={season.id}>
              Temporada {season.season_number}: {season.episode_count} episodios
            </Text>
          ))}
          <Text style={styles.serieOverview}>Status: {serieDetalle.status}</Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    //backgroundColor: '#f7f7f7', // Un fondo claro para la accesibilidad
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222', // Un color oscuro para el título para contraste
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd', // Un color más suave para el borde
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff', // Fondo blanco para los campos de entrada
  },
  button:{
    display: 'flex', // 'display: flex' es el valor predeterminado en React Native, así que no es necesario.
    width: '80%', // En React Native usamos unidades sin 'px'.
    height: '5%',
    justifyContent: 'center', // En React Native usamos camelCase en lugar de guiones.
    alignItems: 'center',
    flexShrink: 0, // Esta propiedad funciona igual que en CSS.
    backgroundColor: '#005f99', // Ejemplo de color azul, ya que no especificaste un color.
    borderRadius: 10, // Si quieres mantener los bordes redondeados como en tu estilo original.
    margin: 10, // Para dar un poco de padding vertical si es necesario.
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
    flexShrink: 0, // Esta propiedad funciona igual que en CSS.
    borderRadius: 10, // Si quieres mantener los bordes redondeados como en tu estilo original.
    margin: 10, // Para dar un poco de padding vertical si es necesario.
  },
  buttonOutlineText: {
    color: '#005f99',
  },
  text:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black'
  },
  logo: {
    marginTop: '-20%',
    width: windowWidth * 0.6,
    height: windowWidth * 0.6 * (windowWidth  / windowWidth),
  },
});


