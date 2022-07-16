<!DOCTYPE html> 
<html> 
	<head>
	<meta charset="utf-8"/>
	<title>Blob File MySQL</title> 
	<link rel="stylesheet" href="style.css">
</head> 
<body>
<?php $dbh = new PDO("mysql:host=localhost;dbname=bsdb", "root", ""); 
if(isset($_POST['btn'])){
	
	$name = $_FILES['myfile']['name']; 
	$type = $_FILES['myfile']['type']; 
	$data = file_get_contents($_FILES['myfile']['tmp_name']);

	$stmt = $dbh->prepare("insert into train_food values('',?,?,?)"); 
	$stmt->bindParam(1, $name); 
	$stmt->bindParam(2, $type); 
	$stmt->bindParam(3, $data); 
	$stmt->execute();
}
?>
<form method="post" enctype="multipart/form-data">
	<input type="file" name="myfile"/>
	<button name="btn">Upload</button> 
</form> 

<ol> 
	<?php 
	$stat = $dbh->prepare("select * from train_food"); 
	$stat->execute(); 
	while($row = $stat->fetch()){	
		echo "<li><a target='_blank' href='view.php?id=".$row['id']."'>".$row['name']."</a><br/> <div class='imgContiner'><img  class='flexibleImg' src='data:".$row['mime'].";base64,".base64_encode($row['data'])."' width='400' height='400'/></div></li>";
	}
	?>
</ol>

</body> 
</html>