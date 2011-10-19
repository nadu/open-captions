<?php
require("queryYT.php");
if(isset($_GET['query'])){
    searchAndPrint($_GET['query']);
}else{
    echo "error";
}

function searchAndPrint($searchTerms = 'sesame street')
{
    $yt = new Zend_Gdata_YouTube();
    $yt->setMajorProtocolVersion(2);
    $query = $yt->newVideoQuery();
    $query->setOrderBy('relevance');
    $query->setSafeSearch('moderate');
    $query->setVideoQuery($searchTerms);
    $query->setParam('caption', 'true');
    $query->setParam('start-index', $_GET['start_index']);
    $query->setParam('max-results',8);
    
    //$query->setParam('max-results','2');
    // Note that we need to pass the version number to the query URL function
    // to ensure backward compatibility with version 1 of the API.
    //echo $query->getQueryUrl(2); 
    //$videoFeed = $yt->getVideoFeed("http://gdata.youtube.com/feeds/api/videos?orderby=relevance&safeSearch=moderate&q=sesame+street");
    $videoFeed = $yt->getVideoFeed($query->getQueryUrl(2));
    $links = $videoFeed->getLink();
    $suggestFlag = null;
    foreach($links as $link){
        if($link->getRel() == 'http://schemas.google.com/g/2006#spellcorrection'){
            $videoFeed = $yt->getVideoFeed($link->getHref());
            //print_r($link->getTitle());
            $suggestFlag = $link->getTitle();
            break;
        }
    }
    //if($links[1]){
        
    //} 
   printVideoFeed($videoFeed, $suggestFlag);//'Search results for: ' . $searchTerms);
}
//searchAndPrint("cats, cc");
?>     
