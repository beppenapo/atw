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
    <input type="hidden" name="usrAct" value="<?php echo $_SESSION['id']; ?>">
    <input type="hidden" name="scavo" value="<?php echo $_POST['scavo']; ?>">
    <input type="hidden" name="sacchetto" value="<?php echo $_POST['sacchetto']; ?>">
    <main class="container pt-5 mt-5">
      <form class="form bg-white pt-2 pb-5 px-3 border rounded shadow" id="formSacchetto">
        <div class="form-row">
          <div class="col border-bottom mb-3 text-center">
            <h2><?php echo $_POST['cantiere']; ?></h2>
            <h4 class="d-block m-0">Aggiorna sacchetto</h4>
            <small class="text-danger">tutti i campi sono obbligatori</small>
          </div>
        </div>
        <div class="form-row mb-3">
          <div class="col-md-2">
            <label for="data">Data creazione</label>
            <input type="date" id="data" class="form-control" name="data" min="2005-01-01" max="<?php echo date('Y-m-d', strtotime('+1 year')); ?>" value="" required>
          </div>
          <div class="col-md-10">
            <label for="us">US</label>
            <select class="form-control" id="us" name="us" required>
              <option value="" selected disabled>--select from list--</option>
            </select>
          </div>
        </div>

        <div class="form-row mb-3">
          <div class="col">
            <label for="descrizione">Descrizione sacchetto</label>
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
    <script src="js/editSacchetto.js" charset="utf-8"></script>
  </body>
</html>
