<?php

require_once "conn.php";

$id = $_POST['id'];

$query = "SELECT * FROM exercise WHERE id = '$id'";
$check = mysqli_query($conn,$query);
$result = array();

if(mysqli_num_rows($check) == 1){																																																									
	$sql = "DELETE FROM exercise WHERE id = '$id'";
		
	if(mysqli_query($conn, $sql)){
		$result['state'] = "delete";
		echo json_encode($result);
	}else{
		echo 'Exercise Already Deleted';
	}
	
}else{
	echo "Invalid";
}
	
?>