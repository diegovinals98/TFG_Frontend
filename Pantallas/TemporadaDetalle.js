import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image,TouchableOpacity } from 'react-native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { useFocusEffect } from '@react-navigation/native';

const DetallesDeTemporada = ({ route }) => {

  const [idSerie, setidSerie] = useState(route.params.idSerie);
  const [numeroTemporada, setnumeroTemporada] = useState(route.params.NumeroTemporada);

  const { user } = useUser();
  


  console.log('Id Serie: ' + route.params.idSerie)
  console.log('Temporada: ' + route.params.NumeroTemporada)

  const [detallesTemporada, setDetallesTemporada] = useState(null);
  const [capitulosVistos, setCapitulosVistos] = useState([]);
  const [actualizarVisto, setActualizarVisto] = useState(false);



  const obtenerCapitulosVistos = async () => {
    try {
      const apiKey = 'c51082efa7d62553e4c05812ebf6040e';
      const url = `https://api.themoviedb.org/3/tv/${idSerie}/season/${numeroTemporada}?api_key=${apiKey}&language=es-ES`;
    
      const response = await fetch(url);
      const data = await response.json();
      setDetallesTemporada(data); // Esto actualiza el estado, pero recuerda que React puede agrupar varias actualizaciones de estado juntas.
      

      try{
        // Debido a cómo funciona la actualización de estado en React, `detallesTemporada` aún no se ha actualizado aquí.
        // Si necesitas usar inmediatamente los datos de `detallesTemporada`, utiliza directamente `data` obtenida de la respuesta.
        const url2 = `http://localhost:3000/temporada-vista/${user.id}/${idSerie}/${data.season_number}`;
        const response2 = await fetch(url2);
        const data2 = await response2.json();
        
        setCapitulosVistos(data2.vistos);
        console.log("Vistos: " + data2.vistos);

      }catch(error){
        console.error('Error al obtener capitulos vistos: ', error);
      }
      
    } catch (error) {
      console.error('Error al obtener detalles de la temporada: ', error);
    }
  };


  // PARA ACTILIZAR LO QUE QUIERAS CUANDO LA PANTALLA GANA EL FOCO
  useFocusEffect(
    useCallback(() => {
      // El código aquí se ejecutará cuando la pantalla gane foco
      console.log('---------------------------------------- TEMPORADA ----------------------------------------');
      obtenerCapitulosVistos() // Esta función ahora espera a que obtenerDetallesTemporada se complete.
      return () => {
        // Opcional: Código de limpieza si necesitas hacer algo cuando la pantalla pierde foco
        console.log('Pantalla va a perder foco...');
      };
    }, []) // Dependencias para este efecto
  );



  useEffect(() => {  
    //cargarDatos();
    console.log('Actualizar después (dentro de useEffect): ' + actualizarVisto);
  
    obtenerCapitulosVistos()
  }, [idSerie, numeroTemporada, actualizarVisto, user.id]); // Dependencias para el useEffect.

  

  if (!detallesTemporada) {
    return (
      <View style={styles.container}>
        <Text>Cargando detalles de la temporada...</Text>
      </View>
    );
  }

  const marcarVisto  = async (idSerie, capituloId, Name, Episode_number,season_number, userid) => {
    console.log('Pulsado Marcar Visto')
    try {
        console.log('Dentro del try')
        const response = await fetch('http://localhost:3000/agregar-visualizacion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idSerie, capituloId, Name, Episode_number,season_number, userid}),
        });

        if (!response.ok) {
          console.log('Error al agregar capitulo');
        }
        
        // Manejo adicional en caso de éxito, como actualizar la interfaz de usuario
      } catch (error) {
        console.log('Error al agregar capitulo:', error);
      }
      // Después de una operación exitosa, actualiza el estado para refrescar la lista de capítulos vistos
      setActualizarVisto(actual => !actual);
      console.log('Fuera del try')

  }

  const eliminarVisto = async (capituloId, userid) => {

    try {
        const response = await fetch('http://localhost:3000/eliminar-visualizacion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ capituloId, userid }),
        });
    
        if (!response.ok) {
          throw new Error('Error al eliminar visualización');
        }
        const result = await response.json();
        console.log(result);
        // Después de una operación exitosa, actualiza el estado para refrescar la lista de capítulos no vistos
        setActualizarVisto(actual => !actual);
        
        // Manejo adicional en caso de éxito, como actualizar la interfaz de usuario
      } catch (error) {
        console.error('Error al eliminar visualización:', error);
      }
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
      <Text style={styles.title}>{detallesTemporada.name.toUpperCase()}</Text>
      <View style={styles.episodesContainer}>
        {detallesTemporada.episodes && detallesTemporada.episodes.map((capitulo, index) => (
          <View key={capitulo.id} style={styles.capituloContainer}>
            <Text style={styles.capituloTitle}>Capitulo {capitulo.episode_number }: {capitulo.name}</Text>
            { /* posterCapitulo(capitulo.still_path) */}
            <Text style={styles.capituloDescription}>{capitulo.overview}</Text>
            {
              (capitulosVistos || []).includes(capitulo.id) ? (
                // Botón para el capítulo visto
                <TouchableOpacity 
                  style={[styles.eliminarSerieBoton, styles.botonVisto]} 
                  onPress={() => eliminarVisto(capitulo.id, user.id)}>
                  <Text style={styles.textoBoton}>Visto ✓</Text>
                </TouchableOpacity>
              ) : (
                // Botón para marcar el capítulo como visto
                <TouchableOpacity 
                  style={[styles.eliminarSerieBoton, styles.botonMarcarVisto]} 
                  onPress={() => marcarVisto(idSerie, capitulo.id, capitulo.name, capitulo.episode_number, detallesTemporada.season_number, user.id)}>
                  <Text style={styles.textoBoton}>Marcar como visto</Text>
                </TouchableOpacity>
              )
            }

          </View>
        ))}
      </View>
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
      margin: '5%',
    },
    posterEpisode: {
      width: '100%', // Establece el ancho que prefieras
      height: '20%',
      resizeMode: 'contain', // Asegura que el póster se ajuste al espacio disponible manteniendo su relación de aspecto
    },
    capituloDescription: {
      fontSize: 14,
      color: 'grey',
      marginLeft:'5%',
      marginRight:'5%',
      textAlign: 'justify', // Alinea justificadamente el texto de la descripción
    }, episodesContainer: {
        flexDirection: 'row', // Ordena los elementos en fila
        flexWrap: 'wrap', // Permite el ajuste automático de los elementos
        justifyContent: 'space-around', // Distribuye el espacio alrededor de los elementos
      },
      capituloContainer: {
        width: '100%', // Ancho para que quepan dos elementos por fila
        alignItems: 'left',
      },eliminarSerieBoton:{
        marginRight: '5%',
        marginLeft:'5%',
        marginTop:'5%'
      },botonMarcarVisto: {
        backgroundColor: 'blue', // Color azul para el botón no visto
        // Otros estilos para el botón...
      },
      botonVisto: {
        backgroundColor: 'green', // Color verde para el botón visto

        // Otros estilos para el botón...
      },
      textoBoton: {
        color: 'white',
        // Otros estilos para el texto...
      },
  });
  

export default DetallesDeTemporada;
