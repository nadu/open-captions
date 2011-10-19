<?php
    require("queryYT.php");	
    if(isset($_GET['videoId']))
    {
        $videoId = $_GET['videoId'];
        $captionfilename = urlencode(checkForCaptions($videoId)); 
	$url = "http://www.youtube.com/api/timedtext?lang=en&format=1&v=".$videoId."&type=track&kind=&hl=en&name=".$captionfilename;
        //echo $url;
	$result = doCurl( $url );
	if($result == 404 ) {
    	    echo "error"; 
	    exit;
	}
	//$result = utf8_encode($result);
	echo ($result);
	
    }
    else{
	echo "word is not set #fail";
    }
?>
