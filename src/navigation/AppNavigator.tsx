import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Post from '../screens/Post';
import PostDetails from '../screens/DetailsPost';
import CreatePost from '../screens/CreatPost';
import EditPost from '../screens/EditPost';
import ListUsers from '../screens/ListUsers';
import CreateUser from '../screens/CreatUser';
import CreateQuiz from '../screens/CreatQuiz';
import ShowQuiz from '../screens/ShowQuiz';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerStyle: {
          backgroundColor: '#391A5F',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Atividades" component={Post}/>
        <Stack.Screen name="Atividade" component={PostDetails}/>
        <Stack.Screen name="Adicionar conteúdo" component={CreatePost}/>
        <Stack.Screen name="Editar atividade" component={EditPost}/>
        <Stack.Screen name="Listar usuários" component={ListUsers}/>
        <Stack.Screen name="Usuário" component={CreateUser}/>
        <Stack.Screen name="Criar quiz" component={CreateQuiz}/>
        <Stack.Screen name="Quiz" component={ShowQuiz}/>
      </Stack.Navigator>
  );
}