$(document).ready(function() {

 $.ajax({
   url: "complete.json",
   dataType: "json",
   success: function(data) {
     var epiOrg = [];
     var timeOrg = [];
     var epi = [];
     var time = [];
     var missed = 0;
     var ftt = [];
     var fttCount = 0;

     //Retreive values from json data
     for(var i in data) {
       epiOrg.push(data[i].Episode);
       timeOrg.push(data[i].TTE);
       ftt.push(data[i].FTT);
     }

     //Calculate ftt count
     for(var i=0; i<ftt.length; i++) {
       if(ftt[i] == "Yes") {
         fttCount++;
       }
     }

     //Get rid of NaN values for calculations
     for(var i=0; i<timeOrg.length;i++) {
       if(timeOrg[i] !== "NaN") {
         time.push(timeOrg[i]);
         epi.push(epiOrg[i]);
       } else {missed ++} //Count number of missed episodes
     }

    var fttPercent = ((fttCount/(epiOrg.length-missed))*100).toFixed(1)+'%';
    var missedPercent = ((missed/epiOrg.length)*100).toFixed(1)+'%';

    document.getElementById("missed").innerHTML='<i class="icon-right"></i>Episodes missed: '+ missed +' ('+missedPercent+')';
    document.getElementById("missedInt").innerHTML=missed+' ('+missedPercent+')';
    document.getElementById("ftt").innerHTML='<i class="icon-right"></i>Episodes first to talk: '+ fttCount +' ('+fttPercent+')';
    document.getElementById("fttInt").innerHTML=fttCount+' episodes, or '+fttPercent;





//-------------------------------------------------------------------------------------------------------------------------------------------------------------//
// LONGEST AND SHORTEST //
//-------------------------------------------------------------------------------------------------------------------------------------------------------------//
     var longestEpi = 0;
     var shortestEpi = 0;
     //Output which episode # is the longest one
     for(var i=0; i<time.length; i++) {
       if(time[i] == Math.max.apply(null, time)) {
         longestEpi += epi[i];
       } else if (time[i] == Math.min.apply(null, time)) {
         shortestEpi += epi[i];
       }
     }

     var longestTTE = '<i class="icon-right"></i>Longest: '+ moment.duration(Math.max.apply(null, time), 's').format('mm:ss', { trim: false }) +' (#'+longestEpi+')';
     var longestInt = (moment.duration(Math.max.apply(null, time), 's').format('mm:ss', { trim: false })).split(':');
     var shortestTTE = '<i class="icon-right"></i>Shortest: '+ moment.duration(Math.min.apply(null, time), 's').format('mm:ss', { trim: false }) +' (#'+shortestEpi+')';
     var shortestInt = moment.duration(Math.min.apply(null, time), 's').format('mm:ss', { trim: false });

     // NOTE: If longest is increased to 10+ minutes, update to remove substring!!!!!
     document.getElementById("longestInt").innerHTML=longestInt[0].substring(1)+' minutes and '+longestInt[1]+' seconds';
     document.getElementById("shortestInt").innerHTML=shortestInt.substring(4)+' seconds';
     document.getElementById("longest").innerHTML=longestTTE;
     document.getElementById("shortest").innerHTML=shortestTTE;




//-------------------------------------------------------------------------------------------------------------------------------------------------------------//
// MEAN MEDIAN AND MODE //
//-------------------------------------------------------------------------------------------------------------------------------------------------------------//
     //Calculate mean
     var timeSum = 0;
     for(var i = 0; i < time.length; i++) {
       timeSum += time[i];
     }
     var meanTTE = moment.duration(timeSum/time.length, 's').format('mm:ss', { trim: false });
     var meanInt = (timeSum/time.length).toFixed(0);

     //Calculate the median
     time.sort((a,b) => a -b);
     var medianTTE = 'Median: '+ moment.duration((time[(time.length-1) >> 1] + time[time.length >> 1]) / 2, 's').format('mm:ss', { trim: false });

     //Calculate the modes
     var modeMap = {},
            maxCount = 0,
            modes = [];

     time.forEach(function(val) {
       if(!modeMap[val]) modeMap[val] = 1;
       else modeMap[val]++;

       if(modeMap[val] > maxCount) {
         modes = [val];
         maxCount = modeMap[val];
       }

       else if(modeMap[val] === maxCount) {
         modes.push(val);
         maxCount = modeMap[val];
       }
     });

     //Output each mode value in the correct time format using moment.duration.js
     var mode = [];
     for(var i = 0; i < modes.length; i++) {
       if(i == modes.length-1) {
         mode += moment.duration(modes[i], 's').format('mm:ss', { trim: false });
       } else {
         mode += moment.duration(modes[i], 's').format('mm:ss', { trim: false })+', ';
       }
     }

     var modeTTE = 'Modes: '+ mode;
     var modeInt = modes;


     document.getElementById("mean").innerHTML='<i class="icon-right"></i>Mean: '+meanTTE;
     document.getElementById("meanInt").innerHTML=meanInt;
     document.getElementById("median").innerHTML='<i class="icon-right"></i>'+medianTTE;
     document.getElementById("mode").innerHTML='<i class="icon-right"></i>'+modeTTE;
     document.getElementById("modeInt").innerHTML=modeInt;

    }
  });

});
