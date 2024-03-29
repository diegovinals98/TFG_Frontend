
import React, { useState } from "react";
import { globalStyles } from '../estilosGlobales.js';
import logoFST from '../assets/logoFST.jpg';
import { useUser } from '../userContext.js'; // Importa el hook useUser

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
  Alert
} from 'react-native';

// Obtiene el ancho de la ventana del dispositivo
const windowWidth = Dimensions.get('window').width;

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

    // Verifica si las contraseñas coinciden
    if(password != password2){
      alert('Contraseñas no coinciden');
    } else if(!validarContraseña(password)){
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número');
      return;
    }else {
      // Crea un objeto de usuario con la información proporcionada
      const usuario = {
        Id: generarIdUnico(), // Genera un ID único
        Nombre: nombre,
        Apellidos: apellidos,
        Usuario: nombreUsuario,
        Contraseña: password
      };
    
      // Intenta registrar al usuario en el servidor
      try {
        let response = await fetch('https://apitfg.lapspartbox.com/usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usuario)
        });
    
        // Verifica si el registro fue exitoso
        if (response.ok) {
          Alert.alert('Usuario creado con éxito');
          setUser({
            id: usuario.Id, // Asegúrate de que estos campos coincidan con los nombres en tu base de datos
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
          Alert.alert('Error al crear el usuario');
        }
      } catch (error) {
        console.error(error);
      }
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
        placeholder="Nombre de Usuario"
        placeholderTextColor="#666"
        onChangeText={newText => setnombreUsuario(newText)}
        autoCapitalize="none"
        />
    
          <TextInput
            style={styles.input}
            onChangeText={newText => setPassword(newText)}
            //value={number}
            placeholder="Contraseña"
            keyboardType="default"
            secureTextEntry={true}
            placeholderTextColor={'#cacaca'}
          />

          <TextInput
            style={styles.input}
            onChangeText={newText => setPassword2(newText)}
            //value={number}
            placeholder="Repite la contraseña"
            keyboardType="default"
            secureTextEntry={true}
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
    width: windowWidth * 0.6,
    height: windowWidth * 0.6 * (windowWidth  / windowWidth),
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    width: '80%'
  },
});
