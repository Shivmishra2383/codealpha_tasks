const previousDisplay = document.getElementById('previous');
const currentDisplay = document.getElementById('current');
const buttonsGrid = document.querySelector('.buttons');

let lastResult = null; 
currentDisplay.value = ' 0';
currentDisplay.focus();

        
function cleanExpression(expression) {
    return expression
        .replace(/x/g, '*') 
        .replace(/÷/g, '/')
        .replace(/%/g, '/100'); 
}

//----Input Value----

function insertAtCursor(value) {
    currentDisplay.focus();
    const start = currentDisplay.selectionStart;
    const end = currentDisplay.selectionEnd;
    let current = currentDisplay.value;

    if (current === '0' && start === 0 && end === 1 && value !== '.') {
        currentDisplay.value = value;
    } else {
        currentDisplay.value = current.substring(0, start) + value + current.substring(end);
    }
    currentDisplay.setSelectionRange(start + value.length, start + value.length);
}

//-----Calculation-----

function calculate() {
    let expression = currentDisplay.value;
    if (expression.trim() === '' || expression === 'Error') return;
    try {
        const cleanExp = cleanExpression(expression);
        
        let result = eval(cleanExp);

        result = Math.round(result * 1000000) / 1000000;
        
        previousDisplay.textContent = expression + ' =';
        currentDisplay.value = result.toString();
        lastResult = result.toString(); 
        
    } catch (e) {
        previousDisplay.textContent = expression + ' =';
        currentDisplay.value = "Error";
    }
    currentDisplay.setSelectionRange(currentDisplay.value.length, currentDisplay.value.length);
}

//------Clear-----

function clearAll() {
    currentDisplay.value = ' ';
    previousDisplay.textContent = '';
    currentDisplay.setSelectionRange(1, 1);
}

//-----Delete-----

function deleteLast() {
    let current = currentDisplay.value;
    const start = currentDisplay.selectionStart;
    const end = currentDisplay.selectionEnd;

    if (current === 'Error') {
        currentDisplay.value = '0';
    } else if (start !== end) {
        currentDisplay.value = current.substring(0, start) + current.substring(end);
        currentDisplay.setSelectionRange(start, start);
    } else if (start > 0) {
        currentDisplay.value = current.substring(0, start - 1) + current.substring(start);
        currentDisplay.setSelectionRange(start - 1, start - 1);
    }
            
    if (currentDisplay.value === '') {
        currentDisplay.value = '0';
        currentDisplay.setSelectionRange(1, 1);
    }
    currentDisplay.focus();
}

//-----Delete-----

function applySquareRoot() {
    let current = currentDisplay.value;
    try {
        const cleanExp = cleanExpression(current);
        const num = eval(cleanExp);
        
        if (num < 0) {
            currentDisplay.value = "Error: Imaginary";
        } else {
            let result = Math.sqrt(num);
            // Round the result
            currentDisplay.value = Math.round(result * 1000000) / 1000000;
        }
    } catch (e) {
        currentDisplay.value = "Error";
    }
    currentDisplay.setSelectionRange(currentDisplay.value.length, currentDisplay.value.length);
}

//------Cursor------
        
function changeSign() {
    let current = currentDisplay.value;
    if (current === '0' || current === 'Error') return;

    if (!isNaN(parseFloat(current))) {
        currentDisplay.value = (parseFloat(current) * -1).toString();
    } else {
        if (current.startsWith('-(') && current.endsWith(')')) {
             currentDisplay.value = current.slice(2, -1);
        } else {
             currentDisplay.value = '-(' + current + ')';
        }
    }
    currentDisplay.setSelectionRange(currentDisplay.value.length, currentDisplay.value.length);
}

//------Answer------

function useAnswer() {
    if (lastResult !== null) {
        insertAtCursor(lastResult);
    }
    else{
        alert("Invalid Value")
    }
}

// --- Event Listener for All Buttons ---

buttonsGrid.addEventListener('click', (e) => {
    const button = e.target.closest('button');

    if (!button) return;
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) {
        insertAtCursor(value);
    } else if (action) {
        switch (action) {
            case 'ans':
                useAnswer();
                break;
            case 'del':
                deleteLast();
                break;
            case 'clear':
                clearAll();
                break;
            case 'sqrt':
                applySquareRoot();
                break;
            case 'changeSign':
                changeSign();
                break;
            case 'calculate':
                calculate();
                break;
        }
    }
});

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === 'Enter' || key === '=') {
        e.preventDefault(); 
        calculate();
    } else if (key === 'Backspace') {
        e.preventDefault(); 
        deleteLast();
    } else if (key === 'c' || key === 'C') {
        clearAll();
    }
});
        
currentDisplay.focus();


