import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5, // Android shadow
    },
    inputWrapper: {
        marginBottom: 15,
    },
    errorText: {
        color: "red",
        marginTop: 4,
    },
});

export default globalStyles;