let selectedColor = null;

// Region adjacency list (CSP graph)
const adjacency = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "D"],
  D: ["B", "C", "E"],
  E: ["B", "D"]
};

// set selected color
document.querySelectorAll(".color-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedColor = btn.dataset.color;
    document.getElementById("currentColor").textContent = selectedColor;
  });
});
document.getElementById("hintBtn").addEventListener("click", giveHint);

function giveHint() {
    // Find an uncolored square
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!colors[i][j]) { // uncolored cell
                let validColor = findValidColor(i, j);
                if (validColor) {
                    colors[i][j] = validColor;
                    drawGrid();
                    return;
                }
            }
        }
    }

    alert("No more hints available!");
}

// Check if a color is valid
function findValidColor(r, c) {
    let usedColors = new Set();

    let neighbors = [
        [r-1, c], [r+1, c], [r, c-1], [r, c+1],
    ];

    neighbors.forEach(([x, y]) => {
        if (x >= 0 && y >= 0 && x < gridSize && y < gridSize && colors[x][y]) {
            usedColors.add(colors[x][y]);
        }
    });

    return colorOptions.find(col => !usedColors.has(col));
}

// attach click event to each region
document.querySelectorAll("#map path").forEach(region => {
  region.addEventListener("click", () => {
    if (!selectedColor) return;

    region.style.fill = selectedColor;
    checkConflicts();
  });
});

// validate no two adjacent share same color
function checkConflicts() {
  document.getElementById("message").textContent = "";

  let conflictFound = false;

  for (let region in adjacency) {
    let regionColor = document.getElementById(region).style.fill;

    adjacency[region].forEach(neighbor => {
      let neighborColor = document.getElementById(neighbor).style.fill;

      // reset borders
      document.getElementById(region).classList.remove("conflict");
      document.getElementById(neighbor).classList.remove("conflict");

      if (regionColor && neighborColor && regionColor === neighborColor) {
        conflictFound = true;
        document.getElementById(region).classList.add("conflict");
        document.getElementById(neighbor).classList.add("conflict");
      }
    });
  }

  if (conflictFound) {
    document.getElementById("message").textContent = "❌ Conflict! Two adjacent regions have same color.";
  } else {
    document.getElementById("message").textContent = "✅ No conflicts!";
  }
}
