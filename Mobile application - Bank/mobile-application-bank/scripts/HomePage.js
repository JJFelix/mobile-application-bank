import 'react-native-gesture-handler';
import React, {useState, useContext, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Pressable,
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
import {createStackNavigator} from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from './Styles/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomePage({navigation}){

    const goToForex=()=>{
        navigation.navigate('Forex')
    }
    const goToLogin=()=>{
        navigation.navigate('Login')
    }
    const goToRegister=()=>{
        navigation.navigate('Register')
    }
    return(
            <View style={styles.body}>
                <ScrollView>
                    <ImageBackground 
                        style={styles.scroll}
                        source={require('../assets/bankbackg1.jpg')}
                        >
                        <View style={styles.titleContainer}>
                            <View>
                                <Text style={styles.titleText}>
                                    The G7 Bank
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.dolarSign}>
                                    $
                                </Text>
                            </View>       
                            <View style={styles.logoContainer}>
                                <Text style={styles.logo}>
                                    G7
                                </Text>
                            </View>
                        </View>
                        <View style={styles.footerContainer}>
                                <Text style={styles.footerText}>
                                    Be your own Financial $ Star $
                                </Text>
                        </View>
                        <View style={GlobalStyle.nav}>
                            <Pressable 
                                hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                                <FontAwesome5 name="home" style={GlobalStyle.activeIcon} />
                            </Pressable>
                            <Pressable 
                                onPress={goToForex}
                                hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                                <FontAwesome5 name="chart-line" style={GlobalStyle.icon} />
                            </Pressable>
                            <Pressable 
                                onPress={goToLogin}
                                hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                                <FontAwesome5 name="unlock" style={GlobalStyle.icon} />
                            </Pressable>
                            <Pressable 
                                onPress={goToRegister}
                                hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                                <FontAwesome5 name="user-plus" style={GlobalStyle.icon} />
                            </Pressable>
                        </View>
                    </ImageBackground>
                </ScrollView>
            </View>
    )
}


const styles=StyleSheet.create({
    body: {
        flex: 1,
    },
    scroll: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    titleContainer: {
        flex: 7,
        
        alignItems: 'center',
        width: '95%',
        height: '100%',
        justifyContent: 'center',
        borderRadius: 15,
        margin: 10,
        marginTop: 60,
    },
    titleText:{
        color: '#17b908',
        fontSize: 80,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: 30,
        padding: 20,
    },
    dolarSign:{
        fontSize: 70,
        color: '#1c03acfd',

    },
    footerContainer: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    footerText: {
        color: '#17b908',
        fontSize: 25,
        fontFamily: 'sanserif',
        textAlign: 'center',
        width: '100%',
    },
    logo: {
        color: '#17b908',
        fontSize: 120,
        fontWeight: 'bold',
        marginBottom: 60,
        marginTop: -25
    }
})

export default HomePage;