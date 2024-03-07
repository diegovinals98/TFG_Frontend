// Importaciones de React, React Native y otras librerías.
import React, { useEffect, useState } from 'react';

import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  TextInput, 
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  Button,
  Alert,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../estilosGlobales.js'; // Importa estilos globales.
import { SelectCountry, Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';




// Obtiene las dimensiones de la ventana del dispositivo.
const windowHeigh = Dimensions.get('window').height;

const EditarGrupo = () => {
  const route = useRoute()
  const [nombreGrupo,setNombregrupo ] = useState(route.params.nombreGrupo)
  const { user } = useUser();
  const [miembros, setMiembros] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNombreGrupo, setEditedNombreGrupo] = useState(nombreGrupo);
  const [idGrupo,  setIdGrupo] = useState();
  const [refrescar, setRefrescar] = useState(false);
  const navigation = useNavigation();
  


  useEffect(() => {
    const fetchMiembrosGrupo = async () => {
      try {
        // Asume que el servidor está corriendo en localhost y tu dispositivo puede acceder a él por esta dirección
        const response = await fetch(`http://10.0.0.36:3000/miembros-grupo/${nombreGrupo}`);
        const data = await response.json();
        setMiembros(data.members);
        setIdGrupo(data.groupId)
        console.log(data)
      } catch (error) {
        console.error('Error al obtener miembros del grupo:', error);
      }
    };

    fetchMiembrosGrupo();
  }, [nombreGrupo, refrescar]);

  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = async () => {
    // Aquí deberías agregar la lógica para guardar el nombre del grupo editado
    // Por ejemplo, actualizar el estado en el servidor o en tu estado global
    setIsEditing(false);
    try {
      const response = await fetch(`http://10.0.0.36:3000/actualizar-nombre-grupo/${idGrupo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoNombre: editedNombreGrupo,
        }),
      });

      console.log(response)
  
      if (response.ok) {
        const data = await response.text(); // o response.json() si tu servidor devuelve un JSON
        console.log('Respuesta del servidor:', data);
        alert('Nombre del grupo actualizado correctamente.');
        setNombregrupo(editedNombreGrupo);
        setRefrescar(prev => !prev);
        
      } else {
        console.error('Error al actualizar el nombre del grupo');
        alert('Error al actualizar el nombre del grupo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
    

  };

  const eliminargrupo = async (idGrupo) => {
    Alert.alert(
      'Confirmación',
      `¿Estás seguro de que quieres eliminar el grupo: ${nombreGrupo}?`,
      [
        {
          text: 'Sí',
          onPress: async () => {
            try {
              // Ajusta esta URL según sea necesario para apuntar a tu servidor real
              const response = await fetch(`http://10.0.0.36:3000/eliminar-grupo/${idGrupo}`, {
                method: 'DELETE',
              });
          
              if (response.ok) {
                const data = await response.text(); // o response.json() si esperas una respuesta JSON
                console.log('Grupo eliminado:', data);
                navigation.navigate('Home')
                // Aquí puedes agregar código para manejar la actualización de la UI,
                // como remover el grupo eliminado de la lista mostrada al usuario.
              } else {
                // Manejo de respuestas no exitosas
                console.error('Error al eliminar el grupo');
                alert('Error al eliminar el grupo.');
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
  };
  

  return (
    <View style={[styles.contenedorPrincipal]}>


    <View style={styles.container}>
      {isEditing ? (
        <View style={styles.contenedorNombre}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            value={editedNombreGrupo}
            onChangeText={setEditedNombreGrupo}
            autoFocus={true}
            onBlur={handleSave}
            style={{flex: 1, padding: 0}} // Ajusta el estilo para que se mezcle con el contenedor
          />
        </View>
      ) : (
        <View style={styles.contenedorNombre}>
          <Text style={styles.label}>Nombre: </Text>
          <Text style={styles.nombregrupo}>{nombreGrupo}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title={isEditing ? "Guardar" : "Editar Nombre"} onPress={isEditing ? handleSave : handleEdit} />
      </View>
    </View>

    <View style={styles.container}>
    <Text>Usuarios:</Text>
    <FlatList
        data={miembros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contenedorNombre}>
            <Text>{item.Nombre} {item.Apellidos}</Text>
          </View>
         )}
      />
    </View>

    <TouchableOpacity style={styles.eliminarSerieBoton} onPress={() => eliminargrupo(idGrupo)}>
      <Text style={styles.eliminarSerieTexto}>Eliminar Grupo</Text>
    </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  contenedorPrincipal:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f7f7', // Un fondo claro para la accesibilidad
    
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    flexDirection:'row',
    
  },
  input: {
    // Estilos para tu TextInput
    borderBottomWidth: 1,
    borderColor: 'gray',
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  label: {
    marginRight: 10, // Ajusta según necesites
    // Agrega aquí más estilos para el label si es necesario
    fontWeight: '900',
  },contenedorNombre:{
    marginTop:'5%',
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    width: '80%',
    flexDirection:'row',
   
  },buttonContainer: {
    justifyContent: 'flex-end', // Alinea el botón a la derecha
    borderRadius:15,
    borderWidth: 2,
    borderColor:'black',
    marginLeft: '5%',
    
  },
 
  
});

export default EditarGrupo;
