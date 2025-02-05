import React, { useState } from 'react';
import { View, Text, TextInput, Button, CheckBox, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreateQuiz({ route }) {
  const { token, userId, postId } = route.params;
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([{ content: '', isCorrect: false }]);
  
  const addOption = () => {
    setOptions([...options, { content: '', isCorrect: false }]);
  };

  const updateOption = (index, content) => {
    const newOptions = [...options];
    newOptions[index].content = content;
    setOptions(newOptions);
  };

  const toggleCorrect = (index) => {
    const newOptions = options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
    setOptions(newOptions);
  };

  const addQuestion = () => {
    if (questionText.trim() === '' || options.some(opt => opt.content.trim() === '')) {
      console.error('Question text or options are empty');
      return;
    }
    const newQuestion = { content: questionText, options };
    console.log('Adding question:', newQuestion);
    setQuestions([...questions, newQuestion]);
    setQuestionText('');
    setOptions([{ content: '', isCorrect: false }]);
  };

  const createQuiz = async () => {
    console.log('Questions before submitting:', questions);
    if (questions.length === 0) {
      console.error('No questions to submit');
      return;
    }

    console.log('Creating quiz with questions:', questions);

    try {
      const response = await fetch('http://192.168.0.110:3000/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ postId, questions })
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Quiz</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua pergunta"
        value={questionText}
        onChangeText={setQuestionText}
      />
      <FlatList
        data={options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.optionContainer}>
            <CheckBox value={item.isCorrect} onValueChange={() => toggleCorrect(index)} />
            <TextInput
              style={styles.input}
              placeholder="Opção de resposta"
              value={item.content}
              onChangeText={(text) => updateOption(index, text)}
            />
          </View>
        )}
      />
      <Button title="Adicionar opção" onPress={addOption} />
      <Button title="Adicionar pergunta" onPress={addQuestion} />
      <Button title="Criar Quiz" onPress={createQuiz} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  optionContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 }
});