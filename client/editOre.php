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
    <main class="container pt-5 mt-5">
      <form class="form bg-white py-5 px-3 border rounded shadow" id="formOre">
        <input type="hidden" name="work" value="<?php echo $_POST['id']; ?>">
        <input type="hidden" name="name" value="<?php echo $_POST['name']; ?>">
        <input type="hidden" name="items" value="<?php echo $_POST['items']; ?>">
        <div class="form-row">
          <div class="col border-bottom mb-3">
            <h3 class="text-center"><?php echo $_POST['name']; ?></h3>
            <h4 class="d-block m-0 text-center">Modifica ore del giorno <?php echo $_POST['giorno']; ?></h4>
            <small class="text-danger">tutti i campi sono obbligatori</small>
          </div>
        </div>
        <div id="wrapData"></div>
        <div class="form-row">
          <div class="col">
            <button type="submit" class="btn btn-primary" name="submit">salva dati</button>
            <a href="#" class="btn btn-outline-secondary backBtn">annulla</a>
          </div>
        </div>
      </form>
    </main>
    <?php require_once("inc/lib.html"); ?>
    <script src="js/editOre.js" charset="utf-8"></script>
  </body>
</html>
