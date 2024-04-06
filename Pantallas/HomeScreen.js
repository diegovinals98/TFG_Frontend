// Importaciones de React, React Native y otras librerías.
import React, { useEffect, useState } from 'react';

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
  RefreshControl,
  SafeAreaView ,
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
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';







// Obtiene las dimensiones de la ventana del dispositivo.

const windowHeight = Dimensions.get('window').height;

// Componente principal de la pantalla de inicio.
const HomeScreen = () => {
  // Hook de navegación y rutas de react-navigation.
  const route = useRoute();
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  // Estilos condicionales basados en la plataforma
  const platformStyles = Platform.select({
    ios: { paddingTop: StatusBar.currentHeight }, // para iOS usamos el inset top
    android: { paddingTop:  insets.top}, // para Android usamos la altura de la barra de estado
  });



  // Accede a los datos del usuario desde el contexto.
  const { user } = useUser();
  // Calcula las iniciales del usuario para mostrar.
  const iniciales = user?.nombre ? `${user?.nombre.charAt(0)}${user?.apellidos.charAt(0)}` : '';

  // Estados del componente.
  const [data, setData] = useState([]); // Estado para datos de usuarios.
  const [seriesData, setSeriesData] = useState([]); // Estado para datos generales de series.
  const [serieDetalle, setSerieDetalle] = useState([]); // Estado para detalles específicos de una serie.
  const [seriesIds, setseriesIds] = useState([]);
  const [seriesDetalles, setSeriesDetalles] = useState([]);

  // Estado para la visibilidad del menú desplegable y el grupo seleccionado.
  const [TodosGrupos, setTodosGrupos] = useState([]); // Estado para almacenar todos los grupos.
  const [value, setValue] = useState("Grupos"); // variable que almacena en que grupo estamos
  const [isFocus, setIsFocus] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const [refrescando, setRefrescando] = useState(false);


  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(TodosGrupos.map(grupo => ({label: grupo.Nombre_grupo, value: grupo.Nombre_grupo})));



  useFocusEffect(
    React.useCallback(() => {
      // Llama a las funciones que cargan los datos
      console.log('---------------------------------------- HOME SCREEN ----------------------------------------');
      llamarAGrupos();
      obtenerSeries();
      resetearBusqueda();
      setRefrescar(prev => !prev);
  
    }, [])
  );

  

  const onRefresh = React.useCallback(() => {
    setRefrescando(true);
    // Aquí debes llamar a las funciones que actualizan tus datos
    resetearBusqueda();
    setRefrescar(prev => !prev);
    llamarAGrupos();
    obtenerSeries();
  
    setRefrescando(false);
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
    // ...
  }, []);
  
  

  // Función para manejar la selección de un grupo.
  const handleSelectItem = (item) => {
    setSelectedItem(item.Nombre_grupo);
    setIsVisible(false);
  };

  async function anadirGrupo() {
    navigation.navigate('Añadir Grupo')
  }

  // Función para realizar la llamada a la API y obtener los grupos del Usuario
  const llamarAGrupos = () =>{
    console.log('Entrado en llamarGrupos')
    fetch(`https://apitfg.lapspartbox.com/grupos/${user?.id}`)
      .then((response) => response.json())
      .then((json) => setTodosGrupos(json))
      .catch((error) => console.error('Error al obtener los grupos:', error));
    console.log("Grupos del Usuario: " + user.nombre + user.apellidos);  
    console.log(TodosGrupos);

    /** 
    if(TodosGrupos.length == 0){
      console.log('TodosGrupos esta vacio')
      setValue('Grupos');
    }
    */
  }

  async function enviarTokenAlBackend(token, userId) {
    const response = await fetch('https://apitfg.lapspartbox.com/guardar-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, userId }),
    });
  
    if (!response.ok) {
      console.error('Hubo un problema al enviar el token al servidor');
      return;
    }
  
    const responseBody = await response.text();
    console.log('Respuesta del servidor:', responseBody);
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  Notifications.addNotificationReceivedListener(notification => {
    console.log(notification);
    // Tu código para manejar la notificación cuando se recibe mientras la app está abierta
  });
  
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
    // Tu código para manejar lo que sucede cuando el usuario toca/responds a la notificación
  });

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data; // EXPO 
      //const tokenObject = await Notifications.getDevicePushTokenAsync();
      //const token = tokenObject.data;
      console.log('TOKEN PUSH: ' +  token)
      // enviamos el token al backend
      await enviarTokenAlBackend(token, user.id);
      // Aquí envías el token al backend


      // ...
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };


