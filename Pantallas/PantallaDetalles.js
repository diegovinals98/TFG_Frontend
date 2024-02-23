import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';


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
        })
        .catch(error => console.error('Error al obtener detalles de la serie:', error));
    };
  
    useEffect(() => {
      obtenerDetallesSerie(idSerie);
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
  
    return (
      <View style={styles.container}>
        {poster(detallesSerie.poster_path)}
        <Text style={styles.title}>{detallesSerie.name.toUpperCase()}</Text>
        <Text style={styles.detail}>{detallesSerie.overview}</Text>
        {/* Aquí puedes agregar más detalles de la serie */}
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
  }
});

export default PantallaDeDetalles;