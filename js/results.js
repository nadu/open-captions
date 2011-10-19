function showResults(results){
    var data = jQuery.parseJSON(results),
        i,
        index,
        len = data.results.count;         
    //console.log(JSON.parse(results));
    //a = data;
    if(len == 0){
        //console.log($('#searchbox'));
        $('#resultscontainer').html("<div> No Results found for <b><i>"+$('#searchbox').val()+"</b></i> </div>");
        return;
    }
    if(data.results.suggested_result){
        $('#resultscontainer').append("<div> Showing Results for <b><i>"+data.results.suggested_result+"</b></i> instead</div>");
    }   
    //console.log(data.results.entries[0].VideoThumbnails);
    for(i=0;i<len;i++){
        //var videoId = e.target.getAttribute("id");
        var desc = data.results.entries[i].Description;
        if(desc.length > 200){
            index = desc.indexOf(" ",200);
            desc = desc.substring(0,index) + " ...";
        }
        var min = Math.floor(data.results.entries[i].VideoDuration/60);
        var seconds = data.results.entries[i].VideoDuration - min*60;
        seconds = (seconds < 10 ? "0" : "") + seconds;
        //console.log(index,desc,desc.length);
        var htmlstr = "";
        htmlstr = "<div class='videoresult'><div class='thumb'><a href='watch.html#videoId="+data.results.entries[i].VideoId+"'>";
        htmlstr += "<img class='thumbimage' src='"+data.results.entries[i].VideoThumbnails[0].url+"'/>";
        htmlstr += "<span class='video-time'>"+min+":"+seconds+"</span></a></div>";
        htmlstr += "<div class='videoresultcontent'><h3 class='videoresulttitle'><a href='watch.html#videoId="+data.results.entries[i].VideoId+"'>";
        htmlstr +=  "<b>"+data.results.entries[i].VideoTitle+ "</b></a></h3>";
        htmlstr += "<p class='videoresultdesc'>"+desc+"</p>";
        htmlstr += "<p class='videoresultowner'> by <a href='http://www.youtube.com/user/"+ data.results.entries[i].VideoAuthor+"'>"+ data.results.entries[i].VideoAuthor+"</a></p></div></div>";
        $('#resultscontainer').append(htmlstr);
    }
}
//var a;
function showSearchResults(){
    var query = $('#searchbox').val();
    window.location.href = "results.html#query="+query;
    window.location.reload();
}

function init(){
    $('#searchbox').val(decodeURIComponent(window.location.hash.split('=')[1]));
    $('.searchbutton').click(showSearchResults);
    $('#searchbox').keyup(function(evnt){
                            if(evnt.keyCode == 13)
                                showSearchResults();
                            });

}
function search(){
    var query = window.location.hash.split('=')[1];
    var url = "search.php?query="+query+"&start_index=1";
    $.get(url,function(result){showResults(result);});
    url = "search.php?query="+query+"&start_index=9";
    $.get(url,function(result){showResults(result);});
    url = "search.php?query="+query+"&start_index=17";
    $.get(url,function(result){showResults(result);});
    url = "search.php?query="+query+"&start_index=25";
    $.get(url,function(result){showResults(result);});
    url = "search.php?query="+query+"&start_index=33";
    $.get(url,function(result){showResults(result);});

}
