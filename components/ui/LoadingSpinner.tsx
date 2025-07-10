import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#000080" />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginTop: 10,
        color: '#000080',
        fontSize: 16,
    },
});

export default LoadingSpinner;