const express = require('express');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.disable("x-powered-by");

app.use(express.json());
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'sistemaacademico',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de CRUD de alunos',
      version: '1.0.0',
      description: 'API para criar, ler, atualizar e deletar alunos'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['index.js']
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       '200':
 *         description: OK
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: nome do usuário
 *               idade:
 *                 type: integer
 *                 description: idade do usuário
 *             example:
 *               nome: João da Silva
 *               idade: 30
 *     responses:
 *       '200':
 *         description: OK
 *
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do usuário
 *               idade:
 *                 type: integer
 *                 description: Nova idade do usuário
 *             example:
 *               nome: José da Silva
 *               idade: 35
 *     responses:
 *       '204':
 *         description: No Content
 *   delete:
 *     summary: Deleta um usuário existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: ID do usuário a ser deletado
 *     responses:
 *       '204':
 *         description: No Content
 */

//exemplo: /alunos?nome=João 

app.get('/alunos', async (req, res) => {
  try {
    const { nome } = req.query;
    let query = 'SELECT * FROM alunos';
    let params = [];
    
    if (nome) {
      query += ' WHERE nome LIKE ?';
      params.push(`%${nome}%`);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao recuperar alunos:", error);
    res.status(500).send("Erro ao recuperar alunos");
  }
});

app.post('/alunos', async (req, res) => {
  try {
    const { nome, rm } = req.body;
    const [result] = await pool.query('INSERT INTO alunos (nome, rm) VALUES (?, ?)', [nome, rm]);
    res.json({ id: result.insertId, nome:nome, rm:rm});
  } catch (error) {
    console.error("Erro ao criar alunos:", error);
    res.status(500).send("Erro ao criar alunos");
  }
});

app.put('/alunos/:id', async (req, res) => {
  try {
    const { nome, rm } = req.body;
    const { id } = req.params;
    await pool.query('UPDATE alunos SET nome = ?, rm = ? WHERE id = ?', [nome, rm, id]);
    res.status(200).json({ id: id, nome: nome, rm: rm });
  } catch (error) {
    console.error("Erro ao atualizar alunos:", error);
    res.status(500).send("Erro ao atualizar alunos");
  }
});

app.delete('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM alunos WHERE id = ?', [id]);
    res.status(200).json({ id: Number(id) });
  } catch (error) {
    console.error("Erro ao deletar alunos:", error);
    res.status(500).send("Erro ao deletar alunos");
  }
});

app.get('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM alunos WHERE id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).send("Erro ao buscar alunos");
  }
});

const server = app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// Mantém o servidor rodando mesmo se ocorrer um erro
process.on('uncaughtException', (err) => {
  console.error('Erro não tratado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Rejeição não tratada:', err);
});

