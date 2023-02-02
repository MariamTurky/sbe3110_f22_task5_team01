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

   var table = document.getElementById("myTable");  
   var rowCount = table.rows.length;  
   var row = table.insertRow(rowCount);  
    //Column 1 
    var updatedrowCount= rowCount
    var ce1 = row.insertCell(0);  
    var element1 = document.createElement("input");  
    element1.type = "button";  
    var btnName = "button" + (rowCount + 1);  
    element1.name = btnName;  
    element1.setAttribute('value', 'Delete'); // or element1.value = "button";  
    element1.onclick = function () { updatedrowCount=removeRow(btnName,rowCount); }  
    rowCount = updatedrowCount
    ce1.appendChild(element1);  
    //Column 2    
    var ce2 = row.insertCell(1);  
    ce2.innerHTML = rowCount ;  
    // Create table cells
    var c3 = row.insertCell(2);
  
    if (image == 1){
        allPassCoeff.push(0)
        c3.innerText = 0

    } else if(image == 2){
        allPassCoeff.push(0.9)
        c3.innerText = 0.9

    }else if(image == 3){
        allPassCoeff.push(0.5)
        c3.innerText = 0.5

    }else if(image == 4){
        allPassCoeff.push(0.3)
        c3.innerText = 0.3

    }else if(image == 5){
    allPassCoeff.push(-0.9)
    c3.innerText = -0.9

    }else{
        allPassCoeff.push(-0.4)
        c3.innerText = -0.4
    }

    console.log(row.cells[0].childNodes[2])


}

function removeRow(btnName,rowCount) {  
    // try {  
        var table = document.getElementById("myTable");  
        var rowCount = table.rows.length;  
        for (var i = 0; i < rowCount; i++) {  
            var row = table.rows[i];  
            var rowObj = row.cells[0].childNodes[0]; 
            var element = row.cells[1]
            if (rowObj.name == btnName) { 
                allPassCoeff.splice(row.cells[0], 1)  
                // allPassCoeff = allPassCoeff.filter(element);
                // console.log(element);
                table.deleteRow(i);  
                // table.find(row:eq(i), td:eq(2));
                rowCount--;  
                // console.log(row.cells[0].childNodes[2])
                // allPassCoeff.remove((row.cells[0]))
            }  
        }  
    // }catch (e) {  
    //     alert(e);  
    // } 
    return  rowCount;
} 

function updateAllPassCoeff() {
     updateFilterPhase(allPassCoeff)
    allPassCoeff
}



function changeMode(e) {
    unit_circle_mode = modesMap[e.target.id]
    for (btn of modes_btns) {
        btn.style.color = (btn !== e.target) ? "#fff" : "#febc2c";
    }
}