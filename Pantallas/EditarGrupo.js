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

// Componente principal de la pantalla de inicio.
const EditarGrupo = () => {
  // Hook de navegación y rutas de react-navigation.
   // Hook de navegación y rutas de react-navigation.
   const route = useRoute();

   // Accede al nombre del grupo pasado como parámetro
   const { nombreGrupo } = route.params;
     // Accede a los datos del usuario desde el contexto.
  const { user } = useUser();
 
   // Accede a los datos del usuario desde el contexto.
   // const { user } = useUser(); // Asumiendo que tienes un contexto para los datos del usuario
 
   return (
     <View style={[globalStyles.container, styles.container]}>
       {/* Renderiza el nombre del grupo o lo que necesites aquí */}
       <Text>Editar Grupo: {nombreGrupo}</Text>
     </View>
   );


  
  
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '15%',
    alignItems: 'center',
    flex: 1,
  },
  
});

export default EditarGrupo;
