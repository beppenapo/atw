classRubricaSelect();
$(".collapseBtn").text(btnListTxt);
$('[name=submit]').on('click', function (e) {
  form = $("#formRubrica");
  isvalidate = $(form)[0].checkValidity()
  if (isvalidate) {
    e.preventDefault()
    dati={};
    dati.classe = $("#classe").val();
    dati.nome = $("#nome").val();
    dati.email = $("#email").val();
    dati.mobile = $("#mobile").val();
    dati.telefono = $("#telefono").val();
    dati.cod_fisc = $("#cod_fisc").val();
    dati.piva = $("#piva").val();
    dati.indirizzo = $("#indirizzo").val();
    dati.web = $("#web").val();
    dati.note = $("#note").val();
    dati.trigger="addRubrica";
    console.log(dati);
    postData("utenti.php", {dati}, function(data){buildToast(data, 'rubrica.php')});
  }
})