const obtenerSeriesDelUsuario = async (userId, value) => {
  console.log('obtenerSeriesDelUsuario: ' + value);
  try {
    // Suponiendo que el servidor espera 'value' como parámetro de consulta
    const url = new URL(`https://apitfg.lapspartbox.com/series-ids-usuario/${userId}`);
    url.searchParams.append('value', value); // Agrega 'value' como parámetro de consulta

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

  if(value == 'Grupos'){
    console.log('Estamos en grupos, por lo que no hay series')
    setSeriesDetalles([])
  }else {
    obtenerSeriesDelUsuario(user.id, value).then(seriesIds => {
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
        //console.log(seriesDetalles); // Imprime los detalles de las series
      }).catch(error => console.error('Error:', error));
    });
  }

}


  // Efecto para cargar datos de una serie específica.
  useEffect(() => {
    llamarAGrupos();
    obtenerSeries();
  }, [ refrescar]); // El array vacío asegura que useEffect se ejecute solo una vez.
  
  // Función para navegar a la pantalla de ajustes.
  const handleSettings = () => {
    navigation.navigate('Settings');
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

  const [query, setQuery] = useState('');
  const [series, setSeries] = useState([]);
  

  const handleTextChange = (text) => {
    setQuery(text);
    
  };

  const buscarSeries = () => {
    const apiURL = `https://api.themoviedb.org/3/search/tv?api_key=c51082efa7d62553e4c05812ebf6040e&language=es-ES&page=1&query=${query}&include_adult=false`;
    fetch(apiURL)
      .then(response => response.json())
      .then(data => setSeries(data.results))
      .catch(error => console.error(error));
    console.log("Series Buscadas:")
    console.log(series)
  };

  const agregarSerieAUsuario = async (userId, idSerie) => {
    try {
      let response = await fetch('https://apitfg.lapspartbox.com/agregar-serie-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          idSerie: idSerie
        }),
      });
  
      let responseJson = await response.json();
      console.log('Respuesta del servidor:', responseJson);
      // Manejar la respuesta como sea necesario
    } catch (error) {
      //console.error('Error al enviar la solicitud:', error);
    }
  };
  

  const seleccionSerie = (text, idSerie) => {
    
    console.log("Se quire añadir " + text + ', con el id: ' + idSerie)
    Alert.alert(
      'Confirmación',
      `¿Estás seguro de que quieres añadir la serie: ${text}?`,
      [
        {
          text: 'Sí',
          onPress: async () => {
            // logica para añadir serie
            agregarSerieAUsuario(user.id,idSerie)
            resetearBusqueda();
            setRefrescar(prev => !prev);
          },
          
        },
        {
          text: 'No',
          style: 'cancel', // Pone este botón con un estilo de cancelar
          onPress: () => {
            // Lógica para añadir la serie
            resetearBusqueda
          }
        },
      ],
      { cancelable: false } // Evita que el cuadro de diálogo se cierre al tocar fuera de él
    );
  };

  const resetearBusqueda = () => {
    setQuery('');
    setSeries([]);
  };

  const navegarADetalles = (idSerie) => {
    // Aquí utilizas la función de navegación para ir a la pantalla de detalles
    // Asegúrate de haber definido la ruta y los parámetros adecuadamente en tu configurador de navegación
    navigation.navigate('Detalles Serie', { idSerie: idSerie, NombreGrupo: value });
  };


  const editarGrupo = (nombreGrupo) => {
    navigation.navigate('Editar Grupo', { nombreGrupo });
  }

  const verCalendario = (nombreGrupo) => {
    navigation.navigate('Calendario', { nombreGrupo });
  }
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
    <StatusBar></StatusBar>
      

    <View style={[globalStyles.container, styles.container, platformStyles]}>
  
  {/* Renderizado de la fila superior con las iniciales del usuario y el botón de grupos. */}
  <View style={styles.row }>
    <TouchableOpacity style={styles.circle} onPress={() => handleSettings()}>
      <Text style={styles.initials}>{iniciales}</Text>
    </TouchableOpacity>

 
   
    <Dropdown
      style={[styles.buttonGroup, isFocus && { borderColor: 'blue' }]}
      placeholderStyle={styles.buttonText}
      selectedTextStyle={styles.selectedTextStyle}
      backgroundColor='blur'
      containerStyle={{ backgroundColor:'#6666ff', borderRadius:15}}
      iconStyle={styles.iconStyle}
      data={TodosGrupos}
      labelField="Nombre_grupo"
      valueField={value}
      placeholder={value}
      value={value}
      maxHeight={500}
      itemTextStyle={{ textAlign: 'left', color:'white'}}
      //itemContainerStyle={{ backgroundColor: 'grey', borderRadius: 15}}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item.Nombre_grupo);
        obtenerSeries();
        setIsFocus(false);
        onRefresh()
      }}
      renderLeftIcon={() => (
        <Text style={styles.buttonText}>{value}</Text>
      )}
    />


    
    {/* Botón para añadir un nuevo grupo. */}
    <TouchableOpacity style={styles.circle} onPress={() => anadirGrupo()}>
      <Text style={styles.initials}>+</Text>
    </TouchableOpacity>
  </View>

  <TouchableWithoutFeedback onPress={() => resetearBusqueda()}>
  <View style={styles.searchContainer}>
  <View style={{ flexDirection: 'row'}}>
      <TextInput
        value={query}
        onChangeText={handleTextChange}
        placeholder="Buscar series..."
        style={styles.searchInput}
      />
      <TouchableOpacity onPress={buscarSeries} style={styles.cajaBoton}>
        <Text style={styles.searchButton}>Buscar</Text>
      </TouchableOpacity>
  </View>
    
    {series.length > 0 ? (
      <FlatList
        data={series}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={{borderColor:'black', borderBottomWidth:2}}  onPress={() => seleccionSerie(item.name, item.id)}>
          <Text style={styles.textoBuscadas} >{item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.flatList}
      />
    ) : null}
  </View>
