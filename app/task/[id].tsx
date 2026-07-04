import Header from "@/components/Header";
import { color } from "@/utils/color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const TaskDetail = () => {
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
      setNewDate(formattedDate);
    }
  };
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    const getTaskDetail = async () => {
      const existingData = await AsyncStorage.getItem("MY_TASKS");
      if (existingData) {
        const tasks = JSON.parse(existingData);
        const selectedTask = tasks.find((item: any) => item.id === id);
        setTask(selectedTask);
      }
    };
    getTaskDetail();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const existingData = await AsyncStorage.getItem("MY_TASKS");
          const tasks = existingData ? JSON.parse(existingData) : [];
          const newTasks = tasks.filter((item: any) => item.id !== id);
          await AsyncStorage.setItem("MY_TASKS", JSON.stringify(newTasks));
          router.back();
        },
      },
    ]);
  };

  const toogleTaskStatus = async () => {
    try {
      const existingData = await AsyncStorage.getItem("MY_TASKS");
      if (existingData) {
        const tasks = JSON.parse(existingData);

        const taskIndex = tasks.findIndex((item) => item.id === id);

        if (taskIndex !== -1) {
          const currentStatus = tasks[taskIndex].status;
          const newStatus = currentStatus === "done" ? "pending" : "done";

          tasks[taskIndex].status = newStatus;

          await AsyncStorage.setItem("MY_TASKS", JSON.stringify(tasks));

          const msg =
            newStatus === "done"
              ? "Task completed!"
              : "Task set to uncompleted";
          Alert.alert("Success", msg, [
            { text: "Oke", onPress: () => router.back() },
          ]);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const [newTitle, setNewTitle] = useState(task?.title || "");
  const [newDate, setNewDate] = useState(task?.deadline || "");

  const handleUpdate = async () => {
    const isTitleActuallyChanged =
      newTitle.trim() !== "" && newTitle !== task.title;
    const isDateActuallyChanged = newDate !== "" && newDate !== task.deadline;

    if (!isTitleActuallyChanged && !isDateActuallyChanged) {
      Alert.alert(
        "No Changes Detected",
        "Please provide a new title or choose a different deadline to update.",
      );
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem("MY_TASKS");
      const tasks = existingData ? JSON.parse(existingData) : [];

      const updateTasks = tasks.map((item: any) => {
        if (item.id === id) {
          return {
            ...item,
            title: newTitle.trim() !== "" ? newTitle : item.title,
            deadline: newDate !== "" ? newDate : item.deadline,
          };
        }
        return item;
      });

      await AsyncStorage.setItem("MY_TASKS", JSON.stringify(updateTasks));

      Alert.alert("Success", "Task updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update tasks :(");
    }
  };

  if (!task) return null;

  const getStatusInfo = () => {
    if (!task)
      return { label: "Loading...", color: "gray", icon: "help-circle" };

    if (task.status === "done") {
      return { label: "Done", color: color.accent, icon: "checkmark-circle" };
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
      return new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0]));
    };

    const taskDate = parseIndonesianDate(task.deadline);

    if (taskDate && taskDate.getTime() <= today.getTime()) {
      return { label: "Deadline", color: "red", icon: "alert-circle" };
    }

    return { label: "Pending", color: "gray", icon: "time" };
  };

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.welcome}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginTop: 10,
            marginLeft: 5,
          }}
        >
          Action
        </Text>
        <View style={styles.actionButton}>
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
          <View style={{ flexDirection: "row", gap: 5 }}>
            <TouchableOpacity onPress={handleDelete} style={styles.removeBtn}>
              <Ionicons name="trash" size={24} color={"white"} />
              <Text style={{ color: "white" }}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toogleTaskStatus}
              style={[
                styles.doneBtn,
                {
                  backgroundColor:
                    task?.status === "done" ? "#6c757d" : color.accent,
                },
              ]}
            >
              <Ionicons
                name={
                  task?.status === "done" ? "arrow-undo" : "checkmark-circle"
                }
                size={24}
                color={"white"}
              />
              <Text style={{ color: "white" }}>
                {task?.status === "done" ? "Undone" : "Done"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.currentDetail}>
        <Text style={styles.detailTitle}>Current Detail Task</Text>
        <View style={styles.detail}>
          <View>
            <Text style={styles.textPrim}>Task: {task.title}</Text>
            <Text style={styles.textSec}>Deadline: {task.deadline}</Text>
            <Text style={styles.textSec}>Status: {statusInfo.label}</Text>
          </View>
          <Ionicons name={statusInfo.icon} size={34} color={statusInfo.color} />
        </View>
      </View>

      {task?.status !== "done" && (
        <View style={styles.content}>
          <Text style={styles.textInput}>EDIT TASK</Text>
          <TextInput
            style={styles.inputTask}
            placeholder="What needs to be done?"
            multiline={true}
            maxLength={35}
            onChangeText={setNewTitle}
          />
          <View style={styles.addSection}>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.calendar}
            >
              <Ionicons name="calendar" size={20} color={color.primary} />
              <Text
                style={{ marginLeft: 8, fontSize: 12, color: color.primary }}
              >
                {dateText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUpdate} style={styles.addTask}>
              <Ionicons name="cloud-upload-outline" size={24} color={"white"} />
              <Text style={{ color: "white" }}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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

export default TaskDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg,
    width: "100%",
    height: "100%",
    paddingHorizontal: 15,
  },
  detailTitle: {
    marginTop: 10,
    backgroundColor: color.bg,
    width: 150,
    textAlign: "center",
    textAlignVertical: "center",
    height: 30,
    elevation: 2,
    borderRadius: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  detail: {
    backgroundColor: color.bg,
    marginTop: 10,
    width: 340,
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 2,
    borderRadius: 15,
    fontSize: 16,
    overflow: "scroll",
    flexDirection: "row",
  },
  content: {
    backgroundColor: color.surface,
    height: 200,
    marginTop: 10,
    elevation: 3,
    borderRadius: 15,
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
  textInput: {
    marginHorizontal: 15,
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
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
  welcome: {
    backgroundColor: color.surface,
    elevation: 3,
    marginTop: 15,
    height: 100,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  currentDetail: {
    backgroundColor: color.surface,
    elevation: 3,
    marginTop: 10,
    height: 120,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  edit: {
    backgroundColor: color.surface,
    elevation: 3,
    marginTop: 15,
    height: 200,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
  removeBtn: {
    backgroundColor: "red",
    borderRadius: 15,
    elevation: 2,
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 35,
    alignItems: "center",
    gap: 5,
  },
  doneBtn: {
    backgroundColor: color.accent,
    borderRadius: 15,
    elevation: 2,
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 35,
    alignItems: "center",
    gap: 5,
  },
  updateBtn: {
    backgroundColor: color.accent,
    borderRadius: 15,
    elevation: 2,
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 35,
    alignItems: "center",
    gap: 5,
  },
  leftBtn: {
    flexDirection: "row",
    gap: 10,
  },
  textPrim: {
    fontSize: 14,
    color: color.textPrim,
    fontWeight: "600",
  },
  textSec: {
    color: color.textSec,
    fontSize: 12,
  },
});
