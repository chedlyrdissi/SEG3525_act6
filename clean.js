var fs = require('fs');
var mapper = require('./controllers/MainController').fileMapper;

function cleanData() {

	for( let v in mapper ) {
		fs.writeFileSync('./data/' + mapper[v] + '.json', '[]');
	}
}

cleanData();