class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && operation === '-') {
            this.currentOperand = '-';
            this.updateDisplay();
            return;
        }
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.currentOperand === '-' || this.currentOperand === '.') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        // Limit decimal places to avoid floating point issues and display overflow
        computation = Math.round(computation * 100000000) / 100000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        if (number === '-') return '-';
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        // Dynamic font sizing based on length
        const currentLength = this.currentOperand.toString().length;
        if (currentLength > 12) {
            this.currentOperandElement.style.fontSize = '1.5rem';
        } else if (currentLength > 8) {
            this.currentOperandElement.style.fontSize = '2rem';
        } else {
            this.currentOperandElement.style.fontSize = '2.5rem';
        }

        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            const content = button.innerText;

            switch (action) {
                case 'number':
                    calculator.appendNumber(content);
                    calculator.updateDisplay();
                    break;
                case 'operator':
                    calculator.chooseOperation(content);
                    calculator.updateDisplay();
                    break;
                case 'calculate':
                    calculator.compute();
                    calculator.updateDisplay();
                    break;
                case 'clear':
                    calculator.clear();
                    calculator.updateDisplay();
                    break;
                case 'delete':
                    calculator.delete();
                    calculator.updateDisplay();
                    break;
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', e => {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
        }
        if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault();
            calculator.compute();
            calculator.updateDisplay();
        }
        if (e.key === 'Backspace') {
            calculator.delete();
            calculator.updateDisplay();
        }
        if (e.key === 'Escape') {
            calculator.clear();
            calculator.updateDisplay();
        }
        if (e.key === '+' || e.key === '-' || e.key === '%' || e.key === '*') {
            calculator.chooseOperation(e.key === '*' ? '×' : e.key);
            calculator.updateDisplay();
        }
        if (e.key === '/') {
            e.preventDefault();
            calculator.chooseOperation('÷');
            calculator.updateDisplay();
        }
    });
});
