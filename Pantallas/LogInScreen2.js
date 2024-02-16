import React, { useState } from 'react';
import logoFST from '../assets/logoFST.jpg';
import { useNavigation } from '@react-navigation/native';
import { dynamoDb } from '../database.js';
import { useUser } from '../userContext.js'; // Importa el hook useUser
import * as AppleAuthentication from 'expo-apple-authentication';
import * as LocalAuthentication from 'expo-local-authentication';

import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';


const windowWidth = Dimensions.get('window').width;
const LogInScreen = () => {
  
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { setUser } = useUser();


  async function handleLogin(username, password) {
    try {
      let response = await fetch('http://10.0.0.36:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if(response.ok) {
        const users = await response.json();
        // Encuentra el usuario que coincide con el nombre de usuario y la contraseña
        const user = users.find(u => u.Usuario === username && u.Contraseña === password);
        if (user) {
          setUser({
            id: user.Id,
            nombre: user.Nombre,
            usuario: user.Usuario,
            // ...otros campos que quieras asignar
          });
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      } else {
        alert('Error al obtener la lista de usuarios');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
    <Image source={logoFST} style={styles.logo} />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


  
    
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLogin(username, password)}
          >
            <Text style={styles.text}>Iniciar Sesión</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.text, styles.buttonOutlineText]}>Volver</Text>
          </TouchableOpacity>
    
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    //backgroundColor: '#f7f7f7', // Un fondo claro para la accesibilidad
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#222', // Un color oscuro para el título para contraste
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd', // Un color más suave para el borde
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff', // Fondo blanco para los campos de entrada
  },
  button:{
    display: 'flex', // 'display: flex' es el valor predeterminado en React Native, así que no es necesario.
    width: '80%', // En React Native usamos unidades sin 'px'.
    height: '5%',
    justifyContent: 'center', // En React Native usamos camelCase en lugar de guiones.
    alignItems: 'center',
    flexShrink: 0, // Esta propiedad funciona igual que en CSS.
    backgroundColor: '#005f99', // Ejemplo de color azul, ya que no especificaste un color.
    borderRadius: 10, // Si quieres mantener los bordes redondeados como en tu estilo original.
    margin: 10, // Para dar un poco de padding vertical si es necesario.
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#005f99',
    display: 'flex', // 'display: flex' es el valor predeterminado en React Native, así que no es necesario.
    width: '80%', // En React Native usamos unidades sin 'px'.
    height: '5%',
    justifyContent: 'center', // En React Native usamos camelCase en lugar de guiones.
    alignItems: 'center',
    flexShrink: 0, // Esta propiedad funciona igual que en CSS.
    borderRadius: 10, // Si quieres mantener los bordes redondeados como en tu estilo original.
    margin: 10, // Para dar un poco de padding vertical si es necesario.
  },
  buttonOutlineText: {
    color: '#005f99',
  },
  text:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black'
  },
  logo: {
    marginTop: '-20%',
    width: windowWidth * 0.6,
    height: windowWidth * 0.6 * (windowWidth  / windowWidth),
  },
});

export default LogInScreen;
