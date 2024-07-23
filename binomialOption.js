







//import math
const E = Math.E;

const DEPTH = 500; //500
const TOL = 0.001; // 0.001


function value(S, K, T, sigma, r, q, OptionType, n = DEPTH) {
    let deltaT = T/n;
    let dv = Math.pow(E, -r*deltaT);


    let sqdt = Math.sqrt(deltaT);
    console.log("Sig sqdt: " + sigma*sqdt + "sigma" + sigma + "sqdt: " + sqdt);


    let u = Math.pow(E,sigma*sqdt);



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


}


function onGetClick() {
    let inputs = getValues();


    greekTable(S = inputs.stockPrice, K = inputs.strikePrice, T = inputs.T, sigma = inputs.optionIV, r = inputs.rate, q = inputs.q, OptionType = inputs.OptionType);

    graphST(S = inputs.stockPrice, K = inputs.strikePrice, T = inputs.T, sigma = inputs.optionIV, r = inputs.rate, q = inputs.q, OptionType = inputs.OptionType);
}


function greekTable(S, K, T, sigma, r, q, OptionType) {


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

    }


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

    Plotly.newPlot('graph', data, layout, {displayModeBar: false});
}



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



