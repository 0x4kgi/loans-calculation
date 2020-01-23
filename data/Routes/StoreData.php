<?php
require_once __DIR__ . "/../Models/Debtor.php";
require_once __DIR__ . "/../Models/HTTPResponse.php";

if ($_POST['add']) {
    try{
        $new_debtor= new Debtor;
        $new_debtor->Create($_POST);
        $response = new HTTPResponse;
        $response->HTTPStatusCode = 200;
        $response->Message = "Added Successfully.";
        json_encode($response);
    }
    catch(Exception $ex){
        $error = new HTTPResponse;
        $error->HTTPStatusCode = 500;
        $error->Message = "Server encountered an exception while processing request.";
        header('HTTP/1.1 500 Internal Server Error');
        json_encode($error);
    }
} else if ($_POST['update']) {
    try{
        $new_debtor= new Debtor;
        $new_debtor->ID = $_POST['ID'];
        $new_debtor->Update($_POST);
        $response = new HTTPResponse;
        $response->HTTPStatusCode = 200;
        $response->Message = "Updated Successfully.";
        json_encode($response);
    }
    catch(Exception $ex){
        $error = new HTTPResponse;
        $error->HTTPStatusCode = 500;
        $error->Message = "Server encountered an exception while processing request.";
        header('HTTP/1.1 500 Internal Server Error');
        json_encode($error);
    }
} else {
    $error = new HTTPResponse;
    $error->HTTPStatusCode = 400;
    $error->Message = "Unable to process client request. Request body maybe invalid";
    header('HTTP/1.1 400 Bad Request');
    json_encode($error);
}
