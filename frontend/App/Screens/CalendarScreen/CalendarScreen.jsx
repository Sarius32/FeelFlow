import { View, Text } from 'react-native'
import React from 'react'
import { useCameraPermission, useMicrophonePermission} from 'react-native-vision-camera'

export default function CalendarScreen() {
  const { hasPermission, requestPermission } = useCameraPermission()
  console.log(hasPermission);

  return (
    <View>
      <Text>CalendarScreen</Text>
    </View>
  )
}