// ======================
// Estado del juego
// ======================
const gameState = {
  players: [],
  secretWord: "",
  impostorIndexes: [],
  currentPlayerIndex: 0,
  revealedPlayers: new Set(),
  votes: {},
};

// ======================
// Persistencia
// ======================
function savePlayers() {
  localStorage.setItem(
    "le-impostore-players",
    JSON.stringify(gameState.players)
  );
}

function loadPlayers() {
  const saved = localStorage.getItem("le-impostore-players");
  if (saved) {
    gameState.players = JSON.parse(saved);
  }
}


// Palabras
const fallbackWords = [
  "perro",
  "gato",
  "pájaro",
  "pez",
  "caballo",
  "vaca",
  "oveja",
  "conejo",
  "ratón",
  "tigre",
  "león",
  "elefante",
  "jirafa",
  "mono",
  "oso",
  "zorro",
  "lobo",
  "ciervo",
  "ardilla",
  "pollo",
  "pan",
  "queso",
  "leche",
  "agua",
  "jugo",
  "café",
  "té",
  "pizza",
  "hamburguesa",
  "empanada",
  "pasta",
  "arroz",
  "pollo",
  "carne",
  "pescado",
  "ensalada",
  "sopa",
  "huevo",
  "torta",
  "galleta",
  "mesa",
  "silla",
  "puerta",
  "ventana",
  "pared",
  "techo",
  "piso",
  "cama",
  "almohada",
  "sillón",
  "lámpara",
  "reloj",
  "espejo",
  "cuadro",
  "televisor",
  "radio",
  "computadora",
  "teclado",
  "mouse",
  "pantalla",
  "casa",
  "escuela",
  "hospital",
  "plaza",
  "parque",
  "cine",
  "teatro",
  "biblioteca",
  "museo",
  "tienda",
  "supermercado",
  "panadería",
  "farmacia",
  "restaurante",
  "cafetería",
  "oficina",
  "fábrica",
  "iglesia",
  "estadio",
  "aeropuerto",
  "calle",
  "avenida",
  "esquina",
  "puente",
  "camino",
  "ruta",
  "vereda",
  "semáforo",
  "auto",
  "camión",
  "colectivo",
  "tren",
  "subte",
  "bicicleta",
  "moto",
  "avión",
  "barco",
  "lancha",
  "patineta",
  "patines",
  "camisa",
  "pantalón",
  "falda",
  "vestido",
  "abrigo",
  "campera",
  "bufanda",
  "sombrero",
  "gorra",
  "zapato",
  "zapatilla",
  "bota",
  "sandalia",
  "media",
  "cinturón",
  "mochila",
  "bolso",
  "cartera",
  "remera",
  "pulsera",
  "sol",
  "luna",
  "estrella",
  "nube",
  "lluvia",
  "viento",
  "tormenta",
  "nieve",
  "frío",
  "calor",
  "mar",
  "río",
  "lago",
  "montaña",
  "bosque",
  "playa",
  "isla",
  "desierto",
  "valle",
  "campo",
  "árbol",
  "flor",
  "hoja",
  "raíz",
  "rama",
  "semilla",
  "fruta",
  "manzana",
  "banana",
  "naranja",
  "limón",
  "pera",
  "uva",
  "frutilla",
  "sandía",
  "melón",
  "durazno",
  "ciruela",
  "kiwi",
  "mango",
  "pelota",
  "juego",
  "cartas",
  "dados",
  "rompecabezas",
  "muñeca",
  "autito",
  "bloques",
  "pintura",
  "lápiz",
  "papel",
  "cuaderno",
  "libro",
  "mochila",
  "regla",
  "tijera",
  "pegamento",
  "colores",
  "pincel",
  "acuarela",
  "música",
  "canción",
  "baile",
  "película",
  "serie",
  "actor",
  "actriz",
  "director",
  "escena",
  "historia",
  "familia",
  "hermano",
  "hermana",
  "abuela",
  "abuelo",
  "tía",
  "tío",
  "primo",
  "amigo",
  "amiga",
  "vecino",
  "persona",
  "niño",
  "niña",
  "adulto",
  "gente",
  "equipo",
  "grupo",
  "fútbol",
  "tenis",
  "básquet",
  "voleibol",
  "natación",
  "correr",
  "saltar",
  "caminar",
  "nadar",
  "jugar",
  "trabajo",
  "oficio",
  "empleo",
  "dinero",
  "precio",
  "tiempo",
  "día",
  "noche",
  "mañana",
  "tarde",
  "semana",
  "mes",
  "año",
  "hora",
  "minuto",
  "segundo",
  "calendario",
  "agenda",
  "reunión",
  "fiesta",
  "cumpleaños",
  "regalo",
  "sorpresa",
  "viaje",
  "vacaciones",
  "hotel",
  "valija",
  "mapa",
  "foto",
  "cámara",
  "sonrisa",
  "risa",
  "abrazo",
  "beso",
  "mirada",
  "voz",
  "palabra",
  "idea",
  "pensamiento",
  "recuerdo",
  "alegría",
  "tristeza",
  "miedo",
  "enojo",
  "amor",
  "amistad",
  "respeto",
  "confianza",
  "paciencia",
  "esperanza",
  "color",
  "rojo",
  "azul",
  "verde",
  "amarillo",
  "naranja",
  "violeta",
  "blanco",
  "negro",
  "gris",
  "número",
  "círculo",
  "cuadrado",
  "línea",
  "punto",
  "tamaño",
  "altura",
  "peso",
  "velocidad",
];

