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


// Método para verificar el inicio de sesión de un usuario
app.post('/login', (req, res) => {
  let usuario = req.body.usuario;
  let contraseña = req.body.contraseña; // Asegúrate de que esto coincida con el nombre de campo en tu base de datos

  console.log("Usuario: " + usuario);
  console.log("Contraseña: " + contraseña);
  let sql = 'SELECT * FROM Usuarios WHERE Usuario = ? AND Contraseña = ?';
  db.query(sql, [usuario, contraseña], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al verificar el usuario');
    }
    if (results.length > 0) {
      // Usuario encontrado y contraseña correcta
      console.log('Inicio de sesión exitoso');
      // Envía los datos del usuario en la respuesta
      let user = results[0]; // asumiendo que el usuario es único
      console.log(user)
      res.json({ success: 1, user: user });
    } else {
      // Usuario no encontrado o contraseña incorrecta
      console.log('Usuario o contraseña incorrectos');
      res.json({ success: 0 });
    }
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

app.put('/usuario/:id', (req, res) => {
  const { id } = req.params;
  const { newNombre, newApellidos, newUsuario, newContrasena } = req.body;

  let sql = `UPDATE Usuarios SET Nombre = ?, Apellidos = ?, Usuario = ?, Contraseña = ? WHERE Id = ?`;
  db.query(sql, [newNombre, newApellidos, newUsuario, newContrasena, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el usuario');
    } else {
      console.log('Datos del usuario actualizados:', result);
      res.send('Datos del usuario actualizados correctamente.');
    }
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
    Contraseña: req.body.Contraseña,
    Apellidos: req.body.Apellidos
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
  let sql = 'SELECT * FROM Usuario_Grupo2';
  db.query(sql, (err, results) => {
    if(err) throw err;
    console.log(results);
    res.send(results);
  });
});

// Ruta para obtener los grupos a los que pertenece un usuario
app.get('/grupos/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log("Llamado a grupos para el usuario:", userId);

  // Ajusta esta consulta SQL según tu esquema de base de datos
  let sql = `SELECT Grupos.* FROM Grupos
             JOIN Usuario_Grupo2 ON Grupos.ID_Grupo = Usuario_Grupo2.ID_Grupo
             WHERE Usuario_Grupo2.ID_Usuario = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    console.log(results);
    res.send(results);
  });
});

app.get('/series-ids-usuario/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log("Llamado para obtener los IDs de series para el usuario:", userId);

  // Asegúrate de que esta consulta SQL coincida con tu esquema de base de datos y que la tabla y columna sean correctas
  let sql = `SELECT ID_Serie FROM Series WHERE ID_Usuario = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    // Solo enviamos los IDs de las series en la respuesta
    const seriesIds = results.map(row => row.ID_Serie);
    console.log(seriesIds);
    res.json(seriesIds);
  });
});



// Escuchar en un puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
