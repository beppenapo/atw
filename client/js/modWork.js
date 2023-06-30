const id = $("[name=id]").val();
direttoreSelect()
postData("lavoro.php", {dati:{trigger:'getWork', id:id}}, function(dati){
  $("[name=nome_lungo]").val(dati[0].nome)
  $("[name=sigla]").val(dati[0].sigla)
  $("[name=direttore]").val(dati[0].id_direttore)
  $("[name=descrizione]").val(dati[0].descrizione)
  $("[name=ore_stimate]").val(dati[0].tot_ore)
  $("[name=inizio]").val(dati[0].inizio)
  $("[name=fine]").attr("min",dati[0].inizio)
});

function fillForm(dati){
}

$('[name=submitInfoWork]').on('click', function (e) {
  form = $("#modInfoWorkForm");
  isvalidate = $(form)[0].checkValidity()
  if (isvalidate) {
    e.preventDefault()
    dati={};
    dati.trigger="modInfoWork";
    $(".form-control").each(function(index, el) {
      if ($(el).val()) { dati[$(el).prop('name')]=$(el).val() }
    });
    postData("lavoro.php", {dati}, function(data){
      buildToast(data, 'workPage.php', {id:id})
    });
  }
})

$('[name=cancelInfoWork]').on('click', function (e) {
  $.redirectPost('workPage.php', {id: id});
});
