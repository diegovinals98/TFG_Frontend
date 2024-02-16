import { View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  button,
  Dimensions
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../estilosGlobales.js';
const windowHeigh = Dimensions.get('window').height;
import { useUser } from '../userContext.js'; // Importa el hook useUser
import { StatusBar } from 'expo-status-bar';




const HomeScreen = () => {
  

  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useUser(); // Accede a los datos del usuario y la función para actualizarlos
  
  const iniciales = user?.nombre ? `${user?.nombre.charAt(0)}${user?.apellidos.charAt(0)}` : '';

  const handleSettings = () => {
    navigation.navigate('Settings');
  }
  
  return (
    
    <View style={[globalStyles.container, styles.container]}>
      <StatusBar/>

      <View style={styles.row}>
    <TouchableOpacity style={styles.circle} onPress={() => handleSettings()}>
      <Text style={styles.initials}>{iniciales}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.buttonGroup} onPress={() => { /* Tu lógica de manejo de grupos aquí */ }}>
      <Text style={styles.buttonText}>GRUPOS</Text>
      <Text style={styles.dropdownIcon}>▼</Text>
    </TouchableOpacity>
  </View>
      
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
});

export default HomeScreen;
