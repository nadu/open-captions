var my_ytPlayer;
var global_full_captions = new Array();
var tmpCaptions = "";
var prevCaptions = "";
var showASLTimer;


function onYouTubePlayerReady(videoId){
    // get the captions!
    getCaptionsFromServer(videoId);
    my_ytPlayer = $('#'+videoId)[0];
    $('#backtosearch').show();
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

	//console.log(global_full_captions);//[0].captions,global_full_captions[0].startTime);

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
                
        // hacky way of handling when to show and hide the captions and the previous button. Have to find a better way to do it
        $('.mycaption').show();
        $('#previous').show();

		for(i=0;i<len;i++){
            //console.log(global_full_captions[i].startTime,'-',currTime,'-',global_full_captions[i+1].startTime, global_full_captions[i].startTime + global_full_captions[i].duration);
			if(currTime < global_full_captions[0].startTime){ // if it has not started, call just before the first caption is scheduled
				setTimeout(showAppropriateCaptions, (global_full_captions[0].startTime - currTime)*1000);
				return;
			}
			if(currTime > global_full_captions[len-1].startTime + global_full_captions[len-1].duration){
			    // it has ended, no more captions to show
                $('.mycaption').hide();
                //console.log("run after the captions have ended");
                $("#previous").removeClass('enabled');
                $("#previous").attr("disabled",true);
 			}
		 	if((global_full_captions[len-1].startTime <= currTime && ((global_full_captions[len-1].startTime + global_full_captions[i].duration) > currTime))){
				//console.log("last caption"); 
                if(!$('#previous').hasClass('enabled')){
                    $("#previous").addClass('enabled'); 
                    $("#previous").attr("disabled",false);
                }
                //console.log("now its time to create beautiful captions");
				createBeautifulCaptions(global_full_captions[len-1].captions);
				//console.log("after finding",global_full_captions[i].startTime,currTime,global_full_captions[i+1].startTime);
                //setTimeout(function(){$('.mycaption').hide();},global_full_captions[i].duration*1000);
        		setTimeout(showAppropriateCaptions,global_full_captions[len-1].duration*1000);                                       
				return;
			}
 
            if((global_full_captions[i].startTime <= currTime && (global_full_captions[i+1].startTime > currTime))){
                // found it
                if(!$('#previous').hasClass('enabled')){
                    $("#previous").addClass('enabled'); 
                    $("#previous").attr("disabled",false);
                }
                //console.log("now its time to create beautiful captions");
				createBeautifulCaptions(global_full_captions[i].captions);
				//console.log("after finding",global_full_captions[i].startTime,currTime,global_full_captions[i+1].startTime);
                                //setTimeout(function(){$('.mycaption').hide();},global_full_captions[i].duration*1000);
        		setTimeout(showAppropriateCaptions, 
                                    Math.abs(global_full_captions[i+1].startTime - global_full_captions[i].startTime)*1000);
                                        
				return;
			}
        
		}
	 }
	 
}

function init(){
    $('#previous').click(function(){getPreviousCaption();});
    $('#backtosearch').click(function(){window.history.back();});// is there a better way to do it
}
	
function getPreviousCaption(){
	var prevCaptionsArray = prevCaptions.split(" ");
	$('.mycaption').html("");
	createBeautifulCaptionElements(prevCaptionsArray);
	my_ytPlayer.pauseVideo();
	//console.log(prevCaptionsArray);
}

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
	    $('.mycaption').html("") ;
	    beautifulCaptionsSpan = createBeautifulCaptionElements(captionsArray);
	}
	
}
	
function createBeautifulCaptionElements(a){
    var len = a.length,
        i,
	    beautifulCaptionsSpan = new Array();
    for(i=0;i<len;i++){
        beautifulCaptionsSpan[i] = document.createElement('span');
        beautifulCaptionsSpan[i].innerHTML = a[i];
        //beautifulCaptionsSpan[i].className += " " + 'beautifulCaptions';
        beautifulCaptionsSpan[i].id =  'beautifulCaptions' + i;
        $('.mycaption').append(beautifulCaptionsSpan[i]);
        $('#beautifulCaptions'+i).click((function(w,i){
                                                 return function(){
                                            showASL(w,i);
                                }}(a[i],i)));
	}
	//console.log(beautifulCaptionsSpan);
    return beautifulCaptionsSpan;
}
	
function addSelectedClass(i){
    $('.mycaption span').each(function() {
        if($(this).hasClass("selectedCaption"))
	    $(this).removeClass("selectedCaption");
	});
    $('#beautifulCaptions'+i).addClass("selectedCaption");
}


function showASL(word,i){
	//console.log(word);
	clearTimeout(showASLTimer);
	my_ytPlayer.pauseVideo();		
	addSelectedClass(i);
	
	word = word.replace(/[\.\!\?\,\)\(\]\[\-\!]/g,"");
	getASLPage(word);
	$("#imgWrapper").html("<div id='aslWrapper'><div style='width:240px; height:200px; text-align:center'><iframe id='iframe-0' frameborder='0' scrolling='no' name='iframe-0' src='http://cats.gatech.edu/cats/MySignLink/dictionary/html/pages/"+word.toLowerCase()+".htm'/></div></div>");         
	$('#imgWrapper').show();
	$('#iframe-0').hide();
    $('#aslWrapper').append("<div class='fullviewbutton'><a target='_blank' href='http://cats.gatech.edu/cats/MySignLink/dictionary/html/pages/"+word.toLowerCase()+".htm'>Full Page View</a></div>");
        
	
    var iframe = $("#iframe-0");
	var imgWrap = $("imgWrapper");
    /*var loadImg = document.createElement('img');
	loadImg.setAttribute('id', 'loadImg');
	loadImg.setAttribute('src', 'http://naduism.com/hacks/ASL/loading.gif');
	loadImg.style.position = 'fixed';
	loadImg.style.right = '30px';
	loadImg.style.top = '50px';*/
    $("#aslWrapper").append("<img id='loadImg' src='http://naduism.com/hacks/ASL/loading.gif' style='position:fixed; right:30px;top:50px");
	
	var loadTimer = setTimeout(function(){
                                var loadImg = document.getElementById('loadImg');
                                if($("#aslWrapper").length && loadImg)
                                    $("#aslWrapper").removeChild(loadImg); 
                                    $('#iframe-0').show();
                                },1000);
	showASLTimer = setTimeout(function(){
					$('#imgWrapper').hide();
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

