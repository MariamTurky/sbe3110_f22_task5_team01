const filterDesignMagnitude = document.querySelector('#filter-mag-response')
const filterDesignPhase = document.querySelector('#filter-phase-response')
const allPassPhase = document.getElementById('all-pass-phase-response');
const finalPhase = document.getElementById('final-filter-phase-response');
var img  = document.querySelector('#image'); 
const checkList = document.getElementById('list1');
const zero_mode_btn = document.getElementById("zero")
const pole_mode_btn = document.getElementById("pole")
const modes_btns = [zero_mode_btn, pole_mode_btn]

let allPassCoeff = []
document.querySelector('#listOfA').addEventListener(updateAllPassCoeff)
document.querySelector('#new-all-pass-coef').addEventListener('click', addNewA)

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response.json()
}


async function updateFilterDesign(data) {
    data.gain = 1
    let { w, angels, magnitude } = await postData(`${API}/getFilter`, data)
    plotlyMultiLinePlot(filterDesignMagnitude, [
        { x: w, y: magnitude, line: { color: '#febc2c' } },
    ])
    plotlyMultiLinePlot(filterDesignPhase, [
        { x: w, y: angels, line: { color: '#fd413c' } },
    ])
}

checkList.getElementsByClassName('anchor')[0].onclick = function () {
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
}



async function updateFilterPhase(allPassCoeff) {
    const { zeros, poles } = filter_plane.getZerosPoles(radius)
    const { angels: allPassAngels } = await postData(
        'http://127.0.0.1:8080/getAllPassFilter',
        {
            a: allPassCoeff,
        }
    )
    const { w, angels: finalFilterPhase } = await postData(
        'http://127.0.0.1:8080/getFinalFilter',
        {
            zeros,
            poles,
            a: allPassCoeff,
        }
    )
    updateFilterPlotting(w, allPassAngels, finalFilterPhase)
}

function updateFilterPlotting(w, allPassAngels, finalFilterPhase) {
    plotlyMultiLinePlot(allPassPhase, [{x: w, y: allPassAngels}])
    plotlyMultiLinePlot(finalPhase, [{x: w, y: finalFilterPhase}])
    plotlyMultiLinePlot(filterDesignPhase, [
        { x: w, y: finalFilterPhase, line: { color: '#fd413c' } },
    ])
}

function plotlyMultiLinePlot(container, data) {
    Plotly.newPlot(
        container,
        data,
        {
            margin: { l: 30, r: 0, b: 30, t: 0 },
            xaxis: {
                autorange: true,
                tickfont: { color: '#cccccc' },
            },
            yaxis: {
                autorange: true,
                tickfont: { color: '#cccccc' },
            },
            plot_bgcolor: '#111111',
            paper_bgcolor: '#111111',
        },
        { staticPlot: true }
    )
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value
    })
}
function changeImage(image) {
    let table = document.getElementById("myTable");
   
    // Create a row using the inserRow() method and
    // specify the index where you want to add the row
    let row = table.insertRow(-1); // We are adding at the end
 
    // Create table cells
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);

 
    // Add data to c1 and c2
    c1.innerText = "All Pass Filter"
  

    if (image == 1){
        allPassCoeff.push(0)
        c2.innerText = 0

        td.append(button);
        trArray.append(td);
 
       
    } else if(image == 2){
        allPassCoeff.push(0.9)
        c2.innerText = 0.9

    }else if(image == 3){
        allPassCoeff.push(0.5)
        c2.innerText = 0.5

    }else if(image == 4){
        allPassCoeff.push(0.3)
        c2.innerText = 0.3

    }else if(image == 5){
    allPassCoeff.push(-0.9)
    c2.innerText = -0.9

    }else{
        allPassCoeff.push(-0.4)
        c2.innerText = -0.4
    }
// let tr = document.querySelectorAll("table tbody tr");



}
// Array.from(tr).forEach(function(trArray) {
//     let button = document.createElement("button");
//     let td = document.createElement("td");
//     button.innerText = "Delete";
//     button.className = "btn_buy";

// });
// function myDeleteFunction(value) {
//     if (value == 1){
//         allPassCoeff.remove(0)

 
       
//     } else if(value == 2){
//         allPassCoeff.remove(0.9)


//     }else if(value == 3){
//         allPassCoeff.remove(0.5)


//     }else if(value == 4){
//         allPassCoeff.remove(0.3)


//     }else if(value == 5){
//     allPassCoeff.remove(-0.9)


//     }else{
//         allPassCoeff.remove(-0.4)

//     }
//     document.getElementById("myTable").deleteRow(-1);
//   }

function updateAllPassCoeff() {
     updateFilterPhase(allPassCoeff)
    console.log(allPassCoeff);
    allPassCoeff
}



function changeMode(e) {
    unit_circle_mode = modesMap[e.target.id]
    for (btn of modes_btns) {
        btn.style.color = (btn !== e.target) ? "#fff" : "#febc2c";
    }
}
