const work = $('[name=work]').val();
let nome_scavo,sigla;
let lon,lat, totOre, percOre, ore = 0, color;

$("[name=modInfoWork]").on('click', (el) =>{ $.redirectPost('modInfoWork.php',{id:work}); })


postData("lavoro.php", {dati:{trigger:'getWork',id:work}}, function(data){
  sigla = data[0].sigla;
  totOre = data[0].tot_ore;
  nome_scavo = data[0].nome;
  $('[name=name]').val(data[0].nome);
  $(".nomeScavo").text(data[0].nome);
  $("#comune").text(data[0].comune);
  $("#localizzazione").text(data[0].localizzazione);
  $("#nome").text(data[0].nome);
  $("#sigla").text(data[0].sigla);
  $("#inizio").text(data[0].inizio);
  $("#descrizione").text(data[0].descrizione);
  $("#ore").text(data[0].tot_ore);
  $("#direttore").text(data[0].direttore);
  if (data[0].chiuso_il && data[0].chiuso_il !== null) {
    $(".statoLavoroItem").addClass('bg-danger text-white');
    $("#statoLavoro").text("lavoro chiuso in data: "+data[0].chiuso_il);
  }else {
    $(".statoLavoroItem").addClass('bg-success text-white');
    $("#statoLavoro").text("work in progress!");
  }
  if (data[0].lon && data[0].lat) {
    lat = data[0].lat;
    lon = data[0].lon;
  }else {
    lat = 46.37336;
    lon = 11.0337;
  }
  $(".dropdown-inserisci > button").on('click', function(){
    const page = $(this).data('form')+".php";
    let opt = {id:work, name:data[0].nome};
    if(typeof $(this).data('tipo') !== 'undefined') {opt.tipo = $(this).data('tipo'); }
    $.redirectPost(page,opt);
  })
  $("[name=modWork]").on('click', (el) => { $.redirectPost('modWork.php',{id:work}); })
  initMap(lon, lat)
  initSectionOre(totOre)
  initDiario(data[0].nome)
  initReperti()
  initUs(data[0].nome)
})

function initUs(scavo){
  postData("lavoro.php", {dati:{trigger:'getUs',id:work}}, function(data){
    $("#totUs").text(data.screen.length);
    $("#scarica-us").on('click', function(){ getCsv(data.csv, sigla+"_lista_US"); })
    $.each(data.screen, function(i,el) {
      let prefix = el.id_tipo == 2 ? '-' : '';
      let item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo(".list-us");
      let title = $("<small/>",{class:'d-block font-weight-bold', text:"US num. "+prefix+el.us}).appendTo(item);
      $("<span/>",{class:'float-right', text:el.compilazione}).appendTo(title);
      let definizione = (el.definizione == el.descrizione) ? el.definizione : el.definizione+"<br/>"+el.descrizione;
      definizione = truncate(definizione,50)
      if (count_words(definizione) == 50) {definizione = definizione+" ...";}
      $("<small/>",{class:'d-block', html:definizione}).appendTo(item);
      let usNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(item);
      let usView = $('<button/>',{class:'btn btn-sm btn-light toolBtn', name:'usView'}).appendTo(usNavDiv);
      $("<i/>", {class:'fas fa-eye'}).appendTo(usView);
      let usEdit = $('<button/>',{class:'btn btn-sm btn-light toolBtn', name:'usView'}).appendTo(usNavDiv);
      $("<i/>", {class:'fas fa-edit'}).appendTo(usEdit);
      usView.on('click', function(event) {
        $(".modal-title").html("<h4>US num. "+prefix+el.us+"</h4><h6>"+el.tipo+"</h6>");
        $(".modal-body").html("<div>"+nl2br(definizione)+"</div>");
        $(".modal").modal();
      });
      usEdit.on('click', function(){
        $.redirectPost('addUs.php',{id:work, name:scavo,usId:el.id, tipo:el.id_tipo});
      });
    });
  })
}

