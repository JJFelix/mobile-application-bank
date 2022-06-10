import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Pressable,
  Alert,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  ScrollView,
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
import { Cache } from "react-native-cache";
import cache from './HomePage';

function LoginPage({navigation}){

    navigation.setOptions({
        headerLeft: ()=>(
            <Pressable
                style={styles.backButton}
                onPress={goToForex}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
        )
    })
   
    const [userName, setUserName] = useState('')
    const [accountNo, setAccountNo] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [userMadeRequest, setUserMadeRequest] = useState(false);

    const getvalue=async ()=>{
        const value = await AsyncStorage.getItem('accountNo')
        console.log('Asynced value login', value);
    }

    const setValue= async (data)=>{
        await AsyncStorage.setItem('accountNo', data);
        setAccountNo(data)
    }
    getvalue();
    

    const baseurl="http://192.168.0.108:5000/login";

    //authentication function
        useEffect(()=>{
            if(userMadeRequest){
                setIsLoading(true)
                async function fetchData(){
                    axios.post(baseurl, {
                        userName: {userName},
                        accountNo: {accountNo},
                        password: {password},
                    })
                    .then((response) => {
                        console.log(response.data.message);
                        AsyncStorage.setItem('userName', response.data.userName)
                        AsyncStorage.setItem('balance', response.data.balance)
                        AsyncStorage.setItem('loanAmount', response.data.loanAmount)
                        AsyncStorage.setItem('loanLimit', response.data.loanLimit)
                        AsyncStorage.setItem('ownedCurrencies', response.data.currencies)
                        setIsLoading(false);
                        setUserMadeRequest(false)
                        console.log('ian');
                        if (response.data.success=='false'){
                            alert(response.data.message)
                            setUserMadeRequest(false);
                        }else{
                            console.log(response.data.accountNo)
                            ToastAndroid.showWithGravity('Successful Login', ToastAndroid.LONG, ToastAndroid.TOP);
                            navigation.navigate('AuthRoot')
                        }
                    })
                }
                console.log('acc', accountNo)
                //storeData(accountNo);
                fetchData();
                console.log('IAn');
            }
        }, [userMadeRequest])


    const goToAuthentication= ()=>{
        if(userName == ''){
            alert('The user Name field is empty')
        }
        else if(accountNo == ''){
            alert('The account number field is empty')
        }
        else if (password == ''){
            alert('The password field is empty')
        }else{
            //getUserData(); //accessing the API
            // storeData(accountNo);
            // console.log('In the go to authentication function')
            // console.log(AsyncStorage.getItem('AccountNo'))
            setUserMadeRequest(true);
            setIsLoading(false);
            
            
        }
    }

    //navigation functions
    const goToForex=()=>{
        navigation.navigate('App', {screen: 'Forex'});
    }
    const goToHome=()=>{
        navigation.navigate('App', {screen: 'Forex'});
    }
    const goToLogin=()=>{
        navigation.navigate('Login');
    }
    const goToRegister=()=>{
        navigation.navigate('App', {screen: 'Register'});
    }

    return(
        <View style={styles.body}>
            <ScrollView>
                <View style={styles.scroll}>
                    <Modal
                        visible={false}
                        transparent
                        animationType='slide'
                        hardwareAccelerated
                        //onRequestClose={() => 
                        //setShowWarning(false)}
                    >
                        <View style={styles.modalPage}>
                            <View style={styles.modalSection}>
                                <View style={styles.modalTitle}>
                                    <Text>Error</Text>
                                </View>
                                <View style={styles.modalBody}>
                                    <Text>{message}</Text>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {isLoading?<ActivityIndicator/>:<Text>(-)</Text>}
                    <Text style={styles.logo}>
                        G7
                    </Text>
                    <Text style={styles.label}>
                        User Name:
                    </Text>
                    <TextInput
                        style={styles.inputs}
                        placeholder='Your User name'
                        onChangeText={(value)=>setUserName(value)}
                    />
                    <Text style={styles.label}>
                        Account Number:
                    </Text>
                    <TextInput
                        style={styles.inputs}
                        placeholder='Account Number'
                        onChangeText={(value)=>setValue(value)}
                    />
                    <Text style={styles.label}>
                        Password:
                    </Text>
                    <TextInput
                        style={styles.inputs}
                        secureTextEntry
                        placeholder='Password'
                        onChangeText={(value)=>setPassword(value)}
                    />
                    <Pressable 
                        onPress={goToAuthentication}
                        style={styles.loginButton} 
                        android_ripple={{color: '#ffffff'}}>
                        <Text style={styles.loginText}>Login</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}

const styles=StyleSheet.create({
    body:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#02001fce',
    },
    logo: {
        color: '#17b908',
        fontSize: 100,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -25
        
    },
    scroll: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    label: {
        color: '#17b908',
        fontSize: 22,
        marginTop: 30,
        fontWeight: 'bold',
    },
    inputs: {
        width: '100%',
        backgroundColor: '#dfdfec',
        marginTop: 10,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600' 
    },
    loginButton: {
        backgroundColor: '#02001fb9',
        width: '100%',
        marginTop: 25,
        borderRadius: 7,
        paddingBottom: 10,
        paddingTop: 10,
    },
    loginText: {
        textAlign: 'center',
        color: '#17b908',
        fontSize: 25,
        fontWeight: 'bold',
    },
    nav: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -100
    },
    backButton: {
        backgroundColor: '#17b908',
        width: '70%',
        paddingBottom: 10,
        paddingTop: 10,
        marginBottom: -6,
        borderRadius: 3
    },
    backButtonText:{
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    }, 
    modalPage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000099',
    },
    modalSection: {
        width: '80%',
        height: '30%',
        backgroundColor: '#dad6d6',
        borderWidth: 1,
        borderColor: '#131213',
        borderRadius: 20,
    },
    modalTitle: {
        width: '100%',
        height: '20%',
        backgroundColor: '#9e1e07',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalBody: {
        width: '100%',
        height:'70%',
    }
    
})

export default LoginPage