const BOARD_W = 10;
const BOARD_H = 8;
const STORAGE_KEY = "chegg-js-hotseat-v1";
const CORRESPONDENCE_STORAGE_KEY = "chegg-correspondence-games-v1";

const SPRITES = {
  villager: "sprites/eggs/villager.png",
  zombie: "sprites/eggs/zombie.png",
  creeper: "sprites/eggs/creeper.png",
  pig: "sprites/eggs/pig.png",
  rabbit: "sprites/eggs/rabbit.png",
  pufferfish: "sprites/eggs/pufferfish.png",
  irongolem: "sprites/eggs/irongolem.png",
  frog: "sprites/eggs/frog.png",
  skeleton: "sprites/eggs/skeleton.png",
  blaze: "sprites/eggs/blaze.png",
  phantom: "sprites/eggs/phantom.png",
  enderman: "sprites/eggs/enderman.png",
  slime: "sprites/eggs/slime.png",
  shulker: "sprites/eggs/shulker.png",
  parrot: "sprites/eggs/parrot.png",
  cat: "sprites/eggs/cat.png",
  sniffer: "sprites/eggs/sniffer.png",
  wither: "sprites/eggs/wither.png",
};

const MINIONS = {
  villager: {
    name: "Villager",
    cost: 0,
    rule: "King. If it dies, you lose. Moves/attacks around itself; movement always costs mana.",
    move: "king",
    attack: "king",
  },
  zombie: {
    name: "Zombie",
    cost: 1,
    rule: "Moves forward to one of three squares. Attacks adjacent lateral squares.",
    move: "zombie",
    attack: "cardinal1",
  },
  creeper: {
    name: "Creeper",
    cost: 1,
    rule: "Moves around itself. Attack explodes all adjacent minions and destroys itself.",
    move: "king",
    attack: "explode",
  },
  pig: {
    name: "Pig",
    cost: 1,
    rule: "Support. Draws on spawn and death. Cannot attack. Moves around itself.",
    move: "king",
    attack: "none",
    onSpawn: "draw",
    onDeath: "draw",
  },
  rabbit: {
    name: "Rabbit",
    cost: 2,
    rule: "Jumps two lateral squares. Draws if it jumps over any minion. Cannot attack.",
    move: "rabbit",
    attack: "none",
    onMove: "hopDraw",
  },
  pufferfish: {
    name: "Puffer-Fish",
    cost: 2,
    rule: "Moves laterally. Attacks all four diagonal adjacent squares at once.",
    move: "cardinal1",
    attack: "diagonalBurst",
  },
  irongolem: {
    name: "Iron Golem",
    cost: 2,
    rule: "Moves around itself. Attacks a lateral tile plus its two perpendicular neighbors.",
    move: "king",
    attack: "sweep",
  },
  frog: {
    name: "Frog",
    cost: 2,
    rule: "Moves in a diamond up to two tiles. Ability pulls a lateral minion two squares closer.",
    move: "diamond2",
    attack: "none",
    ability: "pull",
  },
  skeleton: {
    name: "Skeleton",
    cost: 3,
    rule: "Moves laterally. Attacks diagonally up to three squares.",
    move: "cardinal1",
    attack: "diagonal3",
  },
  blaze: {
    name: "Blaze",
    cost: 3,
    rule: "Moves diagonally. Attacks laterally up to two squares.",
    move: "diagonal1",
    attack: "cardinal2",
  },
  phantom: {
    name: "Phantom",
    cost: 3,
    rule: "Only spawns, moves, and attacks on dark tiles. Moves/attacks in a two-tile square.",
    move: "phantom",
    attack: "phantom",
    darkOnly: true,
  },
  enderman: {
    name: "Enderman",
    cost: 4,
    rule: "Cannot move. Ability swaps with any lateral non-villager minion. Attacks adjacent.",
    move: "none",
    attack: "king",
    ability: "teleport",
  },
  slime: {
    name: "Slime",
    cost: 4,
    rule: "Jumps exactly two squares in any direction. Attacks by landing on a minion.",
    move: "slime",
    attack: "slime",
  },
  shulker: {
    name: "Shulker-Box",
    cost: 4,
    rule: "Cannot free-move. Attacks along a blockable L path, then moves to the target square.",
    move: "none",
    attack: "shulker",
  },
  parrot: {
    name: "Parrot",
    cost: 5,
    rule: "Moves up to two squares in any direction. Copies a laterally adjacent minion attack pattern.",
    move: "parrot",
    attack: "copy",
  },
  cat: {
    name: "Cat",
    cost: 5,
    rule: "Cannot move or attack. Gives its owner +1 mana each turn while alive.",
    move: "none",
    attack: "none",
    aura: "mana",
  },
  sniffer: {
    name: "Sniffer",
    cost: 5,
    rule: "Moves around itself. Draws two from enemy deck on spawn; discards two on death.",
    move: "king",
    attack: "none",
    onSpawn: "stealDraw",
    onDeath: "discardTwo",
  },
  wither: {
    name: "Wither",
    cost: 6,
    rule: "Explodes adjacent minions on spawn. Ranged splash attack costs 2 mana.",
    move: "king",
    attack: "wither",
    attackCost: 2,
    onSpawn: "explode",
  },
};

const DEFAULT_DECK = [
  "zombie",
  "zombie",
  "creeper",
  "pig",
  "rabbit",
  "pufferfish",
  "irongolem",
  "frog",
  "skeleton",
  "blaze",
  "phantom",
  "enderman",
  "slime",
  "shulker",
  "wither",
];

const BUILDABLE_TYPES = Object.keys(MINIONS).filter((type) => type !== "villager");
const DECK_SIZE = 15;
const MANA_ICON = "sprites/ui/Experience_Orb_Value_3-6.png";
const CORRESPONDENCE_MODE = window.location.pathname.endsWith("correspondence.html");
const LAB_MODE = new URLSearchParams(window.location.search).get("lab") === "pieces";
const LAB_TYPES = Object.keys(MINIONS);
const LAB_SCENARIOS = {
  auto: "Auto stress",
  movement: "Clean movement",
  targets: "Targets + blockers",
  parrot: "Parrot copy",
  shulker: "Shulker L blocks",
  slime: "Slime landings",
  phantom: "Phantom dark range",
  golem: "Golem lanes",
  frog: "Frog pull",
};

const els = {
  app: document.querySelector("#app"),
  corrHome: document.querySelector("#corrHome"),
  corrActions: document.querySelector("#corrActions"),
  corrDetail: document.querySelector("#corrDetail"),
  corrGames: document.querySelector("#corrGames"),
  corrNewGameButton: document.querySelector("#corrNewGameButton"),
  corrJoinCode: document.querySelector("#corrJoinCode"),
  corrJoinButton: document.querySelector("#corrJoinButton"),
  corrHomeMessage: document.querySelector("#corrHomeMessage"),
  corrPanel: document.querySelector("#corrPanel"),
  board: document.querySelector("#board"),
  fxLayer: document.querySelector("#fxLayer"),
  hand: document.querySelector("#hand"),
  activePanel: document.querySelector("#activePanel"),
  selectionPanel: document.querySelector("#selectionPanel"),
  redMeter: document.querySelector("#redMeter"),
  blueMeter: document.querySelector("#blueMeter"),
  turnTitle: document.querySelector("#turnTitle"),
  deckCount: document.querySelector("#deckCount"),
  endTurnButton: document.querySelector("#endTurnButton"),
  passScreen: document.querySelector("#passScreen"),
  passTitle: document.querySelector("#passTitle"),
  passText: document.querySelector("#passText"),
  readyButton: document.querySelector("#readyButton"),
  rulesButton: document.querySelector("#rulesButton"),
  rulesDialog: document.querySelector("#rulesDialog"),
  rulesGrid: document.querySelector("#rulesGrid"),
  newGameButton: document.querySelector("#newGameButton"),
  deckScreen: document.querySelector("#deckScreen"),
  builderTitle: document.querySelector("#builderTitle"),
  builderCount: document.querySelector("#builderCount"),
  builderPool: document.querySelector("#builderPool"),
  builderList: document.querySelector("#builderList"),
  builderDoneButton: document.querySelector("#builderDoneButton"),
  builderAutoButton: document.querySelector("#builderAutoButton"),
  hoverCard: document.querySelector("#hoverCard"),
};

let state = LAB_MODE || CORRESPONDENCE_MODE ? null : loadState();
let selected = null;
let passPending = true;
let builder = null;
let transientEffects = [];
let activeReplayLog = null;
let replaying = false;
let replayBoardPieces = null;
let correspondenceGame = null;
let pendingInvitePacket = null;
let correspondenceCodePopupClosed = false;
let lab = {
  type: "slime",
  scenario: "auto",
};

function newGame(redDeck, blueDeck, preserveDeckOrder = false) {
  const game = {
    active: "red",
    turnId: 0,
    winner: null,
    pieces: [
      makePiece("villager", "red", 4, 0, -1),
      makePiece("villager", "blue", 5, 7, -1),
    ],
    players: {
      red: makePlayer("Red", preserveDeckOrder ? [...redDeck] : shuffle([...redDeck])),
      blue: makePlayer("Blue", preserveDeckOrder ? [...blueDeck] : shuffle([...blueDeck])),
    },
    newHandCards: {
      red: [],
      blue: [],
    },
    actionHistory: [],
    replayedTurns: {
      red: 0,
      blue: 0,
    },
    log: ["New CHEGG match created."],
  };
  draw(game.players.red, 3);
  draw(game.players.blue, 3);
  beginTurn(game, "red");
  return game;
}

function makePlayer(name, deck) {
  return {
    name,
    deck,
    hand: [],
    discard: [],
    maxMana: 0,
    mana: 0,
    turns: 0,
  };
}

function makePiece(type, owner, x, y, spawnedTurn) {
  return {
    id: crypto.randomUUID(),
    type,
    owner,
    x,
    y,
    spawnedTurn,
    moved: false,
    dashed: false,
    attacked: false,
    usedAbility: false,
  };
}

function ensureRuntimeState() {
  if (!state.newHandCards) state.newHandCards = { red: [], blue: [] };
  if (!state.newHandCards.red) state.newHandCards.red = [];
  if (!state.newHandCards.blue) state.newHandCards.blue = [];
  if (!state.actionHistory) state.actionHistory = [];
  if (!state.replayedTurns) state.replayedTurns = { red: 0, blue: 0 };
  if (!state.replayedTurns.red) state.replayedTurns.red = 0;
  if (!state.replayedTurns.blue) state.replayedTurns.blue = 0;
}

