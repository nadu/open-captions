function clearInitialSearchText(e){
    if($('#searchbox').hasClass('initialsearchtext')){
        $('#searchbox').removeClass('initialsearchtext');
        $('#searchbox').val('');
    }
}
function showSearchResults(){
    var query = $('#searchbox').val();
    window.location = "http://www.naduism.com/open-captions/results.html#query="+query;
}
function init(){
    //attach listeners to various elements
    $('#searchbox').click(clearInitialSearchText);
    $('.searchbutton').click(showSearchResults);
    $('#searchbox').keyup(function(evnt){
                        if(evnt.keyCode == 13)
                            showSearchResults();
                        });
 //   $('#about').click(function(){$("#aboutmodal").modal({opacity:10,position: ["60%","60%"]});});

}
