import { Stack } from 'expo-router'
import React from 'react'

const AuthNavigator = () => {
    return (
        <Stack>
            <Stack.Screen
                name="(auth)"
                options={{
                    title: 'ယာဉ်စည်းကမ်းလမ်းစည်းကမ်း ထိန်သိမ်းရေးကော်မတီ',
                    headerStyle: {
                        backgroundColor: '#000080',  // Navy blue color or any color you want
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontSize: 15,  // smaller font size
                    },
                    headerTitleAlign: 'center',
                }}

            />
        </Stack>
    )
}

export default AuthNavigator