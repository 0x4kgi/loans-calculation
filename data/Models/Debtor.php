<?php
require_once "Loan.php";
require_once __DIR__ . "/../Utilities/MySqlConnection.php";
class Debtor
{
    public $ID;
    public $name;
    public $loan;
    public function Create($params)
    {
        $this->ID =  hash("SHA3-512", date("ymdhisu"));
        $this->name = $params['name'];
        $this->loan = new LoanData;
        $this->Save("new");
    }
    public function Update($params)
    {
        $this->loan = new LoanData;
        $this->loan->Build($params);
        $this->Save("update");
    }
    public function Retrieve($ID)
    {
        $sql = "SELECT `ID`, `name`, loans  FROM debtor WHERE ID = ?";
        $Database = new MySqlConnection("loan_app", "root", "", "localhost");
        $stmt = $Database->conn->prepare($sql);
        $stmt->bind_param("s", $ID);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $this->Build_Model($result->fetch_assoc());
        } else {
            throw new Exception("Cannot find record of entry ID " . $ID);
        }
    }
    private function Save($mode)
    {
        $json_loan = json_encode($this->loan);
        if ($mode == "edit") {
            try {
                $sql = "UPDATE debtor SET `name` = ?, loans = ? WHERE `ID` = ?";
                $Database = new MySqlConnection("loan_app", "root", "", "localhost");
                $stmt = $Database->conn->prepare($sql);
                $stmt->bind_param("sss", $this->name, $json_loan, $this->ID);
               if (!$stmt->execute()) {
                  throw new Exception("Failed to execute SQL query");
               }
               return;
            } catch (Exception $ex) {
               throw $ex;
            }
         }
         try {
            $sql = "INSERT INTO debtor (`ID`, `name`, loans) VALUES(?,?,?)";
            $Database = new MySqlConnection("loan_app", "root", "", "localhost");
            $stmt = $Database->conn->prepare($sql);
            $stmt->bind_param("sss", $this->ID, $this->name, $json_loan);
            if (!$stmt->execute()) {
               throw new Exception("Failed to execute query");
            }
         } catch (Exception $ex) {
                 throw $ex;
         }
    }
    private function Build_Model($row)
    {
        $this->ID = $row['ID'];
        $this->name = $row['name'];
        $this->loan = json_decode($row['loans']);
    }
}
