import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,Image ,ScrollView, TouchableOpacity} from 'react-native';


const PantallaDeDetalles = ({ route, navigation }) => {
    const { idSerie } = route.params;
    const [detallesSerie, setDetallesSerie] = useState(null);
  
    const obtenerDetallesSerie = (idSerie) => {
      const apiKey = 'c51082efa7d62553e4c05812ebf6040e';
      const url = `https://api.themoviedb.org/3/tv/${idSerie}?api_key=${apiKey}&language=es-ES`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setDetallesSerie(data);
          console.log(detallesSerie);
        })
        .catch(error => console.error('Error al obtener detalles de la serie:', error));
        
    };

    const obtenerUsuariosPorSerie = (idSerie) => {
      // Reemplaza 'http://10.0.0.36:3000' con la dirección de tu servidor real y el puerto
      const url = `http://10.0.0.36:3000/serie/${idSerie}/usuarios`;
    
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Aquí procesas la respuesta. Supongamos que 'data' es un array de usuarios.
          // Puedes establecer ese array en el estado o hacer algo con él.
          console.log(data);
        })
        .catch(error => console.error('Error al obtener los usuarios:', error));
    };
    
  
    useEffect(() => {
      obtenerDetallesSerie(idSerie);
      obtenerUsuariosPorSerie(idSerie);
    }, [idSerie]);
  
    // Verifica si detallesSerie aún es null
    if (!detallesSerie) {
      return <View style={styles.container}><Text>Cargando...</Text></View>;
    }
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

      const posterSeason = (path) => {
        // Asegurándose de que el path es válido
        if (!path) {
          // Puedes retornar null o una imagen predeterminada
          return null;
        }
      
        let imagePath = { uri: `https://image.tmdb.org/t/p/w500${path}` };
    
        return (
          <Image
            source={imagePath}
            style={styles.posterSeason}
          />
        );
      }

      // Esta función será llamada cuando se presione una temporada
      const navegarADetallesDeTemporada = (idSerie, NumeroTemporada) => {
        // Aquí, 'DetallesDeTemporada' es el nombre de la pantalla a la que quieres navegar.
        // Debes reemplazarlo con el nombre real que hayas configurado en tu stack de navegación.
        // Asegúrate de pasar todos los detalles necesarios para mostrar la pantalla de detalles de la temporada.
        navigation.navigate('Temporada', { idSerie,  NumeroTemporada});
      };

      
  
    return (
      <View style={styles.container}>
        {poster(detallesSerie.poster_path)}
        <Text style={styles.title}>{detallesSerie.name.toUpperCase()}</Text>


        <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
        <Text style={styles.detail}>{detallesSerie.overview}</Text>
        {/* Aquí se imprimen los títulos de las temporadas */}
        {detallesSerie.seasons && detallesSerie.seasons.map((season, index) => (
          <TouchableOpacity
        key={index}
        style={styles.serieDetailContainer}
        onPress={() => navegarADetallesDeTemporada(idSerie, season.season_number)}
      >
          <View style={{ flex: 1 , marginTop: 0}}>
            <Text key={index} style={styles.seasonTitle}>
                {season.name}
            </Text>
            {posterSeason(season.poster_path)}
            </View>
            </TouchableOpacity>
        ))}
          
        </View>        
        {/* Aquí puedes agregar más detalles de la serie */}
        </ScrollView>
        
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 40, // Tamaño grande para el título
    fontWeight: 'bold', // Negrita para resaltar
    color: '#4A90E2', // Un color llamativo pero no demasiado intenso
    marginBottom: 8, // Espacio debajo del título
    textAlign: 'center', // Centrar el texto
  },
  detail: {
    marginTop: '1%',
    margin:'5%',
    fontSize: 14,
    color: 'grey',
    textAlign: 'justify'

  },
  poster: {
    height: '50%', // Ajusta la altura como prefieras
    width: '100%',
    resizeMode: 'contain' // Esto asegura que la imagen se ajuste al espacio disponible manteniendo su relación de aspecto
  },posterSeason:{
    height: '100%', // Ajusta la altura como prefieras
    width: '100%',
    resizeMode: 'contain' 
  },serieDetailContainer: {
    width: '33,33%', // Asegúrate de que sea 100% para que cada elemento tenga su propia fila
    padding: 10, // Añade algo de espacio alrededor de cada serie
    flexDirection: 'column',
  }
});

export default PantallaDeDetalles;