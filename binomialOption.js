







//import math
const E = Math.E;

const DEPTH = 500; //500
const TOL = 0.001; // 0.001


function value(S, K, T, sigma, r, q, OptionType, n = DEPTH) {
    let deltaT = T/n;
    let dv = Math.pow(E, -r*deltaT);


    let sqdt = Math.sqrt(deltaT);
    console.log("Sig sqdt: " + sigma*sqdt + "sigma" + sigma + "sqdt: " + sqdt);

    // try {
    //     // Check if u is NaN and handle the error
    //     if (isNaN(sqdt)) {
    //         throw new Error("sqdt is NaN");
    //     }
    // } catch (error) {
    //     console.error(error.message);
    //     sqdt = 0.1; // Set u to 1 if it is NaN
    // }
    //let u = Math.pow(E,sigma*Math.sqrt(deltaT));
    let u = Math.pow(E,sigma*sqdt);


    // try {
    //     // Check if u is NaN and handle the error
    //     if (isNaN(u)) {
    //         throw new Error("u is NaN");
    //     }
    // } catch (error) {
    //     console.error(error.message);
    //     u = 0.9; // Set u to 1 if it is NaN
    // }
        
    let p = (Math.pow(E,(r-q)*deltaT) - (1/u)) / (u-(1/u));
    console.log("deltaV: " + deltaT + " DV: " + dv + "  u: " + u + "    p: " + p);

    // Range for Snp
    let arange1 = Array.from({length: n+1}, (v, k) => k); // [0, 1, 2, ..., n]
    let arange2 = Array.from({length: n+1}, (v, k) => n - k); // [n, n-1, ..., 0]
    // Calculate Snp
    let Snp = arange1.map((val, index) => S * Math.pow(u, val) * Math.pow(u, -arange2[index]));
    console.log("Snp: " + Snp)
    
    if (OptionType == "C") {
        Fnp = Snp.map(S => Math.max(0, S - K));
    } else {
        Fnp = Snp.map(S => Math.max(0, K - S));
    }

    for (let i = n; i >= 0; i--) {

        Snp = Snp.map(value => value * u);

        for (let j = 0; j < i; j++) {
            if (OptionType == "C") {
                Fnp[j] = Math.max(dv * ( (p * Fnp[j + 1]) + ((1 - p) * Fnp[j]) ), (Snp[j] - K) );
                // F[i] max(discount const * (prob const * prev FUp + (1-prod const) * prev FDwon) , S(u,i) - K  const )

            } else {
                Fnp[j] = Math.max(dv * ( (p * Fnp[j + 1]) + ((1 - p) * Fnp[j]) ), (K - Snp[j]) );
            }
        
        }
        //console.log("Return Prics " + Fnp.slice(0,5) + "i: " + i);
    }
    //clog("Return Price:",Fnp[0]);
    //console.log("Return Prics " + Fnp.slice(0,5));
    //console.log("Return Price " + Fnp[0]);
    return Fnp[0];
}



function clog(value) {console.log(value)};

function getValues() {
    // Get the values from the input boxes
    let stockPrice = document.getElementById('input1').value;
    let strikePrice = document.getElementById('input2').value;
    let optionIV = document.getElementById('input3').value;
    let rate = document.getElementById('input5').value;
    // Add Inputs
    let q = 0;
    let OptionType = "P";

    let date = new Date(document.getElementById('input4').value); //Get Date
    date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setDate(date.getDate()+1);
    let d = new Date(); //Set todays
    d.setHours(0); d.setMinutes(0); d.setSeconds(0);
    let optT = (date-d)/ (1000*60*60*24) / 365;



    //const d = new Date();
    clog(d);
    clog(date);



    // Convert values to numbers
    return values = {
        "stockPrice": Number(stockPrice),
        "strikePrice": Number(strikePrice),
        "optionIV": Number(optionIV),
        "date": Date(date),
        "rate": Number(rate),
        "q": Number(q),
        "OptionType": String(OptionType),
        "T": Number(optT)
    };


    
    // console.log(values);
    
    // // Do something with the values, e.g., sum them
    // //const sum = values.reduce((acc, val) => acc + val, 0);
    // //console.log("Sum:", sum);

    // let optPrice = value(s = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = OptionType);
    // document.getElementById('outputPrice').innerText = "Price: " + optPrice;
    // let vegaT = vega(S = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = OptionType);
    // console.log(vegaT);
    // document.getElementById('vegaT').innerText = "Vega: " + vegaT;

}


