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
  database: 'crudapi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de CRUD de usuarios',
      version: '1.0.0',
      description: 'API para criar, ler, atualizar e deletar usuarios'
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
 * /usuarios:
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
 * /usuarios/{id}:
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

//exemplo: /usuarios?nome=João 

app.get('/usuarios', async (req, res) => {
  try {
    const { nome } = req.query;
    let query = 'SELECT * FROM usuario';
    let params = [];
    
    if (nome) {
      query += ' WHERE nome LIKE ?';
      params.push(`%${nome}%`);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao recuperar usuarios:", error);
    res.status(500).send("Erro ao recuperar usuarios");
  }
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nome, rm } = req.body;
    const [result] = await pool.query('INSERT INTO usuario (nome, rm) VALUES (?, ?)', [nome, idade]);
    res.json({ id: result.insertId, nome:nome, idade:idade});
  } catch (error) {
    console.error("Erro ao criar usuarios:", error);
    res.status(500).send("Erro ao criar usuarios");
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const { nome, rm } = req.body;
    const { id } = req.params;
    await pool.query('UPDATE usuario SET nome = ?,idade = ? WHERE id = ?', [nome, idade, id]);
    res.status(200).json({ id: id, nome: nome, rm: rm });
  } catch (error) {
    console.error("Erro ao atualizar usuarios:", error);
    res.status(500).send("Erro ao atualizar usuarios");
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuario WHERE id = ?', [id]);
    res.status(200).json({ id: Number(id) });
  } catch (error) {
    console.error("Erro ao deletar usuarios:", error);
    res.status(500).send("Erro ao deletar usuarios");
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuarios:", error);
    res.status(500).send("Erro ao buscar usuarios");
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

