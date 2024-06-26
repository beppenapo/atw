<?php
require("config/db.class.php");
class Sacchetto extends Db{
  public $config = array();
  public $tipologia;

  function __construct($scavo = null, $tipologia = null){
    if($scavo){ $this->config = parent::getScavoConfig($scavo); }
    if($tipologia){ $this->tipologia = $tipologia; }
  }

  public function usList(){
    $sql = "select id, us, definizione from us where scavo = ".$this->config['scavo']." order by us desc;";
    return $this->simple($sql);
  }

  public function numeroLiberoSacchetto(){
    $sqlInv = "select coalesce(max(inventario),0) inventario from sacchetto where scavo = ".$this->config['scavo'].";";
    $sqlNum = "select coalesce(max(numero),0) numero from sacchetto where scavo = ".$this->config['scavo']." and tipologia = ".$this->tipologia.";";
    switch ($this->tipologia) {
      case 1: $filter='campione'; break;
      case 2: $filter='reperto'; break;
      case 3: $filter='sacchetto'; break;
    }
    $numInv = $this->simple($sqlInv);
    $numRes = $this->simple($sqlNum);
    $numero = $numRes[0]['numero'] == 0 ? $this->config[$filter] : $numRes[0]['numero'] + 1;
    $inventario = $numInv[0]['inventario'] == 0 ? $this->config['inventario'] : $numInv[0]['inventario'] + 1;
    return array("inventario"=>$inventario, "numero" => $numero);
  }

  public function addReperto($dati = array()){
    $n = $this->numeroLiberoSacchetto();
    $dati['sacchetto']['inventario'] = $n['inventario'];
    $dati['sacchetto']['numero'] = $n['numero'];
    $this->begin();
    $sacchettoId = $this->nuovoSacchetto($dati['sacchetto']);
    if (isset($dati['reperto'])) {
      $dati['reperto']['sacchetto'] = $sacchettoId['field'][0];
      $sql = "insert into reperto(sacchetto, materiale, tipologia) values (:sacchetto, :materiale, :tipologia)";
      $this->prepared($sql,$dati['reperto']);
    }
    if (isset($dati['campione'])) {
      $dati['campione']['sacchetto'] = $sacchettoId['field'][0];
      $sql = "insert into campione(sacchetto, tipologia) values (:sacchetto, :tipologia)";
      $this->prepared($sql,$dati['campione']);
    }
    $this->commitTransaction();
    return array('res'=>true, 'inventario'=>$n['inventario'], 'numero'=>$n['numero']);
  }

  public function updateReperto(array $dati){
    $repertoArr = array("sacchetto"=>$dati['sacchetto'], "tipologia"=>$dati['tipologia'], "materiale" => $dati['materiale']);
    unset($dati['tipologia'], $dati['materiale']);
    $updateSacchettoSql = "update sacchetto set data = :data, us = :us, descrizione = :descrizione, modificato_il = default, modificato_da = :modificato_da where id = :sacchetto;";
    $updateRepertoSql = "update reperto set tipologia = :tipologia, materiale = :materiale where sacchetto = :sacchetto;";
    $this->begin();
    $this->prepared($updateSacchettoSql,$dati);
    $this->prepared($updateRepertoSql,$repertoArr);
    $this->commitTransaction();
    return array('res'=>true);
  }  
  
  public function updateCampione(array $dati){
    $campioneArr = array("sacchetto"=>$dati['sacchetto'], "tipologia"=>$dati['tipologia']);
    $sacchettoArr = array("id"=>$dati['sacchetto'], "us"=>$dati['us'], "descrizione"=>$dati['descrizione'], "data"=>$dati['data'], "compilatore"=>$dati['compilatore'], "modificato_da"=>$dati['modificato_da']);
    $updateSacchettoSql = "update sacchetto set us = :us, descrizione = :descrizione, data = :data, compilatore = :compilatore, modificato_il = default, modificato_da = :modificato_da where id = :id;";
    $updateCampioneSql = "update campione set tipologia = :tipologia where sacchetto = :sacchetto;";
    $this->begin();
    $this->prepared($updateSacchettoSql,$sacchettoArr);
    $this->prepared($updateCampioneSql,$campioneArr);
    $this->commitTransaction();
    return array('res'=>true);
  }

  public function updateSacchetto(array $dati){
    $updateSacchettoSql = "update sacchetto set us = :us, descrizione = :descrizione, data = :data, compilatore = :compilatore, modificato_il = default, modificato_da = :modificato_da where id = :sacchetto;";
    $this->prepared($updateSacchettoSql,$dati);
    return array('res'=>true);

  }

  public function delSacchetto(int $id){}

  private function nuovoSacchetto($dati = array()){
    $sql = "insert into sacchetto(scavo, tipologia, data, compilatore, us, descrizione, inventario, numero) values (:scavo, :tipologia, :data, :compilatore, :us, :descrizione, :inventario, :numero) returning id;";
    return $this->returning($sql,$dati);
  }

  public function repertiPie(int $id = null){
    $filter = $id !== null ? "where scavo.id = ".$id : "";
    $sql="SELECT l.value tipologia, count(r.*) AS tot FROM reperto r JOIN list.tipologia l ON r.tipologia = l.id JOIN sacchetto s ON r.sacchetto = s.id JOIN us ON s.us = us.id JOIN scavo ON us.scavo = scavo.id ".$filter." GROUP BY l.value;";
    return $this->simple($sql);
  }
  public function getSacchetti(int $id = null){
    $out=[];
    $out['reperti'] = $this->getReperti($id);
    $out['campioni'] = $this->getCampioni($id);
    $out['sacchetti'] = $this->getGenerici($id);
    return $out;
  }

  public function setConsegnato(array $sacchetto){
    $sql="update sacchetto set consegnato = ".$sacchetto['stato']." where scavo = ".$sacchetto['scavo']." and id = ".$sacchetto['sacchetto'].";";
    return $this->simple($sql);
  }

  public function getReperto(int $sacchetto){
    $sql = "select * from sacchetto, reperto where reperto.sacchetto = sacchetto.id and sacchetto.id = ".$sacchetto.";";
    return $this->simple($sql)[0];
  }  
  public function getCampione(int $sacchetto){
    $sql = "select s.data, s.us, c.tipologia, s.descrizione, s.compilatore from sacchetto s inner join campione c on c.sacchetto = s.id and s.id = ".$sacchetto.";";
    return $this->simple($sql)[0];
  }
  public function getSacchetto(int $sacchetto){
    return $this->simple("select * from sacchetto where id = ".$sacchetto)[0];
  }


  private function getReperti(int $id = null){
    $filter = $id !== null ? "WHERE s.scavo = ".$id : "";
    $sql="SELECT s.id, us.us, s.inventario, s.numero, s.descrizione reperto,s.consegnato, r.materiale, r.tipologia, s.data
    FROM sacchetto s
    JOIN reperto r ON r.sacchetto = s.id
    JOIN us ON s.us = us.id
    ".$filter."
    ORDER BY s.numero DESC;";
    return $this->simple($sql);
  }

  private function getCampioni(int $id = null){
    $filter = $id !== null ? "WHERE s.scavo = ".$id : "";
    $sql="SELECT s.id, us.us, s.inventario, s.numero, s.descrizione, s.consegnato, t.value as tipo, s.data
    FROM sacchetto s
    JOIN campione c ON c.sacchetto = s.id
    JOIN list.tipo_campione t ON c.tipologia = t.id
    JOIN us ON s.us = us.id
    ".$filter."
    ORDER BY s.numero DESC;";
    return $this->simple($sql);
  }

  private function getGenerici(int $id = null){
    $filter = " where s.tipologia = 3 ";
    $filter = $id !== null ? $filter ."and s.scavo = ".$id : $filter;
    $sql="SELECT s.id, us.us, s.inventario, s.numero, s.descrizione, s.data, s.consegnato
    FROM sacchetto s
    JOIN us ON s.us = us.id
    ".$filter."
    ORDER BY s.numero DESC;";
    return $this->simple($sql);
  }


}

?>