</TouchableWithoutFeedback>


<View style={{ flexDirection: 'row', height:windowHeight * 0.7}}>
<ScrollView refreshControl={
    <RefreshControl

      refreshing={refrescando}
      onRefresh={onRefresh}
    />
  }>
  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  
    {seriesDetalles.map((detalle, index) => (
      <TouchableOpacity
        key={index}
        style={styles.serieDetailContainer}
        onPress={() => navegarADetalles(detalle.id)}
      >
<View style={{ flex: 1 }}>
            {poster(detalle.poster_path)}
          </View>
        
        <View style={{ flex: 5, marginBottom: '2%'}}>
            <Text style={styles.serieTitle }>{detalle.name}</Text> 
        </View>
        
      </TouchableOpacity>
    ))}
  </View>
</ScrollView>
</View>


<View style={{flexDirection:'row', textAlign: 'center'}}>
{
  value !== 'Grupos' &&
  <TouchableOpacity style={styles.editarGrupoBoton} onPress={() => editarGrupo(value)}>
    <Text style={styles.editarGrupoTexto}>Editar Grupo: {value}</Text>
  </TouchableOpacity>
  
}

{
  value !== 'Grupos' &&
<TouchableOpacity style={styles.editarGrupoBoton} onPress={() => verCalendario(value)}>
    <Text style={styles.editarGrupoTexto}>Ver Calendario</Text>
  </TouchableOpacity>
}

  </View>

