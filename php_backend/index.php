<?php
header("Access-Control-Allow-Origin:gynecologykz.com");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");
include 'config.php';//make the cofig file include
global $details;//make the connection vars global
 

if($_GET['method'] == "load_news")
{
	$conn = new mysqli($details['server_host'], $details['mysql_name'],$details['mysql_password'], $details['mysql_database']);	
    mysqli_set_charset($conn, "utf8");


    $result = $conn->query("SELECT * FROM typeswork");
    
	$data=array();
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		$row=array();
	   $row['id']=addslashes($rs["id"]);
	   $row['name']=addslashes($rs["name"]);
	  
	   
	   $data[]=$row;
		
	}
	$jsonData=array();
	$jsonData['records']=$data;
 
	$conn->close();
    echo json_encode($jsonData, JSON_UNESCAPED_UNICODE);
}

if($_GET['method'] == "patientinfo")
{
	$conn = new mysqli($details['server_host'], $details['mysql_name'],$details['mysql_password'], $details['mysql_database']);	
    mysqli_set_charset($conn, "utf8");


    $result = $conn->query("SELECT * FROM patientinfo");
    
	$data=array();
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		$row=array();
	   $row['id']=addslashes($rs["id"]);
	   $row['name']=addslashes($rs["name"]);
	   $row['patch']=addslashes($rs["patch"]); 
	   
	   $data[]=$row;
		
	}
	$patientinfo=array();
	$patientinfo['records']=$data;
 
	$conn->close();
    echo json_encode($patientinfo, JSON_UNESCAPED_UNICODE);
}

if($_GET['method'] == "upload")
{
	$conn = new mysqli($details['server_host'], $details['mysql_name'],$details['mysql_password'], $details['mysql_database']);	
    mysqli_set_charset($conn, "utf8");

    $result = $conn->query("SELECT * FROM upload");
    
	$data=array();
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		$row=array();
	   $row['id']=addslashes($rs["id"]);
	   $row['name']=addslashes($rs["name"]);
	   $row['patch']=addslashes($rs["patch"]); 
	   
	   $data[]=$row;
		
	}
	$upload=array();
	$upload['records']=$data;
 
	$conn->close();
    echo json_encode($upload, JSON_UNESCAPED_UNICODE);
}

if($_GET['method'] == "area")
{
	$conn = new mysqli($details['server_host'], $details['mysql_name'],$details['mysql_password'], $details['mysql_database']);	
    mysqli_set_charset($conn, "utf8");

    $result = $conn->query("SELECT * FROM area");
    
	$data=array();
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		$row=array();
	   $row['id']=addslashes($rs["id"]);
	   $row['name']=addslashes($rs["name"]);
	   
	   $data[]=$row;
		
	}
	$area=array();
	$area['records']=$data;
 
	$conn->close();
    echo json_encode($area, JSON_UNESCAPED_UNICODE);
}


if($_GET['method'] == "reviews")
{
	$conn = new mysqli($details['server_host'], $details['mysql_name'],$details['mysql_password'], $details['mysql_database']);	
    mysqli_set_charset($conn, "utf8");

    $result = $conn->query("SELECT t1.id, t1.name, DATE_FORMAT(t1.inputdatetime, '%d.%m.%Y %H:%i') as inputdatetime, t1.text, 
	t2.name as area, t3.name as fotoname, t4.name as videoname 
    FROM reviews t1 
    JOIN area t2 ON (t1.area_id = t2.id)
    LEFT JOIN patientfoto t3 ON (t1.id = t3.reviews_id) 
	LEFT JOIN patientvideo t4 ON (t1.id = t4.reviews_id)
	ORDER BY t1.inputdatetime DESC");
	
	$data=array();
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
	   $row=array();
	   $row['id']=addslashes($rs["id"]);
       $row['name']=addslashes($rs["name"]);
       $row['inputdatetime']=addslashes($rs["inputdatetime"]);
       $row['text']=addslashes($rs["text"]);
	   $row['area']=addslashes($rs["area"]);
	   $row['fotoname']=addslashes($rs["fotoname"]);
	   $row['videoname']=addslashes($rs["videoname"]);
	   
	   $data[]=$row;
		
	}
	$reviews=array();
	$reviews['records']=$data;
 
	$conn->close();
    echo json_encode($reviews, JSON_UNESCAPED_UNICODE);
}

?>