function beginTurn(game, owner) {
  const player = game.players[owner];
  game.active = owner;
  game.turnId += 1;
  player.turns += 1;
  player.maxMana = Math.min(6, player.maxMana + 1);
  player.mana = player.maxMana + countAuraMana(game, owner);
  draw(player, 1);
  game.pieces.forEach((piece) => {
    if (piece.owner === owner) {
      piece.moved = false;
      piece.dashed = false;
      piece.attacked = false;
      piece.usedAbility = false;
    }
  });
  game.log.unshift(`${player.name} starts turn ${player.turns} with ${player.mana} mana.`);
}

function draw(player, amount) {
  const owner = player.name.toLowerCase();
  for (let i = 0; i < amount; i += 1) {
    if (player.deck.length === 0) return;
    const type = player.deck.shift();
    player.hand.push(type);
    markNewHandCard(owner, player.hand.length - 1);
  }
}

function markNewHandCard(owner, index) {
  if (!state?.newHandCards?.[owner]) return;
  state.newHandCards[owner].push(index);
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function render() {
  if (CORRESPONDENCE_MODE && !state && !builder) {
    renderCorrespondenceHome();
    return;
  }
  if (!state) {
    renderDeckBuilder();
    return;
  }
  ensureRuntimeState();
  els.deckScreen.classList.remove("is-visible");
  if (CORRESPONDENCE_MODE) {
    correspondenceGame.state = state;
    upsertCorrespondenceGame(correspondenceGame);
    els.corrHome.classList.add("is-hidden");
    els.app.classList.remove("is-hidden");
  } else if (!LAB_MODE) saveState();
  renderMeters();
  if (LAB_MODE) renderLabPanel();
  else renderPanel();
  renderBoard();
  if (LAB_MODE) renderLabControls();
  else renderHand();
  renderSelection();
  renderRules();
  renderTransientEffects();
  const player = state.players[state.active];
  document.body.dataset.activePlayer = state.active;
  els.turnTitle.textContent = LAB_MODE
    ? "Piece test lab"
    : CORRESPONDENCE_MODE
    ? `Correspondence: ${correspondenceStatusText()}`
    : state.winner
    ? `${state.players[state.winner].name} wins`
    : `${player.name}'s turn`;
  els.endTurnButton.textContent = LAB_MODE ? "Reset test" : CORRESPONDENCE_MODE ? "Finish Turn" : state.winner && state.active !== state.winner ? "New game" : "End turn";
  els.endTurnButton.disabled = CORRESPONDENCE_MODE && (!isCorrespondenceLocalTurn() || hasPendingOutgoingCode());
  if (CORRESPONDENCE_MODE) renderCorrespondencePanel();
  document.body.classList.toggle("lab-mode", LAB_MODE);
  document.body.classList.toggle("correspondence-mode", CORRESPONDENCE_MODE);
  document.body.classList.toggle("is-waiting-code", CORRESPONDENCE_MODE && isCorrespondenceCodePopupVisible());
  document.body.classList.toggle("is-replaying", replaying);
}

function startDeckBuilder(owner, redDeck = []) {
  state = null;
  selected = null;
  builder = {
    owner,
    redDeck,
    deck: [],
    lastDrafted: null,
    quickFilled: false,
  };
  localStorage.removeItem(STORAGE_KEY);
  showPassScreen(`${ownerName(owner)} builds`, "Screen hidden. Pass the computer, then press Ready to build this player's deck.");
  renderDeckBuilder();
}

function renderDeckBuilder() {
  if (!builder) return;
  const quickFilled = builder.quickFilled;
  els.deckScreen.classList.add("is-visible");
  els.deckScreen.classList.toggle("red", builder.owner === "red");
  els.deckScreen.classList.toggle("blue", builder.owner === "blue");
  els.builderTitle.textContent = builder.flow === "corr-start"
    ? "Correspondence: build your Red deck"
    : builder.flow === "corr-join"
    ? "Correspondence: build your Blue deck"
    : `${ownerName(builder.owner)}: build a 15-minion deck`;
  els.builderCount.textContent = `${builder.deck.length} / ${DECK_SIZE}`;
  els.builderDoneButton.disabled = builder.deck.length !== DECK_SIZE;
  els.builderPool.innerHTML = BUILDABLE_TYPES.map((type) => {
    const minion = MINIONS[type];
    return `
      <button class="card ${quickFilled && DEFAULT_DECK.includes(type) ? "deck-picked" : ""}" type="button" data-type="${type}" ${builder.deck.length >= DECK_SIZE ? "disabled" : ""}>
        ${SPRITES[type] ? `<img src="${SPRITES[type]}" alt="${minion.name}" />` : `<span class="badge">${initials(minion.name)}</span>`}
        <span><span class="card-name">${minion.name}</span><span class="card-rule">${minion.rule}</span></span>
        <span class="badge">${manaCostHtml(minion.cost)}</span>
      </button>
    `;
  }).join("");
  const counts = countDeck(builder.deck);
  els.builderList.innerHTML = builder.deck.length
    ? Object.entries(counts).map(([type, count]) => `
      <div class="builder-row ${builder.lastDrafted === type || quickFilled ? "deck-picked" : ""}">
        <span>${MINIONS[type].name} x${count}</span>
        <button type="button" data-remove="${type}" aria-label="Remove ${MINIONS[type].name}">Remove</button>
      </div>
    `).join("")
    : `<p class="hint">Choose minions from the pool. Duplicates are allowed because the rules do not set a copy limit.</p>`;
  els.builderPool.querySelectorAll("button[data-type]").forEach((button) => {
    attachHoverCard(button, button.dataset.type);
    button.addEventListener("click", () => {
      if (builder.deck.length < DECK_SIZE) {
        builder.deck.push(button.dataset.type);
        builder.lastDrafted = button.dataset.type;
        button.classList.remove("deck-picked");
        void button.offsetWidth;
        button.classList.add("deck-picked");
      }
      renderDeckBuilder();
    });
  });
  els.builderList.querySelectorAll("button[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = builder.deck.indexOf(button.dataset.remove);
      if (index >= 0) builder.deck.splice(index, 1);
      builder.lastDrafted = null;
      renderDeckBuilder();
    });
  });
  builder.quickFilled = false;
}

