import { React, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import logoFST from '../assets/logoFST.jpg';
import { Dimensions } from 'react-native';
import { globalStyles } from '../estilosGlobales.js';

const windowWidth = Dimensions.get('window').width;

export default function WelcomeScreen({ navigation }) {
  // data: Almacena datos de usuarios.
  const [todosUsuarios, settodosUsuarios] = useState([]);

  const imprimirUsuarios = (usuarios) => {
    console.log("---------------------- USUARIOS ----------------------");
    usuarios.forEach((usuario, index) => {
      console.log(`----------- Usuario ${index + 1}----------- `);
      console.log();
      console.log(`ID: ${usuario.Id}, Nombre: ${usuario.Nombre}, Apellidos: ${usuario.Apellidos}, Usuario: ${usuario.Usuario}, Contraseña : ${usuario.Contraseña}`);
      console.log();
    });
  };
  
  const handleLoginPress = () => {
    fetch('http://apitfg.lapspartbox.com/usuario')
      .then((response) => response.json())
      .then((json) => {
        settodosUsuarios(json);
        imprimirUsuarios(json); // Llama a una función para imprimir los usuarios
      })
      .catch((error) => console.error(error));

    console.log('Login pressed');
    navigation.navigate('LogInScreen'); // Navegar a la pantalla 'LogInScreen'
  };

  const handleCreateAccountPress = () => {
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
