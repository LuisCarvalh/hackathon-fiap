import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createPost } from '@/src/services/post';
import Footer from '@/src/componentes/shared/Footer';


export default function CreatePost({ route }) {
  const { token, userId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();

  const handleCreatePost = async () => {
    try {
      await createPost(token, title, content, userId);
      Alert.alert('', 'Conteudo criado com sucesso');
      navigation.navigate('Atividades', {token});
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button color='#391A5F' title="Criar" onPress={handleCreatePost} />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});