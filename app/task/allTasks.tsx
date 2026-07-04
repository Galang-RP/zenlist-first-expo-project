import Header from "@/components/Header";
import { color } from "@/utils/color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AllTasksScreen = () => {
  const [allTasks, setAllTasks] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadTasks = async () => {
        const data = await AsyncStorage.getItem("MY_TASKS");
        if (data) setAllTasks(JSON.parse(data));
      };
      loadTasks();
    }, []),
  );

  const getTaskCategory = (item) => {
    if (item.status === "done") {
      return "Done";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseIndonesianDate = (dateStr) => {
      const months = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        Mei: 4,
        Jun: 5,
        Jul: 6,
        Agu: 7,
        Sep: 8,
        Okt: 9,
        Nov: 10,
        Des: 11,
      };

      if (!dateStr) return null;
      const parts = dateStr.split(" ");
      if (parts.length !== 3) return null;

      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);

      return new Date(year, month, day);
    };

    const taskDate = parseIndonesianDate(item.deadline);
    if (!taskDate) {
      return "Pending";
    }

    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() <= today.getTime()) {
      return "Deadline";
    }
    return "Pending";
  };

  const getTaskIcon = (item) => {
    const category = getTaskCategory(item);
    if (category === "Done") {
      return (
        <Ionicons name="checkmark-circle" size={30} color={color.accent} />
      );
    }
    if (category === "Deadline") {
      return <Ionicons name="alert-circle-outline" size={30} color={"red"} />;
    }
    return <Ionicons name="time" size={30} color={"gray"} />;
  };

  const getTaskStatusText = (item) => {
    const category = getTaskCategory(item);
    return getTaskCategory(item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>ALL TASKS</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            style={styles.backBtn}
          >
            <Ionicons
              name="arrow-back-circle-sharp"
              size={24}
              color={"white"}
            />
            <Text style={{ color: "white" }}>Back</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
          }}
        >
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 4,
              paddingTop: 4,
            }}
            showsVerticalScrollIndicator={false}
            data={allTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`../task/${item.id}`)}
                style={styles.detailTask}
              >
                {getTaskIcon(item)}
                <View>
                  <Text style={styles.textPrim}>{item.title}</Text>
                  <Text style={styles.textSec}>
                    <Ionicons name="calendar" /> {item.deadline}
                  </Text>
                  <Text style={styles.textSec}>{getTaskStatusText(item)}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text>No tasks yet. Let's create one!</Text>
            )}
          />
        </View>
      </View>
      <View style={styles.footer}></View>
    </SafeAreaView>
  );
};

export default AllTasksScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: color.bg,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  footer: {
    backgroundColor: color.bg,
    width: "100%",
    height: 20,
  },
  content: {
    marginTop: 20,
    flex: 1,
    overflow: "hidden",
  },
  detailTask: {
    flexDirection: "row",
    backgroundColor: color.surface,
    gap: 5,
    height: 80,
    elevation: 1,
    alignItems: "center",
    borderRadius: 15,
    paddingLeft: 8,
    marginBottom: 10,
  },
  textPrim: {
    fontSize: 16,
    color: color.textPrim,
    fontWeight: "600",
  },
  textSec: {
    color: color.textSec,
    fontSize: 12,
  },
  backBtn: {
    backgroundColor: color.primary,
    borderRadius: 15,
    elevation: 2,
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 35,
    alignItems: "center",
    gap: 5,
  },
});
