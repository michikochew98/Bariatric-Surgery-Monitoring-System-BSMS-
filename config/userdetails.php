<?php

require_once "conn.php";

$email = $_POST['email'];
$role = $_POST['role'];

$sql = "SELECT * from userdetails WHERE email = '$email' AND role =  '$role'";
$check = mysqli_query($conn,$sql);

if(mysqli_num_rows($check) > 0){
	// Fetch Results
	$row = mysqli_fetch_assoc($check);
	$useric = $row['ic'];
	
	$sqlp = "SELECT * from patientdetails WHERE ic = '$useric'";
	$checkp = mysqli_query($conn,$sqlp);
	if(mysqli_num_rows($checkp) > 0){
		// Output single column
		$rowp = mysqli_fetch_assoc($checkp);
		$userdetails = $row['ic'].'/'.$row['fullname'].'/'.$rowp['assignedTo'];
		echo $userdetails;
	}else{
		echo "Patient Details is not Updated";
	}
}else{
	echo "Only Exising User or Patient can Log In";
}

?>