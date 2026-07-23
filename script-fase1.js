// ==============================
// OBTENER ELEMENTOS DEL DOM
// ==============================

const humidity = document.getElementById("humidity");
const temperature = document.getElementById("temperature");
const status = document.getElementById("status");
const alertText = document.getElementById("alert");

const button = document.getElementById("waterButton");
const activity = document.getElementById("activityList");

const rain = document.getElementById("rain");
const plant = document.getElementById("plant");

// ==============================
// VARIABLES
// ==============================

let humidityValue = 72;
let plantScale = 1;

// ==============================
// FUNCIÓN PARA CREAR LLUVIA
// ==============================

function createRain() {

    for (let i = 0; i < 25; i++) {

        const drop = document.createElement("div");

        drop.classList.add("drop");

        drop.style.left = Math.random() * 100 + "%";

        drop.style.animationDelay = (Math.random() * 0.3) + "s";

        rain.appendChild(drop);

        setTimeout(() => {

            drop.remove();

        }, 1000);

    }

}

// ==============================
// BOTÓN REGAR
// ==============================

button.addEventListener("click", () => {

    // Crear lluvia
    createRain();

    // Animación del botón
    button.classList.add("pop");

    setTimeout(() => {

        button.classList.remove("pop");

    }, 350);

    // Aumentar humedad
    humidityValue += 5;

    if (humidityValue > 100) {

        humidityValue = 100;

    }

    humidity.textContent = humidityValue + "%";

    // Crecimiento de la planta
    plantScale += 0.08;

    if (plantScale > 1.6) {

        plantScale = 1.6;

    }

    plant.style.transform = `scale(${plantScale})`;

    // Estado
    status.textContent = "Muy saludable";

    alertText.textContent = "Sin alertas";

    // Registrar actividad
    const item = document.createElement("div");

    item.className = "activity-item";

    const hour = new Date().toLocaleTimeString();

    item.textContent = `💧 Riego realizado correctamente - ${hour}`;

    activity.prepend(item);

});