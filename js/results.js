function showResults(results){
    var data = jQuery.parseJSON(results),
        i,
        index,
        len = data.results.count;         
    //console.log(JSON.parse(results));
    a = data;
    //console.log(data.results.entries[0].VideoThumbnails);
    for(i=0;i<len;i++){
        //var videoId = e.target.getAttribute("id");
        var desc = data.results.entries[i].Description;
        if(desc.length > 200){
            index = desc.indexOf(" ",200);
            desc = desc.substring(0,index) + " ...";
        }
        var htmlstr = "";
        htmlstr = "<div class='videoresult'><div class='thumb'><a href='/open-captions/watch.html#videoId="+data.results.entries[i].VideoId+"'>";
        htmlstr += "<img class='thumbimage' src='"+data.results.entries[i].VideoThumbnails[0].url+"'/></a></div>";
        htmlstr += "<div class='videoresultcontent'><h3 class='videoresulttitle'><a href='/open-captions/watch.html#videoId="+data.results.entries[i].VideoId+"'>";
        htmlstr +=  "<b>"+data.results.entries[i].VideoTitle+ "</b></a></h3>";
        htmlstr += "<p class='videoresultdesc'>"+desc+"</p>";
        htmlstr += "<p class='videoresultowner'> by <a href='http://www.youtube.com/user/"+ data.results.entries[i].VideoAuthor+"'>"+ data.results.entries[i].VideoAuthor+"</a></p></div></div>";
        $('#resultscontainer').append(htmlstr);
        /*
        $('<div/>', {
            id: data.results.entries[i].VideoId,
            click: function(e){
                //alert('Foo'+e.target.getAttribute("id")+' has been clicked!');
                var videoId = e.target.getAttribute("id");
                window.location.href = "http://www.naduism.com/open-captions/showvideo.html#videoId="+videoId;
                
            },
            class: 'video',
            css: {
                height:"90px",
                background: "url('"+data.results.entries[i].VideoThumbnails[0].url+"') no-repeat"
            },
            html: "Title:" + data.results.entries[i].VideoTitle + " Description :" +data.results.entries[i].Description
        }).appendTo($('#resultscontainer'));
        */
    }
}
var a;
function showSearchResults(){
    var query = $('#searchbox').val();
    window.location.href = "http://www.naduism.com/open-captions/results.html#query="+query;
    window.location.reload();
}

function init(){
    $('#searchbox').val(window.location.hash.split('=')[1]);
    $('.searchbutton').click(showSearchResults);
    $('#searchbox').keyup(function(evnt){
                            if(evnt.keyCode == 13)
                                showSearchResults();
                            });

}
function search(){
    var query = window.location.hash.split('=')[1];
    //console.log(query);
    var url = "http://www.naduism.com/open-captions/search.php?query="+query;
    $.get(url,function(result){showResults(result);});

}
