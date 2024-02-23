import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './userContext.js'; // Asegúrate de importar UserProvider de la ubicación correcta
import WelcomeScreen from './Pantallas/WelcomeScreen.js'; // Asume que este es tu componente de bienvenida con los botones
import LogInScreen from './Pantallas/LogInScreen.js'; // Asume que este es el componente al que quieres navegar después del login
import HomeScreen from './Pantallas/HomeScreen.js'; // Asume que este es el componente al que quieres navegar después del login
import SignUp from './Pantallas/SignUp.js'; // Asume que este es el componente al que quieres navegar después del login
import Settings from './Pantallas/Settings.js'; // Asume que este es el componente al que quieres navegar después del login
import AnadirGrupo from './Pantallas/AnadirGrupo.js';
import PantallaDeDetalles from './Pantallas/PantallaDetalles.js';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
          <Stack.Screen name="LogInScreen" options={{ headerShown: false }} component={LogInScreen} />
          <Stack.Screen name="Home"  options={{ headerShown: false }} component={HomeScreen} />
          <Stack.Screen name="SignUp"  options={{ headerShown: false }} component={SignUp} />
          <Stack.Screen name="Settings" component={Settings}/>
          <Stack.Screen name="Añadir Grupo" component={AnadirGrupo}/>
          <Stack.Screen name="Detalles Serie" component={PantallaDeDetalles}/>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}



export default App;