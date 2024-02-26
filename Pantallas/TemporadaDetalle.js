import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const DetallesDeTemporada = ({ route }) => {

  const [idSerie, setidSerie] = useState(route.params.idSerie);
  const [numeroTemporada, setnumeroTemporada] = useState(route.params.NumeroTemporada);


  console.log('Id Serie: ' + route.params.idSerie)
  console.log('Temporada: ' + route.params.NumeroTemporada)

  const [detallesTemporada, setDetallesTemporada] = useState(null);

  const obtenerDetallesTemporada = (idSerie, numeroTemporada) => {
    const apiKey = 'c51082efa7d62553e4c05812ebf6040e';
    const url = `https://api.themoviedb.org/3/tv/${idSerie}/season/${numeroTemporada}?api_key=${apiKey}&language=es-ES`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setDetallesTemporada(data); // Suponiendo que tienes un estado llamado setDetallesTemporada para almacenar estos datos
        console.log(data);
      })
      .catch(error => console.error('Error al obtener detalles de la temporada:', error));
  };

  useEffect(() => {
    obtenerDetallesTemporada(idSerie, numeroTemporada);

  }, []);

  if (!detallesTemporada) {
    return (
      <View style={styles.container}>
        <Text>Cargando detalles de la temporada...</Text>
      </View>
    );
  }

  const posterCapitulo = (path) => {
    // Asegurándose de que el path es válido
    if (!path) {
      // Puedes retornar null o una imagen predeterminada
      return null;
    }
  
    let imagePath = { uri: `https://image.tmdb.org/t/p/w500${path}` };

    return (
      <Image
        source={imagePath}
        style={styles.posterEpisode}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{detallesTemporada.name}</Text>
      {/* Aquí podrías mapear los capítulos si los tienes en tus detalles */}
      {detallesTemporada.episodes && detallesTemporada.episodes.map((capitulo, index) => (
        <View key={capitulo.id} style={styles.capituloContainer}>
            
          <Text style={styles.capituloTitle}>{capitulo.name}</Text>
          {posterCapitulo(capitulo.still_path)}
          <Text>{capitulo.overview}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      textAlign: 'center',
    },
    capituloContainer: {
      marginBottom: 20,
      alignItems: 'center', // Centra los elementos en el eje transversal (horizontalmente)
    },
    capituloTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
    posterEpisode: {
      width: 300, // Establece el ancho que prefieras
      height: 169, // Establece la altura basada en una proporción 16:9
      resizeMode: 'contain', // Asegura que el póster se ajuste al espacio disponible manteniendo su relación de aspecto
    },
    capituloDescription: {
      fontSize: 14,
      color: 'grey',
      marginTop: 10,
      paddingHorizontal: 20, // Añade un poco de espacio horizontal para no tocar los bordes
      textAlign: 'justify', // Alinea justificadamente el texto de la descripción
    },
  });
  

export default DetallesDeTemporada;
