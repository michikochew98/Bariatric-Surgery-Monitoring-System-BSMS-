<?php
require "database.php";
require "conn.php";

$db = new database();

$email = $_POST['email'];
$role = "Patient";

$sql = "SELECT * from userdetails WHERE email = '$email' AND role =  '$role'";
$check = mysqli_query($conn,$sql);

if(mysqli_num_rows($check) > 0){
    if (isset($_POST['email']) && isset($_POST['password'])) {
        if ($db->dbConnect()) {
            if ($db->logIn("userdetails", $_POST['email'], $_POST['password'])) {
                $row = mysqli_fetch_array($check);
                $ic = $row["ic"];
                echo "Login Success";
            } else echo "Email or Password wrong";
        } else echo "Error: Database connection";
    } else echo "All fields are required";
}else{
    echo "Only Exising User or Patient can Log In";
}
?>
