import React, { useState } from 'react';
import logoFST from '../assets/logoFST.jpg';
import { useNavigation } from '@react-navigation/native';
import { dynamoDb } from '../database.js';
import { useUser } from '../userContext'; // Importa el hook useUser
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

  const handleBiometricAuth = async () => {
    // Verifica si la autenticación biométrica es compatible
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      alert('Tu dispositivo no es compatible con la autenticación biométrica.');
      return;
    }
  
    // Verifica qué tipos de autenticación biométrica están disponibles
    const { available, biometryType } = await LocalAuthentication.supportedAuthenticationTypesAsync();
  
    if (!available) {
      alert('La autenticación biométrica no está disponible en este dispositivo.');
      return;
    }
  
    // Configurar mensaje basado en el tipo de biometría disponible
    let promptMessage = 'Autenticar';
    if (biometryType === LocalAuthentication.AuthenticationType.FINGERPRINT) {
      promptMessage = 'Usar Touch ID';
    } else if (biometryType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) {
      promptMessage = 'Usar Face ID';
    }
  
    // Intenta autenticar usando biometría
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Usar contraseña',
      });
  
      if (result.success) {
        // Autenticación exitosa, navega o realiza alguna acción
        navigation.navigate('Home');
      } else {
        // Manejo si el usuario cancela o falla la autenticación
        console.log('Autenticación fallida o cancelada');
      }
    } catch (error) {
      console.error('Error en la autenticación biométrica', error);
    }
  };
  
  

  async function handleLogin() {
    const params = {
      TableName: 'Usuarios',
      FilterExpression: 'Email = :email AND Password = :password',
      ExpressionAttributeValues: {
        ':email': username,
        ':password': password,
      },
    };
  
    try {
      const data = await dynamoDb.scan(params).promise();
      if (data.Items.length > 0) {
        const user = data.Items[0]; // Asigna el primer usuario devuelto a 'user'
        setUser({
          id: user.id, // Asegúrate de que estos campos coincidan con los de tu tabla DynamoDB
          nombre: user.Nombre,
          apellidos: user.Apellidos,
          email: user.Email,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        alert('Contraseña o Email incorrectos')
        console.log('Contraseña o Email incorrectos')
      }
    } catch (error) {
      console.error('Error al buscar en DynamoDB:', error);
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

<AppleAuthentication.AppleAuthenticationButton
  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
  cornerRadius={10}
  style={styles.button}
  onPress={async () => {
    try {
      console.log('Dentro del try de apple')
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Imprime los datos obtenidos
      console.log('Nombre completo:', credential.fullName);
      console.log('Apellido:', credential.fullName.familyName);
      console.log('Email:', credential.email);
      // Continúa con tu lógica de autenticación, por ejemplo, crear un nuevo usuario
      // en tu base de datos con estos datos o vincularlo con un usuario existente.
    } catch (e) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        console.log('Inicio de sesión con Apple cancelado por el usuario');
      } else {
        console.error('Error al iniciar sesión con Apple:', e);
      }
    }
  }}
/>

      
<TouchableOpacity
          style={styles.button}
          onPress={handleBiometricAuth}
        >
          <Text style={styles.text}>Iniciar Sesión con Biometría</Text>
        </TouchableOpacity>
    
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
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
