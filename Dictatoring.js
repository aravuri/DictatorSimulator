let prestart;

function startGame() {
    taxSlider.value = 16;
    taxes = taxSlider.value;
    taxValue.textContent = taxes;
    navbar.classList.remove("hidden");
    buyMenu.classList.remove("hidden");
    dictatorMenu.classList.remove("hidden");
    gameStartButton.classList.remove("hidden");
    pollutionText.textContent = shrinkify(pollution);
    beforeUpdate();
    prestart = setInterval(beforeUpdate, 1000);
    gameStartButton.addEventListener('click', function () {
        realStartGame();
    });
}

function realStartGame() {
    for (let i = 0; i < landLength; i++) {
        for (let j = 0; j < landLength; j++) {
            let rect = document.getElementById(i + "-" + j + "-rect");
            rect.onclick = function () {
                let x = confirm("Do you want to launch an expedition?");
                if (!x) {
                    return;
                }
                let beCareful = confirm("Will this explorer be careful or fast? Careful=OK, Fast=Cancel");
                explorers++;
                explorersDisplay.textContent = explorers;
                let bfs = new PriorityQueue({comparator: beCareful ? careful : fast});
                let visited = land.map((x) => new Array(x.length).fill(false));
                bfs.push([Math.ceil(landLength / 2), Math.ceil(landLength / 2), [], 0, 0]);
                log(bfs.size());
                while (bfs.size() > 0) {
                    let state = bfs.poll();
                    let y = state[0];
                    let x = state[1];
                    let exploredLands = state[2];
                    let danger = state[3];
                    let time = state[4];
                    if (visited[y][x]) {
                        continue;
                    }
                    let thing = JSON.parse(JSON.stringify(exploredLands));
                    thing.push([y, x]);
                    visited[y][x] = true;
                    log(x + ", " + y + ", " + danger + ", " + time);
                    if (y === i && x === j) {
                        let k = 0;
                        let time = 0;
                        let dead = false;
                        for (k = 0; k < thing.length; k++) {
                            time += land[i][j] === 0 ? landData[realLand[thing[k][0]][thing[k][1]]].time : 0;
                            if (land[i][j] === 0 && Math.random() < landData[realLand[thing[k][0]][thing[k][1]]].difficulty) {
                                dead = true;
                                break;
                            }
                        }
                        log(time);
                        if (dead) {
                            setTimeout(function () {
                                explorers--;
                                population--;
                                alert("Your explorer died. Sorry.")
                            }, time * 1000)
                        } else {
                            setTimeout(function () {
                                for (k = 0; k < thing.length; k++) {
                                    land[thing[k][0]][thing[k][1]] = realLand[thing[k][0]][thing[k][1]];
                                    let yes = document.getElementById(thing[k][0] + "-" + thing[k][1] + "-rect");
                                    let yYes = thing[k][0];
                                    let xYes = thing[k][1];
                                    yes.onclick = function () {
                                        alert("This is a " + landIDtoName[land[yYes][xYes]]);
                                    };
                                }
                                explorers--;
                                alert("Your explorer discovered things!")
                            }, time * 2 * 1000);
                        }
                        return;
                    }
                    if (y - 1 >= 0 && !visited[y - 1][x]) {
                        bfs.push([y - 1, x, JSON.parse(JSON.stringify(thing)), (1 - ((1 - danger) * (1 - (land[y - 1][x] === 0 ? landData[realLand[y - 1][x]].difficulty : 0)))), time + (land[y - 1][x] === 0 ? landData[realLand[y - 1][x]].time : 0)]);
                    }
                    if (y + 1 < landLength && !visited[y + 1][x]) {
                        bfs.push([y + 1, x, JSON.parse(JSON.stringify(thing)), (1 - ((1 - danger) * (1 - (land[y + 1][x] === 0 ? landData[realLand[y + 1][x]].difficulty : 0)))), time + (land[y + 1][x] === 0 ? landData[realLand[y + 1][x]].time : 0)]);
                    }
                    if (x - 1 >= 0 && !visited[y][x - 1]) {
                        bfs.push([y, x - 1, JSON.parse(JSON.stringify(thing)), (1 - ((1 - danger) * (1 - (land[y][x - 1] === 0 ? landData[realLand[y][x - 1]].difficulty : 0)))), time + (land[y][x - 1] === 0 ? landData[realLand[y][x - 1]].time : 0)]);
                    }
                    if (x + 1 < landLength && !visited[y][x + 1]) {
                        bfs.push([y, x + 1, JSON.parse(JSON.stringify(thing)), (1 - ((1 - danger) * (1 - (land[y][x + 1] === 0 ? landData[realLand[y][x + 1]].difficulty : 0)))), time + (land[y][x + 1] === 0 ? landData[realLand[y][x + 1]].time : 0)]);
                    }
                }
            };
            landDisplay.appendChild(rect)
        }
    }
    gameStartButton.classList.add("hidden");
    clearInterval(prestart);
    update();
    setInterval(update, 1000);
}

// clearCookie();

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

function beforeUpdate() {
    let change = averageWages * (taxes / 100.0);  // People are taxed by income, not by the amount of money they have

    mps = Math.floor(change * population);

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

    happiness = (Math.min(powerPerDay, powerQuota * population) / (powerQuota * population) + (100 - taxes) / 100) / 2 * 100;

    moneyText.textContent = shrinkify(money);
    populationText.textContent = shrinkify(population);
    powerPerDayText.textContent = shrinkify(powerPerDay);
    waterPerDayText.textContent = shrinkify(waterPerDay - population * waterNeeded);
    maxWaterText.textContent = shrinkify(maxWater);
    currentWaterText.textContent = shrinkify(water);
    pollutionText.textContent = shrinkify(pollution);
    happinessText.textContent = shrinkify(happiness);

    for (let i = 0; i < landLength; i++) {
        for (let j = 0; j < landLength; j++) {
            document.getElementById(i + "-" + j + "-rect").setAttributeNS(null, 'style', landColors[land[i][j]]);
        }
    }

    dayCounter.textContent = days;
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
    pps = population * birthrate * rand(0.875, 1.125);
    console.log("Now: " + pps);
    if (water < population * waterNeeded) {
        pps -= (population - water / (population * waterNeeded)) * 0.3;
    }
    pps = Math.ceil(pps);
    water = Math.min(water, maxWater);
    population += pps;

    moneyText.textContent = shrinkify(money);
    populationText.textContent = shrinkify(population);
    powerPerDayText.textContent = shrinkify(powerPerDay);
    waterPerDayText.textContent = shrinkify(waterPerDay - population * waterNeeded);
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