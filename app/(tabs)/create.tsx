import Header from "@/components/Header";
import { color } from "@/utils/color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateText, setDateText] = useState("Choose Deadline");
  const [taskTitle, setTaskTitle] = useState("");

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios");

    if (selectedDate) {
      setDate(selectedDate);

      const formattedDate = selectedDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      setDateText(formattedDate);
    }
  };
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleSaveTask = async () => {
    if (taskTitle.trim() === "" || dateText === "Choose Deadline") {
      Alert.alert(
        "Warning",
        "Please fill the title and choose the deadline first",
      );
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem("MY_TASKS");
      let tasks = existingData ? JSON.parse(existingData) : [];

      const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        status: "Pending",
        deadline: dateText,
      };

      tasks.push(newTask);
      await AsyncStorage.setItem("MY_TASKS", JSON.stringify(tasks));

      Alert.alert("Success", "New task added", [
        { text: "OK", onPress: () => router.push("/(tabs)") },
      ]);
      setTaskTitle("");
      setDateText("Choose Deadline");
    } catch (error) {
      console.error("Failed to save new task", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.headerSecond}>Let's add task!</Text>

      <View style={styles.content}>
        <Text style={styles.textInput}>NEW TASK</Text>
        <TextInput
          style={styles.inputTask}
          placeholder="What needs to be done?"
          multiline={true}
          maxLength={35}
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <View style={styles.addSection}>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={styles.calendar}
          >
            <Ionicons name="calendar" size={20} color={color.primary} />
            <Text style={{ marginLeft: 8, fontSize: 12, color: color.primary }}>
              {dateText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSaveTask} style={styles.addTask}>
            <Text style={{ color: "white" }}>Add Task</Text>
            <Ionicons name="add" size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={tomorrow}
        />
      )}
    </SafeAreaView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: color.bg,
    width: "100%",
    height: "100%",
  },
  header: {
    color: color.textPrim,
    fontWeight: "bold",
    fontSize: 30,
  },
  headerSecond: {
    color: color.textSec,
    fontSize: 16,
    marginTop: -5,
  },
  content: {
    backgroundColor: color.surface,
    height: 200,
    marginTop: 10,
    elevation: 3,
    borderRadius: 15,
  },
  inputTask: {
    backgroundColor: color.bg,
    marginHorizontal: 15,
    elevation: 2,
    borderRadius: 15,
    marginTop: 15,
    height: 80,
    textAlignVertical: "top",
    textAlign: "left",
  },
  textInput: {
    marginHorizontal: 15,
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
  addSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 20,
  },
  calendar: {
    backgroundColor: color.bg,
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  addTask: {
    backgroundColor: color.primary,
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 5,
    elevation: 5,
  },
});
