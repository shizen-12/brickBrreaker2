const SIZE = 16;
const MAX_COUNT = 5;
let grid = Array(SIZE)
    .fill()
    .map(() => Array(SIZE).fill(0));
let colors = ["white", "white", "white", "white", "white", "white"];

window.onload = function () {
    const gridElement = document.getElementById("grid");
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const button = document.createElement("button");
            button.style.width = "32px";
            button.style.height = "32px";
            button.innerText = "0";
            button.onclick = function () {
                grid[i][j] = (grid[i][j] + 1) % (MAX_COUNT + 1);
                button.innerText = String(grid[i][j]);
                button.style.backgroundColor = colors[grid[i][j]];
            };
            gridElement.appendChild(button);
        }
        gridElement.appendChild(document.createElement("br"));
    }

    const confirmButton = document.getElementById("confirm");
    confirmButton.onclick = function () {
        const outputText = `color1 = "${colors[1]}";\ncolor2 = "${colors[2]}";\ncolor3 = "${
            colors[3]
        }";\ncolor4 = "${colors[4]}";\ncolor5 = "${colors[5]}";\n\nbrickArray = ${JSON.stringify(
            grid,
            null,
            2
        )};`;
        const outputElement = document.getElementById("output");
        outputElement.innerText = outputText;
        navigator.clipboard.writeText(outputText);
    };

    for (let i = 1; i <= MAX_COUNT; i++) {
        const colorInput = document.getElementById(`color${i}`);
        colorInput.onchange = function () {
            colors[i] = colorInput.value;
        };
    }
};
