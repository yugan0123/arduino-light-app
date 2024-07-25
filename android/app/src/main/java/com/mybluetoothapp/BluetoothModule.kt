// BluetoothModule.kt
package com.mybluetoothapp // Use your actual package name

import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BluetoothModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val REQUEST_ENABLE_BT = 1
    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()

    override fun getName(): String {
        return "BluetoothModule"
    }

    @ReactMethod
    fun enableBluetooth() {
        if (bluetoothAdapter == null) {
            Log.d("BluetoothModule", "Device does not support Bluetooth")
        } else if (!bluetoothAdapter.isEnabled) {
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            val activity: Activity? = currentActivity
            activity?.startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT)
        }
    }
}
