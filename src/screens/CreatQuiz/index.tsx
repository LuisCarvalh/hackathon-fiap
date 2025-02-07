import React, { useState } from 'react';
import { View, Text, TextInput, Button, CheckBox, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createQuiz } from '@/src/services/quiz';

export default function CreateQuiz({ route }) {
  const { token, userId, postId } = route.params;
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([{ content: '', options: [{ content: '', isCorrect: false }] }]);
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
    console.log('questions:', questions);
    const newQuestion = { content: questionText, options };
    console.log('Adding question:', newQuestion);
    setQuestions([...questions, newQuestion]);
    console.log('questions:', questions);
    setQuestionText('');
    setOptions([{ content: '', isCorrect: false }]);
  };

  const handleCreateQuiz = async () => {
    console.log('Questions before submitting:', questions);
    if (questions.length === 0) {
      console.error('No questions to submit');
      return;
    }

    console.log('Creating quiz with questions:', questions);

    try {
        await createQuiz(token, postId, questions);
        navigation.navigate('Atividades', { token, userId, refresh: true });
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
      <Button color='#391A5F' title="Adicionar opção" onPress={addOption} />
      <Button color='#391A5F' title="Adicionar pergunta" onPress={addQuestion} />
      <Button color='#391A5F' title="Criar Quiz" onPress={handleCreateQuiz} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  optionContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 }
});