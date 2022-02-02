//Check if dataLayer array of Google Tag Manager is allready declared
window.dataLayer = window.dataLayer || [];


var debug = false;
var currentClientHeight, startTime; 
var idleState = true;
//scrollArr is used to capture the timings for different scroll depths. Index translates directly to scroll depth in %. E.g. 
var scrollArr =  new Array(100).fill(null);
var modArr = new Array(5).fill(null);
var medianArr = new Array(5).fill(null);
//var domText = document.body.innerText ? document.body.innerText : "Leere Eingabe.";
var domText = document.body.textContent ? document.body.textContent : "Empty Input";
var domText = "Während die CPU für die Anzahl Objekte entscheidend ist, sorgt die Grafikkarte für die Darstellung des 3D Cockpits, die Kantenglättung, sowie das Zwischenspeichern der Texturen im VRAM. Bei einer Neuanschaffung würde ich auf eine Grafikkarte mit mindestens 8gb VRAM achten. Trotz Texture Komprimierung werden diese eigentlich immer gänzlich genutzt. Auch für die X-Plane Standard Wolken spielt die Grafikkarte eine wichtige Rolle. Gerade bei einer hohe Wolkenabdeckung muss die GPU oft kämpfen. Da ich bereits seit mehreren Monaten X-Enviro nutze spielt das bei mir keine Rolle. Mehr dazu im Vergleich der Wetter Addons für X-Plane. Achtung bei hohen Auflösungen wie 4k Eine Außnahme ist mir mittlerweile seit kurzem aufgefallen: Bei einer sehr hohen Auflösung, wird tatsächlich wesentlich mehr GPU-Power benötigt um die gleiche Framerate zu erreichen. Das ist logisch, denn eine 4K Auflösung verlangt der Grafikkarte generell wesentlich mehr ab. Hier würde ich empfehlen, mindestens eine Nvidia Geforce 1080 oder stärker zu nutzen. Keine AMD Radeon Grafikkarte für X-Plane 11. AMD Radeon Grafikkarten sind gut, nur leider nicht für X-Plane. Denn leider läuft X-Plane 11 mit den OpenGL von Nvidia meist Problem freier. Zu mindestens war es bei mir und einigen anderen Nutzern der Fall. Ich hoffe das ändert sich in Zukunft noch, würde da aber erstmal auf der sicheren und leider teureren Seite bleiben. Nun zu meinem kleinen Test. Mit meiner Nvidia Geforce 1070 habe ich X-Plane 11.20 in 4K getestet. Leider nicht mit den erhofften Resultaten. Mit den gleichen Einstellungen verlor ich um die Hälfte an FPS. Das herunter Stellen von HDR und Anti-Aliasing in den X-Plane 11 Einstellungen brachte schnelle, aber dennoch leider kleine Erfolge. Mögliche Lösung: Bessere Grafikkarte, Auflösung wieder runterstellen, oder GPU bezogene Einstellungen in X-Plane drastisch runterstellen. Bei Nvidia Grafikkarten empfiehlt sich das Aktivieren von Thread Optimization in den Nvidia Treiber Einstellungen.";
var wordCount, sentencesCount, syllablesPerWord,avgReadingTime, syllablesCount= 0;
//Retrieve the document language
var documentLanguage = document.documentElement.lang ? document.documentElement.lang: 'de-DE';
//Divide the modArr array into chunks. E.g. 20 stands for 20% steps
var chunkSize = 20;
var timer= 5000;
var activeTime = 0;

startTime = Date.now();

var prevTime = 0;
var tempTime;

//Maxmimale Scrolltiefe in Pixeln
var maxScrollHeight = document.documentElement.scrollHeight;// - document.documentElement.clientHeight;

//Größe des Viewports in %
var viewportHeight = Math.round(document.documentElement.clientHeight / maxScrollHeight *100);
    
var vowels = ["a","e","i","o","u","ä","ö","ü","y"];
var prefixes= ["ab","an","auf","aus","be","bei","dar","der","ein","ent","her","hin","vor","ver","er","zer"];

var textArray = prepareTextArray(domText);

function prepareTextArray(inputText){
  return inputText.replace(/[-_&\/\\#,+()$~%'":*<>{}\[\]]/g," ").split(/\s/).filter(function(word){if(word.length > 1) return word });
} 

function countWords(strOrArr){
  return Array.isArray(strOrArr) ? strOrArr.length : strOrArr.replace(".", "").split(" ").length; 
}
  
function countSentences(str){
  return str.split(/[.!?]/).length - 1; 
}

// Calculate procentual share of total amount oflong words (>6 chars) in relation to all words
// ASL + LWS - Avergage Sentence Length + Long Word Share
function calcLongWordRatio(strOrArr) {
  var longWordCount = 0;
  strOrArr.forEach(function(element){
    if (element.length > 6){longWordCount++}
  })
  
  return Math.round(100/strOrArr.length * longWordCount * 100)/100 ;
}

function countLetters(strOrArray){
  var letterCount = 0;
  textArray.forEach(function(element){
    letterCount += element.length;
  })
  return letterCount;
}


function avgWordCount(params) {
  return Math.round(letterCount / wordCount * 100 * 100)/100;
}

function avgSentenceCount(){
  return Math.round(sentencesCount / wordCount * 100 *100)/100
}

function countSyllablesDe(word){
  word = word.toLowerCase();
  
  // Every word consists of atleast 1 syllable
  syllablesPerWord = 1;
    
  //if the word is 3 characters long or smaller return 1 for syllablesCount
  if(word.length <= 3){ return syllablesPerWord; }
    
  //Check if the word contains a prefix and strip the word of this prefix for further calculations
  prefixes.forEach(function(prefix){
    actPrefix = word.substr(0,prefix.length); /*?*/
    if (actPrefix == prefix) { /*?*/
      word= word.substr(prefix.length,word.length); /*?*/
      syllablesPerWord ++;
    }
  });
    
  word = Array.from(word);
      
  //Iterate through the word, starting from the end. Increase syllables count for every vowel followed by a non vowel character. Last 3 characters are ignored.
  if (word.length > 3) {
    for (var i = word.length; i > 3; i--) {
    
      if (vowels.indexOf(word[i-1])!= -1 && vowels.indexOf(word[i-2])== -1) {
        syllablesPerWord++;    
      }
    }
  }
  return syllablesPerWord; 
}
    
//Get the syllables for every word and sum them. Here return value ist not working.
function sumSyllables(){
    syllablesSum = 0;
  
    textArray.forEach(function(element, i) {
      syllablesPerWord= countSyllablesDe(element);
      syllablesSum += syllablesPerWord;
    })
    return syllablesSum; /*?*/
}

//Calculate the word count to screen size ratio to get a word density factor to use in idle timer declaration
function calcWordScreenRatio(wordCount) {
  return wordCount / 100 * viewportHeight; 
}

//Adjusted Flesch-Reading-Ease Index by Toni Amstad for the german language
function freDE(){ 
  var freENCount = 180 - (wordCount/sentencesCount) - 58.5 * (syllablesCount / wordCount);
  return Math.round(freENCount*100);
}
  
//Flesch-Reading-Ease for english language
function freEN(){  
  var freDECount = 206.835 - 84.6*(syllablesCount/wordCount) - 1.015*(wordCount/sentencesCount);
  return Math.round(freDECount*100);
}
function lesbarkeitsindex() {
  var lix = (wordCount / sentencesCount) + longWordRatio;
  return Math.round(lix*100);
}

function colemanLiau(){
  var cli = 0.0588 * avgLetterPerWord - 0.296 * avgSentencePerWord - 15.8;
  return Math.round(cli * 100);  
}

//Average reader can read 200-240 words in a minute which translates to 4 words a second. This function calculates the average reading time of the webpage
function calcReadingTime(wordCount) {
  return Math.round(wordCount / 0.004);  
}
//Calculate text related variables
  
var wordCount = countWords(textArray); /*?*/
var sentencesCount = countSentences(domText);
var syllablesCount = sumSyllables();
var letterCount = countLetters(textArray); /*?*/
var avgLetterPerWord = avgWordCount(); /*?*/
var avgSentencePerWord = avgSentenceCount(); /*?*/
var longWordRatio = calcLongWordRatio(textArray); /*?*/
var avgWordsViewport = calcWordScreenRatio(wordCount); /*?*/
var freDe = freDE(syllablesSum);
var freEN = freEN(syllablesSum);
var lix = lesbarkeitsindex(); /*?*/
var cli = colemanLiau(); /*?*/
var avgReadingTime = calcReadingTime(wordCount);
idleCheck();

if (debug==true) {
  console.log(freEN()); 
  console.log(freDE());
  console.log("Word count: " + countWords(domText));
  console.log("Syllables SUM: "+ sumSyllables());
  console.log("Sentence count: "+sentencesCount);
}

//Push text specific data to the dataLayer of Google Tag Manager
window.dataLayer.push({
  "event": "textStats", 
  "wordCount": wordCount, /*?*/
  "sentencesCount": sentencesCount,/*?*/
  "syllablesCount": syllablesCount, /*?*/
  "readingTime" : avgReadingTime,
  "avgWordsViewport": Math.round(avgWordsViewport),
  "freEN": freEN, /*?*/
  "freDe": freDe, /*?*/
  "lix": lix, /*?*/
  "cli": cli /*?*/  
});

// Pushes the time spent for different content parts in an array. The array index resembles the scrolldepth.
function createContentArr(){

  currentClientHeight = this.window.scrollY;    
  var currentScrollDepth = (Math.round(currentClientHeight / maxScrollHeight * 100));
  activeTime += tempTime - prevTime;
  for (var index = 0; index < viewportHeight; index++) {
    scrollArr[currentScrollDepth+index] += tempTime - prevTime;  
  }
}

//Check for user interactions, as clicks, scroll etc. Calculates time from event to event. Runs createContentArr to push the item a content was visible into an array.
function idleCheck() {
  
  var time = resetTimer;
  window.onmousemove = throttle(resetTimer,500);
  window.onmousedown = throttle(resetTimer,500);
  window.onclick = throttle(resetTimer,500);
  window.onkeydown = throttle(resetTimer,500);
  document.ontouchstart = throttle(resetTimer,500);
  window.addEventListener("scroll", throttle(resetTimer,500), true);

  function resetTimer(eventAction) {
        
        // If idle state before, set prevTime to current time to skip the idle time in CreateContentArr
    if (idleState == true) {
      prevTime = Date.now() - startTime;
      idleState = false;
    }
       
    tempTime = Date.now() - startTime;
        
    createContentArr();

    prevTime = tempTime;
    clearTimeout(time);
    time = setTimeout(ifTimeOut,timer);   
  }
    //Set idle state to true to skip duration of idle in createContentArr
    function ifTimeOut(){
      console.log('Time Out');
      idleState = true;
    }
}

//Limits the execution of the function handed over as a parameter. Limit parameter should be in milliseconds
function throttle(func, limit) {
  var waiting;
  return function() {
        //const is not supported by Google Tag Manager
    var args = arguments;
    var context = this;
    if (!waiting) {
      func.apply(context, args);
      waiting = true;
      setTimeout(function test(){waiting = false }, limit);
    }
  }
}
//To calculate the median
function calcMedian(tempArray){
  tempArray.sort(function(a, b) { return a - b; });
  var middle = Math.floor(tempArray.length / 2);

  return tempArray.length % 2 ? tempArray[middle] : (tempArray[middle-1] + tempArray[middle]) / 2
}
//Reduce the scrollArr into a smaller array with 5 chunks with 20% steps. Reason for this approach is the 500 hits per session limit in Google Analytics. 
//We reduce the potentially size from 100 lines down to 5. Data gets aggregated.
function reduceScrollArr() {

  var tempArray;
  var chunk = chunkSize;
  
  for (var i = 0, j = scrollArr.length, k = 0; i<j; i += chunk, k++) {
    tempArray = scrollArr.slice(i, i + chunk).reduce(function (previousValue, currentValue) {
      return previousValue + currentValue;
    });
    modArr[k] = Math.round(tempArray / chunkSize);
    medianArr[k] = Math.round(calcMedian(scrollArr.slice(i, i + chunk)));
  }
  return modArr;
}
//Fires before a website unloads. This event is not completly reliable. I suspect a significant drop in event share for mobile devices
window.addEventListener("beforeunload", function(event) {
  var smallScrollArr = reduceScrollArr();
  var timeOnSite = Date.now() - startTime; /*?*/
  var engagementShare = Math.round(100/avgReadingTime*activeTime*100)/100
  
  window.dataLayer.push({
    "event": "contentTime", 
    "timeOnSite": timeOnSite,
    "activeTime": activeTime,
    "engagementShare": engagementShare,
    "idleTime": timeOnSite - activeTime,
    "smallScrollArr": smallScrollArr,
    "scrollArr": scrollArr,
    "medianArr": medianArr
  });
});
