import { color } from "@/utils/color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={styles.header}>ZenList</Text>
      <Ionicons
        name="checkmark-circle-outline"
        size={30}
        // style={styles.logoHeader}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    color: color.textPrim,
    fontWeight: "bold",
    fontSize: 30,
  },
});
