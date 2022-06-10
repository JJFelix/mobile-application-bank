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

function Transfer({navigation}){
  const [userMadeRequest, setUserMadeRequest] = useState(false);
  const [accountNo, setAccountNo] = useState('')
  const [transferAmount, setTransferAmount] = useState('');
  const [receiverId, setReceiverId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getAccount=async ()=>{
    const value = await AsyncStorage.getItem('accountNo');
    console.log('Asynced value Withdraw', value);
    await setAccountNo(value);
  }

  getAccount()

  const baseurl = "http://192.168.0.108:5000/transfer";

  useEffect(()=>{
    if(userMadeRequest){
      setIsLoading(true)
      async function transfer(){
        axios.post(baseurl, {
          accountNo: {accountNo},
          transferAmount: {transferAmount},
          receiverId: {receiverId},
        }).then((response)=>{
          console.log('Recieving the responses...')
          AsyncStorage.setItem('balance', response.data.balance)
          AsyncStorage.setItem('ownedCurrencies', response.data.currencies)
          setUserMadeRequest(false)
          setIsLoading(false)
          if (response.data.success='false'){
            alert(response.data.message)
          }else{
            alert(response.data.message)
          }
        })
      }

      transfer()
      console.log('Transfer done')
    }
  }, [userMadeRequest])

  const makeUserRequest = ()=>{
    if(transferAmount==''){
      alert('The amount field is empty')
    }else if(receiverId==''){
      alert('The receiver Account Number is empty')
    }else if(receiverId==accountNo){
      alert('You cannot transfer money to your own account')
    }
    else{
      setUserMadeRequest(true);
    }
  }

    return(
        <View style={styles.body}>
            <FontAwesome5 name='paper-plane' style={styles.icon}/>
            {isLoading?<ActivityIndicator/>:<Text>(-)</Text>}
            <View style={styles.form}>
              <TextInput style={styles.input}
                placeholder= 'Amount'
                keyboardType='numeric'
                onChangeText={(value)=>setTransferAmount(value)}
                />
              
              <TextInput style={styles.input}
                placeholder= 'Receiver Account Number'
                keyboardType='numeric'
                onChangeText={(value)=>setReceiverId(value)}
                />
              
              <Pressable 
                onPress={makeUserRequest}
                style={styles.submitButton}
                android_ripple={{color: '#ffffff'}}
              >
                <Text style={styles.submitText}>Send</Text>
              </Pressable>
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
    form:{
      flex: 2,
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
      marginTop: 10,
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

})

export default Transfer