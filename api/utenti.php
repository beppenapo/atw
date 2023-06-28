<?php
require_once("models/utenti.class.php");
$obj = new Utente;
$funzione = $_POST['dati']['trigger'];
unset($_POST['dati']['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}
function getClassRubrica($obj){return json_encode($obj->getClassRubrica());}
function getRubrica($obj){return json_encode($obj->getRubrica($_POST['dati']['id']));}
function addRubrica($obj){return json_encode($obj->addRubrica($_POST['dati']));}
function modContatto($obj){return json_encode($obj->modContatto($_POST['dati']));}

?>
