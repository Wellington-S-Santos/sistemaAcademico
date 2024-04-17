// Importando os módulos necessários
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import axios from 'axios';


// Definindo a URL da API
const API_URL = 'http://172.16.7.19:3000/alunos';


// Criando um componente para renderizar cada item da lista de usuários
const AlunosItem = ({ alunos, onDelete, onEdit }) => {
  return (
    <View style={styles.alunosItem}>
      <Text style={styles.alunosName}>{alunos.nome}</Text>
      <Text style={styles.alunosrm}>{alunos.rm}</Text>
      <View style={styles.alunosActions}>
        <Button title="Editar" onPress={() => onEdit(alunos)} />
        <Button title="Excluir" onPress={() => onDelete(alunos.id)} />
      </View>
    </View>
  );
};

// Criando um componente para o formulário de cadastro e edição de usuários
const AlunosForm = ({ alunos, onSave, onCancel }) => {
  const [name, setName] = useState(alunos ? alunos.nome : '');
  const [rm, setrm] = useState(alunos ? alunos.idade : '');

  const handleSubmit = () => {
    if (alunos) {
      // Atualizando um usuário existente
      axios.put(`${API_URL}/${alunos.id}`, { nome: name, rm: rm })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    } else {
      // Criando um novo usuário
      axios.post(API_URL, { nome: name, rm: rm })
        .then(() => onSave())
        .catch((error) => alert(error.message));
    }
  };

  return (
    <View style={styles.alunosForm}>
      <TextInput
        style={styles.input}
        placeholder="nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="rm"
        value={rm}
        onChangeText={setrm}
        keyboardType="numeric"
      />
      <View style={styles.formActions}>
        <Button title="Salvar" onPress={handleSubmit} />
        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </View>
  );
};


// Criando um componente para a tela principal da aplicação
const App = () => {
  const [alunos, setAlunos] = useState([]);
  const [selectedAlunos, setSelectedAlunos] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Buscando os usuários da API quando o componente é montado
    fetchAlunos();
  }, []);

  const fetchAlunos = () => {
    // Buscando os usuários da API e atualizando o estado
    axios.get(API_URL)
      .then((response) => setAlunos (response.data))
      .catch((error) => alert(error.message));
  };

  const handleDeleteAlunos = (id) => {
    // Excluindo um usuário da API e atualizando o estado
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchAlunos())
      .catch((error) => alert(error.message));
  };

  const handleEditAlunos = (alunos) => {
    // Selecionando um usuário para editar e mostrando o formulário
    setSelectedAlunos(alunos);
    setShowForm(true);
  };

  const handleSaveAlunos = () => {
    // Escondendo o formulário e atualizando os usuários
    setShowForm(false);
    fetchAlunos();
  };

  const handleCancelAlunos = () => {
    // Escondendo o formulário e limpando o usuário selecionado
    setShowForm(false);
    setSelectedAlunos(null);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD API com React Native ALUNOS</Text>
      {showForm ? (
        // Mostrando o formulário se o estado showForm for verdadeiro
        <AlunosForm
          alunos={selectedAlunos}
          onSave={handleSaveAlunos}
          onCancel={handleCancelAlunos}
        />
      ) : (
        // Mostrando a lista de usuários se o estado showForm for falso
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
          <Button title="Adicionar usuário" onPress={() => setShowForm(true)} />          
        </>
      )}
    </View>
  );
};

export default App;//tive que colocar essa linha


// Definindo os estilos dos componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  alunosItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  alunosName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  alunosrm: {
    flex: 1,
    fontSize: 18,
    textAlign: 'right',
  },
  alunosActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  alunosForm: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});
