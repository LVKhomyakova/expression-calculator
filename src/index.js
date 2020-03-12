function eval() {
    // Do not use eval!!!
    return;
}

const OPERATIONS = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
}

function parse(expr)
{
    let parsedExpression = expr.match(/[0-9.]+|[-+*/^]{1}|[()]{1}|[a-z]+/gi);
    return parsedExpression;
}

function expressionCalculator(expr) {
    var calculateStack = [];
    var parsedExpression = parse(expr); 
    var expressionPart = [];
    if (parsedExpression.includes('(')) //если выражение сложное (со скобками или сложными операциями)
    {
        for(let item of parsedExpression)
        {
            let currentValue = item;
            if (currentValue === ')')
            {
                while ( currentValue !== '(' )
                {
                    expressionPart.push(currentValue);
                    currentValue = calculateStack.pop();
                    if(calculateStack.length === 'undefined') throw new Error('ExpressionError: Brackets must be paired');
                }
                expressionPart.reverse();
                expressionPart.pop();
                calculateStack.push(decodeRPR(codeRPR(expressionPart)));
                expressionPart = [];
            }
            else
            {
                calculateStack.push(item);
            }
        }
    }
    else  //если выражение простое без скобок и сложных операций
    {
        calculateStack.push(decodeRPR(codeRPR(parsedExpression)));
    }
    if (calculateStack.length > 1) //если в начале была префиксная операция, необходимо доп. решение
    {
        while (calculateStack.length != 0)
            expressionPart.push(calculateStack.pop());
        expressionPart.reverse();
        calculateStack.push(decodeRPR(codeRPR(expressionPart)));
        expressionPart = [];
    }
    return calculateStack.pop();
}

function codeRPR(expr){
    var reversePolishRecord = [];
    var operandsStack = [];

    for(let item of expr){
        if (Number(item) || Number(item) === 0){
            reversePolishRecord.push(item);
        }
        else{
            if (operandsStack.length === 0 || OPERATIONS[operandsStack[operandsStack.length - 1]] < OPERATIONS[item]){
                operandsStack.push(item);
            }
            else{             
                while (operandsStack.length > 0){
                    if (OPERATIONS[operandsStack[operandsStack.length - 1]] >= OPERATIONS[item])
                        reversePolishRecord.push(operandsStack.pop());
                    else
                        break;
                }
                operandsStack.push(item);
            }
        }
    }
    while (operandsStack.length > 0){
        let operation = operandsStack.pop();
        if(operation === '(' || operation === ')') throw new Error('ExpressionError: Brackets must be paired');
        reversePolishRecord.push(operation);
    }
    return reversePolishRecord;
}

function decodeRPR(exprRPR){
    var stackValues = [];
    for(let item of exprRPR){
        let leftOperand = 0.0;
        let rightOperand = NaN;
        let operation = '';
        if (Number(item) || Number(item) === 0){
            stackValues.push(item);
        }
        else{
            operation = item;
            rightOperand = stackValues.pop();
            if (operation !== 'sqrt' && operation !== 'lg'){
                if (stackValues.length > 0)
                    leftOperand =stackValues.pop();
            }
            stackValues.push(doOperation(leftOperand, rightOperand, operation));
        }
    }
    return stackValues.pop();
}

function doOperation(leftOperand, rightOperand, operation){
    leftOperand = Number(leftOperand);
    rightOperand = Number(rightOperand);
    switch (operation){
        case '+':
            return leftOperand + rightOperand;
        case '-':
            return leftOperand - rightOperand;
        case '*':
            return leftOperand * rightOperand;
        case '/':
            if(rightOperand === 0) 
                throw new Error("TypeError: Division by zero.");
            else
                return leftOperand / rightOperand;
        default:
            return NaN;
    }
}

module.exports = {
    expressionCalculator
}