<?php
	
	if(isset($_GET['videoId']))
	{
		$videoId = $_GET['videoId'];
		$url = "http://www.youtube.com/api/timedtext?lang=en&format=1&v=".$videoId."&type=track&name=&kind=&hl=en";
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url );
		curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
		$result = curl_exec( $curl );
		
		$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		if($httpCode == 404) {
			echo error; 
			curl_close($curl);
			exit;
		}
		
		$result = utf8_encode($result);
		echo ($result);
		
	}
	else{
		echo "word is not set #fail";
	}
		
?>
