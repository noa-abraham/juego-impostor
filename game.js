// game.js - Lógica del Juego del Impostor

// Estado del juego
const gameState = {
    players: [],
    secretWord: '',
    impostorIndex: -1,
    currentPlayerIndex: 0,
    revealedPlayers: new Set(),
    votes: {}
};

// Palabras 
const fallbackWords = [
  "perro","gato","pájaro","pez","caballo","vaca","oveja","conejo","ratón","tigre",
  "león","elefante","jirafa","mono","oso","zorro","lobo","ciervo","ardilla","pollo",
  "pan","queso","leche","agua","jugo","café","té","pizza","hamburguesa","empanada",
  "pasta","arroz","pollo","carne","pescado","ensalada","sopa","huevo","torta","galleta",
  "mesa","silla","puerta","ventana","pared","techo","piso","cama","almohada","sillón",
  "lámpara","reloj","espejo","cuadro","televisor","radio","computadora","teclado","mouse","pantalla",
  "casa","escuela","hospital","plaza","parque","cine","teatro","biblioteca","museo","tienda",
  "supermercado","panadería","farmacia","restaurante","cafetería","oficina","fábrica","iglesia","estadio","aeropuerto",
  "calle","avenida","esquina","puente","camino","ruta","vereda","semáforo","auto","camión",
  "colectivo","tren","subte","bicicleta","moto","avión","barco","lancha","patineta","patines",
  "camisa","pantalón","falda","vestido","abrigo","campera","bufanda","sombrero","gorra","zapato",
  "zapatilla","bota","sandalia","media","cinturón","mochila","bolso","cartera","remera","pulsera",
  "sol","luna","estrella","nube","lluvia","viento","tormenta","nieve","frío","calor",
  "mar","río","lago","montaña","bosque","playa","isla","desierto","valle","campo",
  "árbol","flor","hoja","raíz","rama","semilla","fruta","manzana","banana","naranja",
  "limón","pera","uva","frutilla","sandía","melón","durazno","ciruela","kiwi","mango",
  "pelota","juego","cartas","dados","rompecabezas","muñeca","autito","bloques","pintura","lápiz",
  "papel","cuaderno","libro","mochila","regla","tijera","pegamento","colores","pincel","acuarela",
  "música","canción","baile","película","serie","actor","actriz","director","escena","historia",
  "familia","hermano","hermana","abuela","abuelo","tía","tío","primo",
  "amigo","amiga","vecino","persona","niño","niña","adulto","gente","equipo","grupo",
  "fútbol","tenis","básquet","voleibol","natación","correr","saltar","caminar","nadar","jugar",
  "trabajo","oficio","empleo","dinero","precio","tiempo","día","noche","mañana","tarde",
  "semana","mes","año","hora","minuto","segundo","calendario","agenda","reunión","fiesta",
  "cumpleaños","regalo","sorpresa","viaje","vacaciones","hotel","valija","mapa","foto","cámara",
  "sonrisa","risa","abrazo","beso","mirada","voz","palabra","idea","pensamiento","recuerdo",
  "alegría","tristeza","miedo","enojo","amor","amistad","respeto","confianza","paciencia","esperanza",
  "color","rojo","azul","verde","amarillo","naranja","violeta","blanco","negro","gris",
  "número","círculo","cuadrado","línea","punto","tamaño","altura","peso","velocidad"
];




function getRandomFallbackWord() {
    return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
}

// Funciones de pantalla
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Funciones del Lobby
function addPlayer() {
    const input = document.getElementById('playerNameInput');
    const name = input.value.trim();
    
    if (name && !gameState.players.includes(name)) {
        gameState.players.push(name);
        input.value = '';
        updatePlayersList();
    }
}

function removePlayer(index) {
    gameState.players.splice(index, 1);
    updatePlayersList();
}

function updatePlayersList() {
    const list = document.getElementById('playersList');
    const count = document.getElementById('playerCount');
    
    count.textContent = gameState.players.length;
    
    if (gameState.players.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay jugadorxs aún</p>';
    } else {
        list.innerHTML = gameState.players.map((player, index) => `
            <div class="player-item">
                <span><strong>${player}</strong></span>
                <button onclick="removePlayer(${index})">❌ Eliminar</button>
            </div>
        `).join('');
    }
    
    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = gameState.players.length < 3;
}

// Funciones del juego
 function startGame() {
    if (gameState.players.length < 3) {
        alert('Se necesitan al menos 3 jugadorxs para empezar');
        return;
    }
    
    // Obtener palabra aleatoria
    gameState.secretWord = getRandomFallbackWord();
    gameState.impostorIndex = Math.floor(Math.random() * gameState.players.length);
    gameState.currentPlayerIndex = 0;
    gameState.revealedPlayers = new Set();
    gameState.votes = {};
    
    updateShowingScreen();
    showScreen('showing');
}

