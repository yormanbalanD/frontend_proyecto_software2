import React from 'react'
import { View, Text } from 'react-native'
import { Slot } from 'expo-router'
import { StatusBar } from 'react-native-web'

export default function _layout() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar style="auto" />
        <Slot />
    </View>
  )
}
