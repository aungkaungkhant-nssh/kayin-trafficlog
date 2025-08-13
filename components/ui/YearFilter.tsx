import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type YearFilterProps = {
    years: number[];
    selectedYear?: number | null;
    onSelectYear: (year: number) => void;
};

const YearFilter: React.FC<YearFilterProps> = ({
    years,
    selectedYear,
    onSelectYear,
}) => {
    return (
        <View style={styles.container}>
            {years.map((year) => (
                <TouchableOpacity
                    key={year}
                    style={[
                        styles.button,
                        selectedYear === year && styles.selectedButton,
                    ]}
                    onPress={() => year && onSelectYear(year)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            selectedYear === year && styles.selectedText,
                        ]}
                    >
                        {year}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default YearFilter;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",

    },
    button: {
        borderWidth: 1,
        borderColor: "#000080",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
    },
    selectedButton: {
        backgroundColor: "#000080",
    },
    buttonText: {
        color: "#000080",
        fontSize: 16,
        fontWeight: "500",
    },
    selectedText: {
        color: "#fff",
    },
});
