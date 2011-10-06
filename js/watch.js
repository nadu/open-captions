var my_ytPlayer;
function onYouTubePlayerReady(videoId){
    // get the captions!
    getCaptionsFromServer(videoId);
    my_ytPlayer = $('#'+videoId)[0];
    //console.log(my_ytPlayer);
    //my_ytPlayer.playVideo();
	
    if(my_ytPlayer.addEventListener){
        //console.log("add event listener");
        my_ytPlayer.addEventListener("onStateChange", "showAppropriateCaptions");
    }else if(my_ytPlayer.attachEvent){
        //console.log("attach event");
        my_ytPlayer.attachEvent("onStateChange", "showAppropriateCaptions");
    }
	
	
}

function getCaptionsFromServer(videoId){
    // do an ajax call to get the captions from server // need help with that
    //assuming you have gotten an xml response
    //var videoId = "UZHSDjtD-dg";
    var url ="transcript.php?videoId="+videoId;
    $.get(url, function(response){
                    //console.log(response);
		    parseCaptions(response);
		},"xml");
}

var global_full_captions = new Array();
function parseCaptions(data){
     
    var ctr = 0;
    //console.log(typeof(data));
	 $(data).find("text").each(function() {
	 		global_full_captions[ctr] = {};
	 		global_full_captions[ctr].startTime = parseFloat($(this).attr('start'));
	 		global_full_captions[ctr].duration = parseFloat($(this).attr('dur'));
	 		global_full_captions[ctr].captions = $(this).text();
			ctr++;
	 });
	// console.log(global_full_captions[0].captions,global_full_captions[0].startTime);

}

function showAppropriateCaptions(){
	var i;
	var len = global_full_captions.length;
	var currTime;
	if(my_ytPlayer.getPlayerState() == -1){
	 	//chill relax
	 	return;
	}
        //console.log("showwAppropriatecaptions getting called");
	if(my_ytPlayer.getPlayerState() == 1){
		// its playing video - so get the time and show appropriate captions 
		// this will get triggered when the video starts for the very first time
		//console.log("player state is 1");
		currTime = my_ytPlayer.getCurrentTime();
                //console.log("getting current time after player state is 1 -", currTime," ",len);
		//push the closest time captions to createBeautifulCaptions
		for(i=0;i<len;i++){
			//console.log(global_full_captions[i].startTime,'-',currTime,'-'/*,global_full_captions[i+1].startTime*/, global_full_captions[i].startTime + global_full_captions[i].duration);
			if(currTime < global_full_captions[0].startTime){ // if it has not started, call just before the first caption is scheduled
				setTimeout(showAppropriateCaptions, (global_full_captions[0].startTime - currTime )*1000);
				return;
			}
			if(currTime > global_full_captions[len-1].startTime + global_full_captions[len-1].duration){
			    // it has ended, no more captions to show
                            $('.myCaptionSpan').html("");
                            //$("#previous").attr("disabled","disabled");
			}
			if(global_full_captions[i].startTime <= currTime && (global_full_captions[i].startTime + global_full_captions[i].duration) > currTime){
				// found it 
                                //console.log("now its time to create beautiful captions");
				createBeautifulCaptions(global_full_captions[i].captions);
				//console.log("after finding",global_full_captions[i].startTime,currTime,global_full_captions[i+1].startTime);
				setTimeout(showAppropriateCaptions, Math.abs(global_full_captions[i].duration  - 0.5)*1000);
				return;
			}
		}
	 }
	 
}

function init(){
    $('#previous').click(function(){getPreviousCaption();});
}
	
function getPreviousCaption(){
	var prevCaptionsArray = prevCaptions.split(" ");
	$('.myCaptionSpan').html("");
	//document.getElementsByClassName('myCaptionSpan')[0].innerHTML  = "" ;
	createBeautifulCaptionElements(prevCaptionsArray);
	my_ytPlayer.pauseVideo();
	//console.log(prevCaptionsArray);
}

var tmpCaptions = "";
var prevCaptions = "";

function createBeautifulCaptions(captions){
	//split, add CSS, push into InnerHTML
	captions = captions.replace("\n"," "); // replacing new lines with space 	
	var captionsArray = captions.split(" "),
		len = captionsArray.length,
		i, 
		beautifulCaptions = "";
		beautifulCaptionsSpan = new Array();
	if(tmpCaptions !== captions){
		//console.log(prevCaptions, "***", captions);
		prevCaptions = tmpCaptions;
		tmpCaptions = captions; // storing it for later use only if it has changed
		
		$('.myCaptionSpan').html("") ;
		beautifulCaptionsSpan = createBeautifulCaptionElements(captionsArray);
	}
	
}
	
