<?php
class Conn{
  public $conn;
  public function connect() {
    $params = parse_ini_file('db.ini');
    if ($params === false) {
      throw new \Exception("Error reading database configuration file");
    }
    $conStr = sprintf(
      "pgsql:host=%s;port=%d;dbname=%s;user=%s;password=%s",
      $params['host'],
      $params['port'],
      $params['database'],
      $params['user'],
      $params['password']
    );
    $this->conn = new \PDO($conStr);
    $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
  }
  public function pdo(){
    if (!$this->conn){ $this->connect();}
    return $this->conn;
  }
  public function __destruct(){
    if ($this->conn){ $this->conn = null; }
  }
}

?>
