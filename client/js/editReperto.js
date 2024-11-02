const scavo = $("[name=scavo]").val();
const sacchetto = $("[name=sacchetto]").val();
const user = $("[name=usrAct]").val();
let reperto={}
let check_tipologia, check_materiale = false;
postData('sacchetti.php', {dati:{trigger:'getReperto', sacchetto:sacchetto}}, function(data){
  Object.keys(data).forEach(function(key){ reperto[key]=data[key]; })
  postData('liste.php', {tab:'us', orderBy:'us desc', filter:["scavo = "+scavo]}, function(data){
    data.forEach(function(v,i){
      let opt = $("<option/>",{value:v.id, text:v.us+" - "+v.definizione}).appendTo('#us');
      if(v.id == reperto.us){opt.prop('selected', true);}
    })
  })
  $("[name=tipologia]").val(reperto.tipologia)
  $("[name=materiale]").val(reperto.materiale)
  $("[name=descrizione]").val(reperto.descrizione)
})
postData("liste.php", {tab:'tipo'}, function(data){
  data.forEach(function(v,i){
    let opt = $("<option/>", {value:v.tipologia}).appendTo('#listTipo');
    if(v.id == reperto.us){opt.prop('selected', true);}
  })
  setTimeout(function(){toggleCheck('tipologia');},500);
})

postData("liste.php", {tab:'materia'}, function(data){
  data.forEach(function(v,i){
    $("<option/>", {value:v.materiale}).appendTo('#listMateriale');
  })
  setTimeout(function(){toggleCheck('materiale');},500);
})

postData("liste.php", {tab:'users', orderBy:'cognome asc, nome asc', filter:['classe <= 2']}, function(data){
  data.forEach(function(v,i){
    let opt = $("<option/>", {text:v.cognome+" "+v.nome}).val(v.id).appendTo('#compilatore');
    if (user == parseInt(v.id)) { opt.prop('selected', true); }
  })
})

$(".backBtn").on('click', function() { $.redirectPost('workPage.php', {id:scavo});});

$("#confirm-tipologia").on('click', function(){toggleCheck('tipologia')})
$("#confirm-materiale").on('click', function(){toggleCheck('materiale')})

$("[name=tipologia]").on("keyup search", function(){toggleList('tipologia')})
$("[name=materiale]").on("keyup search", function(){toggleList('materiale')})

$("[name=submit]").on('click', function(e){
  let form = $("#formReperto")[0];
  let isvalidate = form.checkValidity()
  if(isvalidate){
    e.preventDefault()
    if(!check_tipologia){
      alert('devi confermare la scelta della tipologia cliccando sul pulsante accanto al campo');
      return false;
    }
    if(!check_materiale){
      alert('devi confermare la scelta del materiale cliccando sul pulsante accanto al campo');
      return false;
    }
    dati={};
    dati.trigger="updateReperto"
    dati.sacchetto = sacchetto;
    dati.data = $("[name=data]").val();
    dati.us = $("[name=us]").val();
    dati.materiale = $("[name=materiale]").val().trim().toLowerCase();
    dati.tipologia = $("[name=tipologia]").val().trim().toLowerCase();
    dati.descrizione = $("[name=descrizione]").val();
    dati.modificato_da = $("[name=compilatore]").val();
    postData('sacchetti.php', {dati}, function(data){
      console.log(data);
      if (data.res === true) {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-success');
        let msg = "Il reperto è stato correttamente aggiornato!<br><i class='fas fa-hand-peace'></i> peace!"
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