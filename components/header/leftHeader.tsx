import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

const LeftHeader = () => {
    const router = useRouter();
    return (
        <FontAwesome6
            name="arrow-left-long"
            size={20}
            style={{ marginHorizontal: 16, color: "#fff" }}
            onPress={() => router.back()}
        />
    );
};

export default LeftHeader;