function onGetClick() {
    let inputs = getValues();

    
    // tester1();
    // tester2();
    greekTable(S = inputs.stockPrice, K = inputs.strikePrice, T = inputs.T, sigma = inputs.optionIV, r = inputs.rate, q = inputs.q, OptionType = inputs.OptionType);
    //greekTable(S = inputs.stockPrice, K = inputs.strikePrice, T = inputs.T, sigma = inputs.optionIV, r = inputs.rate, q = inputs.q, OptionType = inputs.OptionType);
    //greekTable(S = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = "P");
    
    //graphST(S = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = "P");
    graphST(S = inputs.stockPrice, K = inputs.strikePrice, T = inputs.T, sigma = inputs.optionIV, r = inputs.rate, q = inputs.q, OptionType = inputs.OptionType);
    //graphST(S = inputs.stockPrice, K = inputs.strikePrice, T = inputs.T, sigma = inputs.optionIV, r = inputs.rate, q = inputs.q, OptionType = inputs.OptionType);
}


function greekTable(S, K, T, sigma, r, q, OptionType) {

    // let table = document.getElementById('outputTable');

    // let row = table.insertRow();
    // let indexCell = row.insertCell(0);
    // let priceCell = row.insertCell(1);
    // let IVCell = row.insertCell(2);
    // let deltaCell = row.insertCell(3);
    // let gammaCell = row.insertCell(4);
    // let vegaCell = row.insertCell(5);
    // let thetaCell = row.insertCell(6);
    // let rhoCell = row.insertCell(7);
    // let tCell = row.insertCell(8);
    // //let rhoCell = row.insertCell(7); Date?

    // indexCell.textContent = OptionType;
    // priceCell.textContent = value(S, K, T, Number(sigma), r, q, OptionType); // Adjust formatting as needed
    // IVCell.textContent = sigma; // Adjust formatting as needed
    // deltaCell.textContent = genGreek();
    // gammaCell.textContent = genGreek();
    // vegaCell.textContent = genGreek();
    // thetaCell.textContent = genGreek();
    // rhoCell.textContent = genGreek();
    // tCell.textContent = T;

    document.getElementById('cValue').innerText = value(S, K, T, Number(sigma), r, q, "C").toFixed(3);
    document.getElementById('cIV').innerText = sigma.toFixed(3);
    document.getElementById('cDelta').innerText = delta(S, K, T, Number(sigma), r, q, "C").toFixed(3);
    document.getElementById('cGamma').innerText = Math.random().toFixed(3); //Not real
    document.getElementById('cVega').innerText = vega(S, K, T, Number(sigma), r, q, "C").toFixed(3);
    document.getElementById('cTheta').innerText = theta(S, K, T, Number(sigma), r, q, "C").toFixed(3);
    document.getElementById('cRho').innerText = rho(S, K, T, Number(sigma), r, q, "C").toFixed(3);
    document.getElementById('cT').innerText = T.toFixed(3);

    document.getElementById('pValue').innerText = value(S, K, T, Number(sigma), r, q, "P").toFixed(3);
    document.getElementById('pIV').innerText = sigma.toFixed(3);
    document.getElementById('pDelta').innerText = delta(S, K, T, Number(sigma), r, q, "P").toFixed(3);
    document.getElementById('pGamma').innerText = -Math.random().toFixed(3);
    document.getElementById('pVega').innerText = vega(S, K, T, Number(sigma), r, q, "P").toFixed(3);
    document.getElementById('pTheta').innerText = theta(S, K, T, Number(sigma), r, q, "P").toFixed(3);
    document.getElementById('pRho').innerText = rho(S, K, T, Number(sigma), r, q, "P").toFixed(3);
    document.getElementById('pT').innerText = T.toFixed(3);
    // let price = value(s = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = OptionType);

    // let delta = delta(s = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = OptionType);
    // let gamma = gamma(s = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = OptionType);

    // let vegaT = vega(s = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = OptionType);
    // let thetaT = theta(s = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = OptionType);
    // let rhoT = rho(s = stockPrice, K = strikePrice, T = optT, sigma = optionIV, r = rate, q = q, OptionType = OptionType);
    }



// function tester1() {

