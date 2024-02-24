// Importaciones de React, React Native y otras librerías.
import React, { useEffect, useState } from 'react';
import { View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions,
    Modal,
    TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../estilosGlobales.js'; // Importa estilos globales.

// Obtiene las dimensiones de la ventana del dispositivo.
const windowHeigh = Dimensions.get('window').height;

// Componente principal de la pantalla de inicio.
const AnadirGrupo = () => {

    const [nombreGrupo, setnombreGrupo] = useState() // Estado para almacenar el nombre del grupo.

  // Renderizado del componente.
  return (
    <View style={[globalStyles.container, styles.container]}>

      {/* Sección de entrada para el nombre del grupo */}
      <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Grupo</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setnombreGrupo} // Función para actualizar el estado con el texto ingresado.
            placeholder="Nombre del grupo" // Placeholder para guiar al usuario sobre qué debe ingresar.
          />
        </View>

      {/* Otras secciones y componentes pueden ser agregados aquí */}  
      
    </View>
  );
};

// Estilos para el componente.
const styles = StyleSheet.create({
  
});

export default AnadirGrupo;
