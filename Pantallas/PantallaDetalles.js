import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet,Image ,ScrollView, TouchableOpacity, Alert} from 'react-native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { useFocusEffect } from '@react-navigation/native';


const PantallaDeDetalles = ({ route, navigation }) => {
    const { idSerie , NombreGrupo} = route.params;
    console.log("Id Serie: " + idSerie)
    console.log("Nombre Grupo: " + NombreGrupo)
    const [detallesSerie, setDetallesSerie] = useState(null);
    const [UsuariosSerie, setUsuariosSerie] = useState([]);

    const { user } = useUser();
  
    const obtenerDetallesSerie = (idSerie) => {
      const apiKey = 'c51082efa7d62553e4c05812ebf6040e';
      const url = `https://api.themoviedb.org/3/tv/${idSerie}?api_key=${apiKey}&language=es-ES`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setDetallesSerie(data);
          //console.log(detallesSerie);
        })
        .catch(error => console.error('Error al obtener detalles de la serie:', error));
        
    };

    const obtenerUsuariosViendoSerie = async (nombreGrupo, idSerie) => {
      try {
        const response = await fetch(`https://apitfg.lapspartbox.com/usuarios-viendo-serie/${nombreGrupo}/${idSerie}`);
        if (!response.ok) {
          throw new Error('Respuesta de red no fue ok.');
        }
        const data = await response.json();
        setUsuariosSerie(data);
        console.log(UsuariosSerie)
      } catch (error) {
        console.error('Hubo un problema con la petición fetch:', error);
      }

    };
    


    // PARA ACTILIZAR LO QUE QUIERAS CUANDO LA PANTALLA GANA EL FOCO
    useFocusEffect(
      useCallback(() => {
        // El código aquí se ejecutará cuando la pantalla gane foco
        console.log('---------------------------------------- DETALLES SERIE ----------------------------------------');
        
        obtenerDetallesSerie(idSerie);
        obtenerUsuariosViendoSerie(NombreGrupo, idSerie);

        return () => {
          // Opcional: Código de limpieza si necesitas hacer algo cuando la pantalla pierde foco
          console.log('Pantalla va a perder foco...');
        };
      }, []) // Dependencias para este efecto
    );
  
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

      function irComentaros(idSerie , NombreGrupo){
        navigation.navigate('Comentarios Serie', { idSerie,  NombreGrupo, nombreSerie: detallesSerie.name});
      }

      // Esta función será llamada cuando se presione una temporada
      const navegarADetallesDeTemporada = (idSerie, NumeroTemporada, nombreGrupo, nombreSerie) => {
        // Aquí, 'DetallesDeTemporada' es el nombre de la pantalla a la que quieres navegar.
        // Debes reemplazarlo con el nombre real que hayas configurado en tu stack de navegación.
        // Asegúrate de pasar todos los detalles necesarios para mostrar la pantalla de detalles de la temporada.
        navigation.navigate('Temporada', { idSerie,  NumeroTemporada, nombreGrupo, nombreSerie});
      };

      const eliminarSerie = async ( idSerie, userId) => {
        Alert.alert(
          'Confirmación',
          `¿Estás seguro de que quieres eliminar la serie: ${detallesSerie.name}?`,
          [
            {
              text: 'Sí',
              onPress: async () => {
                try {
                  const response = await fetch('https://apitfg.lapspartbox.com/eliminar-serie-usuario', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, idSerie }),
                  });
              
                  if (!response.ok) {
                    throw new Error('Error al eliminar la serie');
                  }
              
                  const result = await response.json();
                  console.log(result);
                  navigation.navigate('Home');
                  // Manejo adicional en caso de éxito, como actualizar la interfaz de usuario
                } catch (error) {
                  console.error('Error al eliminar la serie:', error);
                }
              },
              
            },
            {
              text: 'No',
              style: 'cancel', // Pone este botón con un estilo de cancelar
              onPress: () => {
                // Lógica para añadir la serie
                //resetearBusqueda
              }
            },
          ],
          { cancelable: false } // Evita que el cuadro de diálogo se cierre al tocar fuera de él
        );
      };

      

      

      

  
    return (
      <View style={styles.container}>
        {poster(detallesSerie.poster_path)}
        <Text style={styles.title}>{detallesSerie.name.toUpperCase()}</Text>


        <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
        <Text style={styles.detail}>{detallesSerie.overview}</Text>


        <View style={styles.usuarioContainer}>
          <View  style={styles.usuarioTextoContainer}>
                <Text style={styles.header}>USUARIO</Text>
                <Text style={styles.header}>TEMPORADA</Text>
                <Text style={styles.header}>CAPÍTULO</Text>
              </View>
          {UsuariosSerie.map((usuario, index) => (
            <View key={index} style={styles.usuarioTextoContainer}>
              <Text style={styles.usuarioTexto}>{usuario.Nombre}</Text>
              <Text style={styles.usuarioTexto}>{usuario.Temporada_Mas_Alta}</Text>
              <Text style={styles.usuarioTexto}>{usuario.Capitulo_Mas_Reciente}</Text>
            </View>
          ))}
        </View>

        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
        {/* Aquí se imprimen los títulos de las temporadas */}
        {detallesSerie.seasons && detallesSerie.seasons.map((season, index) => (
          <TouchableOpacity
        key={index}
        style={styles.serieDetailContainer}
        onPress={() => navegarADetallesDeTemporada(idSerie, season.season_number, NombreGrupo, detallesSerie.name)}
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
        {/* Botón de eliminar serie */}
        <View style={{flexDirection: 'row', marginRight: '1%', marginLeft: '1%'}}>
      <TouchableOpacity style={styles.eliminarSerieBoton} onPress={() => eliminarSerie(idSerie, user.id)}>
        <Text style={styles.eliminarSerieTexto}>Eliminar Serie</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.comentariosBoton} onPress={() => irComentaros(idSerie,NombreGrupo ,detallesSerie.name)}>
        <Text style={styles.eliminarSerieTexto}>Comentarios</Text>
      </TouchableOpacity>
      </View>
      
        
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    
  },
  title: {
    fontSize: 40, // Tamaño grande para el título
    fontWeight: 'bold', // Negrita para resaltar
    borderColor: '#4A90E2', // Color de la línea inferior
    backgroundColor:'white',
    borderWidth: 4, // Grosor de la línea inferior
    width: '100%',
    paddingBottom: '2%', // Espacio debajo del título
    paddingTop: '2%', // Espacio debajo del título
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
    height: '20%', // Ajusta la altura como prefieras
    width: '100%',
    resizeMode: 'contain', // Esto asegura que la imagen se ajuste al espacio disponible manteniendo su relación de aspecto
    
  },posterSeason:{
    height: 200, // Ajusta la altura como prefieras
    resizeMode: 'contain' ,
    
  },serieDetailContainer: {
    width: '33%', // Asegúrate de que sea 100% para que cada elemento tenga su propia fila
    padding: 10, // Añade algo de espacio alrededor de cada serie
    flexDirection: 'column',
    
  },eliminarSerieBoton: {
    backgroundColor: 'red', // Color de fondo
    padding: '2%', // Relleno
    marginTop: '2%', // Margen superior
    marginRight: '2%', // Margen superior
    marginLeft: '2%', // Margen superior
    marginBottom: '4%', // Margen inferior
    alignItems: 'center', // Alinea el texto al centro
    borderRadius: 5, // Bordes redondeados
  },comentariosBoton:{
    backgroundColor: 'blue', // Color de fondo
    padding: '2%', // Relleno
    marginTop: '2%', // Margen superior
    marginRight: '2%', // Margen superior
    marginLeft: '2%', // Margen superior
    marginBottom: '4%', // Margen inferior
    alignItems: 'center', // Alinea el texto al centro
    borderRadius: 5, // Bordes redondeados
  },
  eliminarSerieTexto: {
    color: 'white', // Color del texto
    fontSize: 16, // Tamaño del texto
  },usuarioContainer:{
    flex:1,
    marginRight:'5%',
    marginLeft:'5%',
    
  },seasonTitle:{
    textAlign: 'center'
  },usuarioTextoContainer: {
    flexDirection: 'row', // Alinear los Text en horizontal
    marginBottom: 5, // Ajustar el margen si es necesario
    
  },usuarioTexto:{
    flex:1,
    textAlign:'center',
    borderWidth: 2,
  },header:{
    flex:1,
    textAlign:'center',
    borderWidth: 2,
    backgroundColor: '#9ca3ad'
  }
});

export default PantallaDeDetalles;