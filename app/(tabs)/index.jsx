import { Image, StyleSheet, Alert,Platform,View,Text,StatusBar,Pressable,NativeModules,NativeEventEmitter,PermissionsAndroid } from 'react-native';
import { useState,useEffect } from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import {request,PERMISSIONS,RESULTS} from 'react-native-permissions';

export default function HomeScreen() {

  const [color1,setcolor1] = useState("white")
  const [color2,setcolor2] = useState("white")
  const [color3,setcolor3] = useState("white")
  const [color4,setcolor4] = useState("white")

  const [connectedDeviceid, setConnectedDeviceid] = useState(null);
  const [connectedDevice,setConnectedDevice] = useState(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
        return Object.values(granted).every((result) => result === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
      return result === RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    const initBluetooth = async () => {
      try {

        const enabled = await requestPermissions();
        if(enabled){
          const devices = await RNBluetoothClassic.startDiscovery()
          if(devices !== "" || devices !== "undefined" || devices !== null){
            connectTodevice(devices[0].id);
            setConnectedDeviceid(devices[0].id);
            
          }

        }
      } catch (err) {
        console.error('Bluetooth initialization error:', err);
      }
    };

    initBluetooth();
  }, []);

  const connectTodevice = async (deviceid) => {
    console.log("inside connect to device ",deviceid);
    const connection = await RNBluetoothClassic.connectToDevice(deviceid);
    console.log("Bluetooth device connected successfully");
    setConnectedDevice(connection);
    connection.onDataReceived((e) => {
      console.log("inside the connect to device: ",e.data);
    })
  }

  const sendData = async (data) => {
    try{
      if(connectedDeviceid){
        await RNBluetoothClassic.writeToDevice(connectedDeviceid,data)
        console.log("data sent to ",connectedDeviceid);
      }else{
        console.log("please connect to your bluetooth module");
        if(data==="ON1"||data==="OFF1"){
          setcolor1("white");
        }else if(data==="ON2"||data==="OFF2"){
          setcolor2("white");
        }else if(data==="ON3"||data==="OFF3"){
          setcolor3("white");
        }
      }

    }catch(err){
      console.log(err);
    }
  }

  return (
    <View style={[styles.container]}>
      <Text style={{color:'white',fontSize:30,marginTop:100}}>Smart Control</Text>


      {/* <View style={{width:'100%',flexDirection:'row'}}>
        <View style={{width:'50%',alignItems:"flex-end",marginRight:30}}>
          <Text>Automatic</Text>
        </View>
        <View style={{width:'50%'}}>
          <Text>Manual</Text>
        </View>
      </View>
      <ToggleSwitch 
        isOn={true}
        onColor="green"
        offColor="red"
        size="large"
        onToggle={isOn => console.log("changed to : ", isOn)}
      /> */}

      <View style={[styles.controlsection]}> 
        <Pressable style={[styles.pressablecomponent,{backgroundColor:color1}]} onPress={() => {setcolor1(color1==="white"?"yellow":"white");sendData(color1==="white"?"ON1":"OFF1")}}>
          <Text>L1</Text>
        </Pressable>
        <Pressable style={[styles.pressablecomponent,{backgroundColor:color2}]} onPress={() => {setcolor2(color2==="white"?"yellow":"white");sendData(color2==="white"?"ON2":"OFF2")}}>
          <Text>L2</Text>
        </Pressable>
        <Pressable style={[styles.pressablecomponent,{backgroundColor:color3}]} onPress={() => {setcolor3(color3==="white"?"yellow":"white");sendData(color3==="white"?"ON3":"OFF3")}}>
          <Text>L3</Text>
        </Pressable>
        <Pressable style={[styles.pressablecomponent,{backgroundColor:color4}]} onPress={() => setcolor4(color4==="white"?"yellow":"white")}>
          <Text>F1</Text>
        </Pressable>
        {/* <Pressable >
          <Text>Start Scan</Text>
        </Pressable> */}
      </View>
      <StatusBar backgroundColor={'black'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    backgroundColor: '#36C2CE',
    flex:1,
    height:'100%',
    // justifyContent:'center',
    alignItems:'center'
  },
  controlsection:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 50
  },
  pressablecomponent: {
    height:70,
    width:70,
    borderRadius:36,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:40
  }
});
