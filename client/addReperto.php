<?php
  require_once("inc/session.php");
?>
<!doctype html>
<html lang="it">
  <head>
    <?php require_once("inc/meta.html"); ?>
    <?php require_once("inc/css.html"); ?>
  </head>
  <body>
    <?php require_once("inc/header.html"); ?>
    <?php require_once("inc/nav.html"); ?>
    <?php require_once("inc/toast.html"); ?>
    <input type="hidden" name="postId" value="<?php echo $_POST['id']; ?>">
    <input type="hidden" name="usrAct" value="<?php echo $_SESSION['id']; ?>">
    <input type="hidden" name="tipo" value="<?php echo $_POST['tipo']; ?>">
    <main class="container pt-5 mt-5">
      <div class="alert alert-info alert-dismissible fade show">
        <i class="fas fa-lightbulb d-inline-block" style="width:30px;vertical-align:top"></i><span class="d-inline-block" style="width:calc(100% - 30px);">
        I prossimi numeri liberi di inventario e di <span class="pageObject"></span> sono i seguenti:<br>
        <strong>Inventario: </strong><span class="nextInventario"></span><br>
        <strong><span class="pageObject"></span>: </strong><span class="nextSacchetto"></span><br>
        I numeri definitivi di <span class="pageObject"></span> e di inventario ti verranno comunicati al salvataggio del record.</span>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form class="form bg-white py-5 px-3 border rounded shadow" id="formReperto">
        <div class="form-row">
          <div class="col border-bottom mb-3 text-center">
            <h2><?php echo $_POST['name']; ?></h2>
            <h4 class="d-block m-0">Registra un nuovo <span class="pageObject"></span></h4>
            <small class="text-danger">tutti i campi sono obbligatori</small>
          </div>
        </div>
        <div class="form-row mb-3">
          <div class="col-md-2">
            <label for="data">Data</label>
            <input type="date" id="data" class="form-control" name="data" min="2005-01-01" max="<?php echo date('Y-m-d', strtotime('+1 year')); ?>" value="<?php echo date('Y-m-d'); ?>" required>
          </div>
          <div class="col-md-4">
            <label for="us">US</label>
            <select class="form-control" id="us" name="us" required>
              <option value="" selected disabled>--select from list--</option>
            </select>
          </div>
          <div class="col-md-3 cp">
            <label for="tipologia">Tipologia</label>
            <select class="form-control" id="tipologia" name="tipologia">
              <option value="" selecte required>--tipo campione--</option>
            </select>
          </div>
          <div class="col-md-3 rr divTipologia">
            <label for="tipologia"><i class="fas fa-circle-info" data-toggle="tooltip" title="seleziona un valore dalla lista o inseriscine uno manualmente e conferma la scelta cliccando sul pulsante accanto"></i> tipologia</label>
            <div class="input-group">
              <input type="search" class="form-control" id="tipologia" name="tipologia" list="listTipo" value="" placeholder="tipologia" required>
              <datalist id="listTipo"></datalist>
              <div class="input-group-append">
                <button class="btn btn-danger" type="button" id="confirm-tipologia"><i class="fa-solid fa-check"></i></button>
              </div>
            </div>
          </div>
          <div class="col-md-3 rr divMateriale">
            <label for="materiale"><i class="fas fa-circle-info" data-toggle="tooltip" title="seleziona un valore dalla lista o inseriscine uno manualmente e conferma la scelta cliccando sul pulsante accanto"></i> materiale</label>
            <div class="input-group">
              <input type="search" class="form-control" id="materiale" name="materiale" list="listMateriale" value="" placeholder="materiale" required>
              <datalist id="listMateriale"></datalist>
              <div class="input-group-append">
                <button class="btn btn-danger" type="button" id="confirm-materiale"><i class="fa-solid fa-check"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div class="form-row mb-3">
          <div class="col">
            <label for="descrizione">Descrizione <span class="pageObject"></span></label>
            <textarea id="descrizione" name="descrizione" class="form-control" rows="8" placeholder="inserisci descrizione" required></textarea>
          </div>
        </div>
        <div class="form-row mb-3">
          <div class="col">
            <label for="scavo">Operatore</label>
            <select class="form-control w-auto" id="compilatore" name="compilatore" required></select>
          </div>
        </div>
        <div class="form-row">
          <div class="col">
            <button type="submit" class="btn btn-primary" name="submit">salva dati</button>
            <a href="#" class="btn btn-outline-secondary backBtn">annulla</a>
          </div>
        </div>
      </form>
    </main>
    <?php require_once("inc/lib.html"); ?>
    <script src="js/addReperto.js" charset="utf-8"></script>
  </body>
</html>
