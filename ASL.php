<?php
	
	if(isset($_GET['word']))
	{
		$word = $_GET['word'];
                //echo $word;
		$url = "http://cats.gatech.edu/cats/MySignLink/dictionary/html/pages/".addslashes($word).".htm";
		//$url = "http://www.youtube.com/api/timedtext?lang=en&format=1&v=UZHSDjtD-dg&type=track&name=&kind=&hl=en&ts=1316190915530";
		$result = doCurl( $url );
                //echo $url;
	        //echo $result;	
		if($result == 404) {
                        // make a call to the BING Api and return the thumbnail 
                        $url = "http://api.bing.net/json.aspx?AppId=931819FFE27ADFDAF97F4C529CF7EC4B47C5F83B&Query=".$word."&Sources=Image&Version=2.0&Market=en-us&Adult=Moderate&Image.Count=1&Image.Offset=0";
                        $result = doCurl($url);
                        if(result == 404){
                            echo 'error';
                            exit;
                        }
                        $result = utf8_encode($result);
                        $result = json_decode($result);
                        echo ($result->SearchResponse->Image->Results[0]->Thumbnail->Url); 
			
			exit;
		}
		/*curl_close($curl);
		$result = utf8_encode($result);
		echo ($result);
		*/
		//$result = utf8_encode($result);
		echo "found";
		
	}
	else{
		echo "word is not set #fail";
	}
function doCurl($url){
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url );
    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
    $result = curl_exec( $curl );
    if(curl_getinfo($curl, CURLINFO_HTTP_CODE) == 404){
        $result = 404;
    }
    curl_close($curl);
    //echo $result;
    return $result;
    
}		
?>
