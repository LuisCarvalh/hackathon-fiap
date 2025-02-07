import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { deletePost, fetchPosts } from '@/src/services/post'
import { useNavigation } from '@react-navigation/native';
import { fetchUser } from '@/src/services/user';
import Header from '@/src/componentes/shared/Header';
import { Searchbar } from 'react-native-paper';
import Footer from '@/src/componentes/shared/Footer';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Post({ route }) {
  const { token } = route.params;
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUser(token);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    loadUser();
  }, [token]);

  useLayoutEffect(() => {
    if (user) {
      navigation.setOptions({
        headerRight: () => <Header user={user} token={token} />,
      });
    }
  }, [navigation, user]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts(token, '', page, 10);
        setPosts(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    loadPosts();
  }, [page, token]);

  const handlePostPress = (post: Post) => {
    navigation.navigate('Atividade', { post });
  };

  const handleEditPostPress = (token, userId, post: Post) => {
    navigation.navigate('Editar atividade', { token, userId, post });
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      '',
      'Tem certeza que deseja excluir essa publicação?',
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
              await deletePost(token, id);
              handleSearch(searchQuery);
            } catch (error) {
              console.error('Failed to delete user:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCreateQuizPress = (token, userId, postId: string) => {
    navigation.navigate('Criar quiz', { token, userId, postId });
  };

  const handleShowQuizPress = (quizId: string) => {
    navigation.navigate('Quiz', { token, quizId });
  };

  const handleLoadMore = () => {  
    if (page < totalPages - 1 && !isFetchingMore) {
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && page === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    try {
      const response = await fetchPosts(token, value, page, 10);
      setPosts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {user?.isadmin && (
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => navigation.navigate('Adicionar conteúdo', { token, userId: user.id })}
          >
            <Text style={styles.buttonText}>Criar atividade</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.topContainer}>
        <Searchbar
          placeholder="Buscar"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>
      <View style={styles.listContainer}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.post}
            onPress={() => handlePostPress(item)}
          >
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}</Text>
              <Text>Autor: {item.author.name}</Text>
            </View>
            {user?.isadmin && (
              <View style={styles.postButtonContainer}>
                {item.quiz != null ? (
                  <TouchableOpacity style={styles.addQuizButton} onPress={() => handleShowQuizPress(item.quiz?.id)}><Text style={styles.buttonText}>Quiz</Text></TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.addQuizButton} onPress={() => handleCreateQuizPress(token, user?.id, item.id)}><Text style={styles.buttonText}>Criar Quiz</Text></TouchableOpacity>
                )}
                <TouchableOpacity style={styles.editPostButton} onPress={() => handleEditPostPress(token, user?.id, item)}><Icon name="edit" size={20} color="#fff"/></TouchableOpacity>
                <TouchableOpacity style={styles.deletePostButton} onPress={() => handleDelete(item.id)}><Icon name="delete" size={20} color="#fff"/></TouchableOpacity>

              </View>
            )}
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        />
        </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    overflow: 'visible',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchbar: {
    flex: 1,
    marginRight: 6,
    backgroundColor: '#F4F4F2',
    borderRadius: 4,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    marginTop: 8,
  },
  createPostButton: {
    backgroundColor: '#391A5F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  postContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  post: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  postButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editPostButton: {
    backgroundColor: '#391A5F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addQuizButton: {
    backgroundColor: '#2D51AC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  deletePostButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    paddingVertical: 6,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  listContainer: {
    backgroundColor: '#F4F4F2',
    borderRadius: 4,
  }
});