</View>
</SafeAreaView>
  );  
  
};

const styles = StyleSheet.create({
  container: {
    
    alignItems: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row', // Mantiene los elementos en fila
    alignItems: 'center', // Alinea los elementos verticalmente
    justifyContent: 'space-between', // Distribuye el espacio uniformemente
    width: '100%',
    padding: 10, // Espacio alrededor del contenedor
  },
  circle: {
    aspectRatio: 1, // Asegura que el ancho y la altura sean siempre iguales
    borderRadius: 1000, // Un número grande para asegurarse de que los bordes sean completamente redondos
    backgroundColor: '#6666ff', // Color de fondo del círculo
    alignItems: 'center',
    marginRight: '1%', // Margen derecho para separar del botón de grupos
    marginLeft: '1%',
    flex: 1, // Asigna igual espacio a cada elemento
    justifyContent: 'center', // Centra el contenido
  },
  initials: {
    fontSize: 25,
    color: 'white', // Color de las iniciales
    fontWeight: 'bold', // Negrita para las iniciales
  },
  buttonGroup: {
    height: '100%',
    flexDirection: 'row', // Orientación horizontal para el texto y el ícono
    backgroundColor: '#6666ff', // Color de fondo del botón de grupos
    paddingHorizontal: 20, // Padding horizontal
    paddingVertical: 10, // Padding vertical
    borderRadius: 15, // Bordes redondeados
    justifyContent: 'center', // Centrado horizontal
    alignItems: 'center', // Centrado vertical
    flex: 4, // Ocupa más espacio que los círculos
    flexDirection: 'row',
    justifyContent: 'center',
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    textAlign: 'center', // Centrar el texto
    fontSize: 16,
  },serieTitle: {
    marginTop:'5%',
    fontSize: 12, // Tamaño grande para el título
    fontWeight: 'bold', // Negrita para resaltar
    color: '#4A90E2', // Un color llamativo pero no demasiado intenso
    marginBottom: '1%', // Espacio debajo del título
    textAlign: 'center', // Centrar el texto
    paddingHorizontal: 10, // Espacio horizontal para no pegar al borde
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle:{
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  poster: {
    height: windowHeight * 0.19, // Ajusta la altura como prefieras
    resizeMode: 'contain', // Esto asegura que la imagen se ajuste al espacio disponible manteniendo su relación de aspecto

  },serieDetailContainer: {
    width: '33%', // Asegúrate de que sea 100% para que cada elemento tenga su propia fila
    padding: 10, // Añade algo de espacio alrededor de cada serie
    flexDirection: 'column',
    
  },searchInput: {
    flex: 1, 
    borderWidth: 1,
    borderColor: '#ddd',
    padding: '4%',
    borderRadius: 8,
    marginBottom: '2%',
    fontSize: 16,
    backgroundColor: '#fff',

  },searchContainer:{
    width: '80%',
    flexDirection: 'column',
 
  }, flatList:{
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor:'white'
  },textoBuscadas:{
    margin:'5%',
  },searchButton:{
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#005f99',
    borderRadius: 10,
    padding:'4%',
    
    
  },cajaBoton:{
    flexDirection: 'row',
    alignItems:'center',
    paddingBottom: 10,
    marginLeft:'2%'

  },editarGrupoBoton:{
    backgroundColor: 'grey', // Color de fondo
    padding: 10, // Relleno
    margin: '2%', 
    alignItems: 'center', // Alinea el texto al centro
    borderRadius: 5, // Bordes redondeados
  },editarGrupoTexto:{
    color: 'white', // Color del texto
    fontSize: 16, // Tamaño del texto
  }
});

export default HomeScreen;
