const id = $("[name=id]").val();
classRubricaSelect();
postData("utenti.php", {dati:{trigger:'getRubrica', id:id}}, fillForm);

function fillForm(data){
  $("#nomeContatto").text(data[0]['nome'])
  $("[name=classe]").val(data[0]['id_classe']);
  $("[name=nome]").val(data[0]['nome']);
  $("[name=email]").val(data[0]['email']);
  $("[name=mobile]").val(data[0]['mobile']);
  $("[name=telefono]").val(data[0]['telefono']);
  $("[name=cod_fisc]").val(data[0]['cod_fisc']);
  $("[name=piva]").val(data[0]['piva']);
  $("[name=indirizzo]").val(data[0]['indirizzo']);
  $("[name=web]").val(data[0]['web']);
  $("[name=note]").val(data[0]['note']);
}


$('[name=submit]').on('click', function (e) {
  form = $("#formModContatto");
  isvalidate = $(form)[0].checkValidity()
  if (isvalidate) {
    e.preventDefault()
    dati={};
    dati.trigger="modContatto";
    $(".form-control").each(function(index, el) {
      if ($(el).val()) { dati[$(el).prop('name')]=$(el).val() }
    });
    postData("utenti.php", {dati}, function(data){
      buildToast(data, 'rubrica.php', null)
    });
  }
})
