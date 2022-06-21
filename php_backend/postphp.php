<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");
include 'config.php';//make the cofig file include
global $details;//make the connection vars global

$con = mysqli_connect($details['server_host'], $details['mysql_name'],$details['mysql_password'], $details['mysql_database']);

  if (mysqli_connect_errno($con)) {
    die("Failed to connect:" . mysqli_connect_error());
  }

  mysqli_set_charset($con, "utf8");

// Get the posted data.
$postdata = file_get_contents("php://input");


if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
    $request = json_decode($postdata);
	$recapt = $request->recapt;
	$secret = "6LcUhKQUAAAAAPJQXxqkZzJ19ndqPobS5YFM8uCc"; 
	$url =  'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secret) .  '&response=' . urlencode($recapt);  
	$responsecaptch = file_get_contents($url);
	$responseKeys = json_decode($responsecaptch,true);  
	if($responseKeys["success"]) {
  // Validate.
  if(trim($request->text) === '' || trim($request->name) === '' || !isset($request->text)  || !isset($request->name) || !isset($request->area_id))
  {
    return http_response_code(400);
  }
	
  // Sanitize.
  $text = mysqli_real_escape_string($con, trim($request->text));
  $area_id = mysqli_real_escape_string($con, (int)$request->area_id);
  $name = mysqli_real_escape_string($con, trim($request->name));   

  // Store.
  $sql = "INSERT INTO `reviews`(`name`,`area_id`,`text`) VALUES ('{$name}','{$area_id}','{$text}')";

  if(mysqli_query($con,$sql))
  {
    http_response_code(201);
    $reviews = [
      'name' => $name,
      'area_id' => $area_id,
      'text'    => $text,
    ];
    echo json_encode(['data'=>$reviews]);
  }
  else
  {
    http_response_code(422);
  }
		} else {
                http_response_code(409);
        }
}

?>