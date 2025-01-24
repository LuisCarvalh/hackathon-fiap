import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Post from '../screens/Post';
import PostDetails from '../screens/DetailsPost';
import CreatePost from '../screens/CreatPost';
import EditPost from '../screens/EditPost';
import ListUsers from '../screens/ListUsers';
import CreateUser from '../screens/CreatUser';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="PostDetails" component={PostDetails} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="EditPost" component={EditPost} />
        <Stack.Screen name="ListUsers" component={ListUsers} />
        <Stack.Screen name="User" component={CreateUser} />
      </Stack.Navigator>
  );
}