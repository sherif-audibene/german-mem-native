import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PuzzleGame = ({ navigation }) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  useEffect(() => {
    loadWords();
    loadIncorrectAnswers();
  }, []);

  const loadWords = async () => {
    try {
      const fileContent = require("../assets/words.json");
      function json2array(json) {
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function (key) {
          result.push(json[key]);
        });
        return result;
      }

      const s = json2array(fileContent);
      setWords(s);
    } catch (error) {
      console.error("Error loading words: ", error);
    }
  };

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

  const saveIncorrectAnswer = async (incorrectAnswer) => {
    try {
      const updatedIncorrectAnswers = [...incorrectAnswers, incorrectAnswer];
      setIncorrectAnswers(updatedIncorrectAnswers);
      const jsonValue = JSON.stringify(updatedIncorrectAnswers);
      await AsyncStorage.setItem("incorrectAnswers", jsonValue);
    } catch (error) {
      console.error("Error saving incorrect answer: ", error);
    }
  };

  useEffect(() => {
    if (words.length > 0) {
      generateOptions();
    }
  }, [currentIndex, words]);

  const generateOptions = () => {
    const correctWord = words[currentIndex].Arabic;
    let options = [correctWord];
    while (options.length < 3) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const randomWord = words[randomIndex].Arabic;
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    options = options.sort(() => Math.random() - 0.5);
    setOptions(options);
  };

  const handleAnswer = (answer) => {
    const correctWord = words[currentIndex].Arabic;
    if (answer === correctWord) {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        Alert.alert("Congratulations!", "You have completed all the words!");
      }
    } else {
      saveIncorrectAnswer({ ...words[currentIndex], selectedAnswer: answer });
      Alert.alert("Incorrect", "Try again!");
    }
  };

  return (
    <>
      <View style={styles.headingView}>
        <Text style={styles.headingText}>Learn German Words</Text>
        <Image
          source={require("../assets/Flag_of_germany_800_480.png")}
          style={styles.flagImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.container}>
        {words.length > 0 && (
          <>
            <Text style={styles.question}>
              {`Translate "${words[currentIndex].German}" to Arabic:`}
            </Text>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={words.length - 1}
              step={1}
              value={currentIndex}
              onValueChange={(value) => setCurrentIndex(value)}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#b9e4c9"
              trackHeight={40}
              thumbSize={30}
            />

            <Text style={styles.indexText}>Current Index: {currentIndex}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("IncorrectAnswers")}
            >
              <Text style={styles.buttonText}>View Incorrect Answers</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
  },
  option: {
    backgroundColor: "#f2f0e9",
    padding: 15,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
  },
  optionText: {
    fontSize: 18,
  },
  slider: {
    width: "80%",
    height: 40,
    marginTop: 20,
  },
  indexText: {
    marginTop: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  track: {
    height: 50,
    borderRadius: 30,
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#b9e4c9",
    borderColor: "#1fbx28b",
    borderWidth: 10,
  },
  headingView: {
    flexDirection: "row",
    alignItems: "center",
  },
  headingText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "fff",
    marginRight: 10, // Adjust this value to add some space between text and image
  },
  flagImage: {
    flex: 1, // This makes the image take up the remaining space
    aspectRatio: 800 / 480, // This maintains the aspect ratio of the image
  },
});

export default PuzzleGame;
