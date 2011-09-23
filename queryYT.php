<?php

$clientLibraryPath = '/home/nramakrishnan/naduism.com/open-captions/ZendGdata/library';
$oldPath = set_include_path(get_include_path() . PATH_SEPARATOR . $clientLibraryPath);

require_once 'Zend/Loader.php'; // the Zend dir must be in your include_path
Zend_Loader::loadClass('Zend_Gdata_YouTube');

function printVideoEntry($videoEntry) 
{
  // the videoEntry object contains many helper functions
  // that access the underlying mediaGroup object
    
    echo 'Video: ' . $videoEntry->getVideoTitle() . "";
    echo 'Video ID: ' . $videoEntry->getVideoId() . "\n";
    echo 'Updated: ' . $videoEntry->getUpdated() . "\n";
    echo 'Description: ' . $videoEntry->getVideoDescription() . "\n";
    echo 'Category: ' . $videoEntry->getVideoCategory() . "\n";
  echo 'Tags: ' . implode(", ", $videoEntry->getVideoTags()) . "\n";
  echo 'Watch page: ' . $videoEntry->getVideoWatchPageUrl() . "\n";
  echo 'Flash Player Url: ' . $videoEntry->getFlashPlayerUrl() . "\n";
  echo 'Duration: ' . $videoEntry->getVideoDuration() . "\n";
  echo 'View count: ' . $videoEntry->getVideoViewCount() . "\n";
  echo 'Rating: ' . $videoEntry->getVideoRatingInfo() . "\n";
  echo 'Geo Location: ' . $videoEntry->getVideoGeoLocation() . "\n";
  echo 'Recorded on: ' . $videoEntry->getVideoRecorded() . "\n";
  
  // see the paragraph above this function for more information on the 
  // 'mediaGroup' object. in the following code, we use the mediaGroup
  // object directly to retrieve its 'Mobile RSTP link' child
  foreach ($videoEntry->mediaGroup->content as $content) {
    if ($content->type === "video/3gpp") {
      echo 'Mobile RTSP link: ' . $content->url . "\n";
    }
  }
  
  echo "Thumbnails:\n";
  $videoThumbnails = $videoEntry->getVideoThumbnails();

  foreach($videoThumbnails as $videoThumbnail) {
    echo $videoThumbnail['time'] . ' - ' . $videoThumbnail['url'];
    echo ' height=' . $videoThumbnail['height'];
    echo ' width=' . $videoThumbnail['width'] . "\n";
  }
}
function printVideoFeed($videoFeed)
{
    $count = 0;
    $results = array();
    foreach ($videoFeed as $videoEntry) {
        $videoId = $videoEntry->getVideoId();
        //send video id to the  
        if(!is_null(checkForCaptions($videoId))){
            $results["entries"][$count]["VideoTitle"] = $videoEntry->getVideoTitle();
            $results["entries"][$count]["VideoId"] = $videoEntry->getVideoId();
            $results["entries"][$count]["Updated"] = $videoEntry->getUpdated();
            $results["entries"][$count]["Description"] = $videoEntry->getVideoDescription();
            $results["entries"][$count]["WatchPageUrl"] = $videoEntry->getVideoWatchPageUrl();
            $results["entries"][$count]["FlashPlayerUrl"] = $videoEntry->getFlashPlayerUrl();      
            $results["entries"][$count]["VideoThumbnails"] = $videoEntry->getVideoThumbnails();
            $results["entries"][$count]["VideoAuthor"] = $videoEntry->getMediaGroup()->getMediaCredit()->text;
            //echo "Entry # " . $count . "\n";
            //printVideoEntry($videoEntry);
            //echo "\n";
            $count++;
        }
    }   
    $results["count"] = $count;
    echo '{"results":'.json_encode($results).'}';
}
function checkForCaptions($vId){
    //$vId = "vsvSSGWSyxw";
    $u = "http://video.google.com/timedtext?hl=en&v=".$vId ."&type=list";
    //echo $u;
    $captions = doCurl($u);
    $xml = simplexml_load_string($captions);
    $json = json_encode($xml);
    $array = json_decode($json,TRUE);
    //var_dump ($array);
    if((is_null($array["track"])))
        return null;
    else{
        $captionfilename = $array["track"]["@attributes"]["name"];
        //echo $captionfilename;
    }
    return $captionfilename;
    //echo $captions;
}
 function doCurl($url){
        //echo $url;
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url );
        curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
        $result = curl_exec( $curl );
        if(curl_getinfo($curl, CURLINFO_HTTP_CODE) == 404)
            $result = 404;
        curl_close($curl);
        //echo $result;
        return $result;
}

?>
