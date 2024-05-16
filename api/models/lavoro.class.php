<?php
session_start();
require("config/db.class.php");
class Lavoro extends Db{
  function __construct(){}

  public function getWork(int $id){
    $sql = "select s.id, s.nome_lungo as nome, s.sigla, inizio, s.fine, s.chiuso_il, s.ore_stimate as tot_ore, s.descrizione, c.name as comune, l.localizzazione, l.lon, l.lat, r.id as id_direttore, r.nome as direttore from scavo s inner join rubrica r on s.direttore = r.id left join localizzazione l on l.scavo = s.id left join osm c on l.comune = c.osm_id where s.id = ".$id.";";
    return $this->simple($sql);
  }

  public function addWork($dati=array()){
    try {
      $this->pdo()->beginTransaction();
      $dati['scavo']['creato_da'] = $_SESSION['id'];
      $scavoId = $this->addScavo($dati['scavo']);
      $dati['config']['scavo']=$scavoId['field'][0];
      $this->addScavoConfig($dati['config']);
      if (isset($dati['localizzazione'])) {
        $dati['localizzazione']['scavo']=$scavoId['field'][0];
        $this->addLocalizzazione($dati['localizzazione']);
      }
      $this->pdo()->commit();
      return array('res'=>true, 'id'=>$scavoId['field'][0]);
    } catch (\PDOException $e) {
      $this->pdo()->rollBack();
      return $e->getMessage();
    }
  }

  public function modInfoWork(array $dati){
    $filter = array("id" => $dati['id']);
    $sql = $this->buildUpdate('scavo',$filter, $dati);
    $exec = $this->prepared($sql,$dati);
    return $exec;
  }

  public function getUs(int $id){
    $out=array();
    $sqlScreen = "select us.id, us.us, tipo.id id_tipo, tipo.value as tipo, us.definizione, us_info.descrizione, us.compilazione, concat(usr.nome,' ', usr.cognome) as compilatore, us.chiusa from us, us_info, list.tipo_us tipo, users usr where us_info.us = us.id and us.tipo = tipo.id and us.compilatore = usr.id and us.scavo = ".$id." ORDER by us desc;";
    $sqlCsv = "select scavo.nome_lungo nome,scavo.sigla,us.us,initcap(tipo.value) tipo,us.compilazione,concat(users.cognome,' ',users.nome) compilatore,rubrica.nome direttore,us.definizione,area.area,area.saggio,area.settore,area.ambiente,area.quadrato, regexp_replace(info.descrizione, E'(^[\\n\\r]+)|([\\n\\r]+$)', '', 'g' ) descrizione,initcap(info.criterio) criterio,initcap(info.formazione)formazione,initcap(affidabilita.value) affidabilita,initcap(consistenza.value) consistenza,initcap(info.colore) colore,initcap(conservazione.value) conservazione,info.interpretazione,info.osservazioni,info.elem_datanti \"elementi datanti\",info.periodo,info.dati_quantit \"dati quantitativi reperti\",info.modalita,info.datazione,array_to_string(array_agg(concat(rapporto.rapporto,' ',rapporti.us2) order by rapporto.rapporto), ',') rapporti from us inner join scavo on us.scavo = scavo.id inner join list.tipo_us tipo on us.tipo = tipo.id inner join users on us.compilatore = users.id inner join rubrica on scavo.direttore = rubrica.id left join us_area area on area.us = us.id left join us_info info on info.us = us.id left join list.affidabilita_us affidabilita on affidabilita.id = info.affidabilita left join list.conservazione_us conservazione on conservazione.id = info.conservazione left join list.consistenza_us consistenza on consistenza.id = info.consistenza left join us_rapporti rapporti on rapporti.us = us.id left join list.rapporti_us rapporto on rapporti.rapporto = rapporto.id where us.scavo = ".$id." group by scavo.nome_lungo, scavo.sigla, us.us, tipo.value, us.compilazione, users.cognome,users.nome, rubrica.nome, us.definizione, area.area, area.saggio, area.settore, area.ambiente, area.quadrato, info.descrizione, info.criterio, info.formazione, affidabilita.value, consistenza.value, info.colore, conservazione.value, info.interpretazione, info.osservazioni, info.elem_datanti, info.periodo, info.dati_quantit, info.modalita, info.datazione order by us.us asc;";
    $out['screen'] = $this->simple($sqlScreen); 
    $out['csv'] = $this->simple($sqlCsv); 
    return $out;
  }

  public function getOre(array $dati){
    $filter = [];
    if(isset($dati['id'])){array_push($filter, "o.scavo = ".$dati['id']);}
    if(isset($dati['item'])){array_push($filter, "o.id = ".$dati['item']);}
    if(isset($dati['giorno'])){array_push($filter, "o.data = ".$dati['giorno']);}
    if(count($filter) > 0 ){ $filter = "where ".join(" and ", $filter);}
    // $filter = isset($dati['id']) ? "and o.scavo = ".$dati['id'] : "";
    $sql = "
      select o.id, o.data, o.ore, o.operatore operatore_id, concat(u.cognome,' ',u.nome) as operatore from ore o inner join users u on o.operatore = u.id ".$filter." order by o.data desc;";
    return $this->simple($sql);
  }

