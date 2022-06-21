<?php 

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);
	
  // Validate.
  if(trim($request->text) === '' || trim($request->name) === '' || trim($request->city) === '' || trim($request->email1) === '' || trim($request->email2) === '' ||
  !isset($request->text)  || !isset($request->name) || !isset($request->city) || !isset($request->email1) || !isset($request->email2))
  {
    return http_response_code(400);
  }
	
    $to = "nomad20152016@gmail.com"; 
    $from = "info@gynecologykz.com";
   
    $subject = "Обращение c сайта от {$request->email1}";
    $message ="Имя:  {$request->name} \nГород: {$request->city} \n\nEmail:  {$request->email1} \nEmail (повтор): {$request->email2} \n\nТекст письма\n {$request->text}";
	$headers = "From:" . $from;
      
    if(mail($to,$subject,$message,$headers)){
        return http_response_code(200);
    } else{
      return http_response_code(400);
    }
}
?>