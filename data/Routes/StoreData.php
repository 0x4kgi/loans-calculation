<?php
require_once __DIR__ . "/../Models/Debtor.php";
require_once __DIR__ . "/../Models/HTTPResponse.php";
header("Content-Type: application/JSON");
if(!isset($_POST['method'])) {
    sendBadRequest();
}
else if ($_POST['method'] == "add") {
    try{
        $new_debtor= new Debtor;
        $new_debtor->Create($_POST);
        $response = new HTTPResponse;
        $response->HTTPStatusCode = 200;
        $response->Message = "Added Successfully.";
        echo json_encode($response);
    }
    catch(Exception $ex){
        sendInternalServerError($ex);
    }
} else if ($_POST['method'] == "update") {
    try{
        $new_debtor= new Debtor;
        $new_debtor->Update($_POST);
        $response = new HTTPResponse;
        $response->HTTPStatusCode = 200;
        $response->Message = "Updated Successfully.";
        echo json_encode($response);
    }
    catch(Exception $ex){
        sendInternalServerError($ex);    
    }
} else {
    sendBadRequest();
}

function sendBadRequest(){
    $error = new HTTPResponse;
    $error->HTTPStatusCode = 400;
    $error->Message = "Unable to process client request. Request body maybe invalid";
    header('HTTP/1.1 400 Bad Request');
    echo json_encode($error);
}

function sendInternalServerError($message){
    $error = new HTTPResponse;
    $error->HTTPStatusCode = 500;
    $error->Message = "Server encountered an exception while processing request. $message";
    header('HTTP/1.1 500 Internal Server Error');
    echo $error->Message;
}