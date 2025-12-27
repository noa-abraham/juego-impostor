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
  impostorPool: [], // 🆕 Pool para shuffle bag
  impostorHistory: [] // 🆕 Historial de quién fue impostor
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
// 🆕 Sistema Shuffle Bag para impostores
// ======================
function refillImpostorPool() {
  // Llenar la bolsa con todos los índices de jugadores
  gameState.impostorPool = [...gameState.players.keys()];
  
  // Shuffle usando Fisher-Yates
  for (let i = gameState.impostorPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameState.impostorPool[i], gameState.impostorPool[j]] = 
      [gameState.impostorPool[j], gameState.impostorPool[i]];
  }
}

function selectImpostors(count) {
  // Si no hay suficientes en el pool, rellenar
  if (gameState.impostorPool.length < count) {
    refillImpostorPool();
  }
  
  // Sacar los primeros N del pool
  const selected = gameState.impostorPool.splice(0, count);
  
  return selected;
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

  // Resetear el pool cuando cambia la lista de jugadores
  gameState.impostorPool = [];

  savePlayers();
  updatePlayersList();
}

function removePlayer(index) {
  gameState.players.splice(index, 1);
  
  // Resetear el pool cuando cambia la lista de jugadores
  gameState.impostorPool = [];
  
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

  // Usar el sistema Shuffle Bag
  gameState.impostorIndexes = selectImpostors(impostorCount);
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

let tempSelectedVotes = [];

function updateVotingScreen() {
  tempSelectedVotes = [];
  const impostorCount = gameState.impostorIndexes.length;

  // SIEMPRE votación grupal
  document.getElementById("votingPlayerName").textContent = `Votación grupal`;
  
  if (impostorCount === 2) {
    document.getElementById("voteProgress").textContent = 
      `Seleccionen a los 2 impostores`;
  } else {
    document.getElementById("voteProgress").textContent = 
      `Seleccionen a le impostore`;
  }

  const voteButtons = document.getElementById("voteButtons");

  voteButtons.innerHTML = gameState.players
    .map(
      (player, index) => `
      <button 
        type="button"
        class="vote-button"
        onclick="handleVoteClick(${index})"
      >
        ${player}
      </button>
    `
    )
    .join("");

  // Siempre mostrar botón de confirmar
  voteButtons.innerHTML += `
    <button type="button" class="full-width-btn" onclick="confirmGroupVote()" 
      style="grid-column: 1 / -1; margin-top: 10px;">
      ✓ Confirmar votación grupal
    </button>
  `;
}

// ======================
// Manejo de clicks de voto
// ======================
function handleVoteClick(index) {
  const impostorCount = gameState.impostorIndexes.length;
  const maxSelections = impostorCount;

  if (tempSelectedVotes.includes(index)) {
    tempSelectedVotes = tempSelectedVotes.filter((i) => i !== index);
  } else {
    if (tempSelectedVotes.length < maxSelections) {
      tempSelectedVotes.push(index);
    }
  }

  highlightSelectedVotes();
}

function highlightSelectedVotes() {
  const buttons = document.querySelectorAll(".vote-button:not(.full-width-btn)");
  buttons.forEach((btn, i) => {
    if (tempSelectedVotes.includes(i)) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

function confirmGroupVote() {
  const impostorCount = gameState.impostorIndexes.length;
  
  if (tempSelectedVotes.length !== impostorCount) {
    const mensaje = impostorCount === 1 
      ? "Tenés que seleccionar exactamente 1 jugador"
      : "Tenés que seleccionar exactamente 2 jugadores";
    alert(mensaje);
    return;
  }

  // Guardamos el voto grupal
  gameState.votes["grupo"] = [...tempSelectedVotes];
  tempSelectedVotes = [];
  showResults();
}

// ======================
// Resultados y condición de victoria
// ======================
function showResults() {
  const impostorCount = gameState.impostorIndexes.length;
  const impostores = [...gameState.impostorIndexes].sort();
  
  // Votación grupal: solo hay un voto
  const votoGrupal = gameState.votes["grupo"] || [];
  const señalades = [...votoGrupal].sort();
  
  const grupoGana = 
    señalades.length === impostorCount &&
    señalades.every((i, idx) => i === impostores[idx]);

  const resultsBox = document.getElementById("resultsBox");
  resultsBox.className = grupoGana ? "results-box win" : "results-box lose";

  document.getElementById("winMessage").textContent = grupoGana
    ? "✅ Ganó el grupo"
    : "❌ Ganan les impostores";

  document.getElementById("impostorReveal").textContent =
    impostorCount === 1
      ? "Le impostore era: " + gameState.players[impostores[0]]
      : "Les impostores eran: " + impostores.map((i) => gameState.players[i]).join(", ");

  document.getElementById("finalWord").textContent =
    gameState.secretWord.toUpperCase();

  // Mostrar votación grupal
  const finalVotes = document.getElementById("finalVotes");
  finalVotes.innerHTML = `
    <div class="vote-item">
      <span><strong>Votación del grupo:</strong></span>
      <span>${votoGrupal.map(i => gameState.players[i]).join(", ")}</span>
    </div>
  `;

  showScreen("results");
}

// ======================
// Reset / Nuevo grupo
// ======================
function confirmResetGame() {
  if (confirm("¿Alguien vio mal? Esto reiniciará la partida con una nueva palabra y nuevxs impostores.")) {
    resetGame();
  }
}

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
  gameState.impostorPool = [];
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