//NOTE: sezione gestione ore
function initSectionOre(totOre){
  postData("lavoro.php", {dati:{trigger:'getOre',id:work}}, function(data){
    $("#scarica-ore").on('click', function(){ getCsv(data, sigla+"_ore"); })
    const groupByData = groupBy(['data']);
    let group = groupByData(data);
    $.each(group, function(key,val){
      let oreGiorno = 0;
      let details = $("<details/>").appendTo('.details');
      $("<summary/>").html(key+"<span class='float-right ore"+key+"'></span>").appendTo(details);
      $.each(val,function(i, v) {
        oreGiorno += parseInt(v.ore);
        $(".ore"+v.data).text(oreGiorno);
        $("<div/>",{class:'py-2'}).html("<span class='w-75'>"+v.operatore+"</span><span class='w-25 text-right'>"+parseInt(v.ore)+"</span>").appendTo(details);
      });
      let oreNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(details);
      let editOre = $('<a/>',{class:'btn btn-sm btn-light toolBtn', href:'#',name:'editOre'}).appendTo(oreNavDiv);
      $("<i/>", {class:'fas fa-edit'}).appendTo(editOre);
      editOre.on('click', function(e){
        e.preventDefault()
        let items = []
        group[key].forEach(function(v,i){items.push(v.id);})
        $.redirectPost('editOre.php',{id:work,name:nome_scavo,giorno:group[key][0].data,items:items});
      })
      $("<button/>",{type:'button', class:'btn btn-sm btn-danger'})
        .html('<i class="fas fa-trash" aria-hidden="true"></i>')
        .appendTo(oreNavDiv)
        .on('click', function(){ eliminaGiornata({scavo:work, data:key})})
    })
    $.each(data, function(i,v){ore += parseFloat(v.ore);})
    $(".totOre").text(ore+"/"+totOre);
    percOre = parseInt((ore*100)/totOre);
    switch (true) {
      case percOre <= 50: color = "#28a745"; break;
      case percOre > 50 && percOre <= 75: color = "#ffc107"; break;
      default: color = "#dc3545"; break;
    }
    if (totOre == 0) {
      $(".point>svg").remove();
    }else {
      if (isFinite(percOre)) {
        $(".svg-text").text(percOre+"%").css({"fill":color});
      }else {
        $(".svg-text").text("?!").css({"fill":"red"});
      }
      const $round = $('.round');
      let roundRadius = $round.attr('r');
      let roundPercent = percOre;
      let roundCircum = 2 * roundRadius * Math.PI;
      let roundDraw = roundPercent * roundCircum / 100;
      $round.css({'stroke-dasharray': roundDraw  + ' 999',"stroke":color})
    }
  })
}

//NOTE: sezione gestione diario
function initDiario(name){
  postData("lavoro.php", {dati:{trigger:'getDiario',id:work}}, function(data){
    $("#totDiario").text(data.screen.length);
    $.each(data.screen, function(index, val) {
      let item = $("<li/>", {class:'list-group-item'}).appendTo('.list-diario');
      let testo = truncate(val.descrizione,50)
      if(count_words(testo) == 50){ testo = testo+" ..."; }
      $("<small/>",{class:'font-weight-bold d-block', text:val.data}).appendTo(item);
      $("<small/>",{class:'d-block', html:nl2br(testo)}).appendTo(item);
      $("<small/>",{class:'font-weight-bold d-block', html:val.operatore}).appendTo(item);
      let diarioNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(item);
      let diarioView = $('<button/>',{class:'btn btn-sm btn-light toolBtn', name:'diarioView'}).appendTo(diarioNavDiv);
      $("<i/>", {class:'fas fa-eye'}).appendTo(diarioView);
      let diarioEdit = $('<button/>',{class:'btn btn-sm btn-light toolBtn', name:'diarioEdit'}).appendTo(diarioNavDiv);
      $("<i/>", {class:'fas fa-edit'}).appendTo(diarioEdit);
      diarioView.on('click', function(event) {
        $(".modal-title").html("<h4>Diario del: "+val.data+"</h4>");
        let body = "<div>"+nl2br(val.descrizione)+"</div>";
        body += "<small class='font-weight-bold'>"+val.operatore+"</small>";
        $('.modal-body').html(body);
        $(".modal").modal();
      });
      diarioEdit.on('click', function(){
        $.redirectPost('addDiario.php',{id:work, diario:val.diario, data:val.data, testo:val.descrizione});
      });
    });
    $("#scarica-diario").on('click', function(){ getCsv(data.csv, sigla+"_diario"); })
  })
}

