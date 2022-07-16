<?php

require_once "conn.php";

$user_ic = $_POST['ic'];
$sql = "SELECT * from patientdetails WHERE ic = '$user_ic'";
$checkp = mysqli_query($conn,$sql);
if(mysqli_num_rows($checkp) > 0){
	// Output single column
	$rowp = mysqli_fetch_assoc($checkp);
	$userdetails = $rowp['ic'].'/'.$rowp['fullname'].'/'.$rowp['assignedTo'].'/'.$rowp['daily_intake'].'/'.$rowp['weight_goal'].'/'.$rowp['age'].'/'.$rowp['home_address'].'/'.$rowp['phone_number'].'/'.$rowp['gender'].'/'.$rowp['marital_status'].'/'.$rowp['activity_level'].'/'.$rowp['height'].'/'.$rowp['bmi'].'/'.$rowp['surgery_status'].'/'.$rowp['curr_weight'].'/'.$rowp['before_surg_weight'].'/'.$rowp['surgery_date'].'/'.$rowp['updatedAt'];
	echo $userdetails;
}else{
	echo "Patient Details is not Updated";
}


?>