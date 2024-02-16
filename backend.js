const express = require('express');
const mysql = require('mysql');

const app = express();

// Crear conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost', // La IP de tu máquina donde corre Docker
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

// Ruta de prueba para obtener datos
app.get('/datos', (req, res) => {
  console.log("llamado a data")
  let sql = 'SELECT * FROM Usuarios';
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
