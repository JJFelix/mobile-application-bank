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
  ActivityIndicator,
  Modal,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Deposit({navigation}){
  const[isAgent, setIsAgent]= useState(false);
  const[isAtm, setIsAtm]= useState(true);
  const [userMadeRequest, setUserMadeRequest] = useState(false);
  const [accountNo, setAccountNo] = useState('')
  const [depositAmount, setDepositAmount] = useState('');
  const [agentNo, setAgentNo]=useState('');
  const [atmNo, setAtmNo] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const getAccount=async ()=>{
    const value = await AsyncStorage.getItem('accountNo');
    console.log('Asynced value Deposit', value);
    await setAccountNo(value);
  }

  getAccount()

  const baseurl = "http://192.168.0.108:5000/deposit";

  useEffect(()=>{
    if(userMadeRequest){
      setIsLoading(true)
      async function deposit(){
        axios.post(baseurl, {
          accountNo: {accountNo},
          depositAmount: {depositAmount},
        }).then((response)=>{
          console.log('Recieving the responses...')
          AsyncStorage.setItem('balance', response.data.balance)
          AsyncStorage.setItem('ownedCurrencies', response.data.currencies)
          console.log('The bal', response.data.balance)
          setUserMadeRequest(false)
          setIsLoading(false)
          if (response.data.success='false'){
            alert(response.data.message)
          }else{
            
            alert(response.data.message)
          }
        })
      }

      deposit()
      console.log('deposit done')
    }
  }, [userMadeRequest])

  const makeUserRequest = ()=>{
    if(depositAmount==''){
      alert('The amount field is em1pty')
    }else if(agentNo=='' && atmNo==''){
      if(isAtm){
        alert('The ATM field is empty')
      }else{
        alert('The Agent Number field is Empty')
      }
    }else{
      setUserMadeRequest(true);
    }
  }


  const changeAgentIcon=()=>{
    setIsAgent(true)
    setIsAtm(false)
  }
  const changeAtmIcon=()=>{
    setIsAgent(false)
    setIsAtm(true)
  }
    return(
        <View style={styles.body}>
          <FontAwesome5 name='wallet' style={styles.icon}/>
          {isLoading?<ActivityIndicator/>:<Text>(-)</Text>}
          <View style={styles.formContainer}>
            <View style={styles.optionsContainer}>
              <Pressable 
              style={styles.optionsButton}
              onPress={changeAtmIcon}>{
                isAtm?
                  <FontAwesome5 name='key' style={{fontSize: 20, color: '#17b908'}}/>
                  :
                  <FontAwesome5 name='btc' style={{fontSize: 10, color: '#fff'}}/>
              }
                <Text> ATM</Text>
              </Pressable>
              <Pressable 
                style={styles.optionsButton}
                onPress={changeAgentIcon}>{
                  isAgent?
                  <FontAwesome5 name='key' style={{fontSize: 20, color: '#17b908'}}/>
                  :
                  <FontAwesome5 name='btc' style={{fontSize: 10, color: '#fff'}}/>
                }
                <Text>Agent</Text>
              </Pressable>
            </View>
            <View style={styles.form}>
              <TextInput style={styles.input}
                placeholder= 'Amount'
                keyboardType='numeric'
                onChangeText={(value)=>setDepositAmount(value)}
                />
              
              <TextInput style={styles.input}
                placeholder= {isAgent? 'Agent Number': 'ATM Number'}
                keyboardType='numeric'
                onChangeText={(value)=>isAgent?setAgentNo(value): setAtmNo(value)}
                />
              
              <Pressable 
                onPress={makeUserRequest}
                style={styles.submitButton}
                android_ripple={{color: '#ffffff'}}
              >
                <Text style={styles.submitText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#02001fce',
    },
    formContainer:{
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    form:{
      flex: 2,
    },
    optionsContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: 80,
      margin: 20,
      color: '#17b908',
    },
    input: {
      width: 330,
      backgroundColor: '#fff',
      borderRadius: 5,
      marginBottom: 20,
    },
    submitButton: {
      width: 330,
      backgroundColor: '#02001fef',
      marginTop: 20,
      marginBottom: 50,
      paddingBottom: 10,
      paddingTop: 5,
      borderRadius: 7,
    },
    submitText: {
      fontSize: 25,
      color: '#17b908',
      textAlign: 'center', 
      fontWeight: 'bold',
    },
    optionsButton:{
      margin: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 50,
      padding: 15
    }

})

export default Deposit