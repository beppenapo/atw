<?php
require_once("models/sacchetti.class.php");
$scavo = isset($_POST['dati']['scavo']) ? $_POST['dati']['scavo'] : null;
$tipologia = isset($_POST['dati']['tipoId']) ? $_POST['dati']['tipoId'] : null;
$obj = new Sacchetto($scavo, $tipologia);
$funzione = $_POST['dati']['trigger'];
unset($_POST['dati']['trigger']);
if(isset($funzione) && function_exists($funzione)) {
  $trigger = $funzione($obj);
  echo $trigger;
}

function scavoConfig($obj){return json_encode($obj->config);}
function numeroLiberoSacchetto($obj){return json_encode($obj->numeroLiberoSacchetto());}
function usList($obj){return json_encode($obj->usList());}
function addReperto($obj){return json_encode($obj->addReperto($_POST['dati']));}
function updateReperto($obj){return json_encode($obj->updateReperto($_POST['dati']));}
function repertiPie($lavoro){return json_encode($lavoro->repertiPie($_POST['dati']['id']));}
function getSacchetti($lavoro){return json_encode($lavoro->getSacchetti($_POST['dati']['id']));}
function getReperto($lavoro){return json_encode($lavoro->getReperto($_POST['dati']['sacchetto']));}
function setConsegnato($lavoro){return json_encode($lavoro->setConsegnato($_POST['dati']));}
?>
