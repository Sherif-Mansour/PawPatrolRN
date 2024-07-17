import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Card, Checkbox, Modal, Portal, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../utils/UserContext';

// SaveToFavoritesModal component definition
const SaveToFavoritesModal = ({ visible, onClose, adId, onSave }) => {
  const { user, lists, fetchUserLists, handleAddToFavorites } = useUser();

  // State to control the visibility of the "Create New List" modal
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [selectedList, setSelectedList] = useState('My Favorites');

  // Fetch user lists when the user is available
  useEffect(() => {
    if (user) {
      fetchUserLists();
    }
  }, [user]);

  // Function to show the "Create New List" modal
  const handleCreateNewList = () => {
    setCreateListModalVisible(true);
  };

  // Function to handle saving a new list to Firestore
  const handleSaveList = async () => {
    if (listName) {
      await firestore()
        .collection('favorites')
        .doc(user.uid)
        .collection('lists')
        .doc(listName)
        .set({ description: listDescription, favorites: [] });
      fetchUserLists(); // Fetch updated lists
    }
    setCreateListModalVisible(false);
  };

  // Function to select a list
  const handleSelectList = (list) => {
    setSelectedList(list);
  };

  // Function to handle saving an ad to the selected list
  const handleSave = async () => {
    if (!adId) {
      console.error('Ad ID is not defined.');
      return;
    }

    if (!selectedList) {
      console.error('No list selected.');
      return;
    }

    console.log(`Saving adId: ${adId} to list: ${selectedList}`);

    try {
      await handleAddToFavorites(adId, selectedList);
      onSave(selectedList);
      // Close the modal after successful save
      onClose();
    } catch (error) {
      // Handle the error as needed (e.g., show an error message to the user)
      console.error('Error in handleSave:', error);
    }
  };


  return (
    <Portal>
      {/* Reference: https://callstack.github.io/react-native-paper/docs/components/Modal */}
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Save to Favorites</Text>
          <Button icon="plus" mode="contained" onPress={handleCreateNewList}>
            Create New List
          </Button>
          <Text style={styles.sectionTitle}>My Lists</Text>
          {lists.map((list) => (
            <Card key={list.name} style={styles.card}>
              {/* Reference: https://callstack.github.io/react-native-paper/docs/components/Card/CardTitle */}
              <Card.Title
                title={list.name}
                right={() => (
                  // Reference: https://callstack.github.io/react-native-paper/docs/components/Checkbox/
                  <Checkbox
                    status={selectedList === list.name ? 'checked' : 'unchecked'}
                    onPress={() => handleSelectList(list.name)}
                  />
                )}
              />
            </Card>
          ))}
          {createListModalVisible && (
            <Portal>
              <Modal
                visible={createListModalVisible}
                onDismiss={() => setCreateListModalVisible(false)}
                contentContainerStyle={styles.modalContainer}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Create a list</Text>
                  <Text style={styles.label}>List Name</Text>
                  {/* Reference: https://callstack.github.io/react-native-paper/docs/components/TextInput/ */}
                  <TextInput
                    placeholder="List Name"
                    value={listName}
                    onChangeText={setListName}
                    style={styles.input}
                  />
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    placeholder="Add list description"
                    value={listDescription}
                    onChangeText={setListDescription}
                    multiline
                    numberOfLines={4}
                    style={[styles.input, styles.multilineInput]}
                  />
                  <Button mode="contained" onPress={handleSaveList} style={styles.saveButton}>
                    Save
                  </Button>
                  <Button mode="contained" onPress={() => setCreateListModalVisible(false)} style={styles.saveButton}>
                    Dismiss
                  </Button>
                </View>
              </Modal>
            </Portal>
          )}
          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            Save
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 16,
    borderRadius: 10,
    elevation: 5,
  },
  modalContent: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  modalTitle: {
    justifyContent: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 20,
  },
  card: {
    marginBottom: 8, // Add margin bottom to create space between cards
  },
});

export default SaveToFavoritesModal;
