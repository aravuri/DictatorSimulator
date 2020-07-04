function startGame() {
    taxSlider.value = 16;
    taxes = taxSlider.value;
    taxValue.textContent = taxes;
    navbar.classList.remove("hidden");
    buyMenu.classList.remove("hidden");
    dictatorMenu.classList.remove("hidden");
    pollutionText.textContent = shrinkify(pollution);
    update();
    setInterval(update, 1000);
}

if (getCookie("name").length === 0) {
    askName();
} else {
    // noinspection JSConstantReassignment
    name = getCookie("name");
    log(name);
    if (getCookie("place").length === 0) {
        askPlace();
    } else {
        place = getCookie("place");
        log(place);
        startGame();
    }
}

function update() {  // Assuming that each update is a day
    averageMoney += averageWages - averageExpenses;
    let change = averageWages * (taxes / 100.0);  // People are taxed by income, not by the amount of money they have

    mps = Math.floor(change * population);
    averageMoney -= change;
    averageMoney = Math.max(0, averageMoney);

    powerPerDay = 0;
    maxWater = 0;
    waterPerDay = 0;
    for (let i = 0; i < powerProducers.length; i++) {
        powerPerDay += parseInt(powerProducers[i].querySelector(".nums").textContent) *
            unshrinkify(powerProducers[i].querySelector(".amount").textContent);
        pollution += parseInt(powerProducers[i].querySelector(".nums").textContent) *
            unshrinkify(powerProducers[i].querySelector(".pollute").textContent);
        mps -= parseInt(powerProducers[i].querySelector(".nums").textContent) *
            unshrinkify(powerProducers[i].querySelector(".maintain").textContent)
    }
    for (let i = 0; i < waterStorages.length; i++) {
        maxWater += parseInt(waterStorages[i].querySelector(".nums").textContent) *
            unshrinkify(waterStorages[i].querySelector(".amount").textContent);
        pollution += parseInt(waterStorages[i].querySelector(".nums").textContent) *
            unshrinkify(waterStorages[i].querySelector(".pollute").textContent);
        mps -= parseInt(waterStorages[i].querySelector(".nums").textContent) *
            unshrinkify(waterStorages[i].querySelector(".maintain").textContent)
    }
    for (let i = 0; i < waterProducers.length; i++) {
        waterPerDay += parseInt(waterProducers[i].querySelector(".nums").textContent) *
            unshrinkify(waterProducers[i].querySelector(".amount").textContent);
        pollution += parseInt(waterProducers[i].querySelector(".nums").textContent) *
            unshrinkify(waterProducers[i].querySelector(".pollute").textContent);
        mps -= parseInt(waterProducers[i].querySelector(".nums").textContent) *
            unshrinkify(waterProducers[i].querySelector(".maintain").textContent)
    }

    money += mps;
    water += waterPerDay;

    happiness = (Math.min(powerPerDay, powerQuota * population) / (powerQuota * population) + (100 - taxes) / 100) / 2 * 100;
    pps = Math.ceil(population * birthrate * rand(0.875, 1.125));
    if (water < -population * waterNeeded) {
        pps -= (population - water / (population * waterNeeded)) * 0.30;
    }
    water = Math.min(water, maxWater);
    population += pps;

    moneyText.textContent = shrinkify(money);
    populationText.textContent = shrinkify(population);
    powerPerDayText.textContent = shrinkify(powerPerDay);
    waterPerDayText.textContent = shrinkify(waterPerDay);
    maxWaterText.textContent = shrinkify(maxWater);
    currentWaterText.textContent = shrinkify(water);
    pollutionText.textContent = shrinkify(pollution);
    happinessText.textContent = shrinkify(happiness);

    for (let i = 0; i < landLength; i++) {
        for (let j = 0; j < landLength; j++) {
            document.getElementById(i + "-" + j + "-rect").setAttributeNS(null, 'style', landColors[land[i][j]]);
        }
    }

    days++;
    dayCounter.textContent = days;
}