function getRandomFallbackWord() {
  return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
}

function getImpostorCount(playerCount) {
  return playerCount >= 6 ? 2 : 1;
}

// ======================
// Pantallas
// ======================
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((s) =>
    s.classList.remove("active")
  );
  document.getElementById(screenId).classList.add("active");
}

// ======================
// Lobby
// ======================
function addPlayer() {
  const input = document.getElementById("playerNameInput");
  const name = input.value.trim();

  if (!name) return;

  if (gameState.players.includes(name)) {
    alert("Ese nombre ya está en la lista");
    return;
  }

  gameState.players.push(name);
  input.value = "";

  savePlayers();
  updatePlayersList();
}

function removePlayer(index) {
  gameState.players.splice(index, 1);
  savePlayers();
  updatePlayersList();
}

function updatePlayersList() {
  const list = document.getElementById("playersList");
  const count = document.getElementById("playerCount");
  const info = document.getElementById("impostorInfo");
  const startBtn = document.getElementById("startBtn");

  count.textContent = gameState.players.length;

  if (gameState.players.length === 0) {
    list.innerHTML =
      '<p style="text-align:center;color:#999;padding:20px;">No hay jugadorxs aún</p>';
  } else {
    list.innerHTML = gameState.players
      .map(
        (player, index) => `
        <div class="player-item">
          <span><strong>${player}</strong></span>
          <button onclick="removePlayer(${index})">❌</button>
        </div>
      `
      )
      .join("");
  }

  startBtn.disabled = gameState.players.length < 3;

  if (gameState.players.length >= 6) {
    info.textContent = "⚠️ Con 6 o más jugadores hay 2 impostores";
  } else if (gameState.players.length >= 3) {
    info.textContent = "🕵️ En esta partida hay 1 impostore";
  } else {
    info.textContent = "";
  }
}

// ======================
// Juego
// ======================
function startGame() {
  if (gameState.players.length < 3) {
    alert("Se necesitan al menos 3 jugadorxs");
    return;
  }

  gameState.secretWord = getRandomFallbackWord();

  const impostorCount = getImpostorCount(gameState.players.length);

  const shuffled = [...gameState.players.keys()].sort(
    () => Math.random() - 0.5
  );

  gameState.impostorIndexes = shuffled.slice(0, impostorCount);
  gameState.currentPlayerIndex = 0;
  gameState.revealedPlayers = new Set();
  gameState.votes = {};

  updateShowingScreen();
  showScreen("showing");
}

function updateShowingScreen() {
  const name = gameState.players[gameState.currentPlayerIndex];

  document.getElementById(
    "currentPlayerName"
  ).textContent = `Turno de: ${name}`;

  document.getElementById(
    "playerProgress"
  ).textContent = `Jugadore ${gameState.currentPlayerIndex + 1} de ${
    gameState.players.length
  }`;

  document.getElementById("beforeReveal").style.display = "block";
  document.getElementById("afterReveal").style.display = "none";
}

