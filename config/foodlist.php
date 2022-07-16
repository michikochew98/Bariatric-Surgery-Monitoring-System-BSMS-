<?php

require_once "conn.php";
$ic = $_GET["ic"];

$qry = "SELECT * FROM diets WHERE ic = '$ic'";

$raw =mysqli_query($conn,$qry);

while($res=mysqli_fetch_array($raw)){
	$data[]=$res;
}
print(json_encode($data));

?>