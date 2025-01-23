import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HeaderProps {
  user: User;
  token: string;
}

export default function Header({ user, token }: HeaderProps) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleMenuPress = () => {
    setModalVisible(true);
  };

  const handleCloseMenu = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerText}>On School</Text>
      </View>
      <View style={styles.rightContainer}>
      <View>
        <Text style={styles.userName}>Olá, {user.name}</Text>
      </View>
      {user?.isadmin && (
        <View>
          <TouchableOpacity onPress={handleMenuPress}>
            <Icon name="menu" size={30} color="#007bff" />
          </TouchableOpacity>
        </View>
      )}
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseMenu}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { navigation.navigate('ListUsers', { token }); handleCloseMenu(); }}>
              <Text style={styles.menuOptionText}>Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Post', { token }); handleCloseMenu(); }}>
              <Text style={styles.menuOptionText}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Login', { token }); handleCloseMenu(); }}>
              <Text style={styles.menuOptionText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 50,
        backgroundColor: '#391A5F',
        paddingHorizontal: 10,
        zIndex: 1,
      },
      headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#333',
        letterSpacing: 1,
      },
      rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      },
      userName: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
      },
      modal: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: 0,
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 200,
        marginTop: 60,
        marginRight: 10,
      },
      menuOptionText: {
        fontSize: 16,
        padding: 10,
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      },
});