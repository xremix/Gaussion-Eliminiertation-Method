'use strict';
var gaussian = {
	tools:{
		cleanArray: function(arr) {
			for (var i = arr.length - 1; i >= 0; i--){
				if(arr[i] === "" || arr[i] === undefined || arr[i] === null){
					arr.splice(i, 1);
				}
			}
			return arr;
		}
	},
	ui: {
		clearContent: function(containerid){
			document.getElementById(containerid).innerText = '';
		},
		writeMatrix: function(containerid, mtr){
			for (var i = 0; i < mtr.length; i++) {
				var row = mtr[i];
				for (var j = 0; j < row.length; j++) {
					document.getElementById(containerid).innerHTML += row[j] + ' ';
					if(j == row.length-2){
						document.getElementById(containerid).innerHTML += ' = ';
					}
				}
				document.getElementById(containerid).innerText += '\n';
			}
			document.getElementById(containerid).innerText += '\n';
	},
	writeResult: function(containerid, row){
		for (var i = 0; i < row.length; i++) {
			if (!isNaN(parseFloat(row[i]))){
				var identifier = String.fromCharCode(97 + i);
				document.getElementById(containerid).innerText += identifier + ' = ' + row[i] + '\n';
			}
		}
	},
	stringToMatrix: function(str){
			var result = str.trim().replace(/\+/g, "").replace(/\=/g, "").split('\n');
			for (var i = 0; i < result.length; i++) {
				result[i] = result[i].split(' ');
				result[i] = gaussian.tools.cleanArray(result[i]);

				for (var j = 0; j < result[i].length; j++) {
					result[i][j] = JSON.parse(result[i][j]);
				}
			}
			console.log(result);
			return result;
		},
	},
	calculator:{
		calcRows: function(row1, row2, id){
			var result = [];
			for (var i = 0; i < row1.length; i++) {
				var row1Res = row1[id] * row2[i];
				var row2Res = row2[id] * row1[i];
				result.push(row1Res - row2Res);
			}  
			return result;
		},
		calculateMatrix: function(mtr, advancedOutput){
			gaussian.ui.writeMatrix('result', mtr);
			var runner = 0;
			var printedStep = 1;
			while(runner+1 < mtr.length){
				for (var i = runner+1; i < mtr.length; i++) {
					mtr[i] = gaussian.calculator.calcRows(mtr[runner], mtr[i], runner);
					// advancedOutput && (document.getElementById('result2').innerText += 'Step ' + printedStep + ':\n');
					// advancedOutput && gaussian.ui.writeMatrix('result2', mtr);
					// printedStep++;
				}
				runner++;
				advancedOutput && (document.getElementById('result2').innerText += 'Step ' + runner + ':\n');
				advancedOutput && gaussian.ui.writeMatrix('result2', mtr);
				printedStep++;
			}
			!advancedOutput && gaussian.ui.writeMatrix('result2', mtr);
		},
		resolveMatrixResults: function(mtr){
			var mtrResults = new Array(mtr[0].length-1);

			for (var i = 1; i <= mtr.length; i++) {

				var row = mtr[mtr.length-i];
				var rowResult = row[row.length-1];
				var secondValue = row[row.length-i-1];
				var additionalValue = 0;

				for (var j = mtrResults.length - 1; j >= 0; j--) {
					if(mtrResults[j]){
						additionalValue += mtrResults[j] * row[j];
					}
				}

				mtrResults[mtrResults.length-i] = (rowResult - additionalValue) / secondValue;
			}
			gaussian.ui.writeResult('result3', mtrResults);
			return mtrResults;
		}
	},
	calculateWholeMatrix: function(){
		gaussian.ui.clearContent('result');
		gaussian.ui.clearContent('result2');
		gaussian.ui.clearContent('result3');
		matrix = gaussian.ui.stringToMatrix(document.getElementById("matrixInput").value);
		gaussian.calculator.calculateMatrix(matrix,  document.getElementById("inputAdvancedOutput").checked);
		gaussian.calculator.resolveMatrixResults(matrix);
	}
};
var matrix = [];
document.getElementById('matrixInput').onkeyup = gaussian.calculateWholeMatrix;
document.getElementById("inputAdvancedOutput").onchange = gaussian.calculateWholeMatrix;
gaussian.calculateWholeMatrix();