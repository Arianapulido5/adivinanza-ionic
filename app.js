const express = require('express');
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./swagger/config');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Variables globales para el juego (en producción deberían estar en una base de datos)
let games = new Map();
let users = new Map();
let leaderboard = [];

// Middleware para verificar token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
};

// Rutas de autenticación
app.post('/register', async (req, res) => {
    try {
        const { usuario, correo, password } = req.body;
        if (users.has(usuario)) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }
        users.set(usuario, { correo, password, partidas_jugadas: 0, puntos: 0 });
        res.json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const user = users.get(usuario);
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ usuario }, 'secretkey', { expiresIn: '24h' });
        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rutas del juego
app.post('/start', verifyToken, (req, res) => {
    try {
        const usuario = req.user.usuario;
        const numeroSecreto = Math.floor(Math.random() * 100) + 1;
        games.set(usuario, {
            numeroSecreto,
            intentos: 0,
            completado: false
        });
        res.json({ message: 'Juego iniciado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/guess', verifyToken, (req, res) => {
    try {
        const usuario = req.user.usuario;
        const { numero } = req.body;
        const game = games.get(usuario);

        if (!game) {
            return res.status(400).json({ message: 'Debes iniciar un juego primero' });
        }

        if (game.completado) {
            return res.status(400).json({ message: 'El juego ya fue completado' });
        }

        game.intentos++;

        if (numero === game.numeroSecreto) {
            game.completado = true;
            const user = users.get(usuario);
            user.partidas_jugadas++;
            user.puntos += Math.max(100 - (game.intentos * 10), 10);
            updateLeaderboard();
            return res.json({ message: '¡Felicitaciones! Has adivinado el número' });
        }

        const mensaje = numero < game.numeroSecreto ? 
            'El número es mayor' : 
            'El número es menor';
        
        res.json({ message: mensaje });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/restart', verifyToken, (req, res) => {
    try {
        const usuario = req.user.usuario;
        const numeroSecreto = Math.floor(Math.random() * 100) + 1;
        games.set(usuario, {
            numeroSecreto,
            intentos: 0,
            completado: false
        });
        res.json({ message: 'Juego reiniciado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/status', verifyToken, (req, res) => {
    try {
        const usuario = req.user.usuario;
        const game = games.get(usuario);
        if (!game) {
            return res.status(400).json({ message: 'No hay juego activo' });
        }
        res.json({
            intentos: game.intentos,
            completado: game.completado
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/leaderboard', verifyToken, (req, res) => {
    try {
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/statistics', verifyToken, (req, res) => {
    try {
        const usuario = req.user.usuario;
        const user = users.get(usuario);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({
            partidas_jugadas: user.partidas_jugadas,
            puntos: user.puntos
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Función auxiliar para actualizar el leaderboard
function updateLeaderboard() {
    leaderboard = Array.from(users.entries())
        .map(([usuario, data]) => ({
            usuario,
            puntos: data.puntos,
            partidas_jugadas: data.partidas_jugadas
        }))
        .sort((a, b) => b.puntos - a.puntos)
        .slice(0, 10);
}

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});