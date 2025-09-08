const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Redirección para SPA - todas las rutas van al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Lista de jugadores famosos de fútbol
const footballPlayers = [
  // --- Jugadores conocidos 2010-2025 ---
  "Lionel Messi", "Cristiano Ronaldo", "Neymar Jr", "Kylian Mbappé", "Robert Lewandowski",
  "Karim Benzema", "Luka Modric", "Toni Kroos", "Sergio Ramos", "Gerard Piqué",
  "Iker Casillas", "Gianluigi Buffon", "David de Gea", "Manuel Neuer", "Marc-André ter Stegen",
  "Thibaut Courtois", "Jan Oblak", "Alisson Becker", "Ederson Moraes", "Keylor Navas",
  "Virgil van Dijk", "Jordi Alba", "Dani Alves", "Marcelo Vieira", "Philipp Lahm",
  "Andrew Robertson", "Trent Alexander-Arnold", "Raphaël Varane", "Kalidou Koulibaly", "Antonio Rüdiger",
  "Matthijs de Ligt", "Aymeric Laporte", "John Stones", "Ruben Dias", "Thiago Silva",
  "Marquinhos Correa", "Leonardo Bonucci", "Giorgio Chiellini", "Pepe Ferreira", "Éder Militão",
  "Frenkie de Jong", "Sergio Busquets", "Xavi Hernández", "Andrés Iniesta", "Paul Pogba",
  "N’Golo Kanté", "Casemiro Henrique", "Rodri Hernández", "Kevin De Bruyne", "Ilkay Gündogan",
  "Marco Verratti", "Thiago Alcântara", "Joshua Kimmich", "Arturo Vidal", "Mesut Özil",
  "Cesc Fàbregas", "Isco Alarcón", "James Rodríguez", "David Silva", "Bernardo Silva",
  "Bruno Fernandes", "Christian Eriksen", "Kai Havertz", "Jude Bellingham", "Pedri González",
  "Gavi Páez", "Phil Foden", "Jack Grealish", "Bukayo Saka", "Raheem Sterling",
  "Marcus Rashford", "Mason Mount", "Jadon Sancho", "Harry Kane", "Erling Haaland",
  "Dusan Vlahovic", "Romelu Lukaku", "Edinson Cavani", "Luis Suárez", "Sadio Mané",
  "Mohamed Salah", "Riyad Mahrez", "Lautaro Martínez", "Ángel Di María", "Paulo Dybala",
  "João Félix", "Antoine Griezmann", "Ousmane Dembélé", "Vinícius Júnior", "Rodrygo Goes",
  "Gabriel Jesus", "Richarlison Andrade", "Raphinha Belloli", "Roberto Firmino", "Hakim Ziyech",
  "Christian Pulisic", "Weston McKennie", "Giovanni Reyna", "Tyler Adams", "Alphonso Davies",
  "Jonathan David", "Son Heung-min", "Takumi Minamino", "Shinji Kagawa", "Keisuke Honda",
  "Hirving Lozano", "Raúl Jiménez", "André-Pierre Gignac", "Clint Dempsey", "Carlos Vela",
  "Diego Forlán", "Maxi Gómez", "Edinson Cavani", "Darwin Núñez", "Federico Valverde",
  "Rodrigo Bentancur", "Nicolás Otamendi", "Lisandro Martínez", "Leandro Paredes", "Ángel Correa",
  "Julián Álvarez", "Enzo Fernández", "Giovani Lo Celso", "Papu Gómez", "Lautaro Martínez",
  "Yaya Touré", "Didier Drogba", "Samuel Eto’o", "Pierre-Emerick Aubameyang", "Wilfried Zaha",
  "Kalvin Phillips", "Declan Rice", "João Cancelo", "Diogo Jota", "Pepe Reina",
  "Gerard Moreno", "Iago Aspas", "Álvaro Morata", "Fernando Torres", "David Villa",
  "Dani Olmo", "Ansu Fati", "Yeremi Pino", "Alejandro Garnacho", "Nicolás Tagliafico",
  "Gonzalo Higuaín", "Carlos Tévez", "Juan Román Riquelme", "Ezequiel Lavezzi", "Esteban Cambiasso",
  "Diego Godín", "José Giménez", "Maxi Pereira", "Martín Cáceres", "Sebastián Coates",
  "Claudio Bravo", "Arturo Vidal", "Gary Medel", "Alexis Sánchez", "Eduardo Vargas",
  "Charles Aránguiz", "Matías Fernández", "Mauricio Isla", "Jean Beausejour", "Marcelo Díaz",
  "Alexandre Lacazette", "Kingsley Coman", "Olivier Giroud", "Kylian Mbappé", "Aurélien Tchouaméni",
  "Eduardo Camavinga", "Dayot Upamecano", "Presnel Kimpembe", "Lucas Hernández", "Theo Hernández",
  "Ferland Mendy", "Benjamin Pavard", "Adrien Rabiot", "Anthony Martial", "Corentin Tolisso",
  "Memphis Depay", "Georginio Wijnaldum", "Arjen Robben", "Robin van Persie", "Dirk Kuyt",
  "Klaas-Jan Huntelaar", "Virgil van Dijk", "Denzel Dumfries", "Stefan de Vrij", "Daley Blind",
  "Wesley Sneijder", "Rafael van der Vaart", "Mark van Bommel", "Nigel de Jong", "Patrick van Aanholt",
  "Zlatan Ibrahimović", "Henrikh Mkhitaryan", "Nemanja Vidić", "Branislav Ivanović", "Aleksandar Mitrović",
  "Dejan Lovren", "Luka Modric", "Ivan Rakitic", "Mario Mandzukic", "Mateo Kovacic",
  "Darijo Srna", "Vedran Corluka", "Andrej Kramaric", "Marcelo Brozovic", "Dominik Livakovic",
  "Hakan Çalhanoglu", "Burak Yilmaz", "Cenk Tosun", "Emre Belözoğlu", "Arda Turan",
  "Sergi Roberto", "Dani Ceballos", "Álvaro Negredo", "Nacho Fernández", "Jesé Rodríguez",
  "Gerard Deulofeu", "Mikel Oyarzabal", "Koke Resurrección", "Saúl Ñíguez", "Juan Mata",
  "Ander Herrera", "Santi Cazorla", "Borja Iglesias", "Unai Simón", "Yassine Bounou",
  "Achraf Hakimi", "Hakim Ziyech", "Sofyan Amrabat", "Noussair Mazraoui", "Romain Saïss",
  "Mahmoud Dahoud", "Emre Can", "Mario Götze", "Marco Reus", "Thomas Müller",
  "Miroslav Klose", "Bastian Schweinsteiger", "Per Mertesacker", "Sami Khedira", "Mesut Özil",
  "Kai Havertz", "Timo Werner", "Leroy Sané", "Serge Gnabry", "Julian Draxler",
  "Niklas Süle", "Antonio Rudiger", "Jamal Musiala", "Florian Wirtz", "Ilkay Gündogan",

  // --- 50 Leyendas históricas ---
  "Pelé", "Diego Maradona", "Johan Cruyff", "Franz Beckenbauer", "Michel Platini",
  "George Best", "Alfredo Di Stéfano", "Ferenc Puskás", "Paolo Maldini", "Roberto Baggio",
  "Marco van Basten", "Ruud Gullit", "Franco Baresi", "Lev Yashin", "Zinedine Zidane",
  "Ronaldinho Gaúcho", "Ronaldo Nazário", "Romário Souza", "Rivaldo Ferreira", "Kaká Leite",
  "Patrick Vieira", "Thierry Henry", "David Beckham", "Wayne Rooney", "Ryan Giggs", "Paul Scholes", "Eric Cantona", 
  "Oliver Kahn", "Luis Figo", "Raúl González", "Fernando Hierro", "Xabi Alonso",
  "Carles Puyol", "Moukoko WInslow", "Zurito Jr", "Tartaglia", "Nelcon26", 
];