function countDeck(deck) {
  return deck.reduce((counts, type) => {
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
}

function labPiece() {
  return state?.pieces.find((piece) => piece.id === "lab-active");
}

function refreshLabActions() {
  state.winner = null;
  state.players.red.mana = 10;
  state.players.blue.mana = 10;
  state.pieces.forEach((piece) => {
    piece.spawnedTurn = -1;
    piece.moved = false;
    piece.dashed = false;
    piece.attacked = false;
    piece.usedAbility = false;
  });
}

function loadLabScenario() {
  state = createLabState(lab.type, lab.scenario);
  builder = null;
  passPending = false;
  replaying = false;
  replayBoardPieces = null;
  activeReplayLog = null;
  transientEffects = [];
  els.passScreen.classList.remove("is-visible");
  els.deckScreen.classList.remove("is-visible");
  render();
}

function createLabState(type, scenarioId) {
  const scenario = scenarioId === "auto" ? defaultLabScenario(type) : scenarioId;
  const pieces = labPieces(type, scenario);
  const game = {
    active: "red",
    turnId: 99,
    winner: null,
    pieces,
    players: {
      red: { ...makePlayer("Red", []), mana: 10, maxMana: 10, turns: 99 },
      blue: { ...makePlayer("Blue", []), mana: 10, maxMana: 10, turns: 99 },
    },
    newHandCards: { red: [], blue: [] },
    actionHistory: [],
    replayedTurns: { red: 0, blue: 0 },
    log: [`Lab loaded: ${MINIONS[type].name} / ${LAB_SCENARIOS[scenarioId] || LAB_SCENARIOS[scenario]}.`],
  };
  return game;
}

function defaultLabScenario(type) {
  if (type === "phantom") return "phantom";
  if (type === "slime") return "slime";
  if (type === "shulker") return "shulker";
  if (type === "parrot") return "parrot";
  if (type === "irongolem") return "golem";
  if (type === "frog") return "frog";
  return "targets";
}

function labPieces(type, scenario) {
  const activePos = type === "phantom" || scenario === "phantom" ? { x: 4, y: 3 } : { x: 4, y: 4 };
  const pieces = [labMake(type, "red", activePos.x, activePos.y, "lab-active")];
  const add = (pieceType, owner, x, y) => {
    if (x === activePos.x && y === activePos.y) return;
    pieces.push(labMake(pieceType, owner, x, y));
  };

  if (scenario === "movement") {
    add("zombie", "blue", 0, 0);
    add("zombie", "blue", 9, 7);
    return pieces;
  }

  if (scenario === "phantom") {
    add("zombie", "blue", 2, 3);
    add("skeleton", "blue", 5, 4);
    add("pig", "blue", 4, 4);
    add("creeper", "red", 6, 5);
    return pieces;
  }

  if (scenario === "slime") {
    add("zombie", "blue", 6, 4);
    add("skeleton", "blue", 2, 2);
    add("pig", "red", 5, 4);
    add("creeper", "blue", 4, 2);
    add("blaze", "blue", 6, 6);
    return pieces;
  }

  if (scenario === "shulker") {
    add("zombie", "blue", 5, 4);
    add("skeleton", "blue", 6, 5);
    add("pig", "blue", 3, 2);
    add("creeper", "red", 4, 2);
    add("blaze", "blue", 2, 5);
    return pieces;
  }

  if (scenario === "parrot") {
    add("blaze", "blue", 5, 4);
    add("pufferfish", "red", 3, 4);
    add("skeleton", "blue", 4, 5);
    add("zombie", "blue", 6, 4);
    add("creeper", "blue", 5, 5);
    add("pig", "blue", 3, 3);
    add("slime", "blue", 2, 2);
    return pieces;
  }

  if (scenario === "golem") {
    add("zombie", "blue", 4, 3);
    add("skeleton", "blue", 3, 3);
    add("pig", "red", 5, 3);
    add("creeper", "blue", 5, 4);
    add("blaze", "blue", 5, 5);
    add("rabbit", "blue", 3, 4);
    return pieces;
  }

  if (scenario === "frog") {
    add("zombie", "blue", 4, 1);
    add("skeleton", "blue", 1, 4);
    add("pig", "red", 4, 3);
    add("creeper", "blue", 7, 4);
    add("rabbit", "blue", 5, 5);
    return pieces;
  }

  add("zombie", "blue", 4, 3);
  add("skeleton", "blue", 5, 4);
  add("pig", "red", 3, 4);
  add("creeper", "blue", 5, 5);
  add("blaze", "blue", 2, 2);
  add("villager", "blue", 7, 4);
  return pieces;
}

function labMake(type, owner, x, y, id = crypto.randomUUID()) {
  return {
    ...makePiece(type, owner, x, y, -1),
    id,
  };
}

function renderCorrespondenceHome(message = "") {
  if (!CORRESPONDENCE_MODE) return;
  selected = null;
  state = null;
  correspondenceGame = null;
  builder = null;
  els.app.classList.add("is-hidden");
  els.corrHome.classList.remove("is-hidden");
  els.corrActions?.classList.remove("is-hidden");
  els.corrDetail?.classList.add("is-hidden");
  els.deckScreen.classList.remove("is-visible");
  els.passScreen.classList.remove("is-visible");
  document.body.classList.remove("is-waiting-code", "is-replaying");
  els.corrHomeMessage.textContent = message;
  renderCorrespondenceGames();
}

function renderCorrespondenceGames() {
  const games = loadCorrespondenceGames();
  if (games.length === 0) {
    els.corrGames.innerHTML = `<p class="hint">No correspondence games saved in this browser yet.</p>`;
    return;
  }
  els.corrGames.innerHTML = games.map((game) => `
    <article class="corr-game-card">
      <button type="button" class="corr-game-open" data-open-game="${game.gameId}">
        <strong>${escapeHtml(game.name)}</strong>
        <span>${ownerName(game.localSide)} · ${escapeHtml(statusLabel(game))}</span>
        <small>Next code #${game.nextExpectedSeq} · ${formatDate(game.updatedAt)}</small>
      </button>
      <button type="button" class="corr-game-delete" data-delete-game="${game.gameId}" data-side="${game.localSide}">Delete</button>
    </article>
  `).join("");
  els.corrGames.querySelectorAll("[data-open-game]").forEach((button) => {
    button.addEventListener("click", () => openCorrespondenceGame(button.dataset.openGame));
  });
  els.corrGames.querySelectorAll("[data-delete-game]").forEach((button) => {
    button.addEventListener("click", () => deleteCorrespondenceGame(button.dataset.deleteGame, button.dataset.side));
  });
}

function renderCorrespondenceCodeDetail(game, message = "") {
  if (!els.corrDetail) return;
  state = null;
  correspondenceGame = game;
  correspondenceCodePopupClosed = false;
  els.app.classList.add("is-hidden");
  els.corrHome.classList.remove("is-hidden");
  els.corrActions?.classList.add("is-hidden");
  els.corrDetail.classList.remove("is-hidden");
  els.deckScreen.classList.remove("is-visible");
  els.passScreen.classList.remove("is-visible");
  document.body.classList.remove("is-waiting-code", "is-replaying");
  els.corrDetail.innerHTML = `
    <article class="corr-card">
      <button type="button" class="corr-inline-back" data-corr-detail-back>Back to saved games</button>
      <h2>${escapeHtml(game.name)}</h2>
      <p class="hint">${ownerName(game.localSide)} · ${escapeHtml(statusLabel(game))} · next code #${game.nextExpectedSeq}</p>
      ${game.lastGeneratedCode ? `
        <label class="corr-code-label">Send this code to your opponent</label>
        <textarea rows="8" readonly>${escapeHtml(game.lastGeneratedCode)}</textarea>
        <button type="button" data-corr-copy-detail>Copy code</button>
      ` : ""}
      <label class="corr-code-label">Paste your opponent's code</label>
      <textarea rows="8" data-corr-detail-import spellcheck="false" placeholder="CHEGG1..."></textarea>
      <button type="button" data-corr-detail-import-button>Import code</button>
      <p class="corr-message">${escapeHtml(message)}</p>
    </article>
  `;
  els.corrDetail.querySelector("[data-corr-detail-back]").addEventListener("click", () => renderCorrespondenceHome());
  els.corrDetail.querySelector("[data-corr-copy-detail]")?.addEventListener("click", () => {
    navigator.clipboard?.writeText(game.lastGeneratedCode);
  });
  els.corrDetail.querySelector("[data-corr-detail-import-button]").addEventListener("click", () => {
    const input = els.corrDetail.querySelector("[data-corr-detail-import]");
    importCorrespondenceCode(game.gameId, input.value);
  });
}

function statusLabel(game) {
  if (game.status === "waiting-for-join") return "waiting for join code";
  if (game.status === "finished") return "finished";
  if (!game.state) return "setup";
  return game.state.active === game.localSide ? "your turn" : "waiting for opponent";
}

function formatDate(value) {
  if (!value) return "never";
  return new Date(value).toLocaleString();
}

function loadCorrespondenceGames() {
  try {
    const games = JSON.parse(localStorage.getItem(CORRESPONDENCE_STORAGE_KEY)) || [];
    return Array.isArray(games) ? games : [];
  } catch {
    return [];
  }
}

function saveCorrespondenceGames(games) {
  localStorage.setItem(CORRESPONDENCE_STORAGE_KEY, JSON.stringify(games));
}

function upsertCorrespondenceGame(game) {
  const games = loadCorrespondenceGames();
  const index = games.findIndex((item) => item.gameId === game.gameId && item.localSide === game.localSide);
  game.updatedAt = new Date().toISOString();
  if (index >= 0) games[index] = game;
  else games.unshift(game);
  saveCorrespondenceGames(games);
  correspondenceGame = game;
}

function findCorrespondenceGame(gameId) {
  return loadCorrespondenceGames().find((game) => game.gameId === gameId);
}

function renameCorrespondenceGame(gameId, localSide, rawName) {
  const name = rawName.trim();
  if (!name) {
    renderCorrespondenceHome("Match name cannot be empty.");
    return;
  }
  const games = loadCorrespondenceGames();
  const game = games.find((item) => item.gameId === gameId && item.localSide === localSide);
  if (!game) {
    renderCorrespondenceHome("Saved game not found.");
    return;
  }
  game.name = name.slice(0, 60);
  game.updatedAt = new Date().toISOString();
  saveCorrespondenceGames(games);
  renderCorrespondenceHome("Match renamed.");
}

function deleteCorrespondenceGame(gameId, localSide) {
  const games = loadCorrespondenceGames();
  const game = games.find((item) => item.gameId === gameId && item.localSide === localSide);
  if (!game) {
    renderCorrespondenceHome("Saved game not found.");
    return;
  }
  if (!window.confirm(`Delete "${game.name}"? This only removes the local saved copy.`)) return;
  saveCorrespondenceGames(games.filter((item) => !(item.gameId === gameId && item.localSide === localSide)));
  renderCorrespondenceHome("Match deleted.");
}

function startCorrespondenceDeckBuilder(flow, invitePacket = null) {
  pendingInvitePacket = invitePacket;
  correspondenceGame = null;
  state = null;
  selected = null;
  builder = {
    owner: flow === "join" ? "blue" : "red",
    redDeck: invitePacket?.redDeck || [],
    deck: [],
    lastDrafted: null,
    quickFilled: false,
    flow: flow === "join" ? "corr-join" : "corr-start",
  };
  els.corrHome.classList.add("is-hidden");
  renderDeckBuilder();
}

function finishCorrespondenceDeck(deck) {
  if (builder.flow === "corr-start") {
    const now = new Date().toISOString();
    const redDeck = shuffle([...deck]);
    const game = {
      gameId: crypto.randomUUID(),
      name: `CHEGG ${now.slice(0, 10)} Red`,
      localSide: "red",
      status: "waiting-for-join",
      state: null,
      redDeck,
      blueDeck: null,
      createdAt: now,
      updatedAt: now,
      nextExpectedSeq: 1,
      lastGeneratedCode: "",
      importedCodes: [],
      exportedCodes: [],
    };
    const invite = makeCorrespondencePacket("invite", game, { redDeck: game.redDeck }, 0);
    game.lastGeneratedCode = encodeCorrespondencePacket(invite);
    game.exportedCodes.push(0);
    upsertCorrespondenceGame(game);
    builder = null;
    correspondenceCodePopupClosed = false;
    renderCorrespondenceCodeDetail(game, "Invite code created. Send it to your opponent, then paste their join code here.");
    return;
  }

  const invite = pendingInvitePacket;
  const now = new Date().toISOString();
  const blueDeck = shuffle([...deck]);
  const game = {
    gameId: invite.gameId,
    name: `CHEGG ${now.slice(0, 10)} Blue`,
    localSide: "blue",
    status: "waiting",
    state: newGame(invite.redDeck, blueDeck, true),
    redDeck: invite.redDeck,
    blueDeck,
    createdAt: now,
    updatedAt: now,
    nextExpectedSeq: 2,
    lastGeneratedCode: "",
    importedCodes: [0],
    exportedCodes: [],
  };
  const join = makeCorrespondencePacket("join", game, { blueDeck }, 1);
  game.lastGeneratedCode = encodeCorrespondencePacket(join);
  game.exportedCodes.push(1);
  upsertCorrespondenceGame(game);
  builder = null;
  pendingInvitePacket = null;
  state = game.state;
  correspondenceGame = game;
  correspondenceCodePopupClosed = false;
  render();
}

function openCorrespondenceGame(gameId) {
  const game = findCorrespondenceGame(gameId);
  if (!game) {
    renderCorrespondenceHome("Saved game not found.");
    return;
  }
  if (!game.state) {
    renderCorrespondenceCodeDetail(game);
    return;
  }
  correspondenceGame = game;
  state = game.state;
  selected = null;
  correspondenceCodePopupClosed = false;
  els.corrHome.classList.add("is-hidden");
  els.app.classList.remove("is-hidden");
  render();
}

function copyCorrespondenceCode(gameId) {
  const game = findCorrespondenceGame(gameId);
  if (!game?.lastGeneratedCode) return;
  navigator.clipboard?.writeText(game.lastGeneratedCode);
  renderCorrespondenceHome("Latest code copied.");
}

function importJoinInviteCode() {
  try {
    const packet = decodeCorrespondencePacket(els.corrJoinCode.value);
    if (packet.kind !== "invite" || !Array.isArray(packet.redDeck)) throw new Error("Paste an invite code to join a new game.");
    startCorrespondenceDeckBuilder("join", packet);
  } catch (error) {
    els.corrHomeMessage.textContent = error.message;
  }
}

function importCorrespondenceCode(gameId, rawCode) {
  try {
    const packet = decodeCorrespondencePacket(rawCode);
    const game = findCorrespondenceGame(gameId);
    if (!game) throw new Error("Saved game not found.");
    if (packet.gameId !== game.gameId) throw new Error("This code belongs to another game.");
    if (game.importedCodes.includes(packet.seq)) throw new Error("This code was already imported.");
    if (packet.seq !== game.nextExpectedSeq) throw new Error(`Expected code #${game.nextExpectedSeq}, got #${packet.seq}.`);

    let shouldReplay = false;
    if (packet.kind === "join") {
      if (game.localSide !== "red" || game.status !== "waiting-for-join") throw new Error("This game is not waiting for a join code.");
      if (!Array.isArray(packet.blueDeck)) throw new Error("Join code is missing Blue deck.");
      game.blueDeck = packet.blueDeck;
      game.state = newGame(game.redDeck, game.blueDeck, true);
      game.status = "active";
    } else if (packet.kind === "turn") {
      if (!packet.state) throw new Error("Turn code is missing game state.");
      game.state = packet.state;
      game.status = packet.state.winner ? "finished" : packet.state.active === game.localSide ? "active" : "waiting";
      shouldReplay = game.status === "active";
    } else {
      throw new Error(`Cannot import ${packet.kind} here.`);
    }

    game.importedCodes.push(packet.seq);
    game.nextExpectedSeq = packet.seq + 1;
    upsertCorrespondenceGame(game);
    correspondenceCodePopupClosed = false;
    if (game.state) {
      openCorrespondenceGame(game.gameId);
      if (shouldReplay) window.setTimeout(() => replayOpponentActions(), 180);
    }
    else renderCorrespondenceHome("Code imported.");
  } catch (error) {
    const game = findCorrespondenceGame(gameId);
    if (game && !game.state) renderCorrespondenceCodeDetail(game, error.message);
    else renderCorrespondenceHome(error.message);
  }
}

function makeCorrespondencePacket(kind, game, extra = {}, seq = game.nextExpectedSeq) {
  return {
    v: 1,
    kind,
    gameId: game.gameId,
    seq,
    side: game.localSide,
    createdAt: new Date().toISOString(),
    ...extra,
  };
}

function encodeCorrespondencePacket(packet) {
  const bytes = new TextEncoder().encode(JSON.stringify(packet));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `CHEGG1.${btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")}`;
}

function decodeCorrespondencePacket(code) {
  const trimmed = code.trim();
  if (!trimmed.startsWith("CHEGG1.")) throw new Error("Code must start with CHEGG1.");
  const encoded = trimmed.slice("CHEGG1.".length).replace(/-/g, "+").replace(/_/g, "/");
  const padded = encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const packet = JSON.parse(new TextDecoder().decode(bytes));
  if (packet.v !== 1 || !packet.kind || !packet.gameId || !Number.isInteger(packet.seq)) throw new Error("Invalid CHEGG code.");
  return packet;
}

function isCorrespondenceLocalTurn() {
  return !CORRESPONDENCE_MODE || !correspondenceGame || state?.active === correspondenceGame.localSide;
}

function hasPendingOutgoingCode() {
  if (!CORRESPONDENCE_MODE || !correspondenceGame?.lastGeneratedCode) return false;
  return correspondenceGame.exportedCodes?.includes(correspondenceGame.nextExpectedSeq - 1);
}

function isCorrespondenceCodeMode() {
  if (!CORRESPONDENCE_MODE || !correspondenceGame || !state) return false;
  if (hasPendingOutgoingCode()) return true;
  return !state.winner && !isCorrespondenceLocalTurn();
}

function isCorrespondenceCodePopupVisible() {
  return isCorrespondenceCodeMode() && !correspondenceCodePopupClosed;
}

function correspondenceStatusText() {
  if (!CORRESPONDENCE_MODE || !correspondenceGame) return "";
  if (!state) return statusLabel(correspondenceGame);
  if (state.winner) return state.winner === correspondenceGame.localSide ? "you won" : "you lost";
  return state.active === correspondenceGame.localSide ? "your turn" : "waiting for opponent code";
}

function ownerName(owner) {
  return owner === "red" ? "Red" : "Blue";
}

function manaCostHtml(cost) {
  if (cost === 0) return `<span class="mana-cost mana-free">Free</span>`;
  return `<span class="mana-cost">${cost}<img src="${MANA_ICON}" alt="mana" /></span>`;
}

function traitRows(type) {
  const minion = MINIONS[type];
  return [
    ["Cost", minion.cost ? `${minion.cost} mana` : "Free / setup"],
    ["Move", describeMove(minion.move, type)],
    ["Attack", describeAttack(minion.attack, type, minion.attackCost)],
    ["Ability", describeAbility(minion)],
  ];
}

function describeMove(pattern, type) {
  if (type === "villager") return "1 tile around; costs 1 mana";
  const labels = {
    none: "Cannot free-move",
    king: "1 tile around",
    diamond2: "Diamond range 2",
    zombie: "1 forward diagonal/straight",
    cardinal1: "1 lateral tile",
    diagonal1: "1 diagonal tile",
    phantom: "Two-tile square on dark tiles",
    rabbit: "Jump 2 lateral tiles",
    slime: "Jump exactly 2 any direction",
    parrot: "Up to 2 any direction",
  };
  return labels[pattern] || pattern;
}

function describeAttack(pattern, type, attackCost = 1) {
  if (pattern === "none") return "Cannot attack";
  const cost = attackCost === 1 ? "1 mana" : `${attackCost} mana`;
  const labels = {
    king: `1 tile around; moves in (${cost})`,
    cardinal1: `1 lateral tile (${cost})`,
    cardinal2: `Up to 2 lateral tiles (${cost})`,
    diagonal3: `Up to 3 diagonal tiles (${cost})`,
    explode: `Adjacent explosion; self KO (${cost})`,
    diagonalBurst: `All adjacent diagonals (${cost})`,
    sweep: `Choose a lateral tile; hits perpendiculars (${cost})`,
    phantom: `Two-tile square on dark tiles (${cost})`,
    slime: `Land on target (${cost})`,
    shulker: `Blockable L path; moves in (${cost})`,
    copy: `Copies adjacent attack (${cost})`,
    wither: `Range 3 lateral splash (${cost})`,
  };
  return labels[pattern] || `${pattern} (${cost})`;
}

function describeAbility(minion) {
  if (minion.ability === "pull") return "Pull lateral minion 2 tiles";
  if (minion.ability === "teleport") return "Swap with lateral non-villager";
  if (minion.onSpawn === "draw") return "Draw 1 on spawn";
  if (minion.onSpawn === "stealDraw") return "Draw 2 from enemy deck";
  if (minion.onSpawn === "explode") return "Spawn blast around itself";
  if (minion.onMove === "hopDraw") return "Draw 1 when hopping over a minion";
  if (minion.aura === "mana") return "+1 mana each turn while alive";
  if (minion.onDeath === "draw") return "Draw 1 on death";
  if (minion.onDeath === "discardTwo") return "Discard 2 on death";
  if (minion.darkOnly) return "Only uses dark tiles";
  return "None";
}

function attachHoverCard(element, type) {
  element.addEventListener("mouseenter", () => showHoverCard(type));
  element.addEventListener("mousemove", positionHoverCard);
  element.addEventListener("mouseleave", hideHoverCard);
  element.addEventListener("focus", (event) => {
    showHoverCard(type);
    positionHoverCard(event);
  });
  element.addEventListener("blur", hideHoverCard);
}

function showHoverCard(type) {
  if (!els.hoverCard) return;
  const minion = MINIONS[type];
  els.hoverCard.innerHTML = `
    ${SPRITES[type] ? `<img src="${SPRITES[type]}" alt="${minion.name}" />` : `<span class="badge">${initials(minion.name)}</span>`}
    <div>
      <h3>${minion.name}</h3>
      <table>
        <tbody>
          ${traitRows(type).map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
    <p>${minion.rule}</p>
  `;
  els.hoverCard.classList.add("is-visible");
}

function positionHoverCard(event) {
  if (!els.hoverCard) return;
  const source = event.currentTarget?.getBoundingClientRect?.();
  const x = event.clientX || (source ? source.right : 24);
  const y = event.clientY || (source ? source.top : 24);
  const margin = 14;
  const rect = els.hoverCard.getBoundingClientRect();
  const left = Math.min(window.innerWidth - rect.width - margin, x + 18);
  const top = Math.min(window.innerHeight - rect.height - margin, y + 18);
  els.hoverCard.style.left = `${Math.max(margin, left)}px`;
  els.hoverCard.style.top = `${Math.max(margin, top)}px`;
}

function hideHoverCard() {
  els.hoverCard?.classList.remove("is-visible");
}

function renderMeters() {
  renderMeter(els.redMeter, "red");
  renderMeter(els.blueMeter, "blue");
}

function renderMeter(el, owner) {
  const player = state.players[owner];
  const pieces = state.pieces.filter((piece) => piece.owner === owner).length;
  el.classList.toggle("is-active", state.active === owner);
  el.classList.toggle("red", owner === "red");
  el.classList.toggle("blue", owner === "blue");
  el.innerHTML = `
    <strong>${player.name}${state.active === owner ? " - active" : ""}</strong>
    <span>${pieces} minions · ${player.hand.length} hand · ${player.deck.length} deck</span>
    <div class="mana-pips">${Array.from({ length: 8 }, (_, i) => `<span class="pip ${i < player.mana ? "is-full" : ""}"></span>`).join("")}</div>
  `;
}

function renderPanel() {
  let highlighted = false;
  const activeText = typeof activeReplayLog === "string" ? activeReplayLog : activeReplayLog?.logText;
  els.activePanel.innerHTML = `
    <h2>Log</h2>
    <div class="log">${state.log.slice(0, 12).map((line) => {
      const isActive = Boolean(activeText && !highlighted && line === activeText);
      if (isActive) highlighted = true;
      return `<p class="${isActive ? "is-replay-active" : ""}">${escapeHtml(line)}</p>`;
    }).join("")}</div>
  `;
}

function renderCorrespondencePanel() {
  if (!els.corrPanel || !correspondenceGame) return;
  const pendingOutgoing = hasPendingOutgoingCode();
  const waitingForOpponent = !state?.winner && !isCorrespondenceLocalTurn();
  const showImport = !state?.winner && (waitingForOpponent || pendingOutgoing);
  const showOutgoingCode = pendingOutgoing;
  const codeMode = isCorrespondenceCodeMode();
  const popupVisible = isCorrespondenceCodePopupVisible();
  els.corrPanel.innerHTML = `
    <h2>Correspondence</h2>
    <p class="hint">${ownerName(correspondenceGame.localSide)} · ${escapeHtml(correspondenceStatusText())} · next code #${correspondenceGame.nextExpectedSeq}</p>
    ${codeMode ? `
      <button type="button" data-corr-toggle-popup>${popupVisible ? "Close popup" : "Focus code exchange"}</button>
    ` : ""}
    ${showOutgoingCode ? `
      <label class="corr-code-label">Send this code to your opponent</label>
      <textarea rows="7" readonly>${escapeHtml(correspondenceGame.lastGeneratedCode)}</textarea>
      <button type="button" data-corr-copy-current>Copy latest code</button>
    ` : ""}
    ${showImport ? `
      <label class="corr-code-label">Paste your opponent's code</label>
      <textarea rows="6" data-corr-import-current spellcheck="false" placeholder="CHEGG1..."></textarea>
      <button type="button" data-corr-import-button>Import code</button>
    ` : state?.winner ? `<p class="hint">The match is finished.</p>` : `<p class="hint">Play your turn on the board, then press Finish Turn to create the code for your opponent.</p>`}
    <button type="button" data-corr-home>Back to games</button>
  `;
  els.corrPanel.querySelector("[data-corr-copy-current]")?.addEventListener("click", () => {
    navigator.clipboard?.writeText(correspondenceGame.lastGeneratedCode);
  });
  els.corrPanel.querySelector("[data-corr-import-button]")?.addEventListener("click", () => {
    const input = els.corrPanel.querySelector("[data-corr-import-current]");
    importCorrespondenceCode(correspondenceGame.gameId, input.value);
  });
  els.corrPanel.querySelector("[data-corr-toggle-popup]")?.addEventListener("click", () => {
    correspondenceCodePopupClosed = !correspondenceCodePopupClosed;
    render();
  });
  els.corrPanel.querySelector("[data-corr-home]").addEventListener("click", () => renderCorrespondenceHome());
}

function renderLabPanel() {
  const piece = labPiece();
  const moves = piece ? legalMoves(piece, false).length : 0;
  const dash = piece ? legalMoves(piece, true).length : 0;
  const attacks = piece ? legalAttacks(piece).length : 0;
  const abilities = piece ? legalAbilities(piece).length : 0;
  const copySources = piece?.type === "parrot" ? parrotCopySources(piece) : [];
  els.activePanel.innerHTML = `
    <div class="lab-head">
      <p class="eyebrow">Hidden test lab</p>
      <h2>${piece ? MINIONS[piece.type].name : "No piece"}</h2>
    </div>
    <div class="lab-stats">
      <span>Move ${moves}</span>
      <span>Dash ${dash}</span>
      <span>Attack ${attacks}</span>
      <span>Ability ${abilities}</span>
    </div>
    ${copySources.length ? `
      <h2>Parrot Copies</h2>
      <div class="lab-copy-list">
        ${copySources.map((source) => `
          <p><strong>${MINIONS[source.type].name}</strong><span>${source.targets} target${source.targets === 1 ? "" : "s"}</span></p>
        `).join("")}
      </div>
    ` : piece?.type === "parrot" ? `<p class="hint">Parrot has no lateral minion with an attack to copy.</p>` : ""}
    <p class="hint">Open with <strong>?lab=pieces</strong>. Click the red test piece, then use the real action buttons or keyboard shortcuts: M move, D dash, A attack, B ability.</p>
    <h2>Lab Log</h2>
    <div class="log">${state.log.slice(0, 10).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>
  `;
}

function renderLabControls() {
  const scenarioValue = lab.scenario;
  els.deckCount.textContent = "test tools";
  els.hand.innerHTML = `
    <div class="lab-controls">
      <label>
        <span>Piece</span>
        <select id="labType">
          ${LAB_TYPES.map((type) => `<option value="${type}" ${lab.type === type ? "selected" : ""}>${MINIONS[type].name}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Scenario</span>
        <select id="labScenario">
          ${Object.entries(LAB_SCENARIOS).map(([id, label]) => `<option value="${id}" ${scenarioValue === id ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
      <button type="button" id="labReset">Reset scenario</button>
      <button type="button" id="labReady">Refresh actions</button>
      <button type="button" id="labSwap">Swap active team</button>
      <p class="hint">Scenarios add enemy/friendly pieces in places that stress movement, blocking, copied attacks, splash, and pull effects.</p>
    </div>
  `;
  els.hand.querySelector("#labType").addEventListener("change", (event) => {
    lab.type = event.target.value;
    selected = null;
    loadLabScenario();
  });
  els.hand.querySelector("#labScenario").addEventListener("change", (event) => {
    lab.scenario = event.target.value;
    selected = null;
    loadLabScenario();
  });
  els.hand.querySelector("#labReset").addEventListener("click", () => {
    selected = null;
    loadLabScenario();
  });
  els.hand.querySelector("#labReady").addEventListener("click", () => {
    refreshLabActions();
    render();
  });
  els.hand.querySelector("#labSwap").addEventListener("click", () => {
    state.active = opponent(state.active);
    refreshLabActions();
    render();
  });
}

function renderBoard() {
  const highlights = getHighlights();
  const boardPieces = replayBoardPieces || state.pieces;
  els.board.innerHTML = "";
  for (let y = 0; y < BOARD_H; y += 1) {
    for (let x = 0; x < BOARD_W; x += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `cell ${cellClass(x, y)}`;
      cell.setAttribute("role", "gridcell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      const highlight = highlights.find((h) => h.x === x && h.y === y);
      if (highlight) {
        cell.classList.add("is-highlight");
        if (highlight.kind === "attack") cell.classList.add("is-attack");
      }
      if (selected?.kind === "piece") {
        const piece = pieceById(selected.id);
        if (piece?.x === x && piece?.y === y) cell.classList.add("is-selected");
      }
      const piece = boardPieces.find((boardPiece) => boardPiece.x === x && boardPiece.y === y);
      if (piece) {
        cell.classList.add(`occupied-${piece.owner}`);
        cell.append(renderPiece(piece));
      }
      if (highlight?.label) {
        const label = document.createElement("span");
        label.className = "lab-target-label";
        label.textContent = highlight.label;
        cell.append(label);
      }
      cell.addEventListener("click", () => onCellClick(x, y));
      els.board.append(cell);
    }
  }
}

function renderTransientEffects() {
  if (!els.fxLayer || transientEffects.length === 0) return;
  const effects = transientEffects;
  transientEffects = [];
  effects.forEach((effect, index) => {
    const node = document.createElement("div");
    node.className = `float-text ${effect.kind}`;
    node.textContent = effect.text;
    node.style.setProperty("--fx-x", `${((effect.x + 0.5) / BOARD_W) * 100}%`);
    node.style.setProperty("--fx-y", `${((effect.y + 0.5) / BOARD_H) * 100}%`);
    node.style.animationDelay = `${index * 70}ms`;
    els.fxLayer.append(node);
    window.setTimeout(() => node.remove(), 1200 + index * 70);
  });
}

function queueCellEffect(x, y, text, kind) {
  transientEffects.push({ x, y, text, kind });
}

function snapshotPieces() {
  return state.pieces.map((piece) => ({
    id: piece.id,
    type: piece.type,
    owner: piece.owner,
    x: piece.x,
    y: piece.y,
    spawnedTurn: piece.spawnedTurn,
    moved: piece.moved,
    dashed: piece.dashed,
    attacked: piece.attacked,
    usedAbility: piece.usedAbility,
  }));
}

function recordAction(actor, turnId, logText, effects, beforePieces, afterPieces) {
  if (!logText || effects.length === 0) return;
  state.actionHistory.push({
    actor,
    turnId,
    logText,
    effects: effects.map((effect) => ({ ...effect })),
    beforePieces: beforePieces || null,
    afterPieces: afterPieces || null,
  });
}

function pendingReplayActions() {
  if (!state?.actionHistory?.length) return [];
  const actor = opponent(state.active);
  const lastSeenTurn = state.replayedTurns?.[state.active] || 0;
  return state.actionHistory.filter((action) => action.actor === actor && action.turnId > lastSeenTurn);
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function replayOpponentActions() {
  const actions = pendingReplayActions();
  if (actions.length === 0) return;
  replaying = true;
  selected = null;
  document.body.classList.add("is-replaying");
  els.endTurnButton.disabled = true;

  for (const action of actions) {
    activeReplayLog = action;
    replayBoardPieces = action.beforePieces || state.pieces;
    renderBoard();
    renderPanel();
    await sleep(260);

    action.effects.forEach((effect) => queueCellEffect(effect.x, effect.y, effect.text, effect.kind));
    renderTransientEffects();
    await sleep(780);

    replayBoardPieces = action.afterPieces || state.pieces;
    renderBoard();
    await sleep(360);
  }

  state.replayedTurns[state.active] = Math.max(...actions.map((action) => action.turnId));
  replayBoardPieces = null;
  activeReplayLog = null;
  replaying = false;
  render();
}

function renderPiece(piece) {
  const minion = MINIONS[piece.type];
  const div = document.createElement("div");
  div.className = `piece ${piece.owner} ${SPRITES[piece.type] ? "" : "fallback"}`;
  if (!replaying && isActionablePiece(piece)) div.classList.add("is-actionable");
  div.title = `${state.players[piece.owner].name} ${minion.name}`;
  if (SPRITES[piece.type]) {
    const img = document.createElement("img");
    img.src = SPRITES[piece.type];
    img.alt = minion.name;
    div.append(img);
  } else {
    div.textContent = minion.name.split(/[- ]/).map((part) => part[0]).join("");
  }
  attachHoverCard(div, piece.type);
  return div;
}

function renderHand() {
  const handOwner = CORRESPONDENCE_MODE && correspondenceGame ? correspondenceGame.localSide : state.active;
  const player = state.players[handOwner];
  const newCards = new Set(state.newHandCards?.[handOwner] || []);
  els.deckCount.textContent = `${player.deck.length} deck`;
  els.hand.innerHTML = "";
  player.hand.forEach((type, index) => {
    const minion = MINIONS[type];
    const card = document.createElement("button");
    card.type = "button";
    card.className = `card ${selected?.kind === "card" && selected.index === index ? "is-selected" : ""} ${newCards.has(index) ? "is-new" : ""}`;
    card.disabled = state.winner || !isCorrespondenceLocalTurn() || player.mana < minion.cost;
    card.innerHTML = `
      ${SPRITES[type] ? `<img src="${SPRITES[type]}" alt="${minion.name}" />` : `<span class="badge">${initials(minion.name)}</span>`}
      <span><span class="card-name">${minion.name}</span><span class="card-rule">${minion.rule}</span></span>
      <span class="badge">${manaCostHtml(minion.cost)}</span>
    `;
    card.addEventListener("click", () => {
      if (selected?.kind === "card" && selected.index === index) selected = null;
      else selected = { kind: "card", index };
      render();
    });
    attachHoverCard(card, type);
    els.hand.append(card);
  });
  if (state.newHandCards?.[handOwner]?.length) state.newHandCards[handOwner] = [];
}

function renderSelection() {
  if (state.winner) {
    const didWin = state.active === state.winner;
    const winnerHint = CORRESPONDENCE_MODE
      ? didWin
        ? hasPendingOutgoingCode()
          ? "Copy the final code so your opponent can watch the replay."
          : "Finish Turn to create the final code for your opponent."
        : "The enemy Villager was eliminated."
      : didWin
      ? "End turn to pass the computer for the final replay."
      : "The enemy Villager was eliminated. Start a new game when ready.";
    els.selectionPanel.innerHTML = `
      <h2 class="winner">${didWin ? "You won" : "You lost"}</h2>
      <p class="hint">${winnerHint}</p>
    `;
    return;
  }
  if (!selected) {
    if (CORRESPONDENCE_MODE && !isCorrespondenceLocalTurn()) {
      els.selectionPanel.innerHTML = `<p class="hint">Waiting for your opponent's next code. Paste it in the correspondence panel to continue.</p>`;
      return;
    }
    els.selectionPanel.innerHTML = `<p class="hint">Pick a card to spawn, or select one of your minions on the board.</p>`;
    return;
  }
  if (selected.kind === "card") {
    const type = state.players[state.active].hand[selected.index];
    const minion = MINIONS[type];
    els.selectionPanel.innerHTML = `<h2>Spawn ${minion.name}</h2><p class="hint">Choose an empty spawn-zone tile. Phantom must use a dark spawn tile.</p>`;
    return;
  }
  const piece = pieceById(selected.id);
  if (!piece) {
    selected = null;
    renderSelection();
    return;
  }
  const minion = MINIONS[piece.type];
  const canAct = piece.owner === state.active && piece.spawnedTurn !== state.turnId;
  const attackCost = MINIONS[piece.type].attackCost || 1;
  els.selectionPanel.innerHTML = `
    <h2>${minion.name}</h2>
    <p class="hint">${canAct ? minion.rule : "This minion cannot act yet."}</p>
    <div class="selection-actions">
      <button data-action="move" ${!canMove(piece, false) ? "disabled" : ""}>Move ${manaCostHtml(moveCost(piece, false))}</button>
      <button data-action="dash" ${!canMove(piece, true) ? "disabled" : ""}>Dash ${manaCostHtml(moveCost(piece, true))}</button>
      <button data-action="attack" ${!canAttack(piece) ? "disabled" : ""}>Attack ${manaCostHtml(attackCost)}</button>
      <button data-action="ability" ${!canUseAbility(piece) ? "disabled" : ""}>Ability ${manaCostHtml(1)}</button>
      <button data-action="cancel">Cancel</button>
    </div>
  `;
  els.selectionPanel.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "cancel") selected = null;
      else selected.action = action;
      render();
    });
  });
}

function renderRules() {
  if (els.rulesGrid.children.length) return;
  els.rulesGrid.innerHTML = Object.entries(MINIONS)
    .map(([, minion]) => `<article class="rule-card"><h3>${minion.name} <span class="badge">${manaCostHtml(minion.cost)}</span></h3><p>${minion.rule}</p></article>`)
    .join("");
}

function handleActionShortcut(event) {
  if (!state || builder || replaying || (!CORRESPONDENCE_MODE && passPending) || state.winner || !isCorrespondenceLocalTurn() || selected?.kind !== "piece") return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const focused = document.activeElement?.tagName?.toLowerCase();
  if (["input", "textarea", "select"].includes(focused)) return;
  const shortcuts = {
    m: "move",
    d: "dash",
    a: "attack",
    b: "ability",
    escape: "cancel",
  };
  const action = shortcuts[event.key.toLowerCase()];
  if (!action) return;
  const button = els.selectionPanel.querySelector(`button[data-action="${action}"]`);
  if (!button || button.disabled) return;
  event.preventDefault();
  button.click();
}

function onCellClick(x, y) {
  if (state.winner || replaying || !isCorrespondenceLocalTurn()) return;
  const piece = pieceAt(x, y);
  if (selected?.kind === "card") {
    trySpawn(x, y);
    return;
  }
  if (selected?.kind === "piece" && selected.action) {
    tryResolveAction(x, y);
    return;
  }
  if (piece && piece.owner === state.active) {
    selected = { kind: "piece", id: piece.id, action: null };
  } else {
    selected = null;
  }
  render();
}

function trySpawn(x, y) {
  const effectStart = transientEffects.length;
  const player = state.players[state.active];
  const type = player.hand[selected.index];
  const minion = MINIONS[type];
  if (!type || player.mana < minion.cost || pieceAt(x, y) || !inSpawnZone(state.active, y) || (minion.darkOnly && !isDark(x, y))) return;
  const beforePieces = snapshotPieces();
  player.mana -= minion.cost;
  player.hand.splice(selected.index, 1);
  const piece = makePiece(type, state.active, x, y, state.turnId);
  state.pieces.push(piece);
  state.log.unshift(`${player.name} spawned ${minion.name}.`);
  queueCellEffect(x, y, "Spawn", "spawn");
  applyOnSpawn(piece);
  recordAction(state.active, state.turnId, state.log[0], transientEffects.slice(effectStart), beforePieces, snapshotPieces());
  selected = null;
  render();
}

function tryResolveAction(x, y) {
  const effectStart = transientEffects.length;
  const logStart = state.log.length;
  const piece = pieceById(selected.id);
  if (!piece || piece.owner !== state.active) return;
  const minion = MINIONS[piece.type];
  const target = { x, y };
  const beforePieces = snapshotPieces();
  if (selected.action === "move" || selected.action === "dash") {
    const dash = selected.action === "dash";
    const moves = legalMoves(piece, dash);
    if (!moves.some((m) => m.x === x && m.y === y)) return;
    const cost = moveCost(piece, dash);
    if (state.players[state.active].mana < cost) return;
    state.players[state.active].mana -= cost;
    movePiece(piece, target, dash);
    state.log.unshift(`${state.players[state.active].name}'s ${minion.name} ${dash ? "dashed" : "moved"}.`);
  }
  if (selected.action === "attack") {
    const attacks = legalAttacks(piece);
    if (!attacks.some((a) => a.x === x && a.y === y)) return;
    const cost = MINIONS[piece.type].attackCost || 1;
    if (state.players[state.active].mana < cost) return;
    state.players[state.active].mana -= cost;
    attackWith(piece, target);
  }
  if (selected.action === "ability") {
    const targets = legalAbilities(piece);
    if (!targets.some((a) => a.x === x && a.y === y)) return;
    if (state.players[state.active].mana < 1) return;
    state.players[state.active].mana -= 1;
    useAbility(piece, target);
  }
  const addedLogCount = state.log.length - logStart;
  if (addedLogCount > 0) recordAction(state.active, state.turnId, state.log[0], transientEffects.slice(effectStart), beforePieces, snapshotPieces());
  selected = null;
  render();
}

function getHighlights() {
  if (!selected) return [];
  if (selected.kind === "card") {
    const type = state.players[state.active].hand[selected.index];
    const minion = MINIONS[type];
    const cells = [];
    for (let y = 0; y < BOARD_H; y += 1) {
      for (let x = 0; x < BOARD_W; x += 1) {
        if (inSpawnZone(state.active, y) && !pieceAt(x, y) && (!minion.darkOnly || isDark(x, y))) {
          cells.push({ x, y, kind: "move" });
        }
      }
    }
    return cells;
  }
  const piece = pieceById(selected.id);
  if (!piece || piece.owner !== state.active) return [];
  if (selected.action === "move") return legalMoves(piece, false).map((m) => ({ ...m, kind: "move" }));
  if (selected.action === "dash") return legalMoves(piece, true).map((m) => ({ ...m, kind: "move" }));
  if (selected.action === "attack") {
    return legalAttacks(piece).map((m) => ({
      ...m,
      kind: "attack",
      label: LAB_MODE && piece.type === "parrot" ? parrotCopyLabel(piece, m) : "",
    }));
  }
  if (selected.action === "ability") return legalAbilities(piece).map((m) => ({ ...m, kind: "attack" }));
  return [];
}

function canMove(piece, dash) {
  return isReady(piece) && legalMoves(piece, dash).length > 0 && state.players[state.active].mana >= moveCost(piece, dash);
}

function canAttack(piece) {
  const cost = MINIONS[piece.type].attackCost || 1;
  return isReady(piece) && !piece.dashed && !piece.attacked && legalAttacks(piece).length > 0 && state.players[state.active].mana >= cost;
}

function canUseAbility(piece) {
  return isReady(piece) && !piece.usedAbility && !piece.attacked && !piece.dashed && legalAbilities(piece).length > 0 && state.players[state.active].mana >= 1;
}

function isActionablePiece(piece) {
  if (!isCorrespondenceLocalTurn()) return false;
  if (piece.owner !== state.active || state.winner || !isReady(piece)) return false;
  const mana = state.players[state.active].mana;
  if (mana <= 0) return legalFreeActions(piece).length > 0;
  return legalFreeActions(piece).length > 0 || legalPaidActions(piece).length > 0;
}

function legalFreeActions(piece) {
  const actions = [];
  if (canMove(piece, false) && moveCost(piece, false) === 0) actions.push("move");
  return actions;
}

function legalPaidActions(piece) {
  const actions = [];
  if (canMove(piece, false) && moveCost(piece, false) > 0) actions.push("move");
  if (canMove(piece, true)) actions.push("dash");
  if (canAttack(piece)) actions.push("attack");
  if (canUseAbility(piece)) actions.push("ability");
  return actions;
}

function isReady(piece) {
  return piece.owner === state.active && piece.spawnedTurn !== state.turnId;
}

function legalMoves(piece, dash) {
  if (!isReady(piece) || piece.moved && !dash || piece.attacked || piece.dashed) return [];
  if (dash && piece.moved === false) return [];
  const pattern = MINIONS[piece.type].move;
  const moves = rawPattern(piece, pattern, "move");
  return moves.filter((pos) => inBounds(pos.x, pos.y) && !pieceAt(pos.x, pos.y) && (!MINIONS[piece.type].darkOnly || isDark(pos.x, pos.y)));
}

function legalAttacks(piece) {
  if (!isReady(piece) || piece.attacked || piece.dashed) return [];
  const pattern = MINIONS[piece.type].attack;
  if (pattern === "none") return [];
  if (pattern === "explode") return [{ x: piece.x, y: piece.y }, ...adjacent(piece.x, piece.y)];
  if (pattern === "diagonalBurst") return diagonals(piece.x, piece.y, 1).filter((pos) => pieceAt(pos.x, pos.y));
  if (pattern === "sweep") return sweepTargets(piece);
  if (pattern === "wither") return witherTargets(piece);
  if (pattern === "slime") return rawPattern(piece, "slime", "attack").filter((pos) => pieceAt(pos.x, pos.y));
  if (pattern === "shulker") return shulkerTargets(piece);
  if (pattern === "copy") return parrotTargets(piece);
  return rawPattern(piece, pattern, "attack").filter((pos) => pieceAt(pos.x, pos.y) && (!MINIONS[piece.type].darkOnly || isDark(pos.x, pos.y)));
}

function legalAbilities(piece) {
  const ability = MINIONS[piece.type].ability;
  if (!ability) return [];
  if (ability === "teleport") {
    return rayTargets(piece, cardinalDirs(), 9).filter((pos) => pieceAt(pos.x, pos.y)?.type !== "villager");
  }
  if (ability === "pull") return rayTargets(piece, cardinalDirs(), 9);
  return [];
}

function rawPattern(piece, pattern) {
  if (pattern === "none") return [];
  if (pattern === "king") return adjacent(piece.x, piece.y);
  if (pattern === "diamond2") return diamond(piece, 2);
  if (pattern === "phantom") return squareRange(piece, 2);
  if (pattern === "zombie") {
    const dy = piece.owner === "red" ? 1 : -1;
    return [-1, 0, 1].map((dx) => ({ x: piece.x + dx, y: piece.y + dy }));
  }
  if (pattern === "cardinal1") return ray(piece, cardinalDirs(), 1);
  if (pattern === "cardinal2") return ray(piece, cardinalDirs(), 2);
  if (pattern === "diagonal1") return ray(piece, diagonalDirs(), 1);
  if (pattern === "diagonal3") return ray(piece, diagonalDirs(), 3);
  if (pattern === "rabbit") return cardinalDirs().map(([dx, dy]) => ({ x: piece.x + dx * 2, y: piece.y + dy * 2 }));
  if (pattern === "slime") return exactStep(piece, [...cardinalDirs(), ...diagonalDirs()], 2);
  if (pattern === "parrot") return ray(piece, [...cardinalDirs(), ...diagonalDirs()], 2);
  return [];
}

function squareRange(piece, range) {
  const cells = [];
  for (let dy = -range; dy <= range; dy += 1) {
    for (let dx = -range; dx <= range; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const pos = { x: piece.x + dx, y: piece.y + dy };
      if (inBounds(pos.x, pos.y)) cells.push(pos);
    }
  }
  return cells;
}

function diamond(piece, range) {
  const cells = [];
  for (let dy = -range; dy <= range; dy += 1) {
    for (let dx = -range; dx <= range; dx += 1) {
      const distance = Math.abs(dx) + Math.abs(dy);
      if (distance === 0 || distance > range) continue;
      const pos = { x: piece.x + dx, y: piece.y + dy };
      if (inBounds(pos.x, pos.y)) cells.push(pos);
    }
  }
  return cells;
}

function exactStep(piece, dirs, range) {
  return dirs
    .map(([dx, dy]) => ({ x: piece.x + dx * range, y: piece.y + dy * range }))
    .filter((pos) => inBounds(pos.x, pos.y));
}

function ray(piece, dirs, range) {
  const cells = [];
  dirs.forEach(([dx, dy]) => {
    for (let step = 1; step <= range; step += 1) {
      const pos = { x: piece.x + dx * step, y: piece.y + dy * step };
      if (!inBounds(pos.x, pos.y)) break;
      cells.push(pos);
      if (pieceAt(pos.x, pos.y)) break;
    }
  });
  return cells;
}

function rayTargets(piece, dirs, range) {
  return ray(piece, dirs, range).filter((pos) => pieceAt(pos.x, pos.y));
}

function sweepTargets(piece) {
  return cardinalDirs()
    .map(([dx, dy]) => ({ x: piece.x + dx, y: piece.y + dy }))
    .filter((pos) => inBounds(pos.x, pos.y));
}

function sweepCells(piece, target) {
  const dx = Math.sign(target.x - piece.x);
  const dy = Math.sign(target.y - piece.y);
  if (Math.abs(dx) + Math.abs(dy) !== 1) return [];
  const perpendiculars = dx !== 0
    ? [[0, -1], [0, 1]]
    : [[-1, 0], [1, 0]];
  return [
    { x: target.x, y: target.y },
    ...perpendiculars.map(([px, py]) => ({ x: target.x + px, y: target.y + py })),
  ].filter((pos) => inBounds(pos.x, pos.y));
}

function witherTargets(piece) {
  return ray(piece, cardinalDirs(), 3).filter((pos) => pieceAt(pos.x, pos.y));
}

function shulkerTargets(piece) {
  const cells = shulkerPaths(piece)
    .map((path) => path.find((pos) => pieceAt(pos.x, pos.y)))
    .filter(Boolean);
  return uniqueCells(cells);
}

function shulkerPaths(piece) {
  const paths = [];
  [-1, 1].forEach((longSign) => {
    [-1, 1].forEach((shortSign) => {
      paths.push([
        { x: piece.x + longSign, y: piece.y },
        { x: piece.x + longSign * 2, y: piece.y },
        { x: piece.x + longSign * 2, y: piece.y + shortSign },
      ].filter((pos) => inBounds(pos.x, pos.y)));
      paths.push([
        { x: piece.x, y: piece.y + longSign },
        { x: piece.x, y: piece.y + longSign * 2 },
        { x: piece.x + shortSign, y: piece.y + longSign * 2 },
      ].filter((pos) => inBounds(pos.x, pos.y)));
    });
  });
  return paths;
}

function parrotTargets(piece) {
  const neighbors = cardinalDirs()
    .map(([dx, dy]) => pieceAt(piece.x + dx, piece.y + dy))
    .filter(Boolean)
    .filter((other) => MINIONS[other.type].attack !== "none");
  const targets = neighbors.flatMap((other) => copiedAttackTargets(piece, other.type));
  return uniqueCells(targets);
}

function copiedAttackTargets(piece, copiedType) {
  const copied = { ...piece, type: copiedType };
  const pattern = MINIONS[copiedType].attack;
  if (pattern === "none") return [];
  if (pattern === "explode") return [{ x: piece.x, y: piece.y }, ...adjacent(piece.x, piece.y)];
  if (pattern === "diagonalBurst") return diagonals(piece.x, piece.y, 1).filter((pos) => pieceAt(pos.x, pos.y));
  if (pattern === "sweep") return sweepTargets(piece);
  if (pattern === "wither") return witherTargets(piece);
  if (pattern === "slime") return rawPattern(piece, "slime").filter((pos) => pieceAt(pos.x, pos.y));
  if (pattern === "shulker") return shulkerTargets(piece);
  if (pattern === "copy") return [];
  return rawPattern(copied, pattern).filter((pos) => pieceAt(pos.x, pos.y) && (!MINIONS[copiedType].darkOnly || isDark(pos.x, pos.y)));
}

function copiedTypeForParrotTarget(piece, target) {
  return cardinalDirs()
    .map(([dx, dy]) => pieceAt(piece.x + dx, piece.y + dy))
    .filter(Boolean)
    .find((other) => copiedAttackTargets(piece, other.type).some((pos) => pos.x === target.x && pos.y === target.y))
    ?.type;
}

function parrotCopySources(piece) {
  return cardinalDirs()
    .map(([dx, dy]) => pieceAt(piece.x + dx, piece.y + dy))
    .filter(Boolean)
    .filter((other) => MINIONS[other.type].attack !== "none")
    .map((other) => ({
      type: other.type,
      owner: other.owner,
      targets: copiedAttackTargets(piece, other.type).length,
    }));
}

function parrotCopyLabel(piece, target) {
  const copiedType = copiedTypeForParrotTarget(piece, target);
  if (!copiedType) return "";
  return `${MINIONS[copiedType].name} copy`;
}

function moveCost(piece, dash) {
  if (piece.type === "villager") return dash ? 1 : 1;
  return dash ? 1 : 0;
}

function movePiece(piece, target, dash) {
  const from = { x: piece.x, y: piece.y };
  piece.x = target.x;
  piece.y = target.y;
  if (dash) piece.dashed = true;
  else piece.moved = true;
  queueCellEffect(target.x, target.y, dash ? "Dash" : "Move", "move");
  if (MINIONS[piece.type].onMove === "hopDraw" && jumpedOver(from, target)) {
    draw(state.players[piece.owner], 1);
    state.log.unshift(`${state.players[piece.owner].name}'s Rabbit hopped over a minion and drew a card.`);
    queueCellEffect(target.x, target.y, "+ Draw", "draw");
  }
}

function attackWith(piece, target) {
  const minion = MINIONS[piece.type];
  if (piece.type === "creeper") {
    adjacent(piece.x, piece.y).forEach((pos) => destroyAt(pos.x, pos.y));
    destroyPiece(piece);
    state.log.unshift(`${state.players[piece.owner].name}'s Creeper exploded.`);
    queueCellEffect(piece.x, piece.y, "Boom", "attack");
  } else if (piece.type === "pufferfish") {
    diagonals(piece.x, piece.y, 1).forEach((pos) => destroyAt(pos.x, pos.y));
    state.log.unshift("Puffer-Fish struck every diagonal tile.");
    queueCellEffect(piece.x, piece.y, "Spikes", "attack");
  } else if (piece.type === "irongolem") {
    sweepCells(piece, target).forEach((pos) => destroyAt(pos.x, pos.y));
    state.log.unshift("Iron Golem swept a lane.");
    queueCellEffect(target.x, target.y, "Sweep", "attack");
  } else if (piece.type === "parrot") {
    attackAsParrot(piece, target);
  } else if (piece.type === "wither") {
    destroyAt(target.x, target.y);
    cardinalDirs().forEach(([dx, dy]) => destroyAt(target.x + dx, target.y + dy));
    state.log.unshift("Wither fired a splash shot.");
    queueCellEffect(target.x, target.y, "Splash", "attack");
  } else {
    destroyAt(target.x, target.y);
    if (["villager", "slime", "shulker"].includes(piece.type)) {
      piece.x = target.x;
      piece.y = target.y;
    }
    state.log.unshift(`${state.players[piece.owner].name}'s ${minion.name} attacked.`);
    queueCellEffect(target.x, target.y, "Hit", "attack");
  }
  piece.attacked = true;
}

function attackAsParrot(piece, target) {
  const copiedType = copiedTypeForParrotTarget(piece, target);
  const copiedName = copiedType ? MINIONS[copiedType].name : "nearby minion";
  const pattern = copiedType ? MINIONS[copiedType].attack : null;
  if (pattern === "explode") {
    adjacent(piece.x, piece.y).forEach((pos) => destroyAt(pos.x, pos.y));
    destroyPiece(piece);
    queueCellEffect(piece.x, piece.y, "Copy boom", "attack");
  } else if (pattern === "diagonalBurst") {
    diagonals(piece.x, piece.y, 1).forEach((pos) => destroyAt(pos.x, pos.y));
    queueCellEffect(piece.x, piece.y, "Copy spikes", "attack");
  } else if (pattern === "sweep") {
    sweepCells(piece, target).forEach((pos) => destroyAt(pos.x, pos.y));
    queueCellEffect(target.x, target.y, "Copy sweep", "attack");
  } else if (pattern === "wither") {
    destroyAt(target.x, target.y);
    cardinalDirs().forEach(([dx, dy]) => destroyAt(target.x + dx, target.y + dy));
    queueCellEffect(target.x, target.y, "Copy splash", "attack");
  } else if (pattern === "slime") {
    destroyAt(target.x, target.y);
    piece.x = target.x;
    piece.y = target.y;
    queueCellEffect(target.x, target.y, "Copy land", "attack");
  } else {
    destroyAt(target.x, target.y);
    if (["villager", "shulker"].includes(copiedType)) {
      piece.x = target.x;
      piece.y = target.y;
    }
    queueCellEffect(target.x, target.y, "Copy hit", "attack");
  }
  state.log.unshift(`Parrot copied ${copiedName}'s attack.`);
}

function useAbility(piece, target) {
  const targetPiece = pieceAt(target.x, target.y);
  if (!targetPiece) return;
  if (MINIONS[piece.type].ability === "teleport") {
    const old = { x: piece.x, y: piece.y };
    piece.x = targetPiece.x;
    piece.y = targetPiece.y;
    targetPiece.x = old.x;
    targetPiece.y = old.y;
    state.log.unshift("Enderman swapped places with a minion.");
    queueCellEffect(piece.x, piece.y, "Swap", "ability");
    queueCellEffect(targetPiece.x, targetPiece.y, "Swap", "ability");
  }
  if (MINIONS[piece.type].ability === "pull") {
    const dx = Math.sign(piece.x - targetPiece.x);
    const dy = Math.sign(piece.y - targetPiece.y);
    for (let i = 0; i < 2; i += 1) {
      const next = { x: targetPiece.x + dx, y: targetPiece.y + dy };
      if (!inBounds(next.x, next.y) || pieceAt(next.x, next.y)) break;
      targetPiece.x = next.x;
      targetPiece.y = next.y;
    }
    state.log.unshift("Frog pulled a minion closer.");
    queueCellEffect(targetPiece.x, targetPiece.y, "Pull", "ability");
  }
  piece.usedAbility = true;
}

function applyOnSpawn(piece) {
  const player = state.players[piece.owner];
  const minion = MINIONS[piece.type];
  if (minion.onSpawn === "draw") {
    draw(player, 1);
    queueCellEffect(piece.x, piece.y, "+ Draw", "draw");
  }
  if (minion.onSpawn === "stealDraw") {
    stealDraw(piece.owner, 2);
    queueCellEffect(piece.x, piece.y, "Steal 2", "draw");
  }
  if (minion.onSpawn === "explode") {
    adjacent(piece.x, piece.y).forEach((pos) => destroyAt(pos.x, pos.y));
    queueCellEffect(piece.x, piece.y, "Spawn blast", "attack");
  }
}

function stealDraw(owner, amount) {
  const enemy = state.players[opponent(owner)];
  const player = state.players[owner];
  for (let i = 0; i < amount; i += 1) {
    if (enemy.deck.length) {
      player.hand.push(enemy.deck.shift());
      markNewHandCard(owner, player.hand.length - 1);
    }
  }
}

function destroyAt(x, y) {
  const piece = pieceAt(x, y);
  if (piece) {
    queueCellEffect(x, y, "KO", "destroy");
    destroyPiece(piece);
  }
}

function destroyPiece(piece) {
  const minion = MINIONS[piece.type];
  state.pieces = state.pieces.filter((p) => p.id !== piece.id);
  if (piece.type === "villager") state.winner = opponent(piece.owner);
  if (minion.onDeath === "draw") {
    draw(state.players[piece.owner], 1);
    queueCellEffect(piece.x, piece.y, "+ Draw", "draw");
  }
  if (minion.onDeath === "discardTwo") {
    state.players[piece.owner].hand.splice(0, 2);
    queueCellEffect(piece.x, piece.y, "Discard 2", "destroy");
  }
}

function countAuraMana(game, owner) {
  return game.pieces.filter((piece) => piece.owner === owner && MINIONS[piece.type].aura === "mana").length;
}

function jumpedOver(from, to) {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return Number.isInteger(mid.x) && Number.isInteger(mid.y) && Boolean(pieceAt(mid.x, mid.y));
}

function cellClass(x, y) {
  const classes = [isDark(x, y) ? "dark" : "light"];
  if (y <= 1) classes.push("red-spawn");
  else if (y >= 6) classes.push("blue-spawn");
  else classes.push("neutral");
  return classes.join(" ");
}

function inSpawnZone(owner, y) {
  return owner === "red" ? y <= 1 : y >= 6;
}

function isDark(x, y) {
  return (x + y) % 2 === 1;
}

function inBounds(x, y) {
  return x >= 0 && x < BOARD_W && y >= 0 && y < BOARD_H;
}

function pieceAt(x, y) {
  return state.pieces.find((piece) => piece.x === x && piece.y === y);
}

function pieceById(id) {
  return state.pieces.find((piece) => piece.id === id);
}

function opponent(owner) {
  return owner === "red" ? "blue" : "red";
}

function adjacent(x, y) {
  return [...cardinalDirs(), ...diagonalDirs()]
    .map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
    .filter((pos) => inBounds(pos.x, pos.y));
}

function diagonals(x, y, range) {
  return diagonalDirs()
    .map(([dx, dy]) => ({ x: x + dx * range, y: y + dy * range }))
    .filter((pos) => inBounds(pos.x, pos.y));
}

function cardinalDirs() {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]];
}

