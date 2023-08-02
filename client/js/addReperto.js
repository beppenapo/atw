const model = 'sacchetti.php';
const scavo = $("[name=postId]").val();
const tipoRecord = $("[name=tipo]").val();
const userAct = parseInt($("[name=usrAct]").val());
let title, tipoId;
let check_tipologia, check_materiale = false;

$(".backBtn").on('click', function() { $.redirectPost('workPage.php', {id:postId});});

postData('liste.php', {tab:'us', orderBy:'us desc', filter:["scavo = "+scavo]}, function(data){
  data.forEach(function(v,i){
    $("<option/>",{value:v.id, text:v.us+" - "+v.definizione}).appendTo('#us');
  })
})

postData("liste.php", {tab:'users', orderBy:'cognome asc, nome asc', filter:['classe <= 2']}, function(data){
  data.forEach(function(v,i){
    let opt = $("<option/>", {text:v.cognome+" "+v.nome}).val(v.id).appendTo('#compilatore');
    if (userAct == parseInt(v.id)) { opt.prop('selected', true); }
  })
})

switch (tipoRecord) {
  case 'rr':
    title = 'reperto';
    tipoId = 2;
    $(".form-row > .cp").remove();
    $(".form-row > .rr").show();
    postData("liste.php", {tab:'tipo'}, function(data){
      data.forEach(function(v,i){
        $("<option/>", {value:v.tipologia}).appendTo('#listTipo');
      })
    })
    postData("liste.php", {tab:'materia'}, function(data){
      data.forEach(function(v,i){
        $("<option/>", {value:v.materiale}).appendTo('#listMateriale');
      })
    })
  break;
  case 'sg':
    title = 'sacchetto generico';
    tipoId = 3;
    $(".form-row > .rr, .form-row > .cp").remove();
  break;
  case 'cp':
    title = 'campione';
    tipoId = 1;
    $(".form-row > .divMateriale, .form-row > .divTipologia").remove();
    $(".form-row > .cp").show();
    postData("liste.php", {tab:'list.tipo_campione'}, function(data){
      data.forEach(function(v,i){
        $("<option/>").val(v.id).text(v.value).appendTo('#tipologia');
      })
    })
  break;
}
postData(model, {dati:{trigger:'numeroLiberoSacchetto',scavo:scavo, tipoId:tipoId}}, function(data){
  $(".nextInventario").text(data.inventario);
  $(".nextSacchetto").text(data.numero);
});

$(".pageObject").text(title);

$('[name=submit]').on('click', function (e) {
  form = $("#formReperto");
  isvalidate = $(form)[0].checkValidity()
  if (isvalidate) {
    e.preventDefault()
    if(tipoId == 2 && !check_tipologia){
      alert('devi confermare la scelta della tipologia cliccando sul pulsante accanto al campo');
      return false;
    }
    if(tipoId == 2 && !check_materiale){
      alert('devi confermare la scelta del materiale cliccando sul pulsante accanto al campo');
      return false;
    }
    dati={};
    dati.scavo = scavo;
    dati.tipoId = tipoId;
    dati.trigger="addReperto";
    dati.sacchetto={};
    dati.sacchetto.scavo = scavo;
    dati.sacchetto.tipologia = tipoId;
    dati.sacchetto.data = $("[name=data]").val();
    dati.sacchetto.compilatore = $("[name=compilatore]").val();
    dati.sacchetto.us = $("[name=us]").val();
    dati.sacchetto.descrizione = $("[name=descrizione]").val();
    if (tipoId==2) {
      dati.reperto={};
      dati.reperto.materia = $("[name=materiale]").val();
      dati.reperto.tipo = $("[name=tipologia]").val();
    }
    if (tipoId == 1) {
      dati.campione={};
      dati.campione.tipologia = $("[name=tipologia]").val();
    }
    postData(model, {dati}, function(data){
      console.log(data);
      if (data.res === true) {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-success');
        let msg = "I dati del record appena inserito sono i seguenti:<br> <strong>inventario: </strong>"+data.inventario+"<br><strong>numero: </strong>"+data.numero+"<br>appena sei pronto chiudi questo messaggio!<br><i class='fas fa-hand-peace'></i> peace!"
        $(".toast-body").html(msg);
        $(".toast").toast({delay:3000});
        $(".toast").toast('show');
        $('.toast').on('shown.bs.toast', function () { $("[name=submit]").prop('disabled', true); })
        $('.toast').on('hidden.bs.toast', function () { $.redirectPost('workPage.php', {id: dati.scavo}); })
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

$("#confirm-tipologia").on('click', function(){toggleCheck('tipologia')})
$("#confirm-materiale").on('click', function(){toggleCheck('materiale')})

$("[name=tipologia]").on("keyup search", function(){toggleList('tipologia')})
$("[name=materiale]").on("keyup search", function(){toggleList('materiale')})

function toggleList(el){
  el == 'tipologia' ? check_tipologia = false : check_materiale = false;
  if($("[name="+el+"]").val().length == 0){
    $("#confirm-"+el)
      .removeClass('btn-success')
      .addClass('btn-danger')
      .prop('disabled', false)
      .find('i')
        .removeClass('fa-circle-check')
        .addClass('fa-check')
  }
}

function toggleCheck(el){
  el == 'tipologia' ? check_tipologia = true : check_materiale = true;
  let val = $("[name="+el+"]").val();
  if(!val){
    alert('devi selezionare un valore dalla lista o inserirne uno manualmente');
    return false;
  }
  $("#confirm-"+el).toggleClass('btn-danger btn-success').prop('disabled', true).find('i').toggleClass('fa-check fa-circle-check');
}
