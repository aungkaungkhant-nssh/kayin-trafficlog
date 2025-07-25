import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PropsType {
    caseNumber: number,
    actionDate: string;
}

const CaseInfo = ({ caseNumber, actionDate }: PropsType) => {
    return (
        <View style={styles.caseInfoContainer}>
            <Text style={styles.caseInfoText}>
                🧾 တရားစွဲအမှတ်: <Text style={styles.caseNumber}>{caseNumber}</Text>
            </Text>
            <Text style={styles.caseInfoText}>
                📅 လုပ်ဆောင်သည့်ရက်စွဲ: <Text style={styles.caseDate}>{actionDate}</Text>
            </Text>
        </View>
    )
}

export default CaseInfo;

const styles = StyleSheet.create({
    caseInfoContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
    },
    caseInfoText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#00796b',
    },
    caseNumber: {
        fontWeight: 'bold',
        color: '#004d40',
    },
    caseDate: {
        fontWeight: 'bold',
        color: '#00695c',
    },
})