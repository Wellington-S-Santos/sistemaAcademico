const assert = require('chai').assert;
const axios = require('axios');

describe('Testes da API', function () {
    let userId;

    it('Listar todos usuários', async function () {
        const response = await axios.get('http://localhost:3000/users');
        assert.equal(response.status, 200);
        assert.isArray(response.data);
    });

    it('Criar novo usuário', async function () {
        const newUser = { NOME: 'Usuario Teste', IDADE: 20 };
        const response = await axios.post('http://localhost:3000/users', newUser);
        assert.equal(response.status, 200);
        assert.isObject(response.data);
        assert.property(response.data, 'id');
        assert.isNumber(response.data.id);
        userId = response.data.id; // store the user ID for use in the next test
    });

    it('Modificar usuário', async function () {
        const updatedUser = { NOME: 'Usuario Teste Modificado', IDADE: 25 };
        const response = await axios.put(`http://localhost:3000/users/${userId}`, updatedUser);
        assert.equal(response.status, 200);
        assert.isObject(response.data);
        assert.propertyVal(response.data, 'NOME', 'Usuario Teste Modificado');
        assert.propertyVal(response.data, 'IDADE', 25);
    });

    it('Excluir usuário', async function () {
        const response = await axios.delete(`http://localhost:3000/users/${userId}`);
        assert.equal(response.status, 200);
        const deletedUser = response.data;
        assert.isObject(deletedUser);
        assert.propertyVal(deletedUser, 'id', userId);
    });

});