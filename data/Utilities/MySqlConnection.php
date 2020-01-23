<?php

class MySqlConnection
{
    public $conn;
    public function __Construct($databaseName, $username, $password, $domain)
    {
        $this->conn = mysqli_init();
        mysqli_real_connect($this->conn, $domain, $username, $password, $databaseName, 3306);
        if ($this->conn->connect_error) {
            throw new Exception("Failed to create a database connection");
        }
    }
}
