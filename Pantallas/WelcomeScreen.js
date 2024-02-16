import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import logoFST from '../assets/logoFST.jpg';
import { Dimensions } from 'react-native';
import { globalStyles } from '../estilosGlobales.js';
import {dynamoDb, obtenerTodosLosItemsDeDynamoDB } from '../database.js'

const windowWidth = Dimensions.get('window').width;

export default function WelcomeScreen({ navigation }) {
  
  const handleLoginPress = () => {
    obtenerTodosLosItemsDeDynamoDB()
    console.log('Login pressed');
    navigation.navigate('LogInScreen') // Navegar a la pantalla 'Home' al presionar
    // Aquí iría la lógica para manejar el inicio de sesión
  };

  const handleCreateAccountPress = () => {
    obtenerTodosLosItemsDeDynamoDB()
    console.log('Create Account pressed');
    navigation.navigate('SignUp') // Navegar a la pantalla 'Home' al presionar
    // Aquí iría la lógica para manejar la creación de la cuenta
  };

  return (
    <View style={globalStyles.container}>
      <Image source={logoFST} style={styles.logo} />
        <Text style={styles.titulo}>FamilySeriesTrack</Text>

        <TouchableOpacity style={globalStyles.button} onPress={handleLoginPress}>
          <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.buttonOutline} onPress={handleCreateAccountPress}>
          <Text style={globalStyles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>
    
      
    </View>
  );
}

const styles = StyleSheet.create({
  
  logo: {
    marginTop: '10%',
    width: windowWidth,
    height: windowWidth * (windowWidth / windowWidth),
  },

  
  titulo: {
    fontSize: 40,
    marginBottom: 20,
    marginTop: 50,
  }
});
