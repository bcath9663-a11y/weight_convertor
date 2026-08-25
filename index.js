/* =========================================
   ELEMENTS
========================================= */

const weightMode = document.getElementById("weight-mode");
const bmiMode = document.getElementById("bmi-mode");

const weightSection = document.getElementById("weight-section");
const bmiSection = document.getElementById("bmi-section");


// Weight Converter
const weightInput = document.getElementById("weight-input");

const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");

const swapButton = document.getElementById("swap-button");
const convertButton = document.getElementById("convert-button");

const weightResult = document.getElementById("weight-result");
const weightFormula = document.getElementById("weight-formula");

const weightError = document.getElementById("weight-error");

const weightResultCard =
    document.getElementById("weight-result-card");

const copyButton = document.getElementById("copy-button");


// History
const historyList =
    document.getElementById("history-list");

const clearHistoryButton =
    document.getElementById("clear-history");


// Statistics
const totalConversions =
    document.getElementById("total-conversions");

const highestValue =
    document.getElementById("highest-value");

const lastUnit =
    document.getElementById("last-unit");


// BMI
const bmiWeight =
    document.getElementById("bmi-weight");

const bmiHeight =
    document.getElementById("bmi-height");

const calculateBMI =
    document.getElementById("calculate-bmi");

const bmiError =
    document.getElementById("bmi-error");

const bmiValue =
    document.getElementById("bmi-value");

const bmiCategory =
    document.getElementById("bmi-category");

const bmiMessage =
    document.getElementById("bmi-message");

const bmiResultCard =
    document.getElementById("bmi-result-card");

const clearBMI =
    document.getElementById("clear-bmi");


// Bottom controls
const darkMode =
    document.getElementById("dark-mode");

const glitchMode =
    document.getElementById("glitch-mode");


/* =========================================
   MODE SWITCHING
========================================= */

weightMode.addEventListener("click", function () {

    weightMode.classList.add("active");

    bmiMode.classList.remove("active");

    weightSection.classList.remove("hidden");

    bmiSection.classList.add("hidden");

});


bmiMode.addEventListener("click", function () {

    bmiMode.classList.add("active");

    weightMode.classList.remove("active");

    bmiSection.classList.remove("hidden");

    weightSection.classList.add("hidden");

});


/* =========================================
   WEIGHT CONVERSION
========================================= */

function convertWeight(value, from, to) {

    let kilograms;


    // Convert FROM unit to kilograms

    if (from === "kg") {

        kilograms = value;

    }
    else if (from === "lb") {

        kilograms = value * 0.453592;

    }
    else if (from === "g") {

        kilograms = value / 1000;

    }


    // Convert kilograms TO selected unit

    if (to === "kg") {

        return kilograms;

    }
    else if (to === "lb") {

        return kilograms / 0.453592;

    }
    else if (to === "g") {

        return kilograms * 1000;

    }
}


/* =========================================
   UNIT NAMES
========================================= */

function getUnitName(unit) {

    if (unit === "kg") {
        return "kg";
    }

    if (unit === "lb") {
        return "lb";
    }

    if (unit === "g") {
        return "g";
    }
}


/* =========================================
   CONVERT BUTTON
========================================= */

convertButton.addEventListener("click", function () {

    const value = Number(weightInput.value);

    const from = fromUnit.value;

    const to = toUnit.value;


    // Validation

    if (
        weightInput.value === "" ||
        isNaN(value) ||
        value <= 0
    ) {

        weightError.innerText =
            "Please enter a valid positive number.";

        weightResult.innerText = "--";

        weightFormula.innerText = "";

        return;
    }


    weightError.innerText = "";


    // Convert

    const convertedValue =
        convertWeight(value, from, to);


    const roundedValue =
        convertedValue.toFixed(2);


    // Show result

    weightResult.innerText =
        `${roundedValue} ${getUnitName(to)}`;


    weightFormula.innerText =
        `${value} ${getUnitName(from)} = ${roundedValue} ${getUnitName(to)}`;


    // Animation

    weightResultCard.classList.remove("show");

    void weightResultCard.offsetWidth;

    weightResultCard.classList.add("show");


    // Save conversion

    saveConversion(
        `${value} ${getUnitName(from)} → ${roundedValue} ${getUnitName(to)}`,
        value,
        getUnitName(to)
    );

});


/* =========================================
   SWAP UNITS
========================================= */

swapButton.addEventListener("click", function () {

    const currentFrom = fromUnit.value;

    fromUnit.value = toUnit.value;

    toUnit.value = currentFrom;


    // If a value is already entered,
    // automatically convert it again.

    if (weightInput.value !== "") {

        convertButton.click();

    }

});


/* =========================================
   LOCAL STORAGE
========================================= */

let conversionHistory =
    JSON.parse(
        localStorage.getItem("weightHistory")
    ) || [];


let statistics =
    JSON.parse(
        localStorage.getItem("weightStatistics")
    ) || {

        total: 0,

        highest: 0,

        lastUnit: "--"

    };


/* =========================================
   SAVE CONVERSION
========================================= */

function saveConversion(text, value, unit) {

    conversionHistory.unshift(text);


    // Keep only latest 5

    if (conversionHistory.length > 5) {

        conversionHistory.pop();

    }


    statistics.total++;

    statistics.lastUnit = unit;


    if (value > statistics.highest) {

        statistics.highest = value;

    }


    localStorage.setItem(
        "weightHistory",
        JSON.stringify(conversionHistory)
    );


    localStorage.setItem(
        "weightStatistics",
        JSON.stringify(statistics)
    );


    displayHistory();

    displayStatistics();

}


