import { Image, StyleSheet, Alert,Platform,View,Text,StatusBar,Pressable,NativeModules,NativeEventEmitter,PermissionsAndroid } from 'react-native';
import { useState,useEffect } from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
// import BleManager from 'react-native-ble-manager';
// import { BleManager } from 'react-native-ble-plx';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import {request,PERMISSIONS,RESULTS} from 'react-native-permissions';

// BleManager.start({ showAlert: false }).then(() => {
//   // Success code
//   console.log("Module initialized");
// });

// const manager = new BleManager();

// console.log(manager)

export default function HomeScreen() {

  const [color1,setcolor1] = useState("white")
  const [color2,setcolor2] = useState("white")
  const [color3,setcolor3] = useState("white")
  const [color4,setcolor4] = useState("white")

  // const [bleManager] = useState(new BleManager());
  const [device, setDevice] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [devices, setDevices] = useState([]);
  // const [connectedDevice, setConnectedDevice] = useState(null);

  RNBluetoothClassic.onStateChanged((e) => {
    console.log(e);
  })


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

  const startScan = async () => {
    const enabled = await RNBluetoothClassic.isBluetoothEnabled();
    console.log(enabled);
  }

  // useEffect(() => {
  //   const initBluetooth = async () => {
  //     try {

  //       // if (Platform.OS === 'android') {
  //       //   await requestBluetoothPermissions();
  //       // }

  //       // const enabled = await RNBluetoothClassic.isBluetoothEnabled();
  //       // console.log(enabled)
  //       // setIsBluetoothEnabled(enabled);

  //       const enabled = await requestPermissions();
  //       console.log(enabled)
  //       if(enabled){
  //         const devices = await RNBluetoothClassic.startDiscovery()

  //       }

  //       // if (enabled) {
  //       //   const pairedDevices = await RNBluetoothClassic.getBondedDevices();
  //       //   setDevices(pairedDevices);
  //       // }
  //       // const pairedDevices = await RNBluetoothClassic.getBondedDevices();
  //       //   setDevices(pairedDevices);
  //     } catch (err) {
  //       console.error('Bluetooth initialization error:', err);
  //     }
  //   };

  //   initBluetooth();
  // }, []);




  return (
    <View style={[styles.container]}>
      <Text style={{color:'white',fontSize:30,marginTop:100}}>Smart Control</Text>


      <View style={{width:'100%',flexDirection:'row'}}>
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
      />

      <View style={[styles.controlsection]}> 
        <Pressable style={[styles.pressablecomponent,{backgroundColor:color1}]} onPress={() => setcolor1(color1==="white"?"yellow":"white")}>
          <Text>L1</Text>
        </Pressable>
        <Pressable style={[styles.pressablecomponent,{backgroundColor:color2}]} onPress={() => setcolor2(color2==="white"?"yellow":"white")}>
          <Text>L2</Text>
        </Pressable>
        <Pressable style={[styles.pressablecomponent,{backgroundColor:color3}]} onPress={() => setcolor3(color3==="white"?"yellow":"white")}>
          <Text>L3</Text>
        </Pressable>
        <Pressable style={[styles.pressablecomponent,{backgroundColor:color4}]} onPress={() => setcolor4(color4==="white"?"yellow":"white")}>
          <Text>F1</Text>
        </Pressable>
        <Pressable onPress={startScan}>
          <Text>Start Scan</Text>
        </Pressable>
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
