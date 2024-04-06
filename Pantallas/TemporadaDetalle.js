import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image,TouchableOpacity } from 'react-native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const DetallesDeTemporada = ({ route }) => {

  const [idSerie, setidSerie] = useState(route.params.idSerie);
  const [numeroTemporada, setnumeroTemporada] = useState(route.params.NumeroTemporada);
  const [nombreGrupo, setNombreGrupo] = useState(route.params.nombreGrupo);
  const [nombreSerie, setNombreSerie] = useState(route.params.nombreSerie);
  const [tokensRecibios, setTokensRecibidos] = useState([]);

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
        const url2 = `https://apitfg.lapspartbox.com/temporada-vista/${user.id}/${idSerie}/${data.season_number}`;
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
  

  async function getGroupNotificationTokens(groupName) {
    try {
        // Corrección: Uso de backticks para interpolación de strings
        const response = await fetch(`https://apitfg.lapspartbox.com/getNotificationTokens/${groupName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Error al buscar Tokens: La respuesta de la red no fue ok.');
        }

        // Corrección: Uso de await para resolver la promesa
        const tokensRecibidos = await response.json();
        console.log('Tokens recibidos:', tokensRecibidos);

        // Devuelve los tokens obtenidos
        return tokensRecibidos;

    } catch (error) {
        console.error('Error al obtener tokens:', error);
    }
}


async function sendPushNotification(token, usuario, nombreSerie,season_number ,Episode_number) {
  console.log('INTENTANDO ENVIAR NOTIFICACION')
  try {
    const response = await fetch('https://apitfg.lapspartbox.com/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, usuario, nombreSerie,season_number, Episode_number}),
    });

    console.log('RESPONSE DE MANDAR NOTIFICACION')
    console.log(response)

    if (!response.ok) {
      console.log('Error al mandar notificacion');
    }else{
      console.log('Notificaciones enviadas correctamente');
    }
    // Manejo adicional en caso de éxito, como actualizar la interfaz de usuario
  } catch (error) {
    console.log('Error api notificacion:', error);
  }
}

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification2(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!'
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}



  const marcarVisto  = async (idSerie, capituloId, Name, Episode_number,season_number, userid) => {    
    try {
  
        const response = await fetch('https://apitfg.lapspartbox.com/agregar-visualizacion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idSerie, capituloId, Name, Episode_number,season_number, userid}),
        });

        if (!response.ok) {
          console.log('Error al agregar capitulo');
        }else{
          const tokens = await getGroupNotificationTokens(nombreGrupo);
          tokens.forEach(async (token) => {
              //await sendPushNotification(token, user.nombre, nombreSerie ,season_number ,Episode_number);
              await sendPushNotification2(token);
          });
          console.log('Capitulo agregado correctamente');
        }
        
        // Manejo adicional en caso de éxito, como actualizar la interfaz de usuario
      } catch (error) {
        console.log('Error al agregar capitulo:', error);
      }

      // Después de una operación exitosa, actualiza el estado para refrescar la lista de capítulos vistos
      setActualizarVisto(actual => !actual);
      

  }

  const eliminarVisto = async (capituloId, userid) => {

    try {
        const response = await fetch('https://apitfg.lapspartbox.com/eliminar-visualizacion', {
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
    <View style={styles.container}>
    <Text style={styles.title}>{detallesTemporada.name.toUpperCase()}</Text>
    <ScrollView style={styles.scrollView}>
      
      <View style={styles.episodesContainer}>
        {detallesTemporada.episodes && detallesTemporada.episodes.map((capitulo, index) => (
          <View key={capitulo.id} style={styles.capituloContainer}>
            <Text style={styles.capituloTitle}>Capitulo {capitulo.episode_number }: {capitulo.name}</Text>
            { /* posterCapitulo(capitulo.still_path) */ }
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
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingBottom:'10%',
      
    },
    scrollView: {
      height: '100%'
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      paddingTop: '2%',
      paddingBottom: '2%',
      textAlign: 'center',
      backgroundColor: '#4A90E2'
    },
    capituloTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: '5%',
      margin:'2%'
    },
    posterEpisode: {
      width: '30%', // Establece el ancho que prefieras
      height: '10%',
      resizeMode: 'contain', // Asegura que el póster se ajuste al espacio disponible manteniendo su relación de aspecto
      marginLeft: '5%'
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
        paddingBottom:'5%',
        borderWidth: 1
      },eliminarSerieBoton:{
        marginRight: '5%',
        marginLeft:'5%',
        marginTop:'5%'
      },botonMarcarVisto: {
        backgroundColor: 'blue', // Color azul para el botón no visto
        borderRadius: 5,
        padding: '2%',
        justifyContent: 'space-around'
      },
      botonVisto: {
        backgroundColor: 'green', // Color verde para el botón visto
        borderRadius: 5,
        padding: '2%',
        justifyContent: 'space-around',
      },
      textoBoton: {
        color: 'white',
      },
  });
  

export default DetallesDeTemporada;
