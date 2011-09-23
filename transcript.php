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
	$result = utf8_encode($result);
	echo ($result);
	
    }
    else{
	echo "word is not set #fail";
    }
   /* 
    function doCurl($u){
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $u );
        curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
        $result = curl_exec( $curl );
        //echo $result;
        if(curl_getinfo($curl, CURLINFO_HTTP_CODE) == 404)
            $result = 404;
        curl_close($curl);
        return $result;
    }*/		
?>