function createBeautifulCaptionElements(a){
	var len = a.length,
		i,
	beautifulCaptionsSpan = new Array();
	for(i=0;i<len;i++){

		beautifulCaptionsSpan[i] = document.createElement('div');
		beautifulCaptionsSpan[i].innerHTML = a[i];
		beautifulCaptionsSpan[i].className += " " + 'beautifulCaptions';
		beautifulCaptionsSpan[i].id =  'beautifulCaptions' + i;
		/*beautifulCaptionsSpan[i].addEventListener('click', (function(w,i){
										return function(){
											   showASL(w,i);
										   }
										}(a[i],i)));
		*/																
		//document.getElementsByClassName('myCaptionSpan')[0].appendChild(beautifulCaptionsSpan[i]);
		$('.myCaptionSpan').append(beautifulCaptionsSpan[i]);
		$('#beautifulCaptions'+i).click((function(w,i){
                                                    return function(){
						        showASL(w,i);
						    }}(a[i],i)));
	}
	//console.log(beautifulCaptionsSpan);
	return beautifulCaptionsSpan;
}
	
function addSelectedClass(i){
	$('.beautifulCaptions').each(function() {
		if($(this).hasClass("selectedCaption"))
			$(this).removeClass("selectedCaption");
	});
	$('#beautifulCaptions'+i).addClass("selectedCaption");
}

var showASLTimer;
function showASL(word,i){
	//console.log(word);
	clearTimeout(showASLTimer);
	my_ytPlayer.pauseVideo();		
	addSelectedClass(i);
	
	word = word.replace(/[\.\!\?\,\)\(\]\[]/g,"");
	getASLPage(word);
	document.getElementById("imgWrapper").innerHTML = "<div id='aslWrapper' style='background-color:white; opacity=1; width: 240px; height:200px; right:10px; position:fixed; background-position:center;background-repeat:no-repeat; border-radius: 6px;-moz-border-radius: 6px; z-index:1000; border: 2px black solid;'><div style='width:240px; height:200px; text-align:center'><iframe id='iframe-0' style='margin-left:-10px;' class=' iframe-delta-0' height='180' width='220' frameborder='0' scrolling='no' name='iframe-0' src='http://cats.gatech.edu/cats/MySignLink/dictionary/html/pages/"+word.toLowerCase()+".htm'/></div></div>";
				
	document.getElementById('imgWrapper').style.display = 'block';
	document.getElementById('iframe-0').style.display = 'none';
				
	var iframe = document.getElementById("iframe-0");
	var loadImg = document.createElement('img');
	var imgWrap = document.getElementById("imgWrapper");
	loadImg.setAttribute('id', 'loadImg');
	loadImg.setAttribute('src', 'http://naduism.com/hacks/ASL/loading.gif');
	loadImg.style.position = 'fixed';
	loadImg.style.right = '30px';
	loadImg.style.top = '50px';
	document.getElementById("aslWrapper").appendChild(loadImg);
	
	var loadTimer = setTimeout(function(){
								var loadImg = document.getElementById('loadImg');
								if($("#aslWrapper").length && loadImg)
									document.getElementById("aslWrapper").removeChild(loadImg); 
								document.getElementById('iframe-0').style.display = 'inline';	
						},1000);
	showASLTimer = setTimeout(function(){
					document.getElementById('imgWrapper').style.display = 'none'; 
					$('#beautifulCaptions'+i).removeClass("selectedCaption");
				},8000);
}



function getASLPage(word){
	var url = "ASL.php?word="+encodeURI(word.toLowerCase());
        //console.log(url);
	$.get(url,function(response){
                        //console.log(response);
			if(response == "error"){
				$('#aslWrapper').html("<div style='text-align:center; padding:20px'> <img src='http://naduism.com/hacks/ASL/sorry.gif'/> <p>this word was not found in our database </p></div>");
			}
                        else if(response != "found"){
                                 $('#aslWrapper').html("<div style='text-align:center; padding:20px'> <img src='"+response+"'/> </div>");

                        }
			});
				
}
