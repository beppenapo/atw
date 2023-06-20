const scavo = $("[name=scavo]").val();
const operatore = $("[name=operatore]").val();
const diario = $("[name=diario]").val();
$(".backBtn").on('click', function() { $.redirectPost("workPage.php", {id:scavo});});
$('[name=submit]').on('click', function (e) {
  form = $("#formDiario");
  isvalidate = $(form)[0].checkValidity()
  if (isvalidate) {
    e.preventDefault()
    dati={};
    dati.data = $("[name=data]").val();
    dati.descrizione = $("[name=descrizione]").val();
    if (diario) {
      dati.diario = diario;
      dati.trigger="updateDiario";
      var toast = 'diario modificato correttamente';
    }else {
      dati.scavo = scavo;
      dati.operatore = operatore;
      dati.trigger="addDiario";
      var toast = 'attività giornaliera inserita correttamente';
    }
    postData("lavoro.php", {dati}, function(data){
      if (data === true) {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-success');
        $(".toast>.toast-body").text(toast);
        $(".toast").toast({delay:3000});
        $(".toast").toast('show');
        $('.toast').on('shown.bs.toast', function () { $("[name=submit]").prop('disabled', true); })
        setTimeout(function(){ $.redirectPost('workPage.php', {id: scavo});},3000);
      }else {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-danger');
        $("#headerTxt").html('Errore nella query');
        $(".toast>.toast-body").html(data);
        $(".toast").toast({delay:3000});
        $(".toast").toast('show');
      }
    })
  }
})