function revealWord() {
  const isImpostor = gameState.impostorIndexes.includes(
    gameState.currentPlayerIndex
  );

  document.getElementById("beforeReveal").style.display = "none";
  document.getElementById("afterReveal").style.display = "block";

  document.getElementById("secretWordDisplay").textContent = isImpostor
    ? "❓ IMPOSTORE"
    : gameState.secretWord.toUpperCase();

  document.getElementById("roleMessage").textContent = isImpostor
    ? "Sos le impostore. Intentá disimular."
    : "Memorizá la palabra y encontrá al le impostore.";

  document.getElementById("nextBtn").textContent =
    gameState.currentPlayerIndex < gameState.players.length - 1
      ? "Siguiente →"
      : "Ir a votación →";
}

function nextPlayer() {
  if (gameState.currentPlayerIndex < gameState.players.length - 1) {
    gameState.currentPlayerIndex++;
    updateShowingScreen();
  } else {
    gameState.currentPlayerIndex = 0;
    updateVotingScreen();
    showScreen("voting");
  }
}

// ======================
// Votación
// ======================
function updateVotingScreen() {
  const name = gameState.players[gameState.currentPlayerIndex];

  document.getElementById(
    "votingPlayerName"
  ).textContent = `Vota: ${name}`;

  document.getElementById(
    "voteProgress"
  ).textContent = `Votos ${Object.keys(gameState.votes).length} de ${
    gameState.players.length
  }`;

  const voteButtons = document.getElementById("voteButtons");
  voteButtons.innerHTML = gameState.players
    .map(
      (player, index) => `
      <button class="vote-button" onclick="castVote(${index})">
        ${player}${index === gameState.currentPlayerIndex ? " (vos)" : ""}
      </button>
    `
    )
    .join("");
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

// ======================
// Resultados
// ======================
function showResults() {
  const voteCounts = {};

  Object.values(gameState.votes).forEach((v) => {
    voteCounts[v] = (voteCounts[v] || 0) + 1;
  });

  let maxVotes = 0;
  let mostVoted = [];

  Object.entries(voteCounts).forEach(([i, c]) => {
    if (c > maxVotes) {
      maxVotes = c;
      mostVoted = [Number(i)];
    } else if (c === maxVotes) {
      mostVoted.push(Number(i));
    }
  });

  const tie = mostVoted.length > 1;
  const caught =
    !tie && gameState.impostorIndexes.includes(mostVoted[0]);

  document.getElementById("winMessage").textContent = tie
    ? "⚖️ Empate. Le impostore se salvó."
    : caught
    ? "✅ Ganó el grupo"
    : "❌ Ganó le impostore";

  document.getElementById("impostorReveal").textContent =
    "Les impostores eran: " +
    gameState.impostorIndexes.map((i) => gameState.players[i]).join(", ");

  document.getElementById("finalWord").textContent =
    gameState.secretWord.toUpperCase();

      const finalVotes = document.getElementById("finalVotes");

  finalVotes.innerHTML = gameState.players
    .map(
      (player, index) => `
        <div class="vote-item">
          <span>${player}</span>
          <span><strong>${voteCounts[index] || 0} votos</strong></span>
        </div>
      `
    )
    .join("");


  showScreen("results");
}

// ======================
// Reset / Nuevo grupo
// ======================
function resetGame() {
  gameState.secretWord = "";
  gameState.impostorIndexes = [];
  gameState.currentPlayerIndex = 0;
  gameState.votes = {};
  showScreen("lobby");
}

function newGroup() {
  if (!confirm("¿Borrar el grupo actual?")) return;
  gameState.players = [];
  localStorage.removeItem("le-impostore-players");
  updatePlayersList();
}

// ======================
// Init
// ======================
loadPlayers();
updatePlayersList();

document
  .getElementById("playerNameInput")
  .addEventListener("keypress", (e) => {
    if (e.key === "Enter") addPlayer();
  });