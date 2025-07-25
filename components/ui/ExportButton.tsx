import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const ExportButton = ({ onPress }: { onPress?: () => void }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <FontAwesome5 name="file-export" size={20} color="#fff" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#000080', // your primary color
        width: 50,
        height: 50,
        borderRadius: 25, // makes it a perfect circle
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default ExportButton;