// Estado del servidor
const rooms = new Map();
const clients = new Map();

// Generar código de sala
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Crear nueva sala
function createRoom(host) {
    let roomCode;
    do {
        roomCode = generateRoomCode();
    } while (rooms.has(roomCode));

    const room = {
        code: roomCode,
        host: host.id,
        players: new Map(),
        gameState: 'waiting',
        currentGame: null
    };

    // Agregar host como primer jugador
    const hostPlayer = {
        id: host.id,
        name: host.name,
        ws: host.ws,
        isHost: true
    };

    room.players.set(host.id, hostPlayer);
    rooms.set(roomCode, room);
    clients.set(host.id, { ...host, roomCode });

    console.log(`✅ Sala creada: ${roomCode} por ${host.name}`);
    return room;
}

// Unirse a sala
function joinRoom(player, roomCode) {
    const room = rooms.get(roomCode);
    if (!room) {
        return { success: false, error: 'Sala no encontrada' };
    }

    if (room.players.size >= 10) {
        return { success: false, error: 'Sala llena' };
    }

    if (room.gameState !== 'waiting') {
        return { success: false, error: 'Juego en progreso' };
    }

    const newPlayer = {
        id: player.id,
        name: player.name,
        ws: player.ws,
        isHost: false
    };

    room.players.set(player.id, newPlayer);
    clients.set(player.id, { ...player, roomCode });

    console.log(`👤 ${player.name} se unió a la sala ${roomCode}`);
    return { success: true, room };
}