//     let TESTER = document.getElementById('tester');
    
    
//     Plotly.plot( TESTER, [{
//         x: [1, 2, 3, 4, 5],
//         y: [1, 2, 4, 8, 16] }], { 
//         margin: { t: 0 } }, {showSendToCloud:true} );
    
//     /* Current Plotly.js version */
//     console.log( Plotly.BUILD );
    
// }


// function tester2() {

//     const xArray = ["Italy", "France", "Spain", "USA", "Argentina"];
//     const yArray = [55, 49, 44, 24, 15];
    
//     const layout = {title:"World Wide Wine Production"};
    
//     const data = [{labels:xArray, values:yArray, type:"pie"}];
    
//     Plotly.newPlot("myPlot", data, layout);
// }


// function genGreek() {
//     return Math.random();
// }

// // Calculate button event listener
// document.getElementById('calculate-button').addEventListener('click', function() {
//     getValues()
// });









// document.addEventListener('DOMContentLoaded', function() {
//     // Example 2D array data
// }

function graphST(S, K, T, sigma, r, q, OptionType = "P") {
    let n = 15;
    let ar = Array.from({length: n+1}, (v, k) => k); // [0, 1, 2, ..., n]
    // Calculate Snp
    console.log("arr" + ar);
    
    let Slist = ar.map((val, index) => S * Math.pow(1.01, val));

    console.log("Slist: " + Slist);
    //let Tlist = ar.map((val, index) => T * Math.pow(1.1, val));
    let Tlist = ar.map((val, index) => T - T/n*val);
    console.log("Tlist: " + Tlist);

    // let zData = [[1, 2, 3, 4],[2, 3, 4, 5],[3, 4, 5, 6],[4, 5, 6, 7]];

    let zData = [];

    let zRow = [];
    for (let i = 0; i <= n; i++) { //Slist = i
        for (let j = 0; j <= n; j++) { //Tlist = j
            zRow.push(value(Slist[i], K, Tlist[j], Number(sigma), r, q, OptionType));
        }
        zData.push(zRow)
        zRow = [];
    }

    // Prepare the x and y coordinates
    //let xData = Array.from({length: zData[0].length}, (v, k) => k); // T
    //let yData = Array.from({length: zData.length}, (v, k) => k); // S
    let xData = Tlist; // T    
    let yData = Slist; // S

    // Create the 3D surface plot
    let data = [{
        z: zData,
        x: xData,
        y: yData,
        type: 'surface',
        showscale: false //heat scale for z
    }];

    let layout = {
        title: 'Option Surface Plot',
        paper_bgcolor: "rgba(0,0,0,0)", //background color of the chart container space
        showlegend: false, // Disable the legend
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        scene: {
            xaxis: {title: 'Time'},
            yaxis: {title: 'Stock'},
            zaxis: {title: 'Value'}
        },
        modebar: { // Hide the mode bar
            remove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']
        }
    };
    console.log("Graph Done");

    Plotly.newPlot('graph', data, layout, {displayModeBar: false});
}







//clog(value(S = 554.64, K = 550, T = 0.1506849315068493 , sigma = 0.11652082033824894 , r = 0.05, q = 0, OptionType = "P", arr = false))


// //Delta EB
// def delta(S,K,T,sigma,r,q, OptionType):
//     prices,fArr = value(S, K, T, sigma, r, q, OptionType, True)
//     delta = (fArr[2] - fArr[0]) / (prices[2] - prices[0])
//     return delta

// //Gamma EB
// def gamma(S,K,T,sigma,r,q, OptionType):
//     prices,fArr = value(S, K, T, sigma, r, q, OptionType, True)
//     delta1 = (fArr[2] - fArr[1]) / (prices[2] - prices[1])
//     delta2 = (fArr[1] - fArr[0]) / (prices[1] - prices[0])
//     gamma = (delta1 - delta2) / (prices[2] - prices[0])
//     return gamma*2

//DeltaFD
function delta(S,K,T, sigma,r,q,OptionType) {
    var stol = S * TOL;

    let pSU = value(S + stol, K, T, sigma, r, q, OptionType);
    // let pSN = value(S, K, T, sigma + sigtol, r, q, OptionType);
    let pSD = value(S - stol, K, T, sigma, r, q, OptionType);
    console.log(stol)
    let deltaFD = (pSU - pSD) / (2 * stol);
    return deltaFD;
}

