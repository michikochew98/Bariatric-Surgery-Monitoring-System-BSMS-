<?php

require_once "conn.php";

if(isset($_GET['key'])){
	$key = $_GET['key'];
	$query = "SELECT * FROM food_list WHERE name LIKE '%$key%'";
	$result = mysqli_query($conn,$query);
	$response = array();
	while ($row = mysqli_fetch_assoc($result)){
		array_push($response,
		array(
			'id' => $row['id'],
			'name' => $row['name'],
			'serving_type' => $row['serving_type'],
			'serving_weight' => $row['serving_weight'],
			'calories' => $row['calories']
		));
	}
	echo json_encode($response);
}else{
	$query = "SELECT * FROM food_list";
	$result = mysqli_query($conn, $query);
	$response = array();
	while($row = mysqli_fetch_assoc($result)){
		array_push($response,
		array(
			'id' => $row['id'],
			'name' => $row['name'],
			'serving_type' => $row['serving_type'],
			'serving_weight' => $row['serving_weight'],
			'calories' => $row['calories']
		));
	}
	echo json_encode($response);
}

?>