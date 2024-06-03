const work = $("[name=work]").val()
const name = $("[name=name]").val()
const items = $("[name=items]").val().split(',')
const form = $("#formOre")[0];

screen.orientation.addEventListener("change", delOreBtnStyle);
  
let maxDate = getDate()['year']+'-'+getDate()['month']+'-'+getDate()['day'];
items.forEach((item,index) => {
  postData("lavoro.php", {dati:{trigger:'getOre',item:item}}, function(data){
    let row = $("<div/>",{class:'form-row mb-3 items'}).attr("data-id",data[0].id).appendTo("#wrapData")
    let colOperatore = $("<div/>",{class:'col-md-4'}).appendTo(row)
    let colData = $("<div/>",{class:'col-md-4'}).appendTo(row)
    let colOre = $("<div/>",{class:'col-md-1'}).appendTo(row)
    let toolbar = $("<div/>",{class:'col-md-2'}).appendTo(row)
     
    $("<label/>",{for:'operatore_'+index}).text("Operatore").appendTo(colOperatore)
    $("<label/>",{for:'data_'+index}).text("Data").appendTo(colData)
    $("<label/>",{for:'ore_'+index}).text("Ore").appendTo(colOre)
      
    $("<input/>",{type:'number', id:'ore', class:'form-control', name:'ore', placeholder:'ore effettuate', step:1, min:1, max:15}).prop('required', true).val(parseInt(data[0].ore)).appendTo(colOre);
    $("<input/>",{type:'date', id:'data', class:'form-control', name:'data', min:'2005-01-01', max:maxDate}).prop('required', true).val(data[0].data).appendTo(colData);
    let userSel = $("<select/>",{class:'form-control', id:'operatore', name:'operatore'}).prop('required',true).appendTo(colOperatore);
    postData("liste.php", {tab:'users', orderBy:'cognome asc, nome asc'}, function(items){
      $.each(items,function(i, v){
        let prop = v.id == data[0].operatore_id ? true : false;
        $("<option/>").text(v.cognome+" "+v.nome).val(v.id).prop("selected", prop).appendTo(userSel)
      })
    })

    $("<button/>",{type:'button', class:'btn btn-danger delOreBtn'})
      .appendTo(toolbar)
      .on('click', function(){
        if(confirm('Stai per eliminare un record con le ore di un operatore, questo ricalcolerà la somma totale delle ore previste per il lavoro...clicca ok per confermare')){
          deleteOre(data[0].id)
        }
      })
    delOreBtnStyle()
  })
});
$('[name=submit]').on('click', editOre)
$(".backBtn").on('click', function() { $.redirectPost("workPage.php", {id:work});});

function delOreBtnStyle(){
  if(screen.width > 650){
    $(".delOreBtn")
      .css({"position":"absolute", "bottom":"0", "margin":"0"})
      .attr({"data-toggle":"tooltip", "data-placement":"top", "title":"elimina ore"})
      .html('<i class="fas fa-trash" aria-hidden="true"></i>')
  }else{
    $(".delOreBtn")
      .css({"position":"relative", "margin":"10px 0"})
      .attr({"data-toggle":"", "data-placement":"", "title":""})
      .html('<i class="fas fa-trash" aria-hidden="true"></i> cancella ore')
  }
}

function editOre(e){
  let form = $("#formOre")[0];
  if(form.checkValidity()){
    e.preventDefault()
    let items = []
    $(".items").each(function(i,v){
      let item = {}
      item['id'] = $(this).data("id")
      item['operatore'] = $(this).find("[name=operatore]").val()
      item['data'] = $(this).find("[name=data]").val()
      item['ore'] = $(this).find("[name=ore]").val()
      items.push(item)
    })
    dati={trigger:'updateOre', dati:items}
    postData("lavoro.php", {dati}, function(data){
      console.log(data);
      if (data === true) {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-success');
        let msg = "Ok, le ore sono state modificate con successo<br><i class='fas fa-hand-peace'></i> peace!"
        $(".toast-body").html(msg);
        $(".toast").toast({delay:3000});
        $(".toast").toast('show');
        setTimeout(() => {$.redirectPost('workPage.php', {id: work});}, 3000);
      }else {
        $(".toast").removeClass('[class^="bg-"]').addClass('bg-danger');
        $("#headerTxt").html('Errore nella query');
        $(".toast>.toast-body").html(data);
        $(".toast").toast({delay:3000});
        $(".toast").toast('show');
      }
    })
  }
}

function deleteOre(ore){
  postData("lavoro.php", {dati:{trigger:'deleteOre',id:ore}}, function(data){
    console.log(data);
    if (data === true) {
      $(".toast").removeClass('[class^="bg-"]').addClass('bg-success');
      let msg = "ore cancellate<br><i class='fas fa-hand-peace'></i> peace!"
      $(".toast-body").html(msg);
      $(".toast").toast({delay:3000});
      $(".toast").toast('show');
      setTimeout(() => {$.redirectPost('workPage.php', {id: work});}, 3000);
    }else {
      $(".toast").removeClass('[class^="bg-"]').addClass('bg-danger');
      $("#headerTxt").html('Errore nella query');
      $(".toast>.toast-body").html(data);
      $(".toast").toast({delay:3000});
      $(".toast").toast('show');
    }
  })
}