<?php

require_once "conn.php";
$sql = "SELECT * FROM healthcare";

if(!$conn->query($sql)){
    echo "Error connecting to Database";
}else{
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {

        $return_arr['healthcare'] = array();

        while ($row = $result->fetch_array()){
            array_push($return_arr['healthcare'], array( 
                'name'=>$row['name']
            ));
           
        }
        
        echo json_encode($return_arr);

    }

    
}

?>