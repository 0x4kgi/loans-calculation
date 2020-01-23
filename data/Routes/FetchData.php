<?php
require_once __DIR__ . "/../Models/Debtor.php";
require_once __DIR__ . "/../Utilities/MySqlConnection.php";

$IDs = [];

$Database = new MySqlConnection("loan_app", "root", "", "localhost");
$sql = "SELECT `ID` FROM debtor";
$reader = $Database->conn->query($sql);
$data = [];

if ($reader->num_rows > 0) {
    while ($result = $reader->fetch_assoc()) {
        array_push($IDs, $result['ID']);
    }
}

foreach ($IDs as $Debtor_ID) {
    $Debtor_Data = new Debtor;
    $Debtor_Data->Retrieve($Debtor_ID);
    array_push($data, $Debtor_Data);
}

echo json_encode($data);
