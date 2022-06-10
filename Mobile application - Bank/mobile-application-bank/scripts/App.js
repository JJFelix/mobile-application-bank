import React, {useState, useContext} from 'react';
import {
  Button,
  FlatList,
  SectionList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  Alert,
  ToastAndroid,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {getFocusedRouteNameFromRoute, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPreset, CardStyleInterpolators, TransitionPresets} from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HomePage from './HomePage';
import LoginRoot from './loginRoot';
import LoginPage from './LoginPage';
import ForexPage from './ForexPage';
import RegisterRoot from './registerRoot';



const Stack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overShootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  }
};

function App(){
  
  return(
   <NavigationContainer independent={true}>
     <Stack.Navigator
       screenOptions={({route})=>({
          transitionSpec: {
            open: config,
            close: config
          },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
          tabBarStyle: { backgroundColor: '#02001fef' },
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#02001fef'},
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#dfdfec'
          },
       })}
       
       >
        <Stack.Screen
          name="Home"
          component={HomePage}
          />
        <Stack.Screen
          name="Forex"
          component={ForexPage}
         />
        <Stack.Screen
          name="Login"
          component={LoginRoot}
          options={{headerShown: false}}
          />
        <Stack.Screen
          name="Register"
          component={RegisterRoot}
          options={{headerShown: false}}
          />
     </Stack.Navigator>
   </NavigationContainer>
   )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#212121',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#17b908',
    borderRadius: 5,
    padding: 10,

  },
})


export default App