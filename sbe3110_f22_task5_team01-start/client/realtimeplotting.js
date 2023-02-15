
const notyf = new Notyf()
const button = document.getElementById('sent_zeros_poles')
var arr_y = [];
var arr_x = [];


var cntt = 0;
function Data() {
    var num = Math.random();
    arr_y.push(num)
    return num;
}

Plotly.newPlot('original-signal', [{
    y: [],
    mode: 'lines',

    line: { color: '#febc2c' },
}], {

    plot_bgcolor: "#111111",
    paper_bgcolor: "#111111"
});

console.log(arr_y)
Plotly.newPlot('filtered-signal', [{
    y: [],
    // mode: 'lines',
    type:'scatter',
    line: { color: '#fd413c' }
}], {

    plot_bgcolor: "#111111",
    paper_bgcolor: "#111111"
});



updateFilterDesign({ zeros: [], poles: [] })


async function get_differenceEquationCoefficients(zeros, poles) {
    const { a, b } = await postData(`${API}/differenceEquationCoefficients`, {
        zeros: zeros,
        poles: poles,
    });
    equateLength(a, b);
    return [a, b]
}


function equateLength(a, b) {
    max_length = Math.max(a.length, b.length)
    for (let i = 0; i < max_length; i++) {
        a[i] = i < a.length ? a[i] : 0
        b[i] = i < b.length ? b[i] : 0
    }
    return [a, b]
}

/**
 * IIR filter implementation of the transfer function H[Z] using the difference equation.
 *
 * @param {Array}   a           List of denominator coefficients.
 * @param {Array}   b           List of numerator coefficients.
 * @param {Number}  n           Index of sample point to filter.
 * @param {Array}   x           List of input samples.
 * @param {Array}   y           List of previous filterd samples.
 *
 * @return {Number}             The filterd sample value.
 *
 */
function filter(a, b, n, x, y) {

  
    let filter_order = Math.max(a.length, b.length)
    if (a.length != b.length) equateLength(a, b)
    if (n < filter_order) return y[n]

    let y_n = b[0] * x[n]
    for (let m = 0; m < filter_order; m++) {
        y_n += b[m] * x[n - m] - a[m] * y[n - m]
    }

    return y_n
}

document.getElementById("generate-signal-container").addEventListener("mousemove", async function (e) {
    
    const { zeros, poles } = filter_plane.getZerosPoles(radius)
    if (zeros.length === 0 && poles.length === 0) {
        notyf.error('No filter designed');
        return
    }
    const [a, b] = await get_differenceEquationCoefficients(zeros, poles)

    Plotly.extendTraces('original-signal', { y: [[Data()]] }, [0]);

    var y_filtterd = arr_y;
    y_filtterd[cntt] = filter(a, b,cntt, arr_y, y_filtterd);
   
    Plotly.extendTraces('filtered-signal', {y: [[y_filtterd[cntt]]],  }, [0])

    if (cntt > 40) {
        Plotly.relayout('original-signal', {
            xaxis: {
                range: [cntt - 40, cntt-20]
            },
            plot_bgcolor: "#111111",
            paper_bgcolor: "#111111"
        });
        Plotly.relayout('filtered-signal', {
            xaxis: {
                range: [cntt - 40, cntt-20]
            },
            plot_bgcolor: "#111111",
            paper_bgcolor: "#111111"
        });
    }
    cntt= cntt +1;
    arr_x.push(cntt);

})

setTimeout(() => {
    updateAllPassCoeff()
}, 100)


