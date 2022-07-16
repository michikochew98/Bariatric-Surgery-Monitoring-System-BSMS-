<?php

require_once "conn.php";

$email = $_POST['email'];
$role = $_POST['role'];

$sql = "SELECT * from userdetails WHERE email = '$email' AND role =  '$role'";
$check = mysqli_query($conn,$sql);

if(mysqli_num_rows($check) > 0){
	// Fetch Results
	$row = mysqli_fetch_assoc($check);
	echo "User Exist in Database";
	
}else{
	echo "Only Exising User or Patient can Log In";
}

?>