import React, { useEffect, useState } from 'react';
import { View, Text, CheckBox, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchQuiz, Quiz } from '@/src/services/quiz';


export default function ShowQuiz() {
  const route = useRoute();
  const { token, quizId } = route.params;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const fetchedQuiz = await fetchQuiz(token, quizId);
        setQuiz(fetchedQuiz);
      } catch (err) {
        setError('Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [token, quizId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Text>No quiz found</Text>
      </View>
    );
  }

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Quiz da tividade:</Text>
          <Text style={styles.title}>{quiz.post.title}</Text>
          <FlatList
            data={quiz.questions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.questionContainer}>
                      {item.content !== '' && (
                        <>
                        <Text style={styles.questionText}>{item.content}</Text>
                        {item.options.map((option, index) => (
                            <View key={index} style={styles.optionContainer}>
                            <CheckBox value={option.isCorrect} />
                            <Text style={styles.optionText}>{option.content}</Text>
                            </View>
                        ))}
                        </>
                    )}
              </View>
            )}
          />
        </View>
      );

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  questionContainer: { marginBottom: 20 },
  optionContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  questionText: { fontSize: 18, fontWeight: 'bold' },
  optionText: { fontSize: 16, marginLeft: 10 },
});