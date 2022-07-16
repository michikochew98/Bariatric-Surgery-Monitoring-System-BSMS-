<?php

require_once "conn.php";

$ic = $_POST['ic'];
$role = $_POST['role'];

$sql = "SELECT * from patientdetails WHERE ic = '$ic'";
$check = mysqli_query($conn,$sql);

if(mysqli_num_rows($check) > 0){
	// Fetch Results
	$row = mysqli_fetch_assoc($check);

	// Output single column
	echo $row['ic'];
}else{
	echo "Only Exising User or Patient can Log In";
}

?>