function getDiarioGiornaliero(data){
  postData("lavoro.php", {dati:{trigger:'getDiarioGiornaliero',scavo:work, data:data}}, function(res){
    $(".modal-title").html("<h4>Diario del: "+data+"</h4>");
    var body='';
    res.forEach((item, i) => {
      body += "<div class='mt-3'>"+nl2br(item.descrizione)+"</div>";
      body += "<div class='d-flex justify-content-between'>";
      body += "<small class='font-weight-bold'>"+item.operatore+"</small>";
      body += "<button class='btn btn-sm btn-light bg-white pointer' name='diarioEdit'><i class='fas fa-edit'></i> Modifica attività</button>";
      body += "</div>";
    });
    $('.modal-body').html(body);
    $(".modal").modal();
  });
}

//NOTE: sezione fotopiani
postData("lavoro.php", {dati:{trigger:'getFotopiani',id:work}}, function(data){
  $("#scarica-fotopiani").on('click', function(){ getCsv(fotopiani, sigla+"_fotopiani"); })
  $("#totFotopiani").text(data.length);
  $.each(data, function(k, val) {
    item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo('.list-fotopiani');
    num = $("<small/>",{class:'d-block font-weight-bold m-0 p-0', text:'fotopiano num. '+val.num_fotopiano}).appendTo(item);
    data = $("<span/>", {class:'float-right', text:'('+val.data+')'}).appendTo(num);
    us = $("<small/>", {class:'d-block', text:val.us}).appendTo(item)
    note = $("<small/>", {class:'d-block', text:val.note}).appendTo(item)
    let ftpNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(item);

    let ftpEdit = $('<button/>',{class:'btn btn-sm btn-light toolBtn', name:'ftpEdit'}).appendTo(ftpNavDiv);
    $("<i/>", {class:'fas fa-edit'}).appendTo(ftpEdit);
    ftpEdit.on('click', function(){
      $.redirectPost('editFotopiano.php',{cantiere:nome_scavo,scavo:work,ftp:val.id});
    })

    let ftpBtnClass = val.elaborato == true ? 'fa-solid text-success' : 'fa-regular';
    let ftpBtnActive = val.elaborato == true ? 'active' : '';
    let ftpElaboratoWrap = $('<div/>',{class:'btn-group-toggle'}).attr("data-toggle","buttons").appendTo(ftpNavDiv);
    let ftpBtnLabel = $("<label/>", {class:'btn btn-sm btn-light toolBtn ftpElaborato'+ ftpBtnActive}).appendTo(ftpElaboratoWrap);
    let ftpBtnCheck = $("<input/>", {type:'checkbox'}).prop("checked", val.elaborato).appendTo(ftpBtnLabel);
    let ftpBtnIco = $("<i/>",{class: ftpBtnClass+' fa-square-check'}).appendTo(ftpBtnLabel);

    ftpBtnCheck.on('click', function(){
      let newClass = $(this).is(':checked') ? 'fa-solid text-success fa-square-check' : 'fa-regular fa-square-check';
      ftpBtnIco.removeClass().addClass(newClass);
      let dati = {trigger:'setElaborato', scavo:work, id:val.id, elaborato:$(this).is(':checked')}
      postData("lavoro.php", {dati:dati}, function(data){
        console.log(data);
        let checkStato = $(this).is(':checked') ? 'elaborato': 'non elaborato';
        alert('Il fotopiano è stato contrassegnato come ' + checkStato)
      })
    })
  });
})

