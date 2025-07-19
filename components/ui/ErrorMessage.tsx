import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function ErrorMessage({ message, onDismiss }: { message: string; onDismiss: () => void }) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{message}</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
                <Text style={styles.dismissText}>နောက်တစ်ကြိမ် ထပ်မံကြိုးစားမည်</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        borderColor: "#f5c6cb",
        borderWidth: 1,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        marginBottom: 12,
        textAlign: "center",
    },
    dismissButton: {
        backgroundColor: "#000080",
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 4,
    },
    dismissText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default ErrorMessage;