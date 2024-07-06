import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PuzzleGame from "./src/PuzzleGame";
import IncorrectAnswersScreen from "./src/IncorrectAnswersScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PuzzleGame">
        <Stack.Screen name="PuzzleGame" component={PuzzleGame} />
        <Stack.Screen
          name="IncorrectAnswers"
          component={IncorrectAnswersScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
