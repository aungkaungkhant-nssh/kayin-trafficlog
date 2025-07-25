import { Stack } from 'expo-router'
import React from 'react'

const AppNavigator = () => {
    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            ></Stack.Screen>
        </Stack>
    )
}

export default AppNavigator