import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider } from './userContext.js';
import WelcomeScreen from './Pantallas/WelcomeScreen.js';
import LogInScreen from './Pantallas/LogInScreen.js';
import HomeScreen from './Pantallas/HomeScreen.js';
import SignUp from './Pantallas/SignUp.js';
import Settings from './Pantallas/Settings.js';
import AnadirGrupo from './Pantallas/AnadirGrupo.js';
import PantallaDeDetalles from './Pantallas/PantallaDetalles.js';
import DetallesDeTemporada from './Pantallas/TemporadaDetalle.js';
import EditarGrupo from './Pantallas/EditarGrupo.js';
import Calendario from './Pantallas/Calendario.js';
import ComentariosSerie from './Pantallas/ComentariosSerie.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/** 

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{
          tabBarLabel: 'Series',
          headerShown: false 
        }} />
      <Tab.Screen name="Editar Grupo" component={EditarGrupo} />
    </Tab.Navigator>
  );
}

*/

function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
          <Stack.Screen name="LogInScreen" options={{ headerShown: false }} component={LogInScreen} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              title: '',
              headerStyle: {
                backgroundColor: '#f7f7f7',
              }
            }}
          />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUp} />
          <Stack.Screen name="Settings" options={{ title: 'Ajustes' }} component={Settings}/>
          <Stack.Screen name="Añadir Grupo" options={{ title: 'Crear Grupo' }} component={AnadirGrupo}/>
          <Stack.Screen name="Detalles Serie" component={PantallaDeDetalles}/>
          <Stack.Screen name="Temporada" component={DetallesDeTemporada}/>
          <Stack.Screen name="Editar Grupo" component={EditarGrupo}/>
          <Stack.Screen name="Calendario" component={Calendario}/>
          <Stack.Screen name="Comentarios Serie" options={{ title: 'Comentarios' }} component={ComentariosSerie}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
