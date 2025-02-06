import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { editPost } from '@/src/services/post';

export default function EditPost({ route }) {
  const { token, userId, post } = route.params;
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const id = post.id;
  const navigation = useNavigation();

  const handleEditPost = async () => {
    try {
      await editPost(token, id, title, content, userId);
      Alert.alert('', 'Conteudo editado com sucesso');
      navigation.navigate('Atividades', {token});
    } catch (error) {
      console.error('Failed to edit post:', error);
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
      <Button color='#391A5F' title="Atualizar" onPress={handleEditPost} />

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