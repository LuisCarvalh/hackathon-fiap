import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HeaderProps {
  user?: User;
  token?: string;
}

export default function Header({ user, token }: HeaderProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);

  const handleMenuPress = () => {
    setModalVisible(true);
  };

  const handleCloseMenu = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.header}>
        {user?.name && (
      <View>
          <Text style={styles.userName}>Olá, {user?.name}</Text>
      </View>
        )}
      {user?.isadmin && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleMenuPress}>
            <Icon name="menu" size={30} color="#007bff" />
          </TouchableOpacity>
        </View>
      )}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseMenu}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { navigation.navigate('Listar usuários', { token }); handleCloseMenu(); }}>
              <Text style={styles.menuOptionText}>Usuários</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Atividades', { token }); handleCloseMenu(); }}>
              <Text style={styles.menuOptionText}>Atividades</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Login', { token }); handleCloseMenu(); }}>
              <Text style={styles.menuOptionText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#391A5F',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 1,
  },
  menu: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 10,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    marginLeft: 10,
    color: '#fff',
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