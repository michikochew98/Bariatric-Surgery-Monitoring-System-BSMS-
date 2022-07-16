<?php
require "database.php";
$db = new database();

if (isset($_POST['ic']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['role'])) {
    if ($db->dbConnect()) {
        if ($db->signUp("userdetails", $_POST['ic'], $_POST['email'], $_POST['password'], $_POST['role'])) {
            echo "Sign Up Success";
        } else echo "Sign up Failed";
    } else echo "Error: Database connection";
} else echo "All fields are required";
?>
