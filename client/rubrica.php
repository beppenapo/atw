<?php
require_once("inc/session.php");
?>
<!doctype html>
<html lang="it">
  <head>
    <?php require_once("inc/meta.html"); ?>
    <?php require_once("inc/css.html"); ?>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.21/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.2.5/css/responsive.bootstrap4.min.css">
    <link rel="stylesheet" href="css/rubrica.css">
  </head>
  <body>
    <?php require_once("inc/header.html"); ?>
    <?php require_once("inc/nav.html"); ?>
    <main class="container-fluid pt-5 mt-5">
      <div class="row mb-3">
        <div class="col">
          <h3 class="border-bottom text-center text-md-left">Rubrica utenti</h3>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col text-center text-md-left">
          <a href="addContatto.php" class="btn btn-sm btn-success"><span class="fas fa-plus"></span> nuovo contatto</a>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <table id="dataTable" class="table table-sm table-striped table-bordered display compact" style="width:100%">
            <thead>
              <tr>
                <th>tipologia</th>
                <th>utente</th>
                <th>email</th>
                <th class="no-sort">mobile</th>
                <th class="no-sort">telefono</th>
                <th class="no-sort">indirizzo</th>
                <th class="none">cod.fisc.</th>
                <th class="none">P.IVA</th>
                <th class="none">web</th>
                <th class="none">note</th>
                <th class="all no-sort"></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="card-list card-columns mt-2"></div>
    </main>
    <?php require_once("inc/lib.html"); ?>
    <script src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js" charset="utf-8"></script>
    <script src="https://cdn.datatables.net/1.10.21/js/dataTables.bootstrap4.min.js" charset="utf-8"></script>
    <script src="https://cdn.datatables.net/responsive/2.2.5/js/dataTables.responsive.min.js" charset="utf-8"></script>
    <script src="js/rubrica.js" charset="utf-8"></script>
  </body>
</html>
