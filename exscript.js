// Define colors for squares
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

// Initialize game state
let selectedColumn = 1; // Default selected column
let selectedSquare = null; // Currently selected square

// Function to create a new square
function createSquare(color) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.backgroundColor = color;
    return square;
}

// Function to initialize columns with squares
function initializeColumns() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        const numSquares = Math.floor(Math.random() * 5) + 1; // Random number of squares (1-5)
        for (let i = 0; i < numSquares; i++) {
            const colorIndex = Math.floor(Math.random() * colors.length);
            const square = createSquare(colors[colorIndex]);
            column.appendChild(square);
        }
    });
}

// Function to handle key events
function handleKeyPress(event) {
    const key = event.key;
    const columns = document.querySelectorAll('.column');
    const numColumns = columns.length;
    
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
        // Move selection left or right
        selectedColumn += (key === 'ArrowLeft') ? -1 : 1;
        if (selectedColumn < 1) selectedColumn = numColumns;
        if (selectedColumn > numColumns) selectedColumn = 1;
        updateSelection();
    } else if (key === 'ArrowUp') {
        // Pick up the top square in the selected column
        const selectedColumnDiv = columns[selectedColumn - 1];
        selectedSquare = selectedColumnDiv.lastElementChild;
        if (selectedSquare) {
            selectedColumnDiv.removeChild(selectedSquare);
        }
    } else if (key === 'ArrowDown') {
        // Drop the selected square into the selected column
        if (selectedSquare) {
            columns[selectedColumn - 1].appendChild(selectedSquare);
            selectedSquare = null;
        }
    }
}

// Function to update visual indicator of selection
function updateSelection() {
    const columns = document.querySelectorAll('.column');
    columns.forEach((column, index) => {
        if (index === selectedColumn - 1) {
            column.style.border = '2px solid blue';
        } else {
            column.style.border = '1px solid #ccc';
        }
    });
}

// Initialize the game
initializeColumns();
updateSelection();

// Listen for key events
document.addEventListener('keydown', handleKeyPress);