function updateShowingScreen() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('currentPlayerName').textContent = `Turno de: ${currentPlayer}`;
    document.getElementById('playerProgress').textContent = 
        `Jugadore ${gameState.currentPlayerIndex + 1} de ${gameState.players.length}`;
    
    document.getElementById('beforeReveal').style.display = 'block';
    document.getElementById('afterReveal').style.display = 'none';
}

function revealWord() {
    const isImpostor = gameState.currentPlayerIndex === gameState.impostorIndex;
    
    document.getElementById('beforeReveal').style.display = 'none';
    document.getElementById('afterReveal').style.display = 'block';
    
    document.getElementById('secretWordDisplay').textContent = 
        isImpostor ? '❓ IMPOSTORE' : gameState.secretWord.toUpperCase();
    
    document.getElementById('roleMessage').textContent = isImpostor
        ? '¡Sos le impostore! Intentá descubrir la palabra secreta sin que te descubran.'
        : 'Memorizá la palabra. Cuando todxs la vean, deberán encontrar al le impostore.';
    
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = gameState.currentPlayerIndex < gameState.players.length - 1
        ? 'Siguiente Jugadore →'
        : 'Ir a Votación →';
    
    gameState.revealedPlayers.add(gameState.currentPlayerIndex);
}

function nextPlayer() {
    if (gameState.currentPlayerIndex < gameState.players.length - 1) {
        gameState.currentPlayerIndex++;
        updateShowingScreen();
    } else {
        gameState.currentPlayerIndex = 0;
        updateVotingScreen();
        showScreen('voting');
    }
}

// Funciones de votación
function updateVotingScreen() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('votingPlayerName').textContent = `Votación: ${currentPlayer}`;
    document.getElementById('voteProgress').textContent = 
       `Votos ${Object.keys(gameState.votes).length} de ${gameState.players.length}`;


    
    const voteButtons = document.getElementById('voteButtons');
    voteButtons.innerHTML = gameState.players.map((player, index) => `
        <button class="vote-button" onclick="castVote(${index})">
            ${player} ${index === gameState.currentPlayerIndex ? '(Tú)' : ''}
        </button>
    `).join('');
}

function castVote(votedIndex) {
    gameState.votes[gameState.currentPlayerIndex] = votedIndex;
    
    if (gameState.currentPlayerIndex < gameState.players.length - 1) {
        gameState.currentPlayerIndex++;
        updateVotingScreen();
    } else {
        showResults();
    }
}

// Funciones de resultados
function showResults() {
    const voteCounts = {};
    Object.values(gameState.votes).forEach(vote => {
        voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });
    
    let maxVotes = 0;
let mostVotedPlayers = [];

Object.entries(voteCounts).forEach(([index, count]) => {
  const idx = parseInt(index);

  if (count > maxVotes) {
    maxVotes = count;
    mostVotedPlayers = [idx];
  } else if (count === maxVotes) {
    mostVotedPlayers.push(idx);
  }
});

    const isTie = mostVotedPlayers.length > 1;
const impostorCaught = !isTie && mostVotedPlayers[0] === gameState.impostorIndex;

    const resultsBox = document.getElementById('resultsBox');
    
    resultsBox.className = `results-box ${impostorCaught ? 'win' : 'lose'}`;

document.getElementById('winMessage').textContent = isTie
  ? '⚖️ ¡Empate! Le impostore se salvó.'
  : impostorCaught
    ? '✅ ¡Les jugadores ganaron!'
    : '❌ ¡Le impostore ganó!';



    document.getElementById('impostorReveal').textContent = 
        `Le impostor era: ${gameState.players[gameState.impostorIndex]}`;
    document.getElementById('votedPlayer').textContent = isTie
  ? 'Hubo un empate en la votación'
  : `Más votadx: ${gameState.players[mostVotedPlayers[0]]}`;

    
    document.getElementById('finalWord').textContent = gameState.secretWord.toUpperCase();
    
    const finalVotes = document.getElementById('finalVotes');
    finalVotes.innerHTML = gameState.players.map((player, index) => `
        <div class="vote-item">
            <span>${player}</span>
            <span><strong>${voteCounts[index] || 0} votos</strong></span>
        </div>
    `).join('');
    
    showScreen('results');
}

function resetGame() {
    gameState.players = [];
    gameState.secretWord = '';
    gameState.impostorIndex = -1;
    gameState.currentPlayerIndex = 0;
    gameState.revealedPlayers = new Set();
    gameState.votes = {};
    
    updatePlayersList();
    showScreen('lobby');
}

// Event listener para Enter en el input
document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPlayer();
    }
});