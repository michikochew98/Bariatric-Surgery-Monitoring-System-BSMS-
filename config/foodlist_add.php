<?php

require_once "conn.php";

$ic = $_POST['ic'];
$fullname = $_POST['fullname'];
$assignedTo = $_POST['assignedTo'];
$time = $_POST['time'];
$name = $_POST['name'];
$type = $_POST['type'];
$serving_size = $_POST['serving_size'];
$serving_type = $_POST['serving_type'];
$calories = $_POST['calories'];
$createdAt = $_POST['createdAt'];
$updatedAt = $_POST['updatedAt'];

$sql = "INSERT into diets(ic,fullname,assignedTo,time,name,type,serving_size,serving_type,calories,createdAt,updatedAt) values ('$ic','$fullname','$assignedTo','$time','$name','$type','$serving_size','$serving_type','$calories','$createdAt','$updatedAt')";
$result = mysqli_query($conn,$sql);
if($result){
	
	echo "Foodlist Added Successfully";

}else{
	echo "Unauthorized User";
}

?>
