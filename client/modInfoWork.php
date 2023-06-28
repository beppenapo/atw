<?php
  require_once("inc/session.php");
?>
<!doctype html>
<html lang="it">
  <head>
    <?php require_once("inc/meta.html"); ?>
    <?php require_once("inc/css.html"); ?>
    <style media="screen">
      form label{margin:0}
    </style>
  </head>
  <body>
    <?php require_once("inc/header.html"); ?>
    <?php require_once("inc/nav.html"); ?>
    <?php require_once("inc/toast.html"); ?>
    <main class="container pt-5 mt-5">
      <form class="form bg-white p-3 border rounded shadow" id="modInfoWorkForm">
        <input type="hidden" name="id" class="form-control" value="<?php echo $_POST['id']; ?>">
        <div class="form-row mb-3">
          <div class="col border-bottom ">
            <h4 class="d-block m-0">Modifica i dati principali</h4>
            <small class="text-danger">I campi in rosso sono obbligatori</small>
          </div>
        </div>
        <div class="form-row mb-3 border-bottom">
          <div class="form-group col-md-6 mb-3 mb-sm-3 mb-md-0">
            <label for="nome_lungo" class="text-danger"><i class="fas fa-info-circle" data-toggle="tooltip" data-placement="auto" title="Nome esteso, es. 'Cles, campi neri'"></i> Nome</label>
            <input type="text" class="form-control" id="nome_lungo" name="nome_lungo" value="" placeholder="nome identificativo" required>
          </div>
          <div class="form-group col-md-2 mb-3 mb-sm-3 mb-md-0">
            <label for="sigla" class="text-danger"><i class="fas fa-info-circle" data-toggle="tooltip" data-placement="auto" title="inserisci la sigla di scavo così come compare sulla lavagnetta e su tutta la documentazione"></i> Sigla scavo</label>
            <input type="text" class="form-control" id="sigla" name="sigla" value="" placeholder="sigla scavo" required>
          </div>
          <div class="col-md-4">
            <label for="direttore" class="text-danger">Direttore scavo</label>
            <select class="form-control" id="direttore" name="direttore" required>
              <option value="" selected disabled>--select from list--</option>
            </select>
          </div>
        </div>
        <div class="form-row mb-3 border-bottom">
          <div class="form-group col mb-3 mb-sm-3 mb-md-0">
            <label for="descrizione" class="text-danger">Descrizione</label>
            <textarea name="descrizione" id="descrizione" class="form-control" rows="8" required></textarea>
          </div>
        </div>
        <div class="form-row mb-3 border-bottom">
          <div class="form-group col-md-3 mb-3 mb-sm-3 mb-md-0">
            <label for="ore_stimate" class="text-danger">Ore stimate</label>
            <input type="number" id="ore_stimate" class="form-control" name="ore_stimate" placeholder="ore stimate" step="1" min="0" value="" required>
          </div>
          <div class="form-group col-md-3 mb-3 mb-sm-3 mb-md-0">
            <label for="inizio">Inizio lavori</label>
            <input type="date" id="inizio" class="form-control" name="inizio" min="2005-01-01" max="<?php echo date('Y-m-d', strtotime('+1 year')); ?>" value="" required>
          </div>
          <div class="form-group col-md-3">
            <label for="inizio">Fine lavori</label>
            <input type="date" id="fine" class="form-control" name="fine" min="" max="<?php echo date('Y-m-d', strtotime('+1 year')); ?>" value="">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col">
            <button type="submit" class="btn btn-primary" name="submitInfoWork">salva dati</button>
          </div>
        </div>
      </form>
    </main>
    <?php require_once("inc/lib.html"); ?>
    <script src="js/modWork.js" charset="utf-8"></script>
  </body>
</html>
