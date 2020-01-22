<?php 
require_once __DIR__ . "/../Models/Debtor.php";
require_once __DIR__ . "/../Models/HTTPError.php";

if($_POST['add']){
    
}
else if($_POST['update']){
      
}
else{
    $error = new HTTPError;
    $error->HTTPStatusCode = 400;
    $error->Message = "Unable to process client request. Request body maybe invalid";
    json_encode($error);
}
