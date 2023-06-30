<?php
require_once("models/index.class.php");
$obj = new Index;
$funzione = $_POST['dati']['trigger'];
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function getFilterLavoro($obj){return json_encode($obj->getFilterLavoro());}
function getLavoro($obj){
  // $filtri = isset($_POST['dati']['filtri']) ? $_POST['dati']['filtri'] : array();
  return json_encode($obj->getLavoro($_POST['dati']['filtri']));
}

?>