function initMap(lon,lat){
  center = [lat,lon];
  zoom = 18;
  map = L.map('map').setView(center,zoom);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker(center).addTo(map);
}

function initReperti(){
  let tipologia=[];
  let totale=[];
  let color = [];
  postData("sacchetti.php", {dati:{trigger:'getSacchetti',id:work}}, function(data){
    $("#scarica-reperti").on('click', function(){ getCsv(data.reperti, sigla+"_reperti"); })
    $("#scarica-campioni").on('click', function(){ getCsv(data.campioni, sigla+"_campioni"); })
    $("#scarica-sacchetti").on('click', function(){ getCsv(data.sacchetti, sigla+"_sacchetti"); })
    $("#totReperti").text(data.reperti.length);
    $("#totCampioni").text(data.campioni.length);
    $("#totSacchetti").text(data.sacchetti.length);
    $.each(data.reperti, function(index, val) {
      let item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo('.list-reperti');
      $("<small/>",{class:'font-weight-bold d-block', text:"reperto num. "+val.numero+" in US"+val.us+" (inv."+val.inventario+")"}).appendTo(item);
      $("<small/>",{class:'d-block', text:val.tipologia+","+val.materiale}).appendTo(item);
      if(val.reperto){ $("<small/>",{class:'d-block mt-2', text:"Descrizione: "+val.reperto}).appendTo(item);}
      $("<small/>",{class:'d-block', text:val.note}).appendTo(item);

      let repertoNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(item);
      let repertoEdit = $('<button/>',{class:'btn btn-sm btn-light toolBtn', name:'repertoEdit'}).appendTo(repertoNavDiv);
      $("<i/>", {class:'fas fa-edit'}).appendTo(repertoEdit);
      repertoEdit.on('click', function(){
        $.redirectPost('editReperto.php',{cantiere:nome_scavo,scavo:work,sacchetto:val.id});
      });

      let consActive = '';
      if (val.consegnato == true) {consActive = 'active';}
      let repertoConsegnato = $('<div/>',{class:'btn-group-toggle'}).attr("data-toggle","buttons").appendTo(repertoNavDiv);
      let repConsLabel = $("<label/>", {class:'btn btn-sm btn-light toolBtn repConsegnato '+ consActive}).appendTo(repertoConsegnato);
      let repConsCheck = $("<input/>", {type:'checkbox'}).prop("checked", val.consegnato).appendTo(repConsLabel);
      $("<i/>",{class:'fas fa-handshake'}).appendTo(repConsLabel);
      repConsCheck.on('click', function(){
        let consegnato = $(this).is(':checked')
        setConsegnato({scavo:work, sacchetto: val.id, stato:consegnato})
      })
    });
    
    $.each(data.campioni, function(index, val) {
      let item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo('.list-campioni');
      $("<small/>",{class:'font-weight-bold d-block', text:"campione num. "+val.numero+" in US"+val.us+" (inv."+val.inventario+")"}).appendTo(item);
      $("<small/>",{class:'d-block', text:val.descrizione}).appendTo(item);

      let campioneNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(item);
      let campioneEdit = $('<button/>',{class:'btn btn-sm btn-light toolBtn', name:'campioneEdit'}).appendTo(campioneNavDiv);
      $("<i/>", {class:'fas fa-edit'}).appendTo(campioneEdit);
      campioneEdit.on('click', function(){
        $.redirectPost('editCampione.php',{cantiere:nome_scavo,scavo:work,sacchetto:val.id});
      });

      let consActive = '';
      if (val.consegnato == true) {consActive = 'active';}
      let campioneConsegnato = $('<div/>',{class:'btn-group-toggle'}).attr("data-toggle","buttons").appendTo(campioneNavDiv);
      let campioneConsLabel = $("<label/>", {class:'btn btn-sm btn-light toolBtn repConsegnato '+ consActive}).appendTo(campioneConsegnato);
      let campioneConsCheck = $("<input/>", {type:'checkbox'}).prop("checked", val.consegnato).appendTo(campioneConsLabel);
      $("<i/>",{class:'fas fa-handshake'}).appendTo(campioneConsLabel);
      campioneConsCheck.on('click', function(){
        let consegnato = $(this).is(':checked')
        setConsegnato({scavo:work, sacchetto: val.id, stato:consegnato})
      })
    });
    
    $.each(data.sacchetti, function(index, val) {
      let item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo('.list-sacchetti');
      $("<small/>",{class:'font-weight-bold d-block', text:"sacchetto num. "+val.numero+" in US"+val.us+" (inv."+val.inventario+")"}).appendTo(item);
      $("<small/>",{class:'d-block', text:val.descrizione}).appendTo(item);
      
      let sacchettoNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(item);
      let sacchettoEdit = $('<button/>',{class:'btn btn-sm btn-light toolBtn', name:'campioneEdit'}).appendTo(sacchettoNavDiv);
      $("<i/>", {class:'fas fa-edit'}).appendTo(sacchettoEdit);
      sacchettoEdit.on('click', function(){
        $.redirectPost('editSacchetto.php',{cantiere:nome_scavo,scavo:work,sacchetto:val.id});
      });
  
      let consActive = '';
      if (val.consegnato == true) {consActive = 'active';}
      let sacchettoConsegnato = $('<div/>',{class:'btn-group-toggle'}).attr("data-toggle","buttons").appendTo(sacchettoNavDiv);
      let sacchettoConsLabel = $("<label/>", {class:'btn btn-sm btn-light toolBtn repConsegnato '+ consActive}).appendTo(sacchettoConsegnato);
      let sacchettoConsCheck = $("<input/>", {type:'checkbox'}).prop("checked", val.consegnato).appendTo(sacchettoConsLabel);
      $("<i/>",{class:'fas fa-handshake'}).appendTo(sacchettoConsLabel);
      sacchettoConsCheck.on('click', function(){
        let consegnato = $(this).is(':checked')
        setConsegnato({scavo:work, sacchetto: val.id, stato:consegnato})
      })
    });
  })
}