function diagonalDirs() {
  return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
}

function uniqueCells(cells) {
  const seen = new Set();
  return cells.filter((cell) => {
    const key = `${cell.x},${cell.y}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function initials(name) {
  return name.split(/[- ]/).map((part) => part[0]).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function endTurn() {
  if (LAB_MODE) {
    selected = null;
    loadLabScenario();
    return;
  }
  if (CORRESPONDENCE_MODE) {
    endCorrespondenceTurn();
    return;
  }
  if (replaying) return;
  if (state.winner) {
    if (state.active === state.winner) {
      selected = null;
      state.active = opponent(state.winner);
      passPending = true;
      showPassScreen(`${state.players[state.active].name}'s screen`, "The game is over. Call the other player over to watch the final replay.");
      render();
      return;
    }
    restartGame();
    return;
  }
  selected = null;
  beginTurn(state, opponent(state.active));
  passPending = true;
  showPassScreen();
  render();
}

function endCorrespondenceTurn() {
  if (!correspondenceGame || !state || !isCorrespondenceLocalTurn() || replaying || hasPendingOutgoingCode()) return;
  selected = null;
  if (!state.winner) beginTurn(state, opponent(state.active));
  correspondenceGame.state = state;
  correspondenceGame.status = state.winner ? "finished" : "waiting";
  const seq = correspondenceGame.nextExpectedSeq;
  const packet = makeCorrespondencePacket("turn", correspondenceGame, { state: JSON.parse(JSON.stringify(state)) }, seq);
  correspondenceGame.lastGeneratedCode = encodeCorrespondencePacket(packet);
  correspondenceGame.exportedCodes.push(seq);
  correspondenceGame.nextExpectedSeq = seq + 1;
  upsertCorrespondenceGame(correspondenceGame);
  correspondenceCodePopupClosed = false;
  render();
}

