// Importaciones de React, React Native y otras librerías.
import React, { useEffect, useState } from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  TextInput, 
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  Button,
  Alert,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../estilosGlobales.js'; // Importa estilos globales.
import { SelectCountry, Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';




// Obtiene las dimensiones de la ventana del dispositivo.
const windowHeigh = Dimensions.get('window').height;

const Calendario = () => {
    const route = useRoute()
    const { user } = useUser();
    const [nombreGrupo,setNombregrupo ] = useState(route.params.nombreGrupo)
    const [selected, setSelected] = useState('');
    const [seriesDetalles, setSeriesDetalles] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [idGrupo, setIdgrupo] = useState(route.params.idelegido)
    console.log('ID DEL GRUPO: ' + idGrupo)

    useEffect(() => {
        const newMarkedDates = {};
        seriesDetalles.forEach((detalle) => {
            if (detalle.next_episode_to_air && detalle.next_episode_to_air.air_date) {
                const date = detalle.next_episode_to_air.air_date; // Asume que la fecha ya está en formato 'YYYY-MM-DD'
                newMarkedDates[date] = { marked: true, selectedColor: 'blue' };
            }
        });
        setMarkedDates(newMarkedDates);
    }, [seriesDetalles]); // Dependencia para actualizar las fechas marcadas si seriesDetalles cambia

    useFocusEffect(
        React.useCallback(() => {
          // Llama a las funciones que cargan los datos
          console.log('---------------------------------------- CALENDARIO SCREEN ----------------------------------------');
          obtenerSeries();

        }, [])
      );

  
    const obtenerSeriesDelUsuario = async (userId, idgrupo) => {
        console.log('obtenerSeriesDelUsuario: ' + idgrupo);
        try {
          // Suponiendo que el servidor espera 'value' como parámetro de consulta
          
          const url = new URL(`https://apitfg.lapspartbox.com/series-ids-usuario/${userId}/${idgrupo}`);
          
          // Llamada al endpoint con userId y value como parámetros de consulta
          const respuesta = await fetch(url);
          if (!respuesta.ok) {
            throw new Error('Respuesta de red no fue ok.');
          }
          const seriesIds = await respuesta.json();
          return seriesIds;
        } catch (error) {
          console.error('Hubo un problema con la petición fetch:', error);
        }
      };
      
      
      const obtenerSeries = () => {
      
        if(nombreGrupo == 'Grupos'){
          console.log('Estamos en grupos, por lo que no hay series')
          setSeriesDetalles([])
        }else {
          obtenerSeriesDelUsuario(user.id, idGrupo).then(seriesIds => {
            // Verifica si seriesIds está vacío
            if (seriesIds.length === 0) {
              console.log('No hay series para mostrar');
              return; // Sale de la función si no hay IDs de series
            }
        
            // Si seriesIds no está vacío, ejecuta el resto del código
            Promise.all(seriesIds.map(serieID => 
              fetch(`https://api.themoviedb.org/3/tv/${serieID}?api_key=c51082efa7d62553e4c05812ebf6040e&language=es-ES`)
                .then(response => response.json())
            )).then(seriesDetalles => {
              setSeriesDetalles(seriesDetalles); // Guardar los detalles de las series en el estado
              console.log(seriesDetalles); // Imprime los detalles de las series
            }).catch(error => console.error('Error:', error));
          });
        }
      
      }

      const formatDate = (dateString) => {
        const months = [
            "enero", "febrero", "marzo", "abril", 
            "mayo", "junio", "julio", "agosto", 
            "septiembre", "octubre", "noviembre", "diciembre"
        ];
        const dateParts = dateString.split("-");
        const year = dateParts[0];
        const month = months[parseInt(dateParts[1], 10) - 1]; // Los meses comienzan en 0
        const day = parseInt(dateParts[2], 10); // Convertir a número para eliminar ceros iniciales
    
        return `${day} de ${month} de ${year}`;
    };

    const poster = (path) => {
        // Asegurándose de que el path es válido
        if (!path) {
          // Puedes retornar null o una imagen predeterminada
          return null;
        }
      
        let imagePath = { uri: `https://image.tmdb.org/t/p/w500${path}` };
    
        return (
          <Image
            source={imagePath}
            style={styles.poster}
          />
        );
      }
    
 

  return (
    <View style={[styles.container]}>
    <Calendar
            onDayPress={day => {
                setSelected(day.dateString);
            }}
            markedDates={{
                ...markedDates,
                [selected]: { ...markedDates[selected], selected: true, selectedColor: 'green'}
            }}
        />
    

    <View style={{ flexDirection: 'row', height:'70%'}}>
    <ScrollView style={{height:'100%'}}>
{seriesDetalles.map((detalle, index) => {
    // Función para renderizar el contenido condicionalmente
    const renderDetalle = () => {
        // Verificamos si next_episode_to_air y air_date existen
        if (detalle.next_episode_to_air && detalle.next_episode_to_air.air_date && detalle.next_episode_to_air.air_date === selected) {
        const formattedDate = formatDate(detalle.next_episode_to_air.air_date);
        return (
            <View>
            <Text style= {styles.titulo}> { detalle.name.toUpperCase() }</Text>
            {poster(detalle.poster_path)}
            
            <Text style={styles.title}>
                TEMPORADA: {detalle.next_episode_to_air.season_number}, EPISODIO {detalle.next_episode_to_air.episode_number}
            </Text>
            <Text style={styles.detalles}>
                {detalle.next_episode_to_air.overview}
            </Text>
            </View>
        );
    }  else {
            
        }
    };
   

    return (
      
        <View key={index}>
            {renderDetalle()}
        </View>
        
    );
})}
</ScrollView>
</View>

    </View>

  );
};

const styles = StyleSheet.create({
    poster: {
        height: '60%', // Ajusta la altura como prefieras
        width: '100%',
        resizeMode: 'contain' // Esto asegura que la imagen se ajuste al espacio disponible manteniendo su relación de aspecto
    },title: {
        fontSize: 30, // Tamaño grande para el título
        marginBottom: '5%', // Espacio debajo del título
        textAlign: 'center', // Centrar el texto
    },detalles:{
        marginTop: '1%',
        margin:'5%',
        fontSize: 14,
        color: 'grey',
        textAlign: 'justify'
    },titulo:{
        fontSize: 40, // Tamaño grande para el título
        fontWeight: 'bold', // Negrita para resaltar
        color: '#4A90E2', // Un color llamativo pero no demasiado intenso
        textAlign: 'center', // Centrar el texto
        paddingHorizontal: 10, // Espacio horizontal para no pegar al borde
        borderWidth: 4,
        borderColor: '#4A90E2'
    }
  
});

export default Calendario;
