import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import { deleteUser, fetchUser, fetchUserList } from '@/src/services/user';
import Header from '@/src/componentes/shared/Header';

const initialLayout = { width: Dimensions.get('window').width };

export default function ListUsers({ route }) {
  const { token } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [professors, setProfessors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageProfessors, setPageProfessors] = useState(0);
  const [pageStudents, setPageStudents] = useState(0);
  const [totalPagesProfessors, setTotalPagesProfessors] = useState(1);
  const [totalPagesStudents, setTotalPagesStudents] = useState(1);
  const [isFetchingMoreProfessors, setIsFetchingMoreProfessors] = useState(false);
  const [isFetchingMoreStudents, setIsFetchingMoreStudents] = useState(false);
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'professors', title: 'Professores' },
    { key: 'students', title: 'Alunos' },
  ]);

  
    const loadUser = async () => {
      try {
        const userData = await fetchUser(token);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadUser();
  }, [token, pageProfessors, pageStudents]);

  useLayoutEffect(() => {
    if (user) {
      navigation.setOptions({
        headerTitle: () => <Header user={user} token={token} />,
      });
    }
  }, [navigation, user]);

    const loadUsers = async () => {
      try {
        const [professorsData, studentsData] = await Promise.all([
          fetchUserList(token, true, pageProfessors),
          fetchUserList(token, false, pageStudents),
        ]);
        setProfessors(professorsData.data);
        setTotalPagesProfessors(professorsData.pagination.totalPages);
        setStudents(studentsData.data);
        setTotalPagesStudents(studentsData.pagination.totalPages);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadUsers();
  }, [token, pageProfessors, pageStudents]);

  const handleLoadMoreProfessors = () => {
    if (pageProfessors < totalPagesProfessors - 1 && !isFetchingMoreProfessors) {
      setIsFetchingMoreProfessors(true);
      setPageProfessors((prevPage) => prevPage + 1);
    }
  };

  const handleLoadMoreStudents = () => {
    if (pageStudents < totalPagesStudents - 1 && !isFetchingMoreStudents) {
      setIsFetchingMoreStudents(true);
      setPageStudents((prevPage) => prevPage + 1);
    }
  };

  const handleEditUser = (user: User) => {
    navigation.navigate('User', { token, user });
    
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert(
      '',
      'Tem certeza que deseja excluir esse usuario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(token, userId);
              loadUsers();
            } catch (error) {
              console.error('Failed to delete user:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderScene = SceneMap({
    professors: () => (
      <UserList
        users={professors}
        onLoadMore={handleLoadMoreProfessors}
        isFetchingMore={isFetchingMoreProfessors}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    ),
    students: () => (
      <UserList
        users={students}
        onLoadMore={handleLoadMoreStudents}
        isFetchingMore={isFetchingMoreStudents}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    ),
  });

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createUserButton}
          onPress={() => navigation.navigate('User', { token })}
        >
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.label}
            activeColor="#000"
            inactiveColor="#888" 
          />
        )}
      />
    </View>
  );
}

function UserList({ users, onLoadMore, isFetchingMore, onEdit, onDelete }) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
    overflow: 'visible',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  createUserButton: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#ed9121',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  adminText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  userText: {
    color: '#6c757d',
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: '#000',
  },
  label: {
    color: '#000',
    fontWeight: 'bold',
  },
});