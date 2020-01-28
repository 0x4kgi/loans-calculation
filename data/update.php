<?php

$name = $_POST['name'];
$method = $_POST['method'];
$amount = $_POST['amount'];
$interest = $_POST['interest'];
$terms = $_POST['terms'];
$payment = $_POST['payment'];

var_dump($name);
var_dump($method);
var_dump($amount);
var_dump($interest);
var_dump($terms);
var_dump($payment);

var_dump(json_encode($payment));