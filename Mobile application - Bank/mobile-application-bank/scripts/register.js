import axios from 'axios';
import React, {useState, useEffect} from 'react';
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

function RegisterPage({navigation}){

    navigation.setOptions({
        headerLeft: ()=>(
            <Pressable
                style={styles.backButton}
                onPress={goToHome}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
        )
    })

    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [userMadeRequest, setUserMadeRequest] = useState(false);
    
    const baseurl="http://192.168.0.108:5000/register";

    //authentication function
        useEffect(()=>{
            if(userMadeRequest){
                setIsLoading(true)
                async function fetchData(){
                    await axios.post(baseurl, {
                        userName: {userName},
                        phoneNumber: {phoneNumber},
                        email: {email},
                        password: {password},
                    })
                    .then((response) => {
                        setMessage('some second data');
                        console.log(response.data);
                        console.log(response.data.success)
                        setMessage(response.data);
                        AsyncStorage.setItem('balance', response.data.balance);
                        AsyncStorage.setItem('accountNo', response.data.accountNo);
                        AsyncStorage.setItem('userName', response.data.userName);
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
                            ToastAndroid.showWithGravity('Successful registration', ToastAndroid.LONG, ToastAndroid.TOP)
                            navigation.navigate('personal')
                        }
                    });
                }
                fetchData()
            }
        }, [userMadeRequest])
         //navigation functions
    const goToHome=()=>{
        navigation.navigate('App', {screen: 'Home'})
    }

    const validateUser=()=>{
        //validating the userName
        if(userName==''){
            alert('The User Name field is Empty');
        }else if(phoneNumber==''){
            alert('The phone Number field is empty');
        }else if(email==''){
            alert('The email field is empty');
        }else if(password==''){
            alert('The password field is empty');
        }else if(confirmPassword==''){
            alert('The password field is empty');
        }else if(confirmPassword!=password){
            alert('Confirmation password must match the password')
        }else{
            if(userName.length<3||userName.length>13){
                alert('The user Name should be longer than 3 characters');
            }else if(!email.includes('@')){
                alert('Enter a valid email');
            }else if(phoneNumber.length<10){
                alert('Enter a valid Phone Number');
            }else if(password.length<8){
                alert('The Password must be more than 8 characters long');
            }else{
                setUserMadeRequest(true);
            }
        }
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
                    <FontAwesome5 name="user-plus" style={styles.icon} />
                    <Text style={styles.label}>
                        User Name:
                    </Text>
                    <TextInput
                        style={styles.inputs}
                        placeholder='Your User name'
                        onChangeText={(value)=>setUserName(value)}
                    />
                    <Text style={styles.label}>
                        Phone Number:
                    </Text>
                    <TextInput
                        style={styles.inputs}
                        placeholder='Phone Number'
                        keyboardType='phone-pad'
                        onChangeText={(value)=>setPhoneNumber(value)}
                    />
                    <Text style={styles.label}>
                        Email:
                    </Text>
                    <TextInput
                        style={styles.inputs}
                        placeholder='Valid Email address'
                        keyboardType='email-address'
                        onChangeText={(value)=>setEmail(value)}
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
                    <TextInput
                        style={styles.inputs}
                        secureTextEntry
                        placeholder='Confirm Password'
                        onChangeText={(value)=>setConfirmPassword(value)}
                    />
                    <Pressable 
                        onPress={validateUser}
                        style={styles.loginButton} 
                        android_ripple={{color: '#ffffff'}}>
                        <Text style={styles.loginText}>Submit</Text>
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
    scroll: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    logo: {
        color: '#17b908',
        fontSize: 100,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -25
        
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
    },
    icon: {
        fontSize: 60,
        color: '#dfdfec',
        marginTop: 10
    }
    
})

export default RegisterPage