<?php

require_once "conn.php";

$id = $_POST['id'];
$time = $_POST['time'];
$activity = $_POST['activity'];
$duration = $_POST['duration'];
$step_count = $_POST['step_count'];
$calories_burn = $_POST['calories_burn'];
$updatedAt = $_POST['updatedAt'];

$sql = "SELECT * FROM exercise WHERE id = '$id'";
$check = mysqli_query($conn,$sql);
if(mysqli_num_rows($check) > 0){
	
	$result = "UPDATE exercise SET time = '$time', activity = '$activity', duration = '$duration', step_count = '$step_count', calories_burn = '$calories_burn', updatedAt = '$updatedAt' WHERE id = '$id'";
	
	if(mysqli_query($conn,$result)){
		echo "Exerciselist Updated Successfully";
	}else{
		echo "Error Updating Exercise";
	}
}else{
	echo "Unauthorized User";
}

?>