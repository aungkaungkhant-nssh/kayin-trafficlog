
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';


export default function AuthLayout() {
    const colorScheme = useColorScheme();
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <View style={styles.container}>
                <Slot />
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Android Version 1.0</Text>
                    <Text style={styles.footerText}>Developer By UCSH</Text>
                </View>
            </View>

        </ThemeProvider>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    footerText: {
        fontSize: 14,
        color: '#555',
    },
});