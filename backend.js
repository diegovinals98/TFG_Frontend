const express = require('express');
const mysql = require('mysql');


const app = express();

app.use(express.json()); // Para analizar application/json
// Crear conexión a la base de datos
const db = mysql.createConnection({
  host: '10.0.0.36', // La IP de tu máquina donde corre Docker
  user: 'root', // El usuario de la base de datos
  password: '27101998', // La contraseña de la base de datos
  database: 'Series' // El nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
  if(err) {
    throw err;
  }
  console.log('Conectado a MariaDB');
  
});


// Método para obtener todos los usuarios del LogIn
app.post('/login', (req, res) => {
  let sql = 'SELECT * FROM Usuarios';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al obtener los usuarios');
    }
    // Devuelve todos los usuarios
    res.json(results);
  });
});

// Ruta de prueba para obtener datos de la tabla Usuarios
app.get('/usuario', (req, res) => {
  console.log("llamado a Usuario")
  let sql = 'SELECT * FROM Usuarios';
  db.query(sql, (err, results) => {
    if(err) throw err;
    console.log(results);
    res.send(results);
  });
});

// Ruta para añadir un nuevo usuario a la tabla Usuarios
app.post('/usuario', (req, res) => {
  console.log("Añadiendo un nuevo usuario");
  // Asegúrate de que los nombres de los campos coincidan con los de tu base de datos y tu formulario/entrada
  let nuevoUsuario = {
    Id: req.body.Id,
    Nombre: req.body.Nombre,
    Usuario: req.body.Usuario,
    Contraseña: req.body.Contraseña
  };

  let sql = 'INSERT INTO Usuarios SET ?';
  db.query(sql, nuevoUsuario, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Usuario añadido con éxito');
  });
});


// Ruta de prueba para obtener datos de la tabla Usuario_grupo
app.get('/usuario_grupo', (req, res) => {
  console.log("llamado a Usuario_Grupo")
  let sql = 'SELECT * FROM Usuario_Grupo';
  db.query(sql, (err, results) => {
    if(err) throw err;
    console.log(results);
    res.send(results);
  });
});

// Escuchar en un puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
