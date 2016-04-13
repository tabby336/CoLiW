<?php
//start session
session_start();

// Include config file and twitter PHP Library by Abraham Williams (abraham@abrah.am)
include_once("config.php");
include_once("inc/twitteroauth.php");

include_once("inc/YouTubequery.php");


?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Amazing!</title>
</head>
<body>
<form  method="get">
  <input type="text" name="command">
  <input type="submit" value="Submit">
</form> 

<?php

	if(isset($_SESSION['status']) && $_SESSION['status'] == 'verified') {
		//Retrive variables
		$screen_name 		= $_SESSION['request_vars']['screen_name'];
		$twitter_id			= $_SESSION['request_vars']['user_id'];
		$oauth_token 		= $_SESSION['request_vars']['oauth_token'];
		$oauth_token_secret = $_SESSION['request_vars']['oauth_token_secret'];
	
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $oauth_token, $oauth_token_secret);			
	} else {
		include("process.php");
	}

	if(isset($_GET["command"])) {
		$command = $_GET["command"]; 
		$pieces = explode("|", $command);
		//foreach($pieces as $piece) {
		//	echo $piece;
		//	echo "CACA ";
		//}
		if(0 === strpos(trim($pieces[0]), 'youtube')) {
			$yt = new YouTubeVideoSearch();
			$yt->__set("q", "caca2");
			echo $yt->getVideoEntrys();

		}


		if (0 === strpos(trim($pieces[1]), 'tweet')) {
			//Post text to twitter
			$my_update = $connection->post('statuses/update', array('status' => $pieces[1]));
			die('<script type="text/javascript">window.top.location="index.php"</script>'); //redirect back to index.php
		}
		
	}

?>  

</body>
</html>