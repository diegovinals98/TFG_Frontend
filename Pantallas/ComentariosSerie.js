// Importaciones de React, React Native y otras librerías.
import React, { useEffect, useState, useSyncExternalStore } from 'react';


import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  TextInput, 
  FlatList,
  Keyboard,
  Button,
  Alert,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../estilosGlobales.js'; // Importa estilos globales.
import { SelectCountry, Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { head } from 'lodash';
import moment from 'moment';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';







// Obtiene las dimensiones de la ventana del dispositivo.
const windowHeigh = Dimensions.get('window').height;

const ComentariosSerie = () => {
    const route = useRoute()
    const { user } = useUser();
    const [nombreGrupo,setNombregrupo ] = useState(route.params.NombreGrupo)
    const [idSerie, setIdSerie ] = useState(route.params.idSerie)
    const [nombreSerie, setNombreSerie ] = useState(route.params.nombreSerie)
    const [comentarioaEnviar, setComentarioaEnviar] = useState()
    const [idGrupo, setIdGrupo] = useState()
    const [comentarios, setComentarios] = useState([]);
    const [cargandoComentarios, setCargandoComentarios] = useState(false);
    const [parar, setParar] = useState(false);
    const [refrescar, setRefrescar] = useState(false);


      

    useEffect(() => {
        // Función para obtener el ID del grupo y cargar los datos
        const obtenerYcargarDatos = async () => {
         if (parar) return; // Detiene la ejecución si parar es true
      
          try {
            // Lógica para obtener el ID del grupo
            const responseGrupo = await fetch(`https://apitfg.lapspartbox.com/grupo_por_nombre/${nombreGrupo}`);
            if (!responseGrupo.ok) {
              throw new Error('Grupo no encontrado');
            }
            const dataGrupo = await responseGrupo.json();
            console.log('ID del Grupo:', dataGrupo.idGrupo);
            setIdGrupo(dataGrupo.idGrupo);
      
            // Asegúrate de que idGrupo esté definido antes de continuar
            if (!dataGrupo.idGrupo) {
              console.error('ID del Grupo no está definido');
              return;
            }
      
            // Lógica para cargar los datos con el ID del grupo obtenido
            const responseComentarios = await fetch(`https://apitfg.lapspartbox.com/comentarios_por_grupo_serie/${dataGrupo.idGrupo}/${idSerie}`);
            if (!responseComentarios.ok) {
              throw new Error('Respuesta de red no fue ok');
            }
            const comentarios = await responseComentarios.json();
            setComentarios(comentarios)
            console.log(comentarios);
      
          } catch (error) {
            console.error('Error:', error);
          }
        };
      
        obtenerYcargarDatos();
        const intervalId = setInterval(obtenerYcargarDatos, 10000);
      
        // Opcionalmente, define una función de limpieza si es necesario realizar alguna acción cuando el componente se desmonta o antes de que el efecto se vuelva a ejecutar.
        return () => clearInterval(intervalId);
      }, [nombreGrupo, idSerie, parar, refrescar]); // Incluye parar en las dependencias para reaccionar a sus cambios
      

      async function enviarComentario(userId){
        if (!comentarioaEnviar){

        }else {
            
            // Asegúrate de reemplazar <tu_servidor> con la dirección de tu servidor
            const url = `https://apitfg.lapspartbox.com/anadir_comentario_a_serie`;
    
            try {
                let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: userId,
                    idGrupo: idGrupo,
                    idSerie: idSerie,
                    comentario: comentarioaEnviar,
                }), // Datos que se envían al servidor
                });
    
                if (!response.ok) {
                throw new Error('Error al enviar el comentario');
                }
    
                let data = await response.json();
                console.log('Respuesta del servidor:', data.mensaje);
                setComentarioaEnviar('');
                setRefrescar(prev => !prev);
                Keyboard.dismiss();
                // aqui tendriamos que refrescar para obtener los comentarios

                // Aquí puedes continuar con la lógica de tu aplicación usando la respuesta del servidor
            } catch (error) {
                console.error('Error:', error);
            }
        }
      }

      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 200}
        >
          
            <View style={styles.container}>
              <Text style={styles.title}>{nombreSerie}</Text>
              {/* ScrollView para los comentarios */}
              <ScrollView 
              snapToEnd={true} 
              keyboardDismissMode= 'on-drag' 
              keyboardShouldPersistTaps= 'never' 
              
              style={styles.scrollView}>
              {comentarios.map((comentario, index) => (
                <View key={index} style={styles.comentarioContainer}>
                    <Text style={styles.autor}>{comentario.nombreCompleto}</Text>
                    <Text>{comentario.comentario}</Text>
                    <Text style={styles.fecha}>{moment(comentario.fechaHora).format('dddd D, HH:mm')}</Text>
                </View>
                ))}
                </ScrollView>
              {/* Área para introducir comentarios */}
              <View style={styles.commentBox}>
                <View style={styles.inputRow}>
                    <TextInput
                    style={styles.input}
                    onChangeText={newText => setComentarioaEnviar(newText)}
                    autoCapitalize="sentences"
                    placeholder="Escribe un comentario"
                    value={comentarioaEnviar} 
                    />
                    <TouchableOpacity style={styles.button} onPress={() => enviarComentario(user.id)}>
                    <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
                </View>

            </View>
         
        </KeyboardAvoidingView>
      );
    };
    
    const styles = StyleSheet.create({
      keyboardView: {
        flex: 1,
      },
      container: {
        flex: 1,
        justifyContent: 'space-between', // Distribuye el espacio
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
      scrollView: {
        flex: 1, // Ocupa todo el espacio disponible
      },
      commentBox: {
        marginTop: '1%',
        paddingLeft: '3%',
        paddingRight: '3%',
        height: windowHeigh * 0.12, // Ajusta según necesites
      },inputRow: {
        flexDirection: 'row', // Coloca los elementos en fila
        alignItems: 'center', // Centra los elementos verticalmente
      },
      input: {
        // Estilos para tu TextInput
        flex: 5, // Hace que el input ocupe todo el espacio disponible excepto el que ocupe el botón
        borderWidth: 1,
        borderColor: 'gray',
        padding: windowHeigh * 0.01,
        marginRight: '1%', // Añadido para separar el input del botón
        borderRadius: 5,
      },
      button: {
        flex: 1,
        backgroundColor: '#4A90E2', // Un color de ejemplo, puedes cambiarlo
        borderRadius: 5,
        padding: windowHeigh * 0.01,
        alignItems: 'center', 
        justifyContent: 'center'
      },
      buttonText: {
        
        color: 'white', // Un color de ejemplo para el texto del botón
      },
      label: {
        // Estilos para la etiqueta del área de comentarios
        marginLeft: '10%',
      },comentarioContainer:{
        flex: 1
      },
      comentarioContainer: {
        borderRadius: 15,
        backgroundColor: '#ffffff',  // Fondo blanco para cada comentario
        padding: '3%',  // Espacio interior para cada comentario
        marginVertical: '2%',  // Margen vertical para separar los comentarios
        marginHorizontal: '2%'  // Margen horizontal para un poco de espacio a los lados
      },
      autor: {
        fontWeight: 'bold',  // Texto en negrita para el autor
        fontSize: 16,  // Tamaño de letra adecuado
        color: '#333'  // Color oscuro para el texto del autor
      },
      comentario: {
        fontSize: 14,  // Tamaño de letra para el comentario
        color: '#666',  // Gris oscuro para el texto del comentario
        marginTop: '1%'  // Espacio arriba del comentario
      },
      fecha: {
        fontSize: 12,  // Tamaño de letra más pequeño para la fecha
        color: '#999',  // Gris más claro para la fecha
        marginTop: '1%'  // Espacio arriba de la fecha
      }
    });

export default ComentariosSerie;
