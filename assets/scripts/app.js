const player = document.getElementById('player');
const ice = document.getElementById('ice');
const gameArea = document.getElementById('game-area');

// tamaños
const PLAYER_WIDTH = 100;
const PLAYER_HEIGHT = 50;
const GAME_WIDTH = gameArea.clientWidth;
const GAME_HEIGHT = gameArea.clientHeight;

let playerPosition = {x: 100, y: 100};
let icePosition = {x: 300, y: 300};
// valores default
let playerSpeed = 40;
let iceSpeed = 2;

let btnAdd;
let verFlag;
let selectDificultad;

let selectMusica;
let currentAudio;
let musicStarted = false;

let selectFondo;

function init() {
    btnAdd = document.querySelector('#btn-enviar');
    btnAdd.addEventListener('click', enviar);

    // dificultad
    selectDificultad = document.querySelector('#select-dificultad');
    selectDificultad.addEventListener('change', cambiarDificultad);
    establecerDificultad(selectDificultad.value);

    // musica
    selectMusica = document.querySelector('#select-musica');
    selectMusica.addEventListener('change', cambiarMusica);
    const defaultSong = selectMusica.value;
    currentAudio = new Audio(`assets/audio/${defaultSong}`);
    currentAudio.loop = true;

    // fondo
    selectFondo = document.querySelector('#select-fondo');
    selectFondo.addEventListener('change', cambiarFondo);
    establecerFondo(selectFondo.value);
}

function establecerFondo(nombreFondo) {
    gameArea.style.backgroundImage = `url('assets/img/${nombreFondo}')`;
    gameArea.style.backgroundColor = 'transparent';
}

function cambiarFondo(evt) {
    const fondoSeleccionado = evt.target.value;
    establecerFondo(fondoSeleccionado);
}

function playMusic(songName) {
    currentAudio.pause();
    currentAudio = new Audio(`assets/audio/${songName}`);
    currentAudio.loop = true;
    currentAudio.play();
}

function cambiarMusica(evt) {
    const nuevaCancion = evt.target.value;
    playMusic(nuevaCancion);
    musicStarted = true;
}

function cambiarDificultad(evt) {
    const nuevaDificultad = evt.target.value;
    establecerDificultad(nuevaDificultad);
    reiniciarJuego();
}

function establecerDificultad(dificultad) {
    switch(dificultad) {
        case 'facil':
            playerSpeed = 40;
            iceSpeed = 1;
            break;
        case 'normal':
            playerSpeed = 35;
            iceSpeed = 2;
            break;
        case 'dificil':
            playerSpeed = 31;
            iceSpeed = 3.2;
            break;
        default:
            playerSpeed = 35;
            iceSpeed = 2;
    }
}

function reiniciarJuego() {
    playerPosition = {x: 50, y: 50};
    icePosition = {x: 450, y: 450};
    verFlag = false;
    resetForm();
    updatePositions();
}

// funcion del boton
function enviar(evt) {
    evt.preventDefault();

    let datos = {};

    datos.nombre = document.querySelector('#d1').value;
    datos.apellido = document.querySelector('#d2').value;
    datos.nacimiento = document.querySelector('#d3').value;

    const sexoSeleccionado = document.querySelector('input[name=sexo]:checked');
    datos.sexo = sexoSeleccionado ? sexoSeleccionado.value : null;

    datos.solicitud = document.querySelector('#d4').value;
    datos.curp = document.querySelector('#d5').value;
    datos.motivo = document.querySelector('#d6').value;

    if(datos.nombre == '' || datos.apellido == '' || datos.nacimiento == '' || datos.sexo == null 
        || datos.solicitud == '' || datos.curp == '' || datos.motivo == '') {
            verFlag = false;
            alert('¡Debes llenar todos los campos del formulario, por chistoso te borro todo :v!');
            resetForm();
        } else {
            alert('¡Felicidades, has completado el formulario en su totalidad!');
            verFlag = true;
        }
}

window.addEventListener('keydown', (event) => {
    if (!musicStarted) {
        currentAudio.play();
        musicStarted = true;
    }

    switch(event.key){
        case 'ArrowUp':
        case 'w':
            if(playerPosition.y > 0) {
                playerPosition.y -= playerSpeed;
            }
            break;
        case 'ArrowDown':
        case 's':
            if(playerPosition.y < GAME_HEIGHT - PLAYER_HEIGHT) {
                playerPosition.y += playerSpeed;
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if(playerPosition.x > 0) {
                playerPosition.x -= playerSpeed;
            }
            break;
        case 'ArrowRight':
        case 'd':
            if(playerPosition.x < GAME_WIDTH - PLAYER_WIDTH) {
                playerPosition.x += playerSpeed;
            }
            break;
    }
    updatePositions();
})

// limpiar los campos
function resetForm() {
    document.querySelector('#d1').value = '';
    document.querySelector('#d2').value = '';
    document.querySelector('#d3').value = '';
    document.querySelector('#d4').value = '';
    document.querySelector('#d5').value = '';
    document.querySelector('#d6').value = '';

    const radiosSexo = document.querySelectorAll('input[name=sexo]');
    radiosSexo.forEach(radio => {
        radio.checked = false;
    });
}

function moveIce(){
    if(icePosition.x < playerPosition.x){
        icePosition.x += iceSpeed;
    } else if(icePosition.x > playerPosition.x){
        icePosition.x -= iceSpeed;
    }

    if(icePosition.y < playerPosition.y){
        icePosition.y += iceSpeed;
    } else if(icePosition.y > playerPosition.y){
        icePosition.y -= iceSpeed;
    }
    updatePositions();
    checkCollision();
}

function updatePositions(){
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    ice.style.transform = `translate(${icePosition.x}px, ${icePosition.y}px)`;
}

// chequea colisión
function checkCollision(){
    if(Math.abs(playerPosition.x - icePosition.x) < PLAYER_WIDTH && Math.abs(playerPosition.y - icePosition.y) < PLAYER_HEIGHT) {
        if (verFlag){
            alert('Eres un inmigrante legal. ¡Bienvenido a América! 🇺🇸🦅🦅🦅');
        } else {
            alert('¡El ICE te atrapó! Quedas deportado de Estados Unidos 🇺🇸🦅🦅🔫');
        }
        
        reiniciarJuego();
    }
}

function gameLoop(){
    moveIce();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('load', init);
gameLoop();