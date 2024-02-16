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
import { dynamoDb } from '../database.js';

const Settings = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contrasena, setContrasena] = useState('');

  const iniciales = user?.nombre ? `${user?.nombre.charAt(0)}${user?.apellidos.charAt(0)}` : '';

  async function updateUser(userId, newNombre, newApellidos, newEmail, newContrasena) {
    const params = {
      TableName: "Usuarios",
      Key: {
        "id": userId, // Asegúrate de que 'id' sea la clave de partición o una parte de la clave principal de tu tabla
      },
      UpdateExpression: "set Nombre = :n, Apellidos = :a, Email = :e, Password = :c",
      ExpressionAttributeValues: {
        ":n": newNombre,
        ":a": newApellidos,
        ":e": newEmail,
        ":c": newContrasena,
      },
      ReturnValues: "UPDATED_NEW", // Devuelve los atributos del ítem después de la actualización
    };
  
    try {
      const data = await dynamoDb.update(params).promise();
      console.log("Datos del usuario actualizados:", data);
      // Actualiza el estado global del usuario
      setUser({
        id: userId,
        nombre: newNombre,
        apellidos: newApellidos,
        email: newEmail,
        // Es recomendable no almacenar la contraseña en el estado global
      });
      alert('Datos del usuario actualizados correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar usuario en DynamoDB:", error);
      alert('Error al actualizar usuario.');
    }
  }

  const guardarCambios = () => {
    if (nombre.trim() && apellidos.trim() && email.trim() && contrasena.trim()) {
      updateUser(user.id, nombre, apellidos, email, contrasena);
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
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            style={styles.input}
            onChangeText={setContrasena}
            value={contrasena}
            placeholder="Contraseña"
            secureTextEntry
          />
        </View>

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
  }
});

export default Settings;