function restartGame() {
  if (LAB_MODE) {
    selected = null;
    loadLabScenario();
    return;
  }
  if (CORRESPONDENCE_MODE) {
    renderCorrespondenceHome();
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  startDeckBuilder("red");
}

function showPassScreen(title, text) {
  const player = state?.players?.[state.active];
  const owner = builder?.owner || state?.active || "red";
  els.passScreen.classList.toggle("red", owner === "red");
  els.passScreen.classList.toggle("blue", owner === "blue");
  els.passTitle.textContent = title || `${player.name}'s turn`;
  els.passText.textContent = text || "Hand, mana, and board are hidden. Call the other player over, then press Ready.";
  els.passScreen.classList.add("is-visible");
}

async function hidePassScreen() {
  if (replaying) return;
  passPending = false;
  els.passScreen.classList.remove("is-visible");
  if (state && !builder) await replayOpponentActions();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

els.endTurnButton.addEventListener("click", endTurn);
els.readyButton.addEventListener("click", hidePassScreen);
els.rulesButton.addEventListener("click", () => els.rulesDialog.showModal());
els.newGameButton.addEventListener("click", restartGame);
els.corrNewGameButton?.addEventListener("click", () => startCorrespondenceDeckBuilder("start"));
els.corrJoinButton?.addEventListener("click", importJoinInviteCode);
window.addEventListener("keydown", handleActionShortcut);

els.builderAutoButton.addEventListener("click", () => {
  if (!builder) return;
  builder.deck = [...DEFAULT_DECK];
  builder.lastDrafted = null;
  builder.quickFilled = true;
  renderDeckBuilder();
});

els.builderDoneButton.addEventListener("click", () => {
  if (!builder || builder.deck.length !== DECK_SIZE) return;
  if (CORRESPONDENCE_MODE && builder.flow) {
    finishCorrespondenceDeck(builder.deck);
    return;
  }
  if (builder.owner === "red") {
    startDeckBuilder("blue", [...builder.deck]);
    return;
  }
  state = newGame(builder.redDeck, builder.deck);
  builder = null;
  passPending = true;
  showPassScreen();
  render();
});

if (CORRESPONDENCE_MODE) {
  renderCorrespondenceHome();
} else if (LAB_MODE) {
  loadLabScenario();
} else if (state) {
  showPassScreen();
  render();
} else {
  startDeckBuilder("red");
}
