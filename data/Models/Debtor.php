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
        $this->loan->Build($params);
        $this->Save("new");
    }

    public function Update($params)
    {
        $this->name = $params['name'];
        $this->loan = new LoanData;
        $this->loan->Build($params);
        $this->Save("update");
    }

    public function Delete($params) 
    {
        $this->name = $params['name'];
        $this->loan = new LoanData;
        $this->loan->Build($params);
        $this->Save("delete");
    }

    public function Retrieve($ID)
    {
        $sql = "SELECT `name`, `loans` FROM debtor WHERE `name` = ?";
        $Database = new MySqlConnection("loan_app", "root", "", "localhost");
        $stmt = $Database->conn->prepare($sql);
        $stmt->bind_param("s", $ID);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $this->Build_Model($result->fetch_assoc());
        } else {
            throw new Exception("Cannot find record of entry {$ID} ");
        }
    }

    private function Save($mode)
    {
        $json_loan = json_encode($this->loan);

        $Database = new MySqlConnection("loan_app", "root", "", "localhost");

        try {
            if ($mode == "update") {
                $sql = "UPDATE debtor SET `loans` = ? WHERE `name` = ?";                
                $stmt = $Database->conn->prepare($sql);
                $stmt->bind_param("ss", $json_loan, $this->name);

                if (!$stmt->execute()) {
                    throw new Exception("Failed to update query");
                }
                return;
            } else if ($mode == "new") {
                $sql = "INSERT INTO debtor (`name`, `loans`) VALUES(?,?)";
                $stmt = $Database->conn->prepare($sql);
                $stmt->bind_param("ss", $this->name, $json_loan);

                if (!$stmt->execute()) {
                    throw new Exception("Failed to insert query");
                }
            } else if ($mode == "delete") {
                $sql = "DELETE FROM debtor WHERE `name` = ?";
                $stmt = $Database->conn->prepare($sql);
                $stmt->bind_param("s", $this->name);

                if (!$stmt->execute()) {
                    throw new Exception("Failed to delete query");
                }
            }
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    private function Build_Model($row)
    {
        $this->name = $row['name'];
        $this->loan = json_decode($row['loans']);
    }
}