// Iniciar juego
function startGame(roomCode) {
    const room = rooms.get(roomCode);
    if (!room || room.gameState !== 'waiting' || room.players.size < 3) {
        return false;
    }

    // Seleccionar jugador de fútbol aleatoriamente
    const selectedPlayer = footballPlayers[Math.floor(Math.random() * footballPlayers.length)];
    
    // Seleccionar impostor aleatoriamente
    const playerIds = Array.from(room.players.keys());
    const impostorId = playerIds[Math.floor(Math.random() * playerIds.length)];

    const gameState = {
        selectedPlayer,
        impostor: impostorId,
        startTime: Date.now()
    };

    room.gameState = 'playing';
    room.currentGame = gameState;

    console.log(`🎮 Juego iniciado en sala ${roomCode}: ${selectedPlayer}, Impostor: ${room.players.get(impostorId).name}`);

    // Enviar roles a jugadores
    room.players.forEach((player, playerId) => {
        const isImpostor = playerId === impostorId;
        player.ws.send(JSON.stringify({
            type: 'game-started',
            role: isImpostor ? 'impostor' : 'regular',
            assignedPlayer: selectedPlayer,
            players: getPlayersArray(roomCode)
        }));
    });

    return true;
}

// Iniciar nueva ronda
function startNewRound(roomCode) {
    const room = rooms.get(roomCode);
    if (!room || room.gameState !== 'playing') {
        return false;
    }

    // Si hay menos de 3 jugadores, terminar el juego
    if (room.players.size < 3) {
        endGame(roomCode);
        return false;
    }

    // Seleccionar NUEVO jugador de fútbol aleatoriamente
    let newPlayer;
    do {
        newPlayer = footballPlayers[Math.floor(Math.random() * footballPlayers.length)];
    } while (newPlayer === room.currentGame.selectedPlayer); // Evitar repetir el mismo jugador

    // Seleccionar NUEVO impostor aleatoriamente
    const playerIds = Array.from(room.players.keys());
    const newImpostorId = playerIds[Math.floor(Math.random() * playerIds.length)];

    // Actualizar el estado del juego
    room.currentGame.selectedPlayer = newPlayer;
    room.currentGame.impostor = newImpostorId;

    console.log(`🔄 Nueva ronda en sala ${roomCode}: ${newPlayer}, Nuevo impostor: ${room.players.get(newImpostorId).name}`);

    // Enviar nuevos roles a jugadores
    room.players.forEach((player, playerId) => {
        const isImpostor = playerId === newImpostorId;
        player.ws.send(JSON.stringify({
            type: 'new-round-started',
            role: isImpostor ? 'impostor' : 'regular',
            assignedPlayer: newPlayer,
            players: getPlayersArray(roomCode)
        }));
    });

    return true;
}

// Terminar juego
function endGame(roomCode) {
    const room = rooms.get(roomCode);
    if (!room || room.gameState !== 'playing') {
        return false;
    }

    console.log(`🏁 Juego terminado en sala ${roomCode}`);

    room.gameState = 'waiting';
    room.currentGame = null;

    broadcastToRoom(roomCode, {
        type: 'game-ended'
    });
    
    return true;
}

// Remover jugador de sala
function leaveRoom(playerId) {
    const client = clients.get(playerId);
    if (!client || !client.roomCode) return;

    const room = rooms.get(client.roomCode);
    if (!room) return;

    console.log(`👋 ${client.name} salió de la sala ${client.roomCode}`);

    room.players.delete(playerId);
    clients.delete(playerId);

    // Si era el host, asignar nuevo host
    if (room.players.size > 0 && room.host === playerId) {
        const newHost = Array.from(room.players.values())[0];
        newHost.isHost = true;
        room.host = newHost.id;
        console.log(`👑 Nuevo host: ${newHost.name}`);
    }

    // Si no quedan jugadores, eliminar sala
    if (room.players.size === 0) {
        rooms.delete(client.roomCode);
        console.log(`🗑️ Sala ${client.roomCode} eliminada`);
    } else {
        // Si el juego está en progreso y quedan menos de 3 jugadores, terminar el juego
        if (room.gameState === 'playing' && room.players.size < 3) {
            endGame(client.roomCode);
        }
        
        // Notificar a otros jugadores
        broadcastToRoom(client.roomCode, {
            type: 'player-left',
            players: getPlayersArray(client.roomCode),
            playerLeft: client.name
        });
    }
}

