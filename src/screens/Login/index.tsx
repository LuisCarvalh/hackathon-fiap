import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import loginUser from '@/src/services/user';
import HeaderLogin from '@/src/componentes/shared/HeaderLogin';
import Footer from '@/src/componentes/shared/Footer';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleButtonPress = async () => {
    try {
      const response = await loginUser(user, password);
      if(response.ok){
        const token = response.token;
        navigation.navigate('Post', { token });
      }else {
        errorHandler();
      }
    } catch (error) {
      errorHandler();
    }
  };

  const errorHandler = () => {
    Alert.alert('Erro', 'Erro ao realizar o login!');
  }

  return (
    <View style={styles.container}>
      <HeaderLogin title='Login'/>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={user}
        onChangeText={setUser}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50, 
    borderColor: '#DBD9CD', 
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 15, 
    width: '100%',
    backgroundColor: '#F4F4F2', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    color: '#4E4E4E',
    fontSize: 16,
    textAlign: 'center'
  },
  button: {
    width: '100%',
    backgroundColor: '#391A5F',
    marginTop: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 700,
    fontSize: 16
  }
});