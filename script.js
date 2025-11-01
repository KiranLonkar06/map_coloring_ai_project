// script.js — full corrected version

let selectedColor = null;
// Save chosen colors for each region
let regionColors = {};

// Adjacency graph
const adjacency = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "D"],
  D: ["B", "C", "E"],
  E: ["B", "D"]
};

// Hook up color buttons
document.querySelectorAll(".color-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedColor = btn.dataset.color;
    document.getElementById("currentColor").textContent = selectedColor;
  });
});

// Apply color to region on click
document.querySelectorAll("#map path").forEach(region => {
  region.addEventListener("click", () => {
    if (!selectedColor) return;

    region.style.fill = selectedColor;
    regionColors[region.id] = selectedColor;

    // Remove any previous conflict highlight for this region (re-check will add if still conflict)
    region.classList.remove("conflict");

    checkGameStatus();
  });
});

// Restart button wiring (make sure your HTML has id="restartBtn")
document.getElementById("restartBtn").addEventListener("click", restartGame);

// Restart function: reset UI and internal state
function restartGame() {
  // Reset all regions to default color and remove conflict highlight
  document.querySelectorAll("#map path").forEach(region => {
    region.style.fill = "#eee";
    region.classList.remove("conflict");
  });

  // Reset selected color text and internal state
  regionColors = {};
  selectedColor = null;
  document.getElementById("currentColor").textContent = "None";
  document.getElementById("message").textContent = "";

  // Hide result image and restore map visibility (in case it was hidden)
  const resultImg = document.getElementById("resultImg");
  if (resultImg) {
    resultImg.style.display = "none";
    resultImg.src = "";
  }
  const mapWrapper = document.querySelector(".map-wrapper");
  if (mapWrapper) {
    mapWrapper.style.display = "block";
    // ensure opacity set back to 1 (in case it was faded)
    mapWrapper.style.opacity = "1";
  }
}

// showResult: fade out map and show the win/lose image
function showResult(success) {
  const map = document.querySelector(".map-wrapper");
  const img = document.getElementById("resultImg");

  // Defensive checks
  if (!img) return;

  // Fade out map (requires CSS transition on .map-wrapper)
  if (map) {
    map.style.opacity = "0";
    // after fade completes, hide map and show image
    setTimeout(() => {
      map.style.display = "none";
      img.src = success ? "images/win.png" : "images/lose.png";
      img.style.display = "block";
      // optional: animate the image (CSS keyframes or small JS transform)
      img.style.transform = "scale(0.95)";
      img.style.opacity = "0";
      requestAnimationFrame(() => {
        img.style.transition = "transform 400ms ease, opacity 400ms ease";
        img.style.transform = "scale(1)";
        img.style.opacity = "1";
      });
    }, 700); // match CSS transition duration for .map-wrapper (700ms)
  } else {
    // If no wrapper found, just show image
    img.src = success ? "images/win.png" : "images/lose.png";
    img.style.display = "block";
  }
}

// Check if all regions are colored then evaluate result
function checkGameStatus() {
  // only proceed when all regions are filled
  if (!allColored()) return;

  // Clear previous conflict highlights
  document.querySelectorAll("#map path").forEach(r => r.classList.remove("conflict"));

  const conflict = hasConflict();

  const messageEl = document.getElementById("message");
  if (conflict) {
    messageEl.textContent = "❌ Wrong coloring! Adjacent regions have same color.";
    showResult(false);
  } else {
    messageEl.textContent = "✅ Perfect! All regions colored correctly.";
    showResult(true);
  }
}

// Check that every region has been assigned a color
function allColored() {
  // Count how many regions there are in the SVG
  const totalRegions = document.querySelectorAll("#map path").length;
  return Object.keys(regionColors).length === totalRegions;
}

// these is for the hint button
// Save current map state and redirect to hint.html
document.getElementById("hintBtn").addEventListener("click", () => {
  // Optional: persist current map colors so hint page can read them
  try {
    localStorage.setItem('mapState', JSON.stringify(regionColors || {}));
  } catch (e) {
    console.warn("Could not save mapState to localStorage", e);
  }

  // Redirect to hint/instruction page
  window.location.href = "hint.html";
});


// these is for the view demo button
function startAutoSolve() {
  const steps = [
    { id: "A", color: "red", text: "Step 1: Region A → Red (starting point)" },
    { id: "B", color: "blue", text: "Step 2: Region B → Blue (touches A, so must be different)" },
    { id: "C", color: "yellow", text: "Step 3: Region C → Yellow (touches A, safe)" },
    { id: "D", color: "green", text: "Step 4: Region D → Green (avoiding conflicts with B & C)" },
    { id: "E", color: "red", text: "Step 5: Region E → Red (valid color, no conflicts)" }
  ];

  const msg = document.getElementById("message");
  let i = 0;

  function paintNext() {
    if (i >= steps.length) {
      msg.innerText = "✅ Auto-solve completed!";
      return;
    }

    const s = steps[i];
    const region = document.getElementById(s.id);
    region.style.transition = "fill 0.5s";
    regionColors[s.id] = s.color;

    region.style.fill = s.color;

    msg.innerText = s.text;
    i++;

    setTimeout(paintNext, 1000);  // wait 1 second before next move
  }

  msg.innerText = "🔍 Auto-solve started...";
  setTimeout(paintNext, 800);
 }

// ✅ Run auto-solve if flag exists
  window.addEventListener("load", () => {
    const auto = localStorage.getItem("autoSolve");
    if (auto === "true") {
      localStorage.removeItem("autoSolve"); // clear so it doesn't repeat forever
      startAutoSolve();
    }
  });

function startAutoSolve() {
  const steps = [
    { id: "A", color: "red", text: "Step 1: Region A → Red (starting point)" },
    { id: "B", color: "blue", text: "Step 2: Region B → Blue (touches A, so must be different)" },
    { id: "C", color: "yellow", text: "Step 3: Region C → Yellow (touches A, safe)" },
    { id: "D", color: "green", text: "Step 4: Region D → Green (avoiding conflicts with B & C)" },
    { id: "E", color: "red", text: "Step 5: Region E → Red (valid color, no conflicts)" }
  ];

  const msg = document.getElementById("message");
  let i = 0;

  function paintNext() {
    if (i >= steps.length) {
      msg.innerText = "✅ Auto-solve completed!";
      return;
    }

    const s = steps[i];
    const region = document.getElementById(s.id);

    region.style.transition = "fill 0.5s";
    region.style.fill = s.color;
    regionColors[s.id] = s.color;   // ✅ update internal state

    msg.innerText = s.text;
    i++;

    setTimeout(paintNext, 1000);
  }

  msg.innerText = "🔍 Auto-solve started...";
  setTimeout(paintNext, 800);
}


// Check adjacency for conflicts; mark conflict regions with .conflict class
function hasConflict() {
  let conflictFound = false;

  for (let region in adjacency) {
    const rColor = regionColors[region];
    if (!rColor) continue; // skip uncolored regions

    adjacency[region].forEach(neighbor => {
      const nColor = regionColors[neighbor];
      if (!nColor) return;
      if (rColor === nColor) {
        conflictFound = true;
        // add highlight for both regions (id must exist in DOM)
        const rEl = document.getElementById(region);
        const nEl = document.getElementById(neighbor);
        if (rEl) rEl.classList.add("conflict");
        if (nEl) nEl.classList.add("conflict");
      }
    });
  }

  return conflictFound;
}
window.addEventListener("load", () => {
  const auto = localStorage.getItem("autoSolve");
  if (auto === "true") {
    localStorage.removeItem("autoSolve");
    startAutoSolve();
  }
});