// Obtener array de jugadores
function getPlayersArray(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return [];
    
    return Array.from(room.players.values()).map(player => ({
        id: player.id,
        name: player.name,
        isHost: player.isHost
    }));
}

// Enviar mensaje a toda la sala
function broadcastToRoom(roomCode, message) {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.players.forEach(player => {
        if (player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        }
    });
}

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
    const clientId = Date.now().toString() + Math.random().toString(36).substring(7);
    console.log(`🔗 Cliente conectado: ${clientId}`);
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            handleMessage(ws, clientId, message);
        } catch (error) {
            console.error('Error parsing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Formato de mensaje inválido'
            }));
        }
    });

    ws.on('close', () => {
        console.log(`🔌 Cliente desconectado: ${clientId}`);
        leaveRoom(clientId);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        leaveRoom(clientId);
    });
});

// Manejar mensajes
function handleMessage(ws, clientId, message) {
    switch (message.type) {
        case 'create-room':
            const host = {
                id: clientId,
                name: message.playerName,
                ws: ws
            };
            
            const room = createRoom(host);
            ws.send(JSON.stringify({
                type: 'room-created',
                roomCode: room.code
            }));
            break;

        case 'join-room':
            const player = {
                id: clientId,
                name: message.playerName,
                ws: ws
            };
            
            const joinResult = joinRoom(player, message.roomCode);
            if (joinResult.success) {
                ws.send(JSON.stringify({
                    type: 'room-joined',
                    roomCode: message.roomCode,
                    players: getPlayersArray(message.roomCode)
                }));
                
                // Notificar a otros jugadores
                broadcastToRoom(message.roomCode, {
                    type: 'player-joined',
                    players: getPlayersArray(message.roomCode),
                    playerJoined: message.playerName
                });
            } else {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: joinResult.error
                }));
            }
            break;

        case 'start-game':
            const client = clients.get(clientId);
            if (client && client.roomCode) {
                const room = rooms.get(client.roomCode);
                if (room && room.host === clientId) {
                    if (room.players.size < 3) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Se necesitan al menos 3 jugadores para empezar'
                        }));
                        return;
                    }
                    
                    const started = startGame(client.roomCode);
                    if (!started) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'No se puede iniciar el juego'
                        }));
                    }
                } else {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Solo el host puede iniciar el juego'
                    }));
                }
            }
            break;

        case 'new-round':
            const newRoundClient = clients.get(clientId);
            if (newRoundClient && newRoundClient.roomCode) {
                const room = rooms.get(newRoundClient.roomCode);
                if (room && room.host === clientId) {
                    const success = startNewRound(newRoundClient.roomCode);
                    if (!success) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'No se puede iniciar nueva ronda'
                        }));
                    }
                } else {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Solo el host puede iniciar nueva ronda'
                    }));
                }
            } else {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'No estás en ninguna sala'
                }));
            }
            break;

        case 'end-game':
            const endGameClient = clients.get(clientId);
            if (endGameClient && endGameClient.roomCode) {
                const room = rooms.get(endGameClient.roomCode);
                if (room && room.host === clientId) {
                    const success = endGame(endGameClient.roomCode);
                    if (!success) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'No se puede terminar el juego'
                        }));
                    }
                } else {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Solo el host puede terminar el juego'
                    }));
                }
            } else {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'No estás en ninguna sala'
                }));
            }
            break;

        case 'leave-room':
            leaveRoom(clientId);
            break;

        default:
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Tipo de mensaje desconocido'
            }));
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor Impostor Fútbol corriendo en puerto ${PORT}`);
    console.log(`🌐 Abre tu navegador en http://localhost:${PORT}`);
    console.log(`📊 Salas activas: 0`);
});

// Limpieza periódica y estadísticas
setInterval(() => {
    const roomCount = rooms.size;
    const totalPlayers = Array.from(rooms.values()).reduce((sum, room) => sum + room.players.size, 0);
    
    // Limpiar salas vacías
    rooms.forEach((room, code) => {
        if (room.players.size === 0) {
            rooms.delete(code);
        }
    });
    
    console.log(`📊 Estado: ${rooms.size} salas activas, ${totalPlayers} jugadores conectados`);
}, 60000); // cada minuto

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor Impostor Fútbol corriendo en puerto ${PORT}`);
});