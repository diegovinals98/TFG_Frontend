// Importaciones de React, React Native y otras librerías.
import React, { useEffect, useState , useCallback} from 'react';
import { View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    TouchableWithoutFeedback,
  Keyboard, // Importa Keyboard
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../userContext.js'; // Importa el contexto del usuario.
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../estilosGlobales.js'; // Importa estilos globales.
import { useFocusEffect } from '@react-navigation/native';

// Obtiene las dimensiones de la ventana del dispositivo.
const windowHeigh = Dimensions.get('window').height;

// Componente principal de la pantalla de inicio.
const AnadirGrupo = () => {

    const navigation = useNavigation();

    const [nombreGrupo, setnombreGrupo] = useState() // Estado para almacenar el nombre del grupo.
    const [inputsUsuarios, setInputsUsuarios] = useState([{ key: 0, value: '' }]);
    const { user } = useUser(); // Accede al contexto del usuario para obtener la información del usuario actual.

    useEffect(() => {
      if (user?.nombre) {
        setInputsUsuarios([{ key: 0, value: user.usuario }]);
      }
    }, [user]);

    // PARA ACTILIZAR LO QUE QUIERAS CUANDO LA PANTALLA GANA EL FOCO
  useFocusEffect(
    useCallback(() => {
      // El código aquí se ejecutará cuando la pantalla gane foco
      console.log('---------------------------------------- AÑADIR GRUPO ----------------------------------------');
     
      return () => {
        // Opcional: Código de limpieza si necesitas hacer algo cuando la pantalla pierde foco
        console.log('Pantalla va a perder foco...');
      };
    }, []) // Dependencias para este efecto
  );


    const agregarInputUsuario = () => {
      if (inputsUsuarios.length < 6) {
        const nuevoInput = { key: inputsUsuarios.length, value: '' };
        setInputsUsuarios([...inputsUsuarios, nuevoInput]);
      } else {
        // Opcionalmente, muestra un mensaje indicando que no se pueden agregar más usuarios
        alert('No puedes añadir más de 5 usuarios más.');
      }
    };

    const actualizarUsuario = (index, text) => {
      const nuevosInputs = inputsUsuarios.map((input, i) => {
        if (i === index) {
          return { ...input, value: text };
        }
        return input;
      });
      setInputsUsuarios(nuevosInputs);
      

    };

    const actualizarGrupo = (nombre) => {
      setnombreGrupo(nombre)
    }

    const agregarDatos = async () => {
      console.log('Nombre del grupo: ' + nombreGrupo);
      console.log('Usuarios: ');
      inputsUsuarios.forEach(input => {
        console.log('Item: ' + input.key + '. Nombre: ' + input.value);
      });

      
    
      // Preparar el cuerpo de la solicitud
      const body = {
        nombreGrupo: nombreGrupo,
        nombresUsuarios: inputsUsuarios.map(input => input.value), // Extrae solo los nombres de usuario del arreglo de inputs
        admin: user.id
      };
    
      try {
        const response = await fetch('https://apitfg.lapspartbox.com/crear-grupo-y-asociar-usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
    
        if (!response.ok) {
          // Si el servidor responde con un código de error, lanza un error
          throw new Error('Error al agregar datos a la BBDD');
        }
    
        const data = await response.json();
        console.log('Respuesta del servidor:', data.message); // Imprime el mensaje general
        if (data.message.includes('El grupo ya existe')) {
          // Muestra una alerta si se encuentra el patrón
          alert('El grupo con nombre ' + nombreGrupo + ' ya existe');
        }
        


        // Verifica si 'detalles' existe y tiene elementos
        if (data.detalles && data.detalles.length > 0) {
          console.log('Detalles:');
          data.detalles.forEach((detalle, index) => {
            if (detalle.includes('no existe.')) {
              // Muestra una alerta si se encuentra el patrón
              alert(detalle + ' No se ha podido añadir, pero se ha creado el grupo');
            }
            console.log(`${index + 1}. ${detalle}`); // Imprime cada detalle precedido por su número de orden
          });
        } else {
          console.log('No hay detalles disponibles.');
        }
        alert('Datos del usuario actualizados correctamente.');
        navigation.navigate('Home');

        // Aquí puedes manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
      } catch (error) {
        // Muestra una alerta si se encuentra el patrón
        alert('No se puede añadir un grupo sin nombre');
        console.error('Error al agregar datos a la BBDD:', error);
        // Aquí manejas el error, por ejemplo, mostrando un mensaje de error al usuario
      }

      
    };
    
    
    

  // Renderizado del componente.
  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={[globalStyles.container, styles.container]}>
    
      {/* Sección de entrada para el nombre del grupo */}
      <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Grupo</Text>
          <TextInput 
            style={styles.input}
            onChangeText={(text) => actualizarGrupo(text)} // Función para actualizar el estado con el texto ingresado.
            placeholder="Nombre del grupo" // Placeholder para guiar al usuario sobre qué debe ingresar.
          />
      </View>

        
      <View style={styles.inputGroup}>
        {inputsUsuarios.map((input, index) => (
          <View style={{ alignItems: 'center'}}>
          <Text style={styles.label}>Usuario {index + 1}</Text>
          <View key={input.key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => actualizarUsuario(index, text)}
              placeholder="Usuario a añadir"
              value={input.value}
            />
          </View>
          </View>
        ))}


          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={agregarInputUsuario} style={styles.botonUsuario}>
              <Text style={styles.textoBoton}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={agregarDatos} style={styles.botonAgregar}>
              <Text style={styles.textoBoton}>Agregar grupo</Text>
            </TouchableOpacity>
          </View>
        
      </View>
   

      {/* Otras secciones y componentes pueden ser agregados aquí */}  
      
    </View>
    </TouchableWithoutFeedback>
  );
};

// Estilos para el componente.
const styles = StyleSheet.create({
  usuarios:{
    flexDirection: 'row', // Organiza los elementos en fila
    alignItems: 'center', // Centra los elementos verticalmente en el contenedor
    justifyContent: 'space-between', 
  },
  container: {
    paddingTop: '5%',
    flex: 1,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
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
    marginBottom: '1%', 
    fontSize: 20
  },botonUsuario:{
    flex: 1,
    display: 'flex', // 'display: flex' es el valor predeterminado en React Native, así que no es necesario.
    justifyContent: 'center', // En React Native usamos camelCase en lugar de guiones.
    alignItems: 'center',
    backgroundColor: '#005f99', // Ejemplo de color azul, ya que no especificaste un color.
    borderRadius: 10, // Si quieres mantener los bordes redondeados como en tu estilo original.
    margin: 10, // Para dar un poco de padding vertical si es necesario.

  },
  botonAgregar:{
    backgroundColor: 'transparent',
    borderWidth: 2,
    flex: 1,
    borderColor: '#005f99',
    display: 'flex', // 'display: flex' es el valor predeterminado en React Native, así que no es necesario.
    justifyContent: 'center', // En React Native usamos camelCase en lugar de guiones.
    alignItems: 'center',
    borderRadius: 10, // Si quieres mantener los bordes redondeados como en tu estilo original.
    margin: 10, // Para dar un poco de padding vertical si es necesario.
   
  },textoBoton:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black'
  }
});

export default AnadirGrupo;
