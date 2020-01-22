<?php 

class LoanData{
    public $Loan_Amount = ""; 
    public $Interest_Rate = ""; 
    public $Terms = "";
    public $PaymentLog =  []; 
    public function Build($params){
       $this->Loan_Amount = $params['amount'];
       $this->Interest_Rate = $params['interest'];
       $this->Terms = $params['terms'];
       $this->PaymentLog = $params['payment'];
    }
}