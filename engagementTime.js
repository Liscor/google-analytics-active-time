// 
var debugMode = true;
//percentage share for website partition
var currentClientHeight
var idleState = true;
//scrollArr is used to capture the timings for different scroll depths. Index translates directly to scroll depth in %. E.g. 
var scrollArr =  new Array(100).fill(null);
var modArr = new Array(5).fill(null);
var medianArr = new Array(5).fill(null);

var chunkSize = 20;
var timer= 5000;
var activeTime = 0;

var startTime = Date.now();
debugMode ? console.log("startTime set: "+startTime):null;

var prevTime = 0;
var tempTime;

//Maxmimale Scrolltiefe in Pixeln
var maxScrollHeight = document.documentElement.scrollHeight;// - document.documentElement.clientHeight;

//Größe des Viewports in %
var viewportHeight = Math.round(document.documentElement.clientHeight / maxScrollHeight *100);

//idleCheck();
function setTemplateData(templateDebug, templateTimer){
  debugMode = templateDebug;
  timer = templateTimer;
  idleCheck();
}

function createContentArr(){

    currentClientHeight = this.window.scrollY;    
    var currentScrollDepth = (Math.round(currentClientHeight / maxScrollHeight * 100));
    activeTime += tempTime - prevTime;

    debugMode ? console.log("activeTime: "+activeTime+ " - tempTime - "+ tempTime + " - prevTime - "+ prevTime)  : null;
    
    for (var index = 0; index < viewportHeight; index++) {
        scrollArr[currentScrollDepth+index] += tempTime - prevTime;  
    }
  }
  
  //Check for user interactions, as clicks, scroll etc. Calculates time from event to event. Runs createContentArr to push the item a content was visible into an array.
function idleCheck() {
    
    var time = resetTimer; /*?*/
    window.onpointermove = throttle(resetTimer,500);
    window.onpointerdown = throttle(resetTimer,500);
    window.onclick = throttle(resetTimer,500);
    window.onkeydown = throttle(resetTimer,500);
    document.ontouchstart = throttle(resetTimer,500);
    window.addEventListener("scroll", throttle(resetTimer,500), true);
  
    function resetTimer() {
          
          // If idle state before, set prevTime to current time to skip the idle time in CreateContentArr
        if (idleState == true) {
            prevTime = Date.now() - startTime;
            idleState = false;
        }
         
        tempTime = Date.now() - startTime;

        createContentArr();
        debugMode ? console.log("interval: "+ (tempTime-prevTime)) : null;
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
        var args = arguments;
        var context = this;
        if (!waiting) {
            func.apply(context, args);
            waiting = true;
            setTimeout(function delay(){waiting = false }, limit);
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
      "event": "engagementTime", 
      "timeOnSite": timeOnSite,
      "activeTime": activeTime,
      "idleTime": timeOnSite - activeTime,
      "smallScrollArr": smallScrollArr,
      "scrollArr": scrollArr,
      "medianArr": medianArr
    });
  });
