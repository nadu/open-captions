function clearInitialSearchText(e){
    if($('#searchbox').hasClass('initialsearchtext')){
        $('#searchbox').removeClass('initialsearchtext');
        $('#searchbox').val('');
    }
}
function showSearchResults(){
    var query = $('#searchbox').val();
    if(query == 'Search for closed captioned videos')
        query = "";

    window.location = "results.html#query="+query;
}
function init(){
    //attach listeners to various elements
    $('#searchbox').click(clearInitialSearchText);
    $('.searchbutton').click(showSearchResults);
    $('#searchbox').keyup(function(evnt){
                        if(evnt.keyCode == 13)
                            showSearchResults();
                        });
 
}
