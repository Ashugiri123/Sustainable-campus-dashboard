let energyData = [120, 135, 128, 170];
let waterData = [900, 870, 910, 950];
let labels = ["Mon", "Tue", "Wed", "Thu"];

let energyThreshold = 160;
let waterThreshold = 930;
let alertsEnabled = true;

const energyChart = new Chart(
    document.getElementById("energyChart"),
    {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Energy (kWh)",
                data: energyData,
                borderColor: "#00C853"
            }]
        }
    }
);

const waterChart = new Chart(
    document.getElementById("waterChart"),
    {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Water (Liters)",
                data: waterData,
                borderColor: "#2979FF"
            }]
        }
    }
);

function updateSystem() {

    const alertList = document.getElementById("alertList");
    const ecoScoreElement = document.getElementById("ecoScore");
    const predictionList = document.getElementById("prediction");

    alertList.innerHTML = "";
    predictionList.innerHTML = "";

    let ecoScore = 100;

    const latestEnergy = energyData[energyData.length - 1];
    const latestWater = waterData[waterData.length - 1];

    if (alertsEnabled && latestEnergy > energyThreshold) {
        ecoScore -= 20;
        alertList.innerHTML += "<li>⚠ High energy usage detected</li>";
    }

    if (alertsEnabled && latestWater > waterThreshold) {
        ecoScore -= 20;
        alertList.innerHTML += "<li>⚠ Water usage above optimal limit</li>";
    }

    ecoScoreElement.textContent = ecoScore + "/100";

    const predictedEnergy = Math.round(latestEnergy * 1.05);
    const predictedWater = Math.round(latestWater * 1.03);

    predictionList.innerHTML += "<li>Predicted Energy: " + predictedEnergy + " kWh</li>";
    predictionList.innerHTML += "<li>Predicted Water: " + predictedWater + " Liters</li>";

    generateAIInsights();
}

function generateAIInsights() {

    const aiBox = document.getElementById("aiAnalysis");
    aiBox.innerHTML = "";

    const avgEnergy = energyData.reduce((a, b) => a + b, 0) / energyData.length;
    const avgWater = waterData.reduce((a, b) => a + b, 0) / waterData.length;

    const latestEnergy = energyData[energyData.length - 1];
    const latestWater = waterData[waterData.length - 1];

    let output = "";

    if (latestEnergy > avgEnergy) {
        output += "<p><strong>Energy Overuse Cause:</strong> Energy exceeded weekly average. Likely due to extended AC usage or lab equipment runtime.</p>";
        output += "<p><strong>Control Strategy:</strong> Implement automatic shutdown after peak hours and monitor lab scheduling.</p>";
    }

    if (latestWater > avgWater) {
        output += "<p><strong>Water Overuse Cause:</strong> Water usage above weekly trend. Possible leakage or excessive hostel usage.</p>";
        output += "<p><strong>Control Strategy:</strong> Inspect pipelines and promote water conservation awareness.</p>";
    }

    if (output === "") {
        output = "<p>System operating within sustainable limits this week.</p>";
    }

    aiBox.innerHTML = output;
}

function applySettings() {
    energyThreshold = parseInt(document.getElementById("energyThreshold").value);
    waterThreshold = parseInt(document.getElementById("waterThreshold").value);
    alertsEnabled = document.getElementById("alertsToggle").checked;
    updateSystem();
}

function simulateSpike() {
    energyData.push(190);
    labels.push("Fri");

    energyChart.data.labels = labels;
    energyChart.data.datasets[0].data = energyData;
    energyChart.update();

    updateSystem();
}

function resetSystem() {
    energyData = [120, 135, 128, 170];
    waterData = [900, 870, 910, 950];
    labels = ["Mon", "Tue", "Wed", "Thu"];

    energyChart.data.labels = labels;
    energyChart.data.datasets[0].data = energyData;

    waterChart.data.labels = labels;
    waterChart.data.datasets[0].data = waterData;

    energyChart.update();
    waterChart.update();

    updateSystem();
}

document.querySelectorAll(".sidebar li").forEach(item => {
    item.addEventListener("click", function() {

        document.querySelectorAll(".sidebar li").forEach(li => {
            li.classList.remove("active");
        });

        this.classList.add("active");

        document.querySelectorAll(".section").forEach(section => {
            section.classList.remove("active");
        });

        const sectionId = this.getAttribute("data-section");
        document.getElementById(sectionId).classList.add("active");
    });
});

updateSystem();