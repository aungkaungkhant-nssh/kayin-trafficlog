import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";


const Header = ({ title }: { title: string }) => {
    const router = useRouter();
    const theme = useTheme()
    return (
        <View style={[styles.headerContainer, { backgroundColor: theme.colors.primary }]}>
            <TouchableOpacity onPress={() => router.back()}>
                <FontAwesome6
                    name="arrow-left-long"
                    size={20}
                    color={"#fff"}
                />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

export default memo(Header);

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 45,
        paddingBottom: 20,
        paddingHorizontal: 20,
        gap: 2,
    },
    icon: { width: 24, height: 24, objectFit: "contain", marginRight: 16 },
    title: {
        fontSize: 17,
        fontWeight: "500",
        color: "#fff",
        marginLeft: 10,
    },
});