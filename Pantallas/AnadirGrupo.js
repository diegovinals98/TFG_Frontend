// Importaciones de React, React Native y otras librerías.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../estilosGlobales.js'; // Importa estilos globales.

// Obtiene las dimensiones de la ventana del dispositivo.
const windowHeigh = Dimensions.get('window').height;

// Componente principal de la pantalla de inicio.
const AnadirGrupo = () => {
  

  // Renderizado del componente.
  return (
    <View style={[globalStyles.container, styles.container]}>
      
      
    </View>
  );
};



const styles = StyleSheet.create({
  
});

export default AnadirGrupo;
