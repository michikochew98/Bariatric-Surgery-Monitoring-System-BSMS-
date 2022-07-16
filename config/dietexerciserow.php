<?php

require_once "conn.php";

$ic = $_POST['ic'];

$sql = "SELECT * from diets WHERE ic = '$ic'";
$check = mysqli_query($conn,$sql);

if(mysqli_num_rows($check) > 0){
	// Fetch Results
	$row = mysqli_num_rows($check);
	
	$exer = "SELECT * from exercise WHERE ic = '$ic'";
	$checkexer = mysqli_query($conn,$exer);
	
	$rowexer = mysqli_num_rows($checkexer);
	
	$combinerow = strval($row).'/'.strval($rowexer);
	
	echo $combinerow;
	
}else{
	echo "No data available";
}

?>