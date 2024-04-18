import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_URL = 'http://172.16.7.19:3000/alunos';

const AlunosItem = ({ alunos, onDelete, onEdit }) => {
  return (
    <View style={styles.alunosItem}>
      <Text style={styles.alunosName}>{alunos.nome}</Text>
      <Text style={styles.alunosrm}>{alunos.rm}</Text>
      <View style={styles.alunosActions}>
        <TouchableOpacity style={styles.button} onPress={() => onEdit(alunos)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onDelete(alunos.id)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AlunosForm = ({ alunos, onSave, onCancel }) => {
  const [name, setName] = useState(alunos ? alunos.nome : '');
  const [rm, setRm] = useState(alunos ? alunos.rm : '');

  const handleSubmit = () => {
    if (alunos) {
      axios.put(`${API_URL}/${alunos.id}`, { nome: name, rm: rm })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    } else {
      axios.post(API_URL, { nome: name, rm: rm })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    }
  };

  return (
    <View style={styles.alunosForm}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="RM"
        value={rm}
        onChangeText={setRm}
        keyboardType="numeric"
      />
      <View style={styles.formActions}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  const [alunos, setAlunos] = useState([]);
  const [selectedAlunos, setSelectedAlunos] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = () => {
    axios.get(API_URL)
      .then((response) => setAlunos(response.data))
      .catch((error) => alert(error.message));
  };

  const handleDeleteAlunos = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchAlunos())
      .catch((error) => alert(error.message));
  };

  const handleEditAlunos = (alunos) => {
    setSelectedAlunos(alunos);
    setShowForm(true);
  };

  const handleSaveAlunos = () => {
    setShowForm(false);
    fetchAlunos();
  };

  const handleCancelAlunos = () => {
    setShowForm(false);
    setSelectedAlunos(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD API com React Native ALUNOS</Text>
      {showForm ? (
        <AlunosForm
          alunos={selectedAlunos}
          onSave={handleSaveAlunos}
          onCancel={handleCancelAlunos}
        />
      ) : (
        <>
          <FlatList
            data={alunos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <AlunosItem
                alunos={item}
                onDelete={handleDeleteAlunos}
                onEdit={handleEditAlunos}
              />
            )}
          />
          <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
            <Text style={styles.buttonText}>Adicionar usuário</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#D8D8D8',
  }, 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 50,
  },
  alunosItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  alunosName: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    margin: 5,
  },
  alunosrm: {
    flex: 1,
    fontSize: 26,
    textAlign: 'right',
    color: '#000000',
  },
  alunosActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  alunosForm: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#FF0000',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
 
});

export default App;
