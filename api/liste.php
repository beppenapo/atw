<?php
require_once("config/db.class.php");
$pdo = new Db;
$filter='';
$sql='';
if (isset($_POST['filter'])) {
  $arr = [];
  foreach ($_POST['filter'] as $key => $val) { $arr[]=$key."=".$val; }
  // $filter = " where ". join(" and ", $arr);
  $filter = " where ". join(" and ", $_POST['filter']);
}
$orderBy = isset($_POST['orderBy']) ? " order by ".$_POST['orderBy'] : '';

switch ($_POST['tab']) {
  case 'tipo':
    $sql = "select distinct tipo from reperto order by tipo asc;";
  break;
  case 'materia':
    $sql = "select distinct materia from reperto order by materia asc;";
  break;
  default:
    $sql = "select * from ".$_POST['tab'].$filter.$orderBy.";";
  break;
}

echo json_encode($pdo->simple($sql));
?>