function setConsegnato(dati){
  dati.trigger = 'setConsegnato';
  postData("sacchetti.php", {dati:dati}, function(data){
    let checkStato = dati.stato == false ? 'non consegnato': 'consegnato';
    alert('Il sacchetto è stato contrassegnato come ' + checkStato)
  })
}

function eliminaGiornata(giorno){
  if(confirm("Stai per eliminare un'intera giornata di lavoro, le ore verranno scalate dal totale delle ore disponibili per lo scavo...vuoi continuare?")){
    postData("lavoro.php", {dati:{trigger:'eliminaGiornata',dati:giorno}}, function(data){
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
}

const getCsv = async function (data, nomeFile) { 
  const csvdata = csvmaker(data); 
  download(csvdata, nomeFile); 
} 

// const csvmaker = function (data) { 
//   csvRows = []; 
//   const headers = Object.keys(data[0]); 
//   csvRows.push(headers.join('|')); 
//   for (const row of data) { 
//     const values = headers.map(e => { return row[e] }) 
//     csvRows.push(values.join('|')) 
//   } 
//   return csvRows.join('\n') 
// }

const csvmaker = function (data) {
  csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.map(header => `"${header}"`).join('|'));
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return value === undefined || value === null ? '""' : `"${value}"`;
    });
    csvRows.push(values.join('|'));
  }
  return csvRows.join('\n');
}

const download = function (data, nomeFile) { 
  const blob = new Blob([data], { type: 'text/csv' }); 
  const url = window.URL.createObjectURL(blob) 
  const a = document.createElement('a') 
  a.setAttribute('href', url) 
  a.setAttribute('download', nomeFile+'.csv'); 
  a.click() 
} 