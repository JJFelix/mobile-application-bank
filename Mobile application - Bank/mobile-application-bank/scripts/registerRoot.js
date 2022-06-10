import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
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
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import PersonalRoot from './PersonalRoot';
import RegisterPage from './register';

const Stack = createStackNavigator();

function RegisterRoot(){
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    ...TransitionPresets.FadeFromBottomAndroid,
                    headerTitleAlign: 'center',
                    headerStyle: {backgroundColor: '#02001fef'},
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#dfdfec'
                    },
                }}
            >
                <Stack.Screen
                    name="Register"
                    component={RegisterPage}
                    options={{headerShown: true}}
                />
                <Stack.Screen
                    name='personal'
                    component={PersonalRoot}
                    options={{headerShown: false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RegisterRoot