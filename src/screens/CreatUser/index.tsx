import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUser, updateUser } from '@/src/services/user';

export default function CreateUser({ route }) {
  const { token, user } = route.params;
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(user ? user.isadmin : false);
  const navigation = useNavigation();

  const handleSaveUser = async () => {
    try {
      if (user) {
        await updateUser(token, user.id, { ...user, name, email, password, isadmin: isAdmin });
        Alert.alert('', 'Usuario atualizado com sucesso');
      } else {
        await createUser(token, { name, email, password, isadmin: isAdmin });
        Alert.alert('', 'Usuario criado com sucesso');
      }
      navigation.navigate('Listar usuários', { token });
    } catch (error) {
      console.error('Failed to save user:', error);
      Alert.alert('Error', 'Failed to save user');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder={user ? "Deixe em branco para manter a senha atual" : ""}
      />
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Admin</Text>
        <Switch
          value={isAdmin}
          onValueChange={setIsAdmin}
        />
      </View>
      <Button color='#391A5F' title={user ? "Editar Usuario" : "Criar Usuario"} onPress={handleSaveUser} />
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});