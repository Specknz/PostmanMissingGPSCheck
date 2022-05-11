var numMissingGPS = 0;
for(var k in samples){
	var bsn = samples[k]["BlindedSampleNumber"];
	var rawGPS = samples[k]["Location"]["OrchardGPSLocation"].toString();

	// Check for multiple commas in GPS
	if ((rawGPS.match(/\,/g) || []).length > 1){
		console.log(`\nBad GPS for: ${bsn}\nMultiple commas in GPS\nGPS: ${rawGPS}`)
		numMissingGPS++;
		continue;
	}

	// Check each Coordinate
	var gps = samples[k]["Location"]["OrchardGPSLocation"].split(',');
	for(var i in gps){

		// Index for logging user visibility
		var visIndex = parseInt(i) + 1;

		// Check for leading whitespace
		var coordinate = gps[i].trimStart()
		if(coordinate.length != gps[i].length && i == 0){
			console.log(`\nBad GPS for: ${bsn}\nLeading whitespace in Coordinate ${visIndex}: '${gps[i]}'\nGPS: ${rawGPS}`);
			numMissingGPS++;
			break;
		}

		// Check for trailing whitespace
		var coordinate = gps[i].trimEnd()
		if(coordinate.length != gps[i].length){
			console.log(`\nBad GPS for: ${bsn}\nTrailing whitespace in Coordinate ${visIndex}: '${gps[i]}'\nGPS: ${rawGPS}`);
			numMissingGPS++;
			break;
		}

		// Check if GPS has null value
		var coordinate = gps[i].trim()
		var coordinate = parseFloat(coordinate);
		if(isNaN(coordinate)){
			console.log(`\nBad GPS for: ${bsn}\nNull value in Coordinate ${visIndex}: '${gps[i]}'\nGPS: ${rawGPS}`);
			numMissingGPS++;
			break;
		}

		// Check for more than one period
		if ((gps[i].match(/\./g) || []).length > 1){
			console.log(`\nBad GPS for: ${bsn}\nMultiple periods in Coordinate ${visIndex}: ${gps[i]}\nGPS: ${rawGPS}`);
			numMissingGPS++;
			break;
		}

		var coordinate = gps[i];
		// Check each char in coordinate is number, '-' or '.'
		for(var c in coordinate){
			// Pass on '.'
			if (coordinate[c] == "."){
				continue;
			}
			// Pass on First cooridinate negative
			else if(i == 0 && c == 0 && coordinate[c] == "-"){
				continue;
			}
			// Pass on Second cooridinate leading whitespace
			else if(i == 1 && c == 0 && coordinate[c] == " "){
				continue;
			}
			// Pass on Second cooridinate negative
			else if(i == 1 && c == 1 && coordinate[c] == "-"){
				continue;
			}
			// Check for appropriate Whitespace in second Coodinate
			else if(i == 1 && c == 0 && coordinate[c] != " "){
				console.log(`\nBad GPS for: ${bsn}\nNo leading whitespace in second Coordinate: '${gps[i]}'\nGPS: ${rawGPS}`);
				numMissingGPS++;
				break;
			}
			// Check for number
			else if(!isNumber(coordinate[c])){
				console.log(`\nBad GPS for: ${bsn}\nNon Number in Coordinate ${visIndex}: '${coordinate[c]}'\nGPS: ${rawGPS}`);
				numMissingGPS++;
				break;
			}
		}
	}
}
function isNumber(c) {
	return /\d/.test(c);
}