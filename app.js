/* copyright 2019 - ∞ Suraj, All rights reserved. */

// calculate determinant
let det = (matrixArr) => {
    let order = matrixArr.length;
    if (order > 1) {
      let row = 0;
      let value = 0;
      for (let col = 0; col < order; col++) {
        value +=
          matrixArr[row][col] *
          Math.pow(-1, col + row) *
          det(cofactor(matrixArr, row, col));
      }
      return value;
    } else if (order == 1) {
      return matrixArr[0][0];
    } else if (order < 1) {
      return null;
    }
  };
  
  // to create a matrix leaving 1 row and 1 col which is been passed
  let cofactor = (smallMatrixArr, row, col) => {
    let order = smallMatrixArr.length;
    if (order === 1) {
      return smallMatrixArr;
    }
    let newMatrix = [];
    for (let sRow = 0; sRow < order; sRow++) {
      if (row === sRow) {
        continue;
      } else {
        let tempRow = [];
        for (let sCol = 0; sCol < order; sCol++) {
          if (col === sCol) {
            continue;
          } else {
            tempRow.push(smallMatrixArr[sRow][sCol]);
          }
        }
        newMatrix.push(tempRow);
      }
    }
    return newMatrix;
  };
  
  let transpose = (matrixArr) => {
    const height = matrixArr.length;
    const width = matrixArr[0].length;
    let newMatrix = [];
    for (let row = 0; row < width; row++) {
      let tempRow = [];
      for (let col = 0; col < height; col++) {
        tempRow.push(matrixArr[col][row]);
      }
      newMatrix.push(tempRow);
    }
    return newMatrix;
  };
  
  let adjoint = (matrixArr) => {
    const height = matrixArr.length;
    const width = matrixArr[0].length;
    // if the matrix has only one element than its adjoint is always unity matrix;
    if (height === 1 && width === 1) {
      return [[1]];
    }
    let newMatrix = [];
    for (let row = 0; row < height; row++) {
      let tempRow = [];
      for (let col = 0; col < width; col++) {
        tempRow.push(
          det(cofactor(matrixArr, row, col)) * Math.pow(-1, col + row)
        );
      }
      newMatrix.push(tempRow);
    }
  
    return transpose(newMatrix);
  };
  
  let inverse = (matrixArr) => {
    for (let index = 0; index < matrixArr.length; index++) {
      if (!matrixArr[index].length) return undefined;
    }
    let determinantValue = det(matrixArr);
    if (determinantValue === 0) {
      return null;
    }
    let newMatrix = [];
    newMatrix = adjoint(matrixArr);
    const height = newMatrix.length;
    const width = newMatrix[0].length;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        newMatrix[row][col] = newMatrix[row][col] / determinantValue;
      }
    }
    return newMatrix;
  };
  
  let matrixProduct = (matrix1, matrix2) => {
    if (matrix1 === undefined || matrix2 === undefined) return undefined;
    const matrix1Height = matrix1.length;
    const matrix1Width = matrix1[0].length;
    const matrix2Height = matrix2.length;
    const matrix2Width = matrix2[0].length;
  
    if (matrix1Width === matrix2Height) {
      let newMatrix = [];
      for (let i = 0; i < matrix1Height; i++) {
        let tempRow = [];
        for (let k = 0; k < matrix2Width; k++) {
          let tempElem = 0;
          for (let j = 0; j < matrix1Width; j++) {
            tempElem += matrix1[i][j] * matrix2[j][k];
          }
          tempRow.push(tempElem);
        }
        newMatrix.push(tempRow);
      }
      return newMatrix;
    } else {
      return undefined;
    }
  };
  
  /*
     @input: string of expression
     @function: separate each term
     @return : object with variable as a property name and coefficient as a property value;
     @example:
      const terms = newEquationObject('3x+5y-6t7+8');
  
      let variables = Object.getOwnPropertyNames(s_terms);
  
      for (const itr of variables) {
          console.log(itr + ': ' + s_terms[itr]);
      }
      console.log('====================');
  */
  let newEquationObject = (equation) => {
    let eqnObject = {};
    let createObject = (variable, numValue, gotEqual) => {
      if (gotEqual) {
        numValue *= -1;
      }
      if (eqnObject.hasOwnProperty(variable)) {
        eqnObject[variable] += numValue;
      } else {
        Object.defineProperty(eqnObject, variable, {
          value: numValue,
          writable: true
        });
      }
      return null;
    };
  
    let stackDigit = "";
    let number = 1;
    let gotEqual = false;
    let stackVariable = "";
    equation = equation.replace(/ /g, "");
  
    for (let index = 0; index < equation.length; index++) {
      const element = equation[index];
      if (/^[0-9\.]$/.test(element)) {
        stackDigit += element;
      } else if (/^[a-zA-Z]$/.test(element)) {
        stackVariable += element;
        if (/([1-9][0-9]*)/.test(stackDigit)) {
          number *= parseFloat(stackDigit);
          stackDigit = "";
        }
      }
      if (/^[=\-\+]$/.test(element) || index === equation.length - 1) {
        if (stackVariable) {
          if (stackDigit) {
            number *= parseFloat(stackDigit);
          }
          //    console.log(`${stackVariable} : ${number}`);
          createObject(stackVariable, number, gotEqual);
          number = 1;
        } else if (stackDigit) {
          number *= parseFloat(stackDigit);
          //    console.log(`constant : ${number}`);
          createObject("constant", number, gotEqual);
          number = 1;
        }
        stackDigit = "";
        stackVariable = "";
        if (element === "-") {
          number *= -1;
        } else if (element === "=") {
          gotEqual = true;
        }
      }
    }
    return eqnObject;
  };
  
  // gcd of n numbers
  let gcd = (array = []) => {
    let noOfTensToMultiply = 1;
    array.forEach((elm) => {
      let tempElm = `${elm}`.match(/(?:[.]).*/g);
      if (tempElm && tempElm < noOfTensToMultiply) {
        noOfTensToMultiply = Math.pow(10, tempElm.length);
      }
    });
    array = array.map((x) => x * noOfTensToMultiply);
  
    let gcdOfTwoNumber = (n1, n2) => {
      if (n2 > n1) {
        n2 = n1 + n2;
        n1 = n2 - n1;
        n2 = n2 - n1;
      }
      let quotent = n1;
      let divisor = n2;
      let remainder;
      do {
        remainder = quotent % divisor;
        if (remainder) {
          quotent = divisor;
          divisor = remainder;
        }
      } while (remainder);
      return divisor;
    };
  
    let result = array[0];
    if (array.length === 1) return result;
    for (let index = 1; index < array.length; index++) {
      result = gcdOfTwoNumber(result, array[index]);
    }
    return result / noOfTensToMultiply;
  };
  