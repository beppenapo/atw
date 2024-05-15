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
function updateCampione($obj){return json_encode($obj->updateCampione($_POST['dati']));}
function updateSacchetto($obj){return json_encode($obj->updateSacchetto($_POST['dati']));}
function getSacchetti($lavoro){return json_encode($lavoro->getSacchetti($_POST['dati']['id']));}
function getReperto($lavoro){return json_encode($lavoro->getReperto($_POST['dati']['sacchetto']));}
function getCampione($lavoro){return json_encode($lavoro->getCampione($_POST['dati']['sacchetto']));}
function getSacchetto($lavoro){return json_encode($lavoro->getSacchetto($_POST['dati']['id']));}
function repertiPie($lavoro){return json_encode($lavoro->repertiPie($_POST['dati']['id']));}
function setConsegnato($lavoro){return json_encode($lavoro->setConsegnato($_POST['dati']));}
?>
