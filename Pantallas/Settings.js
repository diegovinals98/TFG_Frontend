import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Button,
  Alert,
  Dimensions
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../estilosGlobales.js';
import { useUser } from '../userContext.js';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const windowHeight = Dimensions.get('window').height;


const Settings = () => {

  const navigation = useNavigation();
  const { user, setUser } = useUser();
  const [errorMessage, setErrorMessage] = useState('');

  // Los datos del usuario, para usarlos, hay que poner {id} o {nombre}
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [usuario, setUsuario] = useState(user?.usuario || '');
  const [contrasena, setContrasena] = useState('');
  const [contrasena2, setContrasena2] = useState('');
  const [id, setId] = useState(user?.id || '');


  const iniciales = user?.nombre ? `${user?.nombre.charAt(0)}${user?.apellidos.charAt(0)}` : '';

  function validarContraseña(contraseña) {
    const longitudValida = contraseña.length >= 8; // Verifica la longitud mínima de 8 caracteres
    const tieneMayuscula = /[A-Z]/.test(contraseña); // Verifica la presencia de al menos una letra mayúscula
    const tieneNumero = /[0-9]/.test(contraseña); // Verifica la presencia de al menos un número
  
    return longitudValida && tieneMayuscula && tieneNumero;
  }
  

  async function updateUser(userId, newNombre, newApellidos, newUsuario, newContrasena) {
    console.log(contrasena)
    console.log(contrasena2)

    // Verifica si las contraseñas coinciden
    if(contrasena != contrasena2){
      alert('Contraseñas no coinciden');
    } else if(!validarContraseña(contrasena)){
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número');
      return;
    }else{
      // Utiliza expo-crypto para generar un hash de la contraseña
      const newContrasena = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        contrasena
      );
      try {
        let response = await fetch(`https://apitfg.lapspartbox.com/usuario/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newNombre,
            newApellidos,
            newUsuario,
            newContrasena
          })
        });
    
        if (response.ok) {
          console.log("Datos del usuario actualizados correctamente.");
          setUser({
            id: userId,
            nombre: newNombre,
            apellidos: newApellidos,
            usuario: newUsuario,
            // Es recomendable no almacenar la contraseña en el estado global
          });
          alert('Datos del usuario actualizados correctamente.');
          navigation.goBack();
        } else {
          console.error('Error al actualizar el usuario:', response);
          alert('Error al actualizar usuario.');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al actualizar usuario.');
      }

    }

    
  }

  async function eliminarCuenta(idUser){
    Alert.alert(
      `¿Estás seguro de que quieres eliminar la cuenta?`,
      `Se borrará toda la Información`,
      [
        {
          text: 'Sí',
          onPress: async () => {
            //logica dfe borrar cuenta
            try {
              // Ajusta esta URL según sea necesario para apuntar a tu servidor real
              const response = await fetch(`https://apitfg.lapspartbox.com/eliminar-cuenta/${idUser}`, {
                method: 'DELETE',
              });
          
              if (response.ok) {
                const data = await response.text(); // o response.json() si esperas una respuesta JSON
                console.log('Cuenta eliminada:', data);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                });
                // Aquí puedes agregar código para manejar la actualización de la UI,
                // como remover el grupo eliminado de la lista mostrada al usuario.
              } else {
                // Manejo de respuestas no exitosas
                console.error('Error al eliminar la cuenta');
                alert('Error al eliminar la cuenta.');
              }
            } catch (error) {
              // Manejo de errores de red o al realizar la solicitud
              console.error('Error al conectar con el servidor:', error);
              alert('Error al conectar con el servidor.');
            }
          },
          
        },
        {
          text: 'No',
          style: 'cancel', // Pone este botón con un estilo de cancelar
          onPress: () => {
            // Lógica para añadir la serie
            //resetearBusqueda
          }
        },
      ],
      { cancelable: false } // Evita que el cuadro de diálogo se cierre al tocar fuera de él
    );
  }

  
  

  const guardarCambios = () => {
    if (nombre.trim() && apellidos.trim() && usuario.trim() && contrasena.trim()) {
      updateUser(user.id, nombre, apellidos, usuario, contrasena);
    } else {
      alert('Por favor, rellena todos los campos.');
    }
  };

  const cerrarSesion = () =>{
    navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
  }

  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"} // "padding" para iOS y "height" para Android
  style={{ flex: 1 }}
>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[globalStyles.container, styles.container]}>
        <View style={styles.circle}>
          <Text style={styles.initials}>{iniciales}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setNombre}
            value={nombre}
            placeholder="Nombre"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setApellidos}
            value={apellidos}
            placeholder="Apellidos"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de Usuario</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setUsuario}
            value={usuario}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setContrasena}
            value={contrasena}
            placeholder="Nueva Contraseña"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Repite Nueva Contraseña</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setContrasena2}
            value={contrasena2}
            placeholder="Repite Nueva Contraseña"
            secureTextEntry
          />
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={globalStyles.button} onPress={guardarCambios}>
          <Text style={globalStyles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[globalStyles.button, globalStyles.buttonOutline]} onPress={() => cerrarSesion()}>
        <Text style = {globalStyles.buttonText} >Cerrar Sesión</Text>
      </TouchableOpacity>
      <View style={styles.eliminar}>
        <Button title='Eliminar Cuenta' color= 'black' onPress={() => eliminarCuenta(user.id)}></Button>  
      </View>
      
      </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },eliminar:{
    backgroundColor:'red',
    borderRadius: 10,
    width:'80%',
    margin: '2%',
   
  },
  circle: {
    marginBottom: '5%',
    width: windowHeight * 0.1,
    height: windowHeight * 0.1,
    borderRadius: 10000,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: windowHeight * 0.015,
    borderRadius: 10,
    marginBottom: '3%',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputGroup: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight * 0.1
    
  },
  label: {
    marginBottom: '1%'
  },
  errorText: {
    color: 'red',
    width: '80%',
    justifyContent: 'center'
  },
});

export default Settings;