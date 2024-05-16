const user = $("[name=usrAct]").val();
const scavo = $("[name=scavo]").val();
const ftp = $("[name=ftp]").val();

$(".backBtn").on('click', function() { $.redirectPost('workPage.php', {id:scavo});});

postData('lavoro.php', {dati:{trigger:'getFotopiano', id:ftp}}, function(data){
  console.log(data);
  $("#numFtp").text(data.num_fotopiano)
  $("[name=data]").val(data.data)
  $("[name=us]").val(data.us)
  $("[name=note]").val(data.note)
  userList(data.autore)
  if(data.elaborato){
    $("label.toolBtn").addClass("active");
    $("[name=elaborato]").prop("checked", true)
  }
  setBtnElaborato(data.elaborato)

})

$("[name=elaborato]").on('click', function(){
  let checked = $(this).is(":checked");
  setBtnElaborato(checked)
})

$("[name=submit]").on('click', function(e){
  let form = $("#formFotopiano")[0];
  let isvalidate = form.checkValidity()
  if(isvalidate){
    e.preventDefault()
    dati={};
    dati.trigger="updateFotopiano";
    dati.id = ftp;
    dati.us = $("[name=us]").val();
    dati.note = $("[name=note]").val();
    dati.data = $("[name=data]").val();
    dati.autore = $("[name=compilatore]").val();
    dati.elaborato = $("[name=elaborato]").is(":checked");

    postData('lavoro.php', {dati}, function(data){
      console.log(data);
      if (data === true) {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-success');
        let msg = "Il fotopiano è stato correttamente aggiornato!<br><i class='fas fa-hand-peace'></i> peace!"
        $(".toast-body").html(msg);
        $(".toast").toast({delay:3000});
        $(".toast").toast('show');
        $('.toast').on('shown.bs.toast', function () { $("[name=submit]").prop('disabled', true); })
        $('.toast').on('hidden.bs.toast', function(){$.redirectPost('workPage.php',{id:scavo});})
      }else {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-danger');
        $("#headerTxt").html('Errore nella query');
        $(".toast>.toast-body").html(data.res);
        $(".toast").toast({delay:3000});
        $(".toast").toast('show');
      }
    })
  }
})

function userList(autore){
  postData("liste.php", {tab:'users', orderBy:'cognome asc, nome asc', filter:['classe <= 2']}, function(data){
    data.forEach(function(v,i){
      let opt = $("<option/>", {text:v.cognome+" "+v.nome}).val(v.id).appendTo('#compilatore');
      if (autore == parseInt(v.id)) { opt.prop('selected', true); }
    })
  })
}
function setBtnElaborato(checked){
  let newClass = checked ? 'fa-solid text-success fa-square-check' : 'fa-regular fa-square-check';
  let newLabel = checked ? 'elaborato' : 'non elaborato';
  $("#ftpElaboratoIco").removeClass().addClass(newClass);
  $("#labelTxt").text(newLabel);
}