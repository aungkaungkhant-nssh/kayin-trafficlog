import { Stack } from 'expo-router'
import React from 'react'

const AuthNavigator = () => {
    return (
        <Stack>
            <Stack.Screen name="(auth)"></Stack.Screen>
        </Stack>
    )
}

export default AuthNavigator