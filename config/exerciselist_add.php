<?php

require_once "conn.php";

$ic = $_POST['ic'];
$fullname = $_POST['fullname'];
$assignedTo = $_POST['assignedTo'];
$time = $_POST['time'];
$activity = $_POST['activity'];
$duration = $_POST['duration'];
$step_count = $_POST['step_count'];
$calories_burn = $_POST['calories_burn'];
$createdAt = $_POST['createdAt'];
$updatedAt = $_POST['updatedAt'];

$sql = "INSERT into exercise(ic,fullname,assignedTo,time,activity,duration,step_count,calories_burn,createdAt,updatedAt) values ('$ic','$fullname','$assignedTo','$time','$activity','$duration','$step_count','$calories_burn','$createdAt','$updatedAt')";
$result = mysqli_query($conn,$sql);
if($result){
	
	echo "Exerciselist Added Successfully";

}else{
	echo "Unauthorized User";
}

?>
