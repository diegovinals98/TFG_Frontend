import { View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  button,
  Dimensions
} from 'react-native';

// Importaciones de React y elementos de React Native.
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../estilosGlobales.js';
const windowHeigh = Dimensions.get('window').height;
import { useUser } from '../userContext.js'; // Importa el hook useUser
import { StatusBar } from 'expo-status-bar';




const HomeScreen = () => {
  

  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useUser(); // Accede a los datos del usuario y la función para actualizarlos
  const iniciales = user?.nombre ? `${user?.nombre.charAt(0)}${user?.apellidos.charAt(0)}` : '';
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


  const handleSettings = () => {
    navigation.navigate('Settings');
  }
  
  return (
    
    <View style={[globalStyles.container, styles.container]}>
      <StatusBar/>

      <View style={styles.row}>
    <TouchableOpacity style={styles.circle} onPress={() => handleSettings()}>
      <Text style={styles.initials}>{iniciales}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.buttonGroup} onPress={() => { /* Tu lógica de manejo de grupos aquí */ }}>
      <Text style={styles.buttonText}>GRUPOS</Text>
      <Text style={styles.dropdownIcon}>▼</Text>
    </TouchableOpacity>
    </View>
      
      <Text>Bienvenido, {user?.nombre} {user?.apellidos} con id: {user?.id}</Text>
      
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
};



const styles = StyleSheet.create({
  container: {
    paddingTop: '15%',
    alignItems: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 20, // Agrega un padding para separar de los bordes de la pantalla
  },
  circle: {
    width: 50, // El tamaño del círculo
    height: 50, // El tamaño del círculo
    borderRadius: 25, // La mitad del tamaño para hacerlo circular
    backgroundColor: '#6666ff', // Color de fondo del círculo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Margen derecho para separar del botón de grupos
  },
  initials: {
    fontSize: 25,
    color: 'white', // Color de las iniciales
    fontWeight: 'bold', // Negrita para las iniciales
  },
  buttonGroup: {
    height: 50,
    width: '80%',
    flexDirection: 'row', // Orientación horizontal para el texto y el ícono
    backgroundColor: '#6666ff', // Color de fondo del botón de grupos
    paddingHorizontal: 20, // Padding horizontal
    paddingVertical: 10, // Padding vertical
    borderRadius: 20, // Bordes redondeados
    justifyContent: 'center', // Centrado horizontal
    alignItems: 'center', // Centrado vertical
  },
  buttonText: {
    color: 'white', // Color del texto
    fontWeight: 'bold', // Negrita para el texto
    fontSize: 25, // Tamaño del texto
    marginRight: 5, // Margen derecho para el texto
  },
  dropdownIcon: {
    color: 'white', // Color del ícono
    fontSize: 18, // Tamaño del ícono
  },
});

export default HomeScreen;
