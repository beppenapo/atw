const scavo = $("[name=scavo]").val();
const sacchetto = $("[name=sacchetto]").val();
const user = $("[name=usrAct]").val();
let sg={}

init();

$(window).bind('ajaxStop', function() {console.log("All AJAX requests have completed.");});

async function f1(){
  postData('sacchetti.php', {dati:{trigger:'getSacchetto', id:sacchetto}}, function(data){
    Object.keys(data).forEach(function(key){ sg[key]=data[key]; })
    $("[name=data]").val(sg.data)
    $("[name=descrizione]").val(sg.descrizione)
  })
}

async function f2(){
  postData('liste.php', {tab:'us', orderBy:'us desc', filter:["scavo = "+scavo]}, function(data){
    data.forEach(function(v,i){
      let opt = $("<option/>",{value:v.id, text:v.us+" - "+v.definizione}).appendTo('#us');
      if(v.id == sg.us){opt.prop('selected', true);}
    })
  })
}

async function f3(){
  postData("liste.php", {tab:'users', orderBy:'cognome asc, nome asc', filter:['classe <= 2']}, function(data){
    data.forEach(function(v,i){
      let opt = $("<option/>", {text:v.cognome+" "+v.nome}).val(v.id).appendTo('#compilatore');
      if (sg.compilatore == parseInt(v.id)) { opt.prop('selected', true); }
    })
  })
}

async function init(){
  await f1();
  await f2();
  await f3();
}

$(".backBtn").on('click', function() { $.redirectPost('workPage.php', {id:scavo});});

$("[name=submit]").on('click', function(e){
  let form = $("#formSacchetto")[0];
  let isvalidate = form.checkValidity()
  if(isvalidate){
    e.preventDefault()
    dati={};
    dati.trigger="updateSacchetto"
    dati.sacchetto = sacchetto;
    dati.data = $("[name=data]").val();
    dati.us = $("[name=us]").val();
    dati.descrizione = $("[name=descrizione]").val();
    dati.compilatore = $("[name=compilatore]").val();
    dati.modificato_da = user;
    postData('sacchetti.php', {dati}, function(data){
      if (data.res === true) {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-success');
        let msg = "Il sacchetto è stato correttamente aggiornato!<br><i class='fas fa-hand-peace'></i> peace!"
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