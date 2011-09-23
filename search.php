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
  $query->setParam('caption', 'true');//$query->setCaption('true');
  // Note that we need to pass the version number to the query URL function
  // to ensure backward compatibility with version 1 of the API.
  $videoFeed = $yt->getVideoFeed($query->getQueryUrl(2));
  printVideoFeed($videoFeed, 'Search results for: ' . $searchTerms);
}
//searchAndPrint("cats, cc");
?>     
