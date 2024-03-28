import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../estilosGlobales.js';
import { useUser } from '../userContext.js';

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

      try {
        let response = await fetch(`http://apitfg.lapspartbox.com/usuario/${userId}`, {
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
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    marginBottom: '5%',
    width: 100,
    height: 100,
    borderRadius: 50,
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
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputGroup: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '0.05%',
    justifyContent: 'center',
  },
  label: {
    marginBottom: '1%'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    width: '80%'
  },
});

export default Settings;