const http = require('http');
const mysql = require('mysql');

const host = 'localhost';
const usuarioDB = 'root';
const contrasenaDB = 'Cara.25818';
const nombreDB = 'extra';

const conexion = mysql.createConnection({
  host: host,
  user: usuarioDB,
  password: contrasenaDB,
  database: nombreDB
});

conexion.connect((error) => {
  if (error) {
    console.error('Error de conexión a la base de datos: ' + error.message);
    return;
  }
  console.log('Conexión a la base de datos exitosa');

  const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/guardar_registro') {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => {
        const { nombre, edad, correo } = JSON.parse(data);

        const sql = `INSERT INTO usuarios (nombre, edad, correo) VALUES (?, ?, ?)`;
        const values = [nombre, edad, correo];

        conexion.query(sql, values, (error, result) => {
          if (error) {
            console.error('Error al registrar usuario: ' + error.message);
            res.statusCode = 500;
            res.end('Error al registrar usuario');
          } else {
            console.log('Usuario registrado correctamente');
            res.statusCode = 200;
            res.end('Usuario registrado correctamente');
          }
        });
      });
    } else {
      res.statusCode = 404;
      res.end('Página no encontrada');
    }
  });

  const port = 3000;

  server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
});