// //Vega FD
// def vega(S,K,T,sigma,r,q, OptionType):
//     sigtol = sigma * TOL
//     pVU = value(S, K, T, sigma + sigtol, r, q, OptionType, False)
//     pVD = value(S, K, T, sigma - sigtol, r, q, OptionType, False)
//     vega = (pVU - pVD) / (2*sigtol*100)
//     return vega

//Vega FD
function vega(S,K,T, sigma,r,q,OptionType) {
    var sigtol = sigma * TOL;
    console.log("Vega ");
    console.log("S" + S + "K" + K + "T" + T + "Sig" + sigma + "sigtol" + sigtol + "r" + r + "q" + q + "Opt" + OptionType);
    let pVU = value(S, K, T, sigma + sigtol, r, q, OptionType);
    console.log("VegaUp " + pVU);
    let pVD = value(S, K, T, sigma - sigtol, r, q, OptionType);
    console.log("VegaDown " + pVD);
    let vegaFD = (pVU - pVD) / (2 * sigtol * 100);
    console.log("VegaFD " + vegaFD);
    return vegaFD;
}
    

// //Theta FD
// def theta(S,K,T,sigma,r,q, OptionType):

//     thetatol = T * TOL
//     pTU = value(S, K, T + thetatol, sigma, r, q, OptionType, False)
//     pTD = value(S, K, T - thetatol, sigma, r, q, OptionType, False)
//     theta = - (pTU - pTD) / (2*thetatol*365)
//     return theta

function theta(S,K,T, sigma,r,q,OptionType) {
    var thetatol = T * TOL;
    //console.log("Vega ");
    //console.log("S" + S + "K" + K + "T" + T + "Sig" + sigma + "sigtol" + sigtol + "r" + r + "q" + q + "Opt" + OptionType);
    let pTU = value(S, K, T + thetatol, sigma, r, q, OptionType);
    //console.log("VegaUp " + pVU);
    let pTD = value(S, K, T - thetatol, sigma, r, q, OptionType);
    //console.log("VegaDown " + pVD);
    let thetaFD = -(pTU - pTD) / (2 * thetatol * 365);
    //console.log("VegaFD " + vegaFD);
    return thetaFD;
}



// //Rho FD
// def rho(S,K,T,sigma,r,q, OptionType):
//     rtol = r * TOL
//     pRU = value(S, K, T, sigma, r + rtol, q, OptionType, False)
//     pRD = value(S, K, T, sigma, r - rtol, q, OptionType, False)
//     rho = (pRU - pRD) / (2*rtol*100)
//     return rho

function rho(S,K,T, sigma,r,q,OptionType) {
    var rtol = r * TOL;
    //console.log("Vega ");
    //console.log("S" + S + "K" + K + "T" + T + "Sig" + sigma + "sigtol" + sigtol + "r" + r + "q" + q + "Opt" + OptionType);
    let pRU = value(S, K, T, sigma, r + rtol, q, OptionType);
    //console.log("VegaUp " + pVU);
    let pRD = value(S, K, T, sigma, r - rtol, q, OptionType);
    //console.log("VegaDown " + pVD);
    let rhoFD = (pRU - pRD) / (2 * rtol * 100);
    //console.log("VegaFD " + vegaFD);
    return rhoFD;
}


// def greeks(S,K,T,sigma,r,q, OptionType):

//     d = delta(S,K,T,sigma,r,q, OptionType)
//     g = gamma(S,K,T,sigma,r,q, OptionType)
//     #sigma
//     v = vega(S,K,T,sigma,r,q, OptionType)
//     t = theta(S,K,T,sigma,r,q, OptionType)
//     rs = rho(S,K,T,sigma,r,q, OptionType)
//     #print([delta, gamma, sigma, vega, theta, rho])
//     return [d, g, sigma, v, t, rs]



// def printOpt(S,K,T,sigma,r,q, OptionType):
//     greekList = greeks(S,K,T,sigma,r,q, OptionType)
//     v = value(S, K, T, sigma, r, q, OptionType, False)
//     print("{} | Value: {:.3}, Delta: {:.3}, Gamma: {:.3}, IV: {:.3}, Vega: {:.3}, Theta: {:.3}, Rho: {:.3} | |".format(
//         OptionType, v, greekList[0], greekList[1], greekList[2], greekList[3], greekList[4], greekList[5]))


