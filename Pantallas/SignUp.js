
import React, { useState} from "react";

import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../estilosGlobales.js';
import logoFST from '../assets/logoFST.jpg';
import { añadirItemADynamoDB } from '../database.js';


import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

const windowWidth = Dimensions.get('window').width;




const SignUp = ({ props, navigation }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [emailError, setEmailError] = useState('');
  


  const volver = () =>{
    navigation.goBack()
  }
  
  // Función para validar el formato del correo electrónico
  const validateEmail = (email) => {
    // Expresión regular para verificar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejar el cambio en el campo de entrada de correo electrónico
  const handleEmailChange = (newText) => {
    setEmail(newText);
    // Verificar si el correo electrónico es válido
    if (!validateEmail(newText)) {
      setEmailError('¡Esto no es un correo electrónico válido!');
    } else {
      setEmailError('');
    }
  };

  function generarIdUnico() {
    // Genera un número aleatorio entre 1 y 9999999
    return Math.floor(Math.random() * 9999999) + 1;
  }


  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      alert("Por favor, introduce un correo electrónico válido.");
      return;
    }
  
    const usuario = {
      Id: generarIdUnico(), // Genera un ID único
      Nombre: nombre,
      Usuario: email,
      Contraseña: password
    };
  
    try {
      let response = await fetch('http://10.0.0.36:3000/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario)
      });
  
      if (response.ok) {
        alert('Usuario creado con éxito');
        navigation.navigate('Welcome');
      } else {
        alert('Error al crear el usuario');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container} >

      <Image source={logoFST} style={styles.logo} />
        <Text style={styles.title}>Crear Cuenta</Text>

        <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#666"
        onChangeText={newText => setNombre(newText)}
        secureTextEntry={false}
        autoCapitalize="none"
        />

        <TextInput
        style={styles.input}
        placeholder="Apellidos"
        placeholderTextColor="#666"
        onChangeText={newText => setApellidos(newText)}
        secureTextEntry={false}
        autoCapitalize="none"
        />

        <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        onChangeText={handleEmailChange}
        autoCapitalize="none"
        />
      {/* Mostrar el mensaje de error si el correo electrónico no es válido */}
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            style={styles.input}
            onChangeText={newText => setPassword(newText)}
            //value={number}
            placeholder="Contraseña"
            keyboardType="default"
            secureTextEntry={true}
            placeholderTextColor={'#cacaca'}
          />

          <TouchableOpacity style={globalStyles.button} title="Check user" onPress={() => handleSignUp()}>
            <Text style = {globalStyles.buttonText} >Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[globalStyles.button, globalStyles.buttonOutline]} onPress={() => volver()}>
            <Text style = {globalStyles.buttonText} >Volver</Text>
          </TouchableOpacity>
  
    </View>
    </TouchableWithoutFeedback>
    
  )
} 

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#f7f7f7', // Un fondo claro para la accesibilidad
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
    display: 'flex', // 'display: flex' es el valor predeterminado en React Native, así que no es necesario.
    width: '80%', // En React Native usamos unidades sin 'px'.
    borderWidth: 1,
    borderColor: '#ddd', // Un color más suave para el borde
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff', // Fondo blanco para los campos de entrada
  },
  
  text1:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white'
  },
  button2:{
    alignItems: 'left',
    justifyContent: 'left',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    width:400,
    elevation: 3,
    backgroundColor: 'white',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#005f99',
  },
  
  text2:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'normal',
    letterSpacing: 0.25,
    color: '#489dff',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#222', // Un color oscuro para el título para contraste
    marginBottom: 30,
  },
  logo: {
    width: windowWidth * 0.6,
    height: windowWidth * 0.6 * (windowWidth  / windowWidth),
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
