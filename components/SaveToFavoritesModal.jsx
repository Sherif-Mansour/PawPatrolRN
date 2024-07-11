import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Card, Checkbox, Modal, Portal, TextInput, PaperProvider } from 'react-native-paper';

const SaveToFavoritesModal = ({ visible, onClose }) => {
  // use chatgpt to generate the state name
  // for the button to create a new list 
  const [createListModalVisible, setCreateListModalVisible] = useState(false);
  // for textinput in create a list name
  const [listName, setListName] = useState('');
  // for description in create a list page
  const [listDescription, setListDescription] = useState('');
  // for the select a list checkbox button
  const [selectedList, setSelectedList] = useState(null);

  // 
  const [checked, setChecked] = useState(false);

  // use chatgpt to generate 
  const handleCreateNewList = () => {
    setCreateListModalVisible(true);
  };

  // use chatgpt to generate
  const handleSaveList = () => {
    console.log('Saving list: ', listName, listDescription);
    setCreateListModalVisible(false);
    onClose();
  };

  // use chatgpt to generate
  const handleSelectList = (list) => {
    setSelectedList(selectedList === list ? null : list);
  };

  return (
    <Portal>
      {/* Reference: https://callstack.github.io/react-native-paper/docs/components/Modal */}
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* modal title */}
          <Text style={styles.modalTitle}>
            Save to Favorites
          </Text>
          {/* add icon and onpress function to create new list
            Reference:https://pictogrammers.com/library/mdi/icon/plus/
          */}
          <Button icon="plus" mode="contained" onPress={handleCreateNewList}>
            Create New List
          </Button>
          <Text style={styles.sectionTitle}>
            My Favorites
          </Text>
          {/* Default List (My Favorites) */}
          <Card>
            {/* Reference: https://callstack.github.io/react-native-paper/docs/components/Card/CardTitle */}
            <Card.Title
              title="My Favorites"
              right={() => (
                // reference https://callstack.github.io/react-native-paper/docs/components/Checkbox/
                <Checkbox
                  status={selectedList === 'My Favorites' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    handleSelectList('My Favorites');
                    setChecked(!checked);
                  }}
                />
              )}
            />
          </Card>
          {/* Create List Modal */}
          {createListModalVisible && (
            <Portal>
              <Modal visible={createListModalVisible} onDismiss={() => setCreateListModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    Create a list
                  </Text>
                  <Text style={styles.label}>
                    List Name
                  </Text>
                  <TextInput
                    placeholder='List Name'
                    value={listName}
                    onChangeText={setListName}
                    style={styles.input}
                  />
                  <Text style={styles.label}>
                    Description
                  </Text>
                  <TextInput
                    placeholder='Add list description'
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
          {/* Save button */}
          <Button mode="contained" onPress={() => console.log('Save button pressed')} style={styles.saveButton}>
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
});

export default SaveToFavoritesModal;
