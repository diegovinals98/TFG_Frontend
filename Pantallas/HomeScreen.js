// Importaciones de React, React Native y otras librerías.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../estilosGlobales.js'; // Importa estilos globales.

// Obtiene las dimensiones de la ventana del dispositivo.
const windowHeigh = Dimensions.get('window').height;

// Componente principal de la pantalla de inicio.
const HomeScreen = () => {
  // Hook de navegación y rutas de react-navigation.
  const route = useRoute();
  const navigation = useNavigation();

  // Accede a los datos del usuario desde el contexto.
  const { user } = useUser();
  // Calcula las iniciales del usuario para mostrar.
  const iniciales = user?.nombre ? `${user?.nombre.charAt(0)}${user?.apellidos.charAt(0)}` : '';

  // Estados del componente.
  const [data, setData] = useState([]); // Estado para datos de usuarios.
  const [seriesData, setSeriesData] = useState([]); // Estado para datos generales de series.
  const [serieDetalle, setSerieDetalle] = useState([]); // Estado para detalles específicos de una serie.

  // Estado para la visibilidad del menú desplegable y el grupo seleccionado.
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [TodosGrupos, setTodosGrupos] = useState([]); // Estado para almacenar todos los grupos.

  // Función para manejar la selección de un grupo.
  const handleSelectItem = (item) => {
    setSelectedItem(item.Nombre_grupo);
    setIsVisible(false);
  };

  // Función para realizar la llamada a la API y obtener los grupos del Usuario
  function llamarAGrupos(){
    setIsVisible(true);
    fetch(`http://10.0.0.36:3000/grupos/${user?.id}`)
      .then((response) => response.json())
      .then((json) => setTodosGrupos(json))
      .catch((error) => console.error('Error al obtener los grupos:', error));
    console.log(TodosGrupos);
  }

  // Efecto para cargar datos de una serie específica.
  useEffect(() => {
    // URL de la API de TMDb para buscar series.
    const serie_a_buscar = 'reacher';
    let apiSeries = `https://api.themoviedb.org/3/search/tv?api_key=c51082efa7d62553e4c05812ebf6040e&language=es-ES&page=1&query=${serie_a_buscar}&include_adult=false`;

    // Llamada a la API para obtener los detalles de la serie.
    fetch(apiSeries)
      .then(response => response.json())
      .then(data => {
        const serieId = data.results[0].id;
        const apiSerieDetalle = `https://api.themoviedb.org/3/tv/${serieId}?api_key=c51082efa7d62553e4c05812ebf6040e&language=es-ES`;
        return fetch(apiSerieDetalle);
      })
      .then(response => response.json())
      .then(serieDetalle => {
        setSerieDetalle(serieDetalle);
      })
      .catch(error => console.error('Error:', error));
  }, []); // El array vacío como segundo argumento asegura que useEffect se ejecute solo una vez.

  // Función para navegar a la pantalla de ajustes.
  const handleSettings = () => {
    navigation.navigate('Settings');
  }

  // Renderizado del componente.
  return (
    <View style={[globalStyles.container, styles.container]}>
      <StatusBar/>

      {/* Renderizado de la fila superior con las iniciales del usuario y el botón de grupos. */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.circle} onPress={() => handleSettings()}>
          <Text style={styles.initials}>{iniciales}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonGroup}
          onPress={() => llamarAGrupos()}
        >
          <Text style={styles.buttonText}>{selectedItem || 'Select an Item'}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para mostrar los grupos disponibles. */}
      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            {TodosGrupos.map((group, index) => (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => handleSelectItem(group)}
              >
                <Text style={styles.itemText}>{group.Nombre_grupo}</Text>
              </TouchableOpacity>
            ))}

            {/* Botón para añadir un nuevo grupo. */}
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>+ Añadir Grupo</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      

      {/* Renderizado de los detalles de la serie seleccionada. */}
      {serieDetalle.name && (
        <View style={styles.serieDetailContainer}>
          <Text style={styles.serieTitle}>{serieDetalle.name}</Text>
          <Text style={styles.serieOverview}>Descripcion: {serieDetalle.overview}</Text>
          {serieDetalle.seasons && serieDetalle.seasons.map((season) => (
            <Text key={season.id} style={styles.serieOverview}>
              Temporada {season.season_number}: {season.episode_count} episodios
            </Text>
          ))}
          <Text style={styles.serieOverview}>Status: {serieDetalle.status}</Text>
        </View>
      )}
      {/* Mensaje de bienvenida y detalles del usuario. */}
      <Text>Bienvenido, {user?.nombre} {user?.apellidos} con id: {user?.id}</Text>
      
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    elevation: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
  },
  serieDetailContainer:{
    width:'90%'
  }, serieTitle: {
    fontSize: 24, // Tamaño grande para el título
    fontWeight: 'bold', // Negrita para resaltar
    color: '#4A90E2', // Un color llamativo pero no demasiado intenso
    marginBottom: 8, // Espacio debajo del título
    textAlign: 'center', // Centrar el texto
  },

  serieOverview: {
    fontSize: 16, // Tamaño moderado para la descripción
    color: '#333333', // Color oscuro para fácil lectura
    lineHeight: 24, // Espacio entre líneas para mejor legibilidad
    textAlign: 'justify', // Justificar para dar una apariencia de bloque de texto
    paddingHorizontal: 10, // Espacio horizontal para no pegar al borde
    marginBottom: 12, // Espacio debajo del párrafo
  },
});

export default HomeScreen;
