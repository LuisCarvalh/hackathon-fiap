import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PostDetails({ route }) {
  const { post } = route.params; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.meta}>Autor: {post.author.name}</Text>
      <Text style={styles.meta}>
        Criado em: {new Date(post.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.content}>{post.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
