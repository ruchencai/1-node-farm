// fs = file system
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////// FILE IO /////////////////////////////////////////////////////////////////
/* 
// blocking code execution --> sync
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

// non-blocking code execution --> async
// callback != async

// ${}: add code
const textOut = `This is what we know about the avocado: ${textIn}.\nCreared on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written!');



// non-blocking, async way
// second var: callback function
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if(err) return console.log('ERROR!');

    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
                console.log('your file has been written');
            });
        });
    });
});
console.log('will read file'); // this will come before console.log(data), bc it runs in the background, the callback function only runs when the file is read
 */





///////////////////// SERVER /////////////////////////////////////////////////////////////////


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // an array of 5 objects


// called this function each time there is a request, we want to load file only once 
const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    // overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // product page
    } else if(pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json'}); // tell the browser that we're sending json
        res.end(data); // page
    
    // not found
    }else {
        // send header, must be before response
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1>Page not found!</h1>');
    }

});

// var1 = port: a sub address on a host
// var2 = local host: current computer
server.listen(8000, '127.0.0.1', () => {
    // run when server start listening
    console.log('Listening to request on port 8000.');
});