  public function getDiario(int $id = null){
    $out = [];
    $sqlScreen = "select d.id diario, d.data, d.descrizione, concat(u.nome,' ',u.cognome) operatore from diario d inner join users u on d.operatore = u.id where d.scavo = ".$id." order by d.data desc;";

    $sqlCsv = "select d.data, replace(d.descrizione,E'\n',''), concat(u.nome,' ',u.cognome) operatore from diario d inner join users u on d.operatore = u.id where d.scavo = ".$id." order by d.data desc;";
    $out['screen'] = $this->simple($sqlScreen);
    $out['csv'] = $this->simple($sqlCsv);
    return $out;
  }
  public function getDiarioGiornaliero(array $dati){
    $sql = "select d.id, d.descrizione, concat(u.nome,' ',u.cognome) as operatore from diario d, users u where d.operatore = u.id and d.scavo = ".$dati['scavo']." and d.data = '".$dati['data']."';";
    return $this->simple($sql);
  }

  public function setDiario(int $id){
    $sql = "select data, descrizione from diario where id = ".$id." ;";
    return $this->simple($sql);
  }

  public function getFotopiani(int $id = null){
    $sql = "select * from fotopiano where scavo = ".$id." order by num_fotopiano desc;";
    return $this->simple($sql);
  }  
  public function getFotopiano(int $id){
    return $this->simple("select * from fotopiano where id = ".$id.";")[0];
  }



  private function addScavo($dati = array()){
    try {
      $sql = "insert into scavo(nome_lungo, sigla, inizio, ore_stimate, descrizione, direttore, creato_da) values (:nome, :sigla, :inizio, :ore, :descrizione, :direttore, :creato_da) returning id";
      return $this->returning($sql,$dati);
    } catch (\Exception $e) {
      return $e->getMessage();
    }

  }
  private function addScavoConfig($dati=array()){
    try {
      $sql = "insert into scavo_config(scavo, us, inventario, reperto, campione, sacchetto, fotopiano, tomba) values (:scavo, :us, :inventario, :reperto, :campione, :sacchetto, :fotopiano, :tomba)";
      $this->prepared($sql,$dati);
    } catch (\Exception $e) {
      return $e->getMessage();
    }
  }
  private function addLocalizzazione($dati = array()){
    try {
      $field = array();
      $val = array();
      foreach ($dati as $key => $value) {
        $field[] = $key;
        $val[]= ":".$key;
      }
      $sql = "insert into localizzazione(".implode(", ", $field).") values (".implode(", ", $val).") ";
      $this->prepared($sql,$dati);
    } catch (\Exception $e) {
      throw $e;
    }
  }


  public function deleteWork(int $id){}

  public function addOre($dati=array()){
    $sql = "insert into ore(scavo, data, ore, operatore) values (:scavo, :data, :ore, :operatore)";
    return $this->prepared($sql,$dati);
  }

  public function updateOre(array $dati){
    $this->pdo()->beginTransaction();
    foreach ($dati['dati'] as $item) {
      $sql = "update ore set operatore = :operatore, ore = :ore, data=:data where id = :id";
      $out = $this->prepared($sql, $item);
    }
    $this->pdo()->commit();
    return $out;
  }

  public function deleteOre(int $id){
    $sql ="delete from ore where id = :id";
    return $this->prepared($sql,["id"=>$id]);
  }

  public function eliminaGiornata(array $dati){
    $sql = "delete from ore where scavo =:scavo and data=:data";
    return $this->prepared($sql,$dati);
  }

  public function addDiario($dati=array()){
    $sql = "insert into diario(scavo, data, operatore, descrizione) values (:scavo, :data, :operatore, :descrizione)";
    return $this->prepared($sql,$dati);
  }
  public function updateDiario(array $dati){
    $sql = "update diario set data = :data, descrizione = :descrizione where id = :diario";
    return $this->prepared($sql,$dati);
  }
  public function deleteDiario(int $id){}

  public function addFotopiano($dati=array()){
    $sql = "select coalesce(max(num_fotopiano), null, 0) + 1 as num from fotopiano where scavo = ".$dati['scavo'].";";
    $maxNum = $this->simple($sql);
    $dati['num_fotopiano'] = $maxNum[0]['num'];
    $sql = "insert into fotopiano(scavo, data, us, autore, note, num_fotopiano) values (:scavo, :data, :us, :autore, :note, :num_fotopiano) returning num_fotopiano;";
    return $this->returning($sql,$dati);
  }

  public function updateFotopiano(array $dati){
    $id = $dati['id'];
    unset($dati['id']);
    $filter = array("id"=>$id);
    $sql = $this->buildUpdate('fotopiano', $filter, $dati);
    return $this->prepared($sql,$dati);
  }


  public function deleteFotopiano(int $id){}

  public function addReperto($dati=array()){
    $sql = "select coalesce(max(reperto), null, 0) + 1 as reperto from reperto where scavo = ".$dati['scavo'].";";
    $maxNum = $this->simple($sql);
    $dati['reperto'] = $maxNum[0]['reperto'];
    $sql = "insert into reperto(scavo, us, reperto, materiale, tipologia, note, data, operatore) values (:scavo, :us, :reperto, :materiale, :tipologia, :note, :data, :operatore) returning reperto;";
    return $this->returning($sql,$dati);
  }

  public function setElaborato(array $dati){
    $sql = "update fotopiano set elaborato = :elaborato where scavo = :scavo and id = :id";
    return $this->prepared($sql,$dati);
  }


}
?>
