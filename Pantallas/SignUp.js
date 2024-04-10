
import React, { useState } from "react";
import { globalStyles } from '../estilosGlobales.js';
import logoFST from '../assets/logoFST.png';
import { useUser } from '../userContext.js'; // Importa el hook useUser
import * as Crypto from 'expo-crypto';
import { SafeAreaView } from "react-native";



import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

// Obtiene el ancho de la ventana del dispositivo
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Componente SignUp para el registro de usuarios
const SignUp = ({ navigation }) => {
  
  // Estados para manejar la entrada de datos del usuario
  const [nombreUsuario, setnombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useUser();


  // Función para volver a la pantalla anterior
  const volver = () => {
    navigation.goBack();
  };

  // Función para generar un ID único para cada usuario
  function generarIdUnico() {
    return Math.floor(Math.random() * 9999999) + 1;
  }

  // Funcion que valida si la contraseña cumple con una serie de requisitos
  function validarContraseña(contraseña) {
    const longitudValida = contraseña.length >= 8; // Verifica la longitud mínima de 8 caracteres
    const tieneMayuscula = /[A-Z]/.test(contraseña); // Verifica la presencia de al menos una letra mayúscula
    const tieneNumero = /[0-9]/.test(contraseña); // Verifica la presencia de al menos un número
  
    return longitudValida && tieneMayuscula && tieneNumero;
  }
  

  // Manejador para el registro de un nuevo usuario
  const handleSignUp = async () => {
    if (password !== password2) {
      alert('Contraseñas no coinciden');
    } else if (!validarContraseña(password)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número');
    } else {
      try {
        // Utiliza expo-crypto para generar un hash de la contraseña
        const hash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA512,
          password
        );
  
        // Crea un objeto de usuario con la información proporcionada y el hash de la contraseña
        const usuario = {
          Id: generarIdUnico(), // Genera un ID único
          Nombre: nombre,
          Apellidos: apellidos,
          Usuario: nombreUsuario,
          Contraseña: hash // Guarda el hash de la contraseña
        };
  
        // Intenta registrar al usuario en el servidor
        let response = await fetch('https://apitfg.lapspartbox.com/usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usuario)
        });

        let respuesta = await response.json();
  
        console.log('Respuesta al crear usuario' , respuesta)
        // Verifica si el registro fue exitoso
        if (respuesta.success == 1) {
          //Alert.alert('Usuario creado con éxito');
          // Asegúrate de que estos campos coincidan con los nombres en tu base de datos
          setUser({
            id: usuario.Id,
            nombre: usuario.Nombre,
            apellidos: usuario.Apellidos,
            usuario: usuario.Usuario,
            contraseña: usuario.Contraseña,
          });
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {

          Alert.alert('Error', respuesta.message);
        }
      } catch (error) {
        console.error('Error al registrar al usuario:', error);
        Alert.alert('Error al registrar al usuario');
      }
    }
  };
  
  return (
    
    <KeyboardAvoidingView
      behavior={ "padding"} // "padding" para iOS y "height" para Android
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 200}
    >
    
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
        autoCapitalize="words"
        autoComplete="given-name"
        />

        <TextInput
        style={styles.input}
        placeholder="Apellidos"
        placeholderTextColor="#666"
        onChangeText={newText => setApellidos(newText)}
        secureTextEntry={false}
        autoCapitalize="words"
        autoComplete="family-name"
        />

        <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        placeholderTextColor="#666"
        onChangeText={newText => setnombreUsuario(newText)}
        autoCapitalize="none"
        autoComplete="username"
        />
    
          <TextInput
            style={styles.input}
            onChangeText={newText => setPassword(newText)}
            //value={number}
            placeholder="Contraseña"
            keyboardType="default"
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor={'#cacaca'}
          />

          <TextInput
            style={styles.input}
            onChangeText={newText => setPassword2(newText)}
            //value={number}
            placeholder="Repite la contraseña"
            keyboardType="default"
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor={'#cacaca'}
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity style={globalStyles.button} title="Check user" onPress={() => handleSignUp()}>
            <Text style = {globalStyles.buttonText} >Crear Cuenta</Text>
          </TouchableOpacity>
     

          <TouchableOpacity style={[globalStyles.button, globalStyles.buttonOutline]} onPress={() => volver()}>
            <Text style = {globalStyles.buttonText} >Volver</Text>
          </TouchableOpacity>
  
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  )
} 

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7', // Un fondo claro para la accesibilidad
    //backgroundColor: '#ffffff',
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
    width: windowHeight * 0.3,
    height: windowHeight * 0.3,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    width: '80%'
  },
});
