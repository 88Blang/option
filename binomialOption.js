



const E = Math.E;
const DEPTH = 500;
const TOL = 0.001;

window.onload = onGetClick;

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
    
    if (OptionType == "Call") {
        Fnp = Snp.map(S => Math.max(0, S - K));
    } else {
        Fnp = Snp.map(S => Math.max(0, K - S));
    }

    for (let i = n; i >= 0; i--) {
        Snp = Snp.map(value => value * u);
        for (let j = 0; j < i; j++) {
            if (OptionType == "Call") {
                Fnp[j] = Math.max(dv * ( (p * Fnp[j + 1]) + ((1 - p) * Fnp[j]) ), (Snp[j] - K) );
            } else {
                Fnp[j] = Math.max(dv * ( (p * Fnp[j + 1]) + ((1 - p) * Fnp[j]) ), (K - Snp[j]) );
            }
        
        }
    }

    return Fnp[0];
}



function getValues() {
    // Get the values from the input boxes
    let stockPrice = document.getElementById('stockPrice').value;
    let strikePrice = document.getElementById('strikePrice').value;
    let optionIV = document.getElementById('impVol').value;
    let rate = document.getElementById('rate').value;
    let q = document.getElementById('dividend').value;
    let OptionType = document.getElementById('optType').value;

    // Convert to T
    let date = new Date(document.getElementById('expiry').value); //Get Date
    date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setDate(date.getDate()+1);
    let d = new Date(); //Set todays
    d.setHours(0); d.setMinutes(0); d.setSeconds(0);
    let optT = (date-d)/ (1000*60*60*24) / 365;

    // Convert values to numbers
    return values = {
        "stockPrice": Number(stockPrice),
        "strikePrice": Number(strikePrice),
        "impVol": Number(optionIV),
        "rate": Number(rate),
        "dividend": Number(q),
        "T": Number(optT),
        "optType": String(OptionType)
    };
}

// FORMAT
// {
//     "stockPrice": 100,
//     "strikePrice": 100,
//     "impVol": 0.5,
//     "rate": 0.05, //Annual
//     "dividend": 0, 
//     "T": 1, // NOT EXPIRY
//     "optType": "Call", //{ "Call", "Put" }
// }


function onGetClick() {
    let inputs = getValues();
    // let data = inputs;
    // // let fetchPort = fetch('http://localhost:3000/binomialTree');
    // const responseCell = document.getElementById('responseCell');

    
    // fetch('http://localhost:3000/binomialTree', {
    //     method: 'POST',
    //     headers: {
    //         "content-type": "application/json"
    //     },
    //     body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // Update the table cell with the response data
    //     responseCell.innerText = data.value;
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     responseCell.innerText = 'An error occurred';
    // });

    greekTable(S = inputs.stockPrice, K = inputs.strikePrice, T = inputs.T, sigma = inputs.impVol, r = inputs.rate, q = inputs.dividend, OptionType = inputs.optType);
    graphST(S = inputs.stockPrice, K = inputs.strikePrice, T = inputs.T, sigma = inputs.impVol, r = inputs.rate, q = inputs.dividend, OptionType = inputs.optType);

}


function greekTable(S, K, T, sigma, r, q, OptionType) {
    document.getElementById('typeOut').innerText = OptionType;
    document.getElementById('valueOut').innerText = value(S, K, T, Number(sigma), r, q, OptionType).toFixed(3);
    document.getElementById('deltaOut').innerText = delta(S, K, T, Number(sigma), r, q, OptionType).toFixed(3);
    document.getElementById('gammaOut').innerText = (Math.random() / 10).toFixed(3); //Not real
    document.getElementById('vegaOut').innerText = vega(S, K, T, Number(sigma), r, q, OptionType).toFixed(3);
    document.getElementById('thetaOut').innerText = theta(S, K, T, Number(sigma), r, q, OptionType).toFixed(3);
    document.getElementById('impVolOut').innerText = rho(S, K, T, Number(sigma), r, q, OptionType).toFixed(3);
    document.getElementById('tOut').innerText = T.toFixed(3);
}


function graphST(S, K, T, sigma, r, q, OptionType) {
    let n = 15;
    let ar = Array.from({length: n+1}, (v, k) => k); // [0, 1, 2, ..., n]
    // Calculate Snp
    let Slist = ar.map((val, index) => S * Math.pow(1.01, val));
    let Tlist = ar.map((val, index) => T - T/n*val);

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
        showscale: false
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
            zaxis: {title: 'Value'},
            camera: {
                eye: {
                    x: -1.5,
                    y: -2,
                    z: 0.8
                }
            }
        },
        modebar: {
            remove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']
        }
    };
    console.log("Graph Done");
    Plotly.newPlot('graph', data, layout, {displayModeBar: false});
}


//DeltaFD
function delta(S,K,T, sigma,r,q,OptionType) {
    var stol = S * TOL;
    let pSU = value(S + stol, K, T, sigma, r, q, OptionType);
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


//Theta FD
function theta(S,K,T, sigma,r,q,OptionType) {
    var thetatol = T * TOL;
    let pTU = value(S, K, T + thetatol, sigma, r, q, OptionType);
    let pTD = value(S, K, T - thetatol, sigma, r, q, OptionType);
    let thetaFD = -(pTU - pTD) / (2 * thetatol * 365);
    return thetaFD;
}


//Rho FD
function rho(S,K,T, sigma,r,q,OptionType) {
    var rtol = r * TOL;
    let pRU = value(S, K, T, sigma, r + rtol, q, OptionType);
    let pRD = value(S, K, T, sigma, r - rtol, q, OptionType);
    let rhoFD = (pRU - pRD) / (2 * rtol * 100);
    return rhoFD;
}
