// reference => https://semath.info/src/inverse-cofactor-ex4.html

var accuracy = 3;    // how many decimal points should be in the answer

const matrix = {    // matrix object
    rows: 0,
    cols: 0,
    data: []
};

// creates matrix from array
function create_matrix(rows, cols, array) {
    for (let i = 0; i < rows; i++) {
        matrix.data.push([]);
        for (let j = 0; j < cols; j++) {
            matrix.data[i][j] = array[cols * i + j];
        }
    }
    matrix.rows = rows;
    matrix.cols = cols;
    return matrix;
}

// return the determinant of the provided matrix
function return_determinant(m = matrix) {
    if (m.rows < 2 || m.cols < 2 || m.cols != m.rows) {
        console.log("No determinant");
        return NaN;
    }
    else if (m.rows == 2 && m.cols == 2) {
        return m.data[0][0] * m.data[1][1] - m.data[0][1] * m.data[1][0];
    }
    else {
        let det = 0.0;
        for (let c = 0; c < m.cols; c++) {    // c for column number
            const tmp_matrix = {        // temp matrix object for return_determinant function below
                rows: m.rows - 1,
                cols: m.cols - 1,
                data: []
            };
            for (let i = 0; i < m.rows - 1; i++) {
                tmp_matrix.data.push([]);
                let skipped = false;
                for (let j = 0; j < m.cols; j++) {
                    if (j == c) {
                        skipped = true;
                        continue;
                    }
                    else {
                        if (skipped) {
                            tmp_matrix.data[i][j - 1] = m.data[i + 1][j];   // first row is skipped
                        }                                                   // bcuz we are getting the determinant along the first row
                        else {
                            tmp_matrix.data[i][j] = m.data[i + 1][j];       // first row is skipped
                        }
                    }

                }
            }
            det += ((-1) ** c) * m.data[0][c] * return_determinant(tmp_matrix);
        }
        return det;
    }
}

// return the matrix of minors from the given matrix
function return_minors(m = matrix) {
    const minor_matrix = {
        rows: m.rows,
        cols: m.cols,
        data: []
    };
    for (let r = 0; r < m.rows; r++) {              // r for row
        minor_matrix.data.push([]);
        for (let c = 0; c < m.cols; c++) {          // c for col
            const tmp_matrix = {                    // temp matrix object for return_determinant function below
                rows: m.rows - 1,
                cols: m.cols - 1,
                data: []
            };
            let row_skipped = false;
            // iterating over the matrix again for the minors for the particular matrix item/entry
            for (let i = 0; i < m.rows; i++) {      // i th row
                if (i == r) {
                    row_skipped = true;
                    continue;
                }
                else {
                    tmp_matrix.data.push([]);
                    let col_skipped = false;
                    for (let j = 0; j < m.cols; j++) {  // j th col
                        if (j == c) {
                            col_skipped = true;
                            continue;
                        }
                        else {
                            // ternary operator -> x = condition ? true : false;
                            let i_ = row_skipped ? i - 1 : i;
                            let j_ = col_skipped ? j - 1 : j;   // subtracting 1 to account the skip
                            tmp_matrix.data[i_][j_] = m.data[i][j];
                        }

                    }
                }

            }
            minor_matrix.data[r][c] = return_determinant(tmp_matrix);
        }
    }
    return minor_matrix;
}

// return the adjuagate from the provided minor matrix
function return_adjugate(m = return_minors()) {
    const adjugate_matrix = {
        rows: m.rows,
        cols: m.cols,
        data: []
    };
    adjugate_matrix.data = JSON.parse(JSON.stringify(m.data));  // to safely (and deeply) copy from m

    for (let r = 0; r < m.rows; r++) {
        for (let c = 0; c < m.cols; c++) {
            adjugate_matrix.data[c][r] = ((-1) ** (r + c)) * m.data[r][c];
        }
    }
    return adjugate_matrix;
}

// return the inverse from the adjugate matrix and determinant
function return_inverse(m = return_adjugate(), det = return_determinant()) {
    const inverse_matrix = {
        rows: m.rows,
        cols: m.cols,
        data: []
    };

    for (let r = 0; r < m.rows; r++) {
        inverse_matrix.data.push([]);
        for (let c = 0; c < m.cols; c++) {
            inverse_matrix.data[r][c] = (Math.round((10 ** accuracy) * m.data[r][c] * (1 / det))) / (10 ** accuracy);
        }
    }
    return inverse_matrix;
}