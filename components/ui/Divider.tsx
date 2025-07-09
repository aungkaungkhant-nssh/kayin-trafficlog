import React from 'react';
import { StyleSheet, View } from 'react-native';

const Divider = () => {
    return <View style={styles.divider} />;
};

export default Divider;

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 12,
        width: '100%',
        opacity: 0.8,
    },
});