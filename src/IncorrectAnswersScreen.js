import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IncorrectAnswersScreen = () => {
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  useEffect(() => {
    loadIncorrectAnswers();
  }, []);

  const loadIncorrectAnswers = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("incorrectAnswers");
      if (jsonValue != null) {
        setIncorrectAnswers(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Error loading incorrect answers: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incorrect Answers</Text>
      {incorrectAnswers.length > 0 ? (
        incorrectAnswers.map((answer, index) => (
          <View key={index} style={styles.answerContainer}>
            <Text style={styles.wordText}>{`German: ${answer.German}`}</Text>
            <Text style={styles.wordText}>
              {`Correct Arabic: ${answer.Arabic}`}
            </Text>
            <Text style={styles.wordText}>
              {`Your Answer: ${answer.selectedAnswer}`}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noAnswersText}>No incorrect answers recorded.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  answerContainer: {
    backgroundColor: "#f2f0e9r",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  wordText: {
    fontSize: 18,
  },
  noAnswersText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default IncorrectAnswersScreen;
