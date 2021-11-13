var domText = document.body.innerText;
var textLength;
var textArray;
var syllablesCountArray = new Array(20);
var syllablesCount;

var vowels = ["a","e","i","o","u","ä","ö","ü","y"];

function wordCount(str){
  textLength = str.split(" ").length;
  textArray = str.split(" ");
}

wordCount(domText);

//Suitable for english language - When used for german language errors can be expected
function syllablesCheckEN(word) {
  word = word.toLowerCase();                                     //word.downcase!
  if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
    return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
}
function syllablesCheckDE(word){
  word = word.toLowerCase();

}



textArray.forEach(function(element, i) {

  syllablesCount = new_count(element);
  console.log(element+" - "+syllablesCount);
  //console.log(element+ " - "+ i);


  /*element = Array.from(element);
  console.log(element);
  syllablesCount = 1;
  for (var i = element.length; i > 0; i--) {
    //console.log(element[i]);
    //console.log(element[i-1]);
    if (vowels.indexOf(element[i-1])!= -1) {
      console.log(element[i-1]);
      flag = 1
    }


  }*/

})


//
for (var i = 1; i <= syllablesCountArray.length; i++) {
  syllablesCountArray[i-1] = new Array(2);
  syllablesCountArray[i-1][0] ="Syllables: - "+i;
  syllablesCountArray[i-1][1] = 0;
}


//Flesch-Wert = 180 - ASL - (58,5 * ASW)
//(ASL - Average Sentence Length) (ASW - Average Number of Syllables per Word)

//console.log(textLength);
//console.log(textArray);
//console.log(syllablesCountArray);
/*

window.addEventListener('DOMContentLoaded', function(event) {
    console.log('DOM fully loaded and parsed');
    var startTime = Date.now();
});


document.addEventListener('mousemove', function(event) {
	console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
});
*/
//check if there was a mouse movement in the last two seconds