/* =========================================
   DISPLAY HISTORY
========================================= */

function displayHistory() {

    historyList.innerHTML = "";


    if (conversionHistory.length === 0) {

        const emptyItem =
            document.createElement("li");

        emptyItem.className =
            "empty-history";

        emptyItem.innerText =
            "No conversions yet";

        historyList.appendChild(emptyItem);

        return;
    }


    conversionHistory.forEach(function (conversion) {

        const listItem =
            document.createElement("li");

        listItem.innerText = conversion;

        historyList.appendChild(listItem);

    });

}


/* =========================================
   DISPLAY STATISTICS
========================================= */

function displayStatistics() {

    totalConversions.innerText =
        statistics.total;

    highestValue.innerText =
        statistics.highest;

    lastUnit.innerText =
        statistics.lastUnit;

}


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryButton.addEventListener(
    "click",
    function () {

        conversionHistory = [];

        statistics = {

            total: 0,

            highest: 0,

            lastUnit: "--"

        };


        localStorage.removeItem(
            "weightHistory"
        );

        localStorage.removeItem(
            "weightStatistics"
        );


        displayHistory();

        displayStatistics();

    }
);


/* =========================================
   COPY RESULT
========================================= */

copyButton.addEventListener(
    "click",
    async function () {

        const text =
            weightFormula.innerText;


        if (!text) {

            return;

        }


        try {

            await navigator.clipboard.writeText(text);

            copyButton.innerText =
                "✅ Copied!";


            setTimeout(function () {

                copyButton.innerText =
                    "📋 Copy Result";

            }, 1500);

        }
        catch (error) {

            copyButton.innerText =
                "Copy not available";

        }

    }
);


/* =========================================
   BMI CALCULATOR
========================================= */

calculateBMI.addEventListener(
    "click",
    function () {

        const weight =
            Number(bmiWeight.value);

        const height =
            Number(bmiHeight.value);


        // Validation

        if (
            bmiWeight.value === "" ||
            bmiHeight.value === "" ||
            isNaN(weight) ||
            isNaN(height) ||
            weight <= 0 ||
            height <= 0
        ) {

            bmiError.innerText =
                "Please enter valid weight and height.";

            bmiValue.innerText = "--";

            bmiCategory.innerText =
                "Enter your details";

            bmiMessage.innerText = "";

            return;

        }


        // Convert height from cm to metres

        const heightInMetres =
            height / 100;


        // BMI formula

        const bmi =
            weight /
            (heightInMetres * heightInMetres);


        const roundedBMI =
            bmi.toFixed(1);


        bmiError.innerText = "";


        bmiValue.innerText =
            roundedBMI;


        /*
            Adult reference categories:

            Below 18.5 = Underweight
            18.5 - 24.9 = Healthy range
            25 - 29.9 = Overweight
            30+ = Obesity
        */


        if (bmi < 18.5) {

            bmiCategory.innerText =
                "Adult reference: Underweight";

            bmiMessage.innerText =
                "This is an adult BMI reference category.";

        }
        else if (bmi < 25) {

            bmiCategory.innerText =
                "Adult reference: Healthy range";

            bmiMessage.innerText =
                "This falls within the adult healthy BMI reference range.";

        }
        else if (bmi < 30) {

            bmiCategory.innerText =
                "Adult reference: Overweight";

            bmiMessage.innerText =
                "This falls within the adult overweight BMI reference range.";

        }
        else {

            bmiCategory.innerText =
                "Adult reference: Obesity";

            bmiMessage.innerText =
                "This falls within the adult obesity BMI reference range.";

        }


        bmiResultCard.classList.remove("show");

        void bmiResultCard.offsetWidth;

        bmiResultCard.classList.add("show");

    }
);


/* =========================================
   CLEAR BMI
========================================= */

clearBMI.addEventListener(
    "click",
    function () {

        bmiWeight.value = "";

        bmiHeight.value = "";

        bmiValue.innerText = "--";

        bmiCategory.innerText =
            "Enter your details";

        bmiMessage.innerText = "";

        bmiError.innerText = "";

    }
);


/* =========================================
   DARK MODE
========================================= */

darkMode.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            darkMode.innerText =
                "☀ Light Mode";

            localStorage.setItem(
                "darkMode",
                "on"
            );

        }
        else {

            darkMode.innerText =
                "🌙 Dark Mode";

            localStorage.setItem(
                "darkMode",
                "off"
            );

        }

    }
);


/* =========================================
   GLITCH MODE
========================================= */

glitchMode.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("glitch");


        if (
            document.body.classList.contains("glitch")
        ) {

            glitchMode.innerText =
                "⚡ Glitch ON";

        }
        else {

            glitchMode.innerText =
                "⚡ Glitch Mode";

        }

    }
);


/* =========================================
   ENTER KEY
========================================= */

weightInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            convertButton.click();

        }

    }
);


bmiWeight.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            calculateBMI.click();

        }

    }
);


bmiHeight.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            calculateBMI.click();

        }

    }
);


/* =========================================
   LOAD SAVED DATA
========================================= */

displayHistory();

displayStatistics();


if (
    localStorage.getItem("darkMode") === "on"
) {

    document.body.classList.add("dark");

    darkMode.innerText =
        "☀ Light Mode";

}