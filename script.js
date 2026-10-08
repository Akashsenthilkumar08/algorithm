// =====================================================
// LCS TEXT SIMILARITY VISUALIZER
// =====================================================

console.log("LCS Lab JavaScript loaded successfully.");


// =====================================================
// DOM ELEMENTS
// =====================================================

const text1 =
    document.getElementById("text1");

const text2 =
    document.getElementById("text2");

const count1 =
    document.getElementById("count1");

const count2 =
    document.getElementById("count2");

const matrixContainer =
    document.getElementById("matrixContainer");

const lcsLength =
    document.getElementById("lcsLength");

const similarity =
    document.getElementById("similarity");

const matrixSize =
    document.getElementById("matrixSize");

const lcsResult =
    document.getElementById("lcsResult");

const scoreValue =
    document.getElementById("scoreValue");

const scoreBar =
    document.getElementById("scoreBar");

const statusText =
    document.getElementById("statusText");

const speedMode =
    document.getElementById("speedMode");

const ignoreSpaces =
    document.getElementById("ignoreSpaces");

const ignoreCase =
    document.getElementById("ignoreCase");


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let dp = [];

let originalA = "";
let originalB = "";

let processedA = "";
let processedB = "";

let isRunning = false;

let stepI = 1;
let stepJ = 1;


// =====================================================
// CHARACTER COUNTER
// =====================================================

function updateCounts() {

    count1.textContent =
        text1.value.length;

    count2.textContent =
        text2.value.length;
}


text1.addEventListener(
    "input",
    updateCounts
);

text2.addEventListener(
    "input",
    updateCounts
);


// =====================================================
// TEXT PROCESSING
// =====================================================

function processText(text) {

    let result = text;

    if (ignoreSpaces.checked) {

        result =
            result.replace(/\s/g, "");

    }

    if (ignoreCase.checked) {

        result =
            result.toLowerCase();

    }

    return result;
}


// =====================================================
// CREATE MATRIX UI
// =====================================================

function createMatrix() {

    processedA =
        processText(originalA);

    processedB =
        processText(originalB);


    const A = processedA;
    const B = processedB;


    const table =
        document.createElement("table");

    table.id = "matrix";


    // HEADER
    const header =
        document.createElement("tr");


    const empty =
        document.createElement("th");

    empty.textContent = "";

    header.appendChild(empty);


    const zeroHeader =
        document.createElement("th");

    zeroHeader.textContent = "0";

    header.appendChild(zeroHeader);


    for (let j = 0; j < B.length; j++) {

        const th =
            document.createElement("th");

        th.textContent =
            B[j];

        header.appendChild(th);

    }


    table.appendChild(header);


    // ROWS
    for (let i = 0; i <= A.length; i++) {

        const row =
            document.createElement("tr");


        const rowHeader =
            document.createElement("th");


        if (i === 0) {

            rowHeader.textContent = "0";

        } else {

            rowHeader.textContent =
                A[i - 1];

        }


        row.appendChild(rowHeader);


        for (
            let j = 0;
            j <= B.length;
            j++
        ) {

            const cell =
                document.createElement("td");


            cell.id =
                `cell-${i}-${j}`;


            cell.textContent =
                "0";


            row.appendChild(cell);

        }


        table.appendChild(row);

    }


    matrixContainer.innerHTML = "";

    matrixContainer.appendChild(table);

}


// =====================================================
// BUILD DP MATRIX
// =====================================================
//
// IMPORTANT:
//
// The actual LCS calculation happens immediately.
// Only the visualization is animated.
//
// Therefore the algorithm remains fast.
// =====================================================

function calculateDP() {

    const A = processedA;
    const B = processedB;


    dp = Array.from(
        {
            length: A.length + 1
        },

        () =>
            Array(
                B.length + 1
            ).fill(0)
    );


    for (
        let i = 1;
        i <= A.length;
        i++
    ) {

        for (
            let j = 1;
            j <= B.length;
            j++
        ) {

            if (
                A[i - 1] ===
                B[j - 1]
            ) {

                dp[i][j] =
                    dp[i - 1][j - 1] + 1;

            } else {

                dp[i][j] =
                    Math.max(
                        dp[i - 1][j],
                        dp[i][j - 1]
                    );

            }

        }

    }

}


// =====================================================
// GET VISUALIZATION SPEED
// =====================================================

function getSpeed() {

    switch (speedMode.value) {

        case "instant":

            return 0;

        case "fast":

            return 15;

        case "normal":

            return 80;

        case "slow":

            return 250;

        default:

            return 15;

    }

}


// =====================================================
// WAIT
// =====================================================

function wait(ms) {

    if (ms === 0) {

        return Promise.resolve();

    }

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


// =====================================================
// UPDATE ONE MATRIX CELL
// =====================================================

async function showCell(
    i,
    j
) {

    const cell =
        document.getElementById(
            `cell-${i}-${j}`
        );


    if (!cell) return;


    cell.textContent =
        dp[i][j];


    cell.classList.add(
        "current"
    );


    const A =
        processedA[i - 1];

    const B =
        processedB[j - 1];


    if (A === B) {

        statusText.textContent =
            `✓ Match: "${A}" = "${B}" → diagonal + 1`;

        cell.classList.add(
            "match"
        );

    } else {

        statusText.textContent =
            `Compare "${A}" and "${B}" → maximum(top, left)`;

    }


    await wait(
        getSpeed()
    );


    cell.classList.remove(
        "current"
    );

}


// =====================================================
// ANIMATE ENTIRE MATRIX
// =====================================================

async function animateMatrix() {

    const A =
        processedA;

    const B =
        processedB;


    for (
        let i = 1;
        i <= A.length;
        i++
    ) {

        for (
            let j = 1;
            j <= B.length;
            j++
        ) {

            await showCell(
                i,
                j
            );

        }

    }

}


// =====================================================
// BACKTRACK LCS
// =====================================================

async function backtrack() {

    let i =
        processedA.length;

    let j =
        processedB.length;


    let result = "";


    statusText.textContent =
        "↙ Backtracking through DP matrix...";


    while (
        i > 0 &&
        j > 0
    ) {

        const cell =
            document.getElementById(
                `cell-${i}-${j}`
            );


        if (
            processedA[i - 1] ===
            processedB[j - 1]
        ) {

            result =
                originalCharacter(
                    processedA[i - 1]
                ) + result;


            cell.classList.remove(
                "match"
            );


            cell.classList.add(
                "path"
            );


            statusText.textContent =
                `✓ "${processedA[i - 1]}" belongs to the LCS`;


            i--;
            j--;


        } else if (
            dp[i - 1][j] >=
            dp[i][j - 1]
        ) {

            cell.classList.add(
                "path"
            );


            statusText.textContent =
                "↑ Moving to the larger value above";


            i--;


        } else {

            cell.classList.add(
                "path"
            );


            statusText.textContent =
                "← Moving to the larger value on the left";


            j--;

        }


        await wait(
            speedMode.value ===
                "instant"
                ? 0
                : 80
        );

    }


    return result;

}


// =====================================================
// CHARACTER DISPLAY
// =====================================================

function originalCharacter(
    char
) {

    return char;

}


// =====================================================
// SHOW FINAL RESULT
// =====================================================

function showResult(
    result
) {

    const A =
        processedA;

    const B =
        processedB;


    lcsResult.textContent =
        result ||
        "No common subsequence";


    const length =
        result.length;


    const maxLength =
        Math.max(
            A.length,
            B.length
        );


    let percentage;


    if (maxLength === 0) {

        percentage = 100;

    } else {

        percentage =
            Math.round(
                (length /
                    maxLength) *
                100
            );

    }


    lcsLength.textContent =
        length;


    similarity.textContent =
        `${percentage}%`;


    scoreValue.textContent =
        `${percentage}%`;


    scoreBar.style.width =
        `${percentage}%`;


    statusText.textContent =
        `✓ Complete — LCS: "${result}"`;

}


// =====================================================
// RUN LCS
// =====================================================

async function startVisualization() {

    if (isRunning) {

        return;

    }


    originalA =
        text1.value;

    originalB =
        text2.value;


    if (
        !originalA ||
        !originalB
    ) {

        statusText.textContent =
            "⚠ Please enter both texts.";

        return;

    }


    isRunning = true;


    // Reset result
    lcsLength.textContent =
        "—";

    similarity.textContent =
        "—";

    matrixSize.textContent =
        "—";

    lcsResult.textContent =
        "Calculating...";

    scoreValue.textContent =
        "0%";

    scoreBar.style.width =
        "0%";


    // Process
    processedA =
        processText(
            originalA
        );

    processedB =
        processText(
            originalB
        );


    // Empty after processing
    if (
        processedA.length === 0 ||
        processedB.length === 0
    ) {

        statusText.textContent =
            "⚠ Text becomes empty after processing.";

        isRunning = false;

        return;

    }


    // Matrix size
    matrixSize.textContent =
        `${processedA.length + 1} × ${processedB.length + 1}`;


    // Calculate FIRST
    // This is instant
    calculateDP();


    // Create visual matrix
    createMatrix();


    // Instant mode
    if (
        speedMode.value ===
        "instant"
    ) {

        fillMatrixInstant();

        const result =
            getLCSDirect();

        showResult(
            result
        );

        highlightBacktrackInstant();

        isRunning = false;

        return;

    }


    // Animated mode
    statusText.textContent =
        "Building DP matrix...";


    await animateMatrix();


    statusText.textContent =
        "✓ Matrix complete. Starting backtracking...";


    await wait(300);


    const result =
        await backtrack();


    showResult(
        result
    );


    isRunning = false;

}


// =====================================================
// INSTANT MATRIX
// =====================================================

function fillMatrixInstant() {

    for (
        let i = 0;
        i <= processedA.length;
        i++
    ) {

        for (
            let j = 0;
            j <= processedB.length;
            j++
        ) {

            const cell =
                document.getElementById(
                    `cell-${i}-${j}`
                );


            if (cell) {

                cell.textContent =
                    dp[i][j];

            }

        }

    }

}


// =====================================================
// DIRECT LCS
// =====================================================

function getLCSDirect() {

    let i =
        processedA.length;

    let j =
        processedB.length;


    let result = "";


    while (
        i > 0 &&
        j > 0
    ) {

        if (
            processedA[i - 1] ===
            processedB[j - 1]
        ) {

            result =
                processedA[i - 1] +
                result;

            i--;
            j--;

        } else if (
            dp[i - 1][j] >=
            dp[i][j - 1]
        ) {

            i--;

        } else {

            j--;

        }

    }


    return result;

}


// =====================================================
// INSTANT BACKTRACK HIGHLIGHT
// =====================================================

function highlightBacktrackInstant() {

    let i =
        processedA.length;

    let j =
        processedB.length;


    while (
        i > 0 &&
        j > 0
    ) {

        const cell =
            document.getElementById(
                `cell-${i}-${j}`
            );


        if (
            processedA[i - 1] ===
            processedB[j - 1]
        ) {

            cell.classList.add(
                "path"
            );

            i--;
            j--;

        } else if (
            dp[i - 1][j] >=
            dp[i][j - 1]
        ) {

            i--;

        } else {

            j--;

        }

    }

}


// =====================================================
// STEP MODE
// =====================================================

async function stepVisualization() {

    if (isRunning) {

        return;

    }


    const A =
        text1.value;

    const B =
        text2.value;


    if (
        !A ||
        !B
    ) {

        statusText.textContent =
            "⚠ Enter both texts first.";

        return;

    }


    originalA =
        A;

    originalB =
        B;


    processedA =
        processText(
            A
        );

    processedB =
        processText(
            B
        );


    // First click
    if (
        dp.length === 0
    ) {

        calculateDP();

        createMatrix();

        stepI = 1;

        stepJ = 1;


        matrixSize.textContent =
            `${processedA.length + 1} × ${processedB.length + 1}`;

    }


    // Matrix finished
    if (
        stepI >
        processedA.length
    ) {

        const result =
            getLCSDirect();

        highlightBacktrackInstant();

        showResult(
            result
        );

        return;

    }


    await showCell(
        stepI,
        stepJ
    );


    stepJ++;


    if (
        stepJ >
        processedB.length
    ) {

        stepJ = 1;

        stepI++;

    }

}


// =====================================================
// RESET
// =====================================================

function resetVisualization() {

    isRunning = false;

    dp = [];

    stepI = 1;

    stepJ = 1;


    lcsLength.textContent =
        "—";

    similarity.textContent =
        "—";

    matrixSize.textContent =
        "—";

    lcsResult.textContent =
        "—";

    scoreValue.textContent =
        "0%";

    scoreBar.style.width =
        "0%";


    statusText.textContent =
        "Ready. Enter two texts and run LCS.";


    matrixContainer.innerHTML = `

        <div class="matrix-placeholder">

            <div class="placeholder-icon">
                ⌘
            </div>

            <p>
                Enter two texts and run the algorithm
            </p>

        </div>

    `;

}


// =====================================================
// LOAD EXAMPLE
// =====================================================

function loadExample() {

    text1.value =
        "ABCDGH";

    text2.value =
        "AEDFHR";


    ignoreSpaces.checked =
        false;

    ignoreCase.checked =
        false;


    updateCounts();

    resetVisualization();

}


// =====================================================
// CHECKBOX CHANGE
// =====================================================

ignoreSpaces.addEventListener(
    "change",
    resetVisualization
);

ignoreCase.addEventListener(
    "change",
    resetVisualization
);


// =====================================================
// INITIALIZE
// =====================================================

updateCounts();


// Console message
console.log(
    "LCS Lab initialized."
);
