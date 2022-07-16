<?php

require_once "conn.php";

$id = $_POST['id'];
$time = $_POST['time'];
$name = $_POST['name'];
$type = $_POST['type'];
$ss = $_POST['ss'];
$st = $_POST['st'];
$calories = $_POST['calories'];
$updatedAt = $_POST['updatedAt'];

$sql = "SELECT * FROM diets WHERE id = '$id'";
$check = mysqli_query($conn,$sql);
if(mysqli_num_rows($check) > 0){
	
	$result = "UPDATE diets SET time = '$time', name = '$name', type = '$type', serving_size = '$ss', serving_type = '$st', calories = '$calories', updatedAt = '$updatedAt' WHERE id = '$id'";
	
	if(mysqli_query($conn,$result)){
		echo "Foodlist Updated Successfully";
	}else{
		echo "Error Updating Food";
	}
}else{
	echo "Unauthorized User";
}

?>