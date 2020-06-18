// required packages
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');

var images = [
                'https://arngrenn.files.wordpress.com/2018/11/cropped-hde-brum-mstor2.jpg',
                'https://webshots.websitesfromhell.net/80b60ba39c7377812aabbeb905a5da2e/s_848.jpg',
                'https://tr3.cbsistatic.com/hub/i/r/2011/11/21/8432d13c-c3a7-11e2-bc00-02911874f8c8/resize/500x/402123f15d46c6e7bf03df01e97e1b48/01-arngren-net_crop.jpg',
                'https://www.siteprice.org/SiteThumbs/a/arngren.net.jpeg',
                'https://pbs.twimg.com/media/EINUFEnWsAACEck.jpg',
                'https://liannebunce.files.wordpress.com/2013/11/badwebsite.jpg?w=1400',
                'https://www.siteprice.org/SiteThumbs/a/arngren.net.jpeg',
                '/assets/images/comp.jpg',
                '/assets/images/search.jpg'
            ];

var fileMapper = {
    '1': 'q1',
    '2': 'q2',
    '3': 'q3',
    '4': 'q4',
    '5': 'q5',
    '6': 'q6',
    'Q1 comment': 'q1Comment',
    'Q2 comment': 'q2Comment',
    'Q3 comment': 'q3Comment',
    'Q4 comment': 'q4Comment',
    'Q5 comment': 'q5Comment',
    'Q6 comment': 'q6Comment',
    'global comment': 'globalComment' 
}

var questions = [
    'Le UI design du site est non utilisable car',
    'La recherche dans ce site est',
    'Placer tout les articles dans la page principale rend the site efficase:',
    'Le site n\'utilise pas une grille specifique, on place des photos partout, comment évaluez-vous la coherence du UI',
    'placer les articles sans les categoriser rend la recherche ',
    'chaque article utilise une langue ce qui rend le cite '
]

// read the data file
function readData(fileName){
    let dataRead = fs.readFileSync('./data/' + fileName + '.json');
    let infoRead = JSON.parse(dataRead);
    return infoRead;
}

// read the data file
function writeData(info, fileName){
    data = JSON.stringify(info);
    fs.writeFileSync('./data/' + fileName + '.json', data);
}

function update(nameToMap, value){
    // console.log(value);
    if ( value !== undefined && value !== '' ){ 
        let info = readData(fileMapper[nameToMap]);
         // will be useful for text entry, since the item typed in might not be in the list
        let found = 0;
        for (let i=0; i<info.length; i++){
            if (info[i]['name'] === value){
                info[i].count = parseInt(info[i].count) + 1;
                found = 1;
            }
        }
        if (found === 0){
            info.push({'name': value, count: 1});
        }
        writeData(info, fileMapper[nameToMap]);
    }
}

// This is the controler per se, with the get/post
module.exports = {
    fileMapper: fileMapper,
    controller: function(app){

        // when a user goes to localhost:3000/analysis
        // serve a template (ejs file) which will include the data from the data files
        app.get('/analytics', function(req, res){
            // var color = readData("color");
            // var fruit = readData("fruit");
            // var animal = readData("animal");
            let data = [];
            let pieChart = [];
            for( let i=1; i<=6; i++) {
                let file = readData('q'+i);
                if (file) {
                    data.push({ 'name': questions[i-1], 'data':file });
                }
                if (i === 3) {
                    // pieChart 
                    for( let o of file ) {
                        pieChart.push( { x: o.name, value: o.count} );
                    }
                }
            }
            let glob = readData('globalComment');
            if (glob) {
                data.push({ 'name':'Global comment', 'data':glob });
            }

            for( let i=1; i<=6; i++) {
                file = readData('q'+i+'Comment');
                if (file) {
                    data.push({ 'name':'Q'+i+' comments', 'data':file });
                }
            }



            res.render('analytics', {results: data, pie: pieChart });
            // console.log([color, fruit, animal]);
            console.log('Analytics');
        });

        // when a user types SUBMIT in localhost:3000/niceSurvey 
        // the action.js code will POST, and what is sent in the POST
        // will be recuperated here, parsed and used to update the data files
        app.post('/survey', urlencodedParser, function(req, res){
            console.log(req.body);
            var json = req.body;
            for (var key in json){
                console.log(key + ": " + json[key]);
                console.log(Array.isArray(json[key]));
                if (Array.isArray(json[key])) {
                    for( let j of json[key]) {
                        update(key, j); 
                    }
                } else {
                    update(key, json[key]);
                }
            }
            // mystery line... (if I take it out, the SUBMIT button does change)
            // if anyone can figure this out, let me know!
            // res.sendFile(__dirname + "/views/survey.html");
            res.render('survey', {src: images});
            console.log('survey');
        });

        app.get('/survey', function(req, resp) {
            resp.render('survey', {src: images});
        });
        
    }
}