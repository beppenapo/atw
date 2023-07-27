const work = $('[name=work]').val();
let name = $('[name=name]').val();
let lon,lat, totOre, percOre, ore = 0, color;

$("[name=modInfoWork]").on('click', (el) =>{ $.redirectPost('modInfoWork.php',{id:work}); })


postData("lavoro.php", {dati:{trigger:'getWork',id:work}}, function(data){
  totOre = data[0].tot_ore;
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
    const aperte = data.aperte;
    const numAperte = data.aperte.length;
    const chiuse = data.chiuse;
    const numChiuse = data.chiuse.length;
    const listAperte = $(".list-us-aperte");
    const listChiuse = $(".list-us-chiuse");
    buildUsList(scavo, aperte, listAperte)
    buildUsList(scavo, chiuse, listChiuse)
    buildUsChart(numAperte, numChiuse)
  })
}
function buildUsChart(aperte, chiuse){
  const tot = aperte + chiuse;
  const percAperte = (aperte * 100) / tot;
  const percChiuse = (chiuse * 100) / tot;
  $("#totUs").text(tot);
  $(".usAperte").css({"width":percAperte+"%"}).prop('aria-valuenow',percAperte);
  $(".usChiuse").css({"width":percChiuse+"%"}).prop('aria-valuenow',percChiuse);
  $("#usAperteTot").text(aperte);
  $("#usChiuseTot").text(chiuse);
}
function buildUsList(scavo, data, list){
  $.each(data, function(index, el) {
    let prefix = el.id_tipo == 2 ? '-' : '';
    let item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo(list);
    let title = $("<small/>",{class:'d-block font-weight-bold', text:"US num. "+prefix+el.us}).appendTo(item);
    $("<span/>",{class:'float-right', text:el.compilazione}).appendTo(title);
    let definizione = (el.definizione == el.descrizione) ? el.definizione : el.definizione+"<br/>"+el.descrizione;
    definizione = truncate(definizione,50)
    if (count_words(definizione) == 50) {definizione = definizione+" ...";}
    $("<small/>",{class:'d-block', html:definizione}).appendTo(item);
    let usNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(item);

    let usView = $('<button/>',{class:'btn btn-sm btn-light bg-white pointer', name:'usView'}).appendTo(usNavDiv);
    $("<i/>", {class:'fas fa-eye'}).appendTo(usView);
    let usEdit = $('<button/>',{class:'btn btn-sm btn-light bg-white pointer', name:'usView'}).appendTo(usNavDiv);
    $("<i/>", {class:'fas fa-edit'}).appendTo(usEdit);
    usView.on('click', function(event) {
      $(".modal-title").html("<h4>US num. "+prefix+el.us+"</h4><h6>"+el.tipo+"</h6>");
      $(".modal-body").html("<div>"+nl2br(el.definizione)+"</div>");
      $(".modal").modal();
    });
    usEdit.on('click', function(){
      $.redirectPost('addUs.php',{id:work, name:scavo,usId:el.id, tipo:el.id_tipo});
    });
  });
}

//NOTE: sezione gestione ore
function initSectionOre(totOre){
  postData("lavoro.php", {dati:{trigger:'getOre',id:work}}, function(data){
    const groupByData = groupBy(['data']);
    let group = groupByData(data);
    $.each(group, function(key,val){
      let oreGiorno = 0;
      details = $("<details/>").appendTo('.details');
      summary = $("<summary/>").html(key+"<span class='float-right ore"+key+"'></span>").appendTo(details);
      $.each(val,function(i, v) {
        oreGiorno += parseFloat(v.ore);
        item = $("<div/>",{class:'py-1'}).html("<span class='w-75'>"+v.operatore+"</span><span class='w-25 text-right'>"+v.ore+"</span>").appendTo(details);
        $(".ore"+v.data).text(oreGiorno);
      });
    })
    $.each(data, function(i,v){ore += parseFloat(v.ore);})
    $(".totOre").text(ore+"/"+totOre);
    percOre = parseInt((ore*100)/totOre);
    if (percOre <= 50) {
      color = "#28a745";
    }else if (percOre > 50 && percOre <= 75) {
      color = "#ffc107";
    }else {
      color = "#dc3545";
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
    console.log(data);
    $.each(data, function(index, val) {
      let item = $("<li/>", {class:'list-group-item'}).appendTo('.list-diario');
      let testo = truncate(val.descrizione,50)
      if(count_words(testo) == 50){ testo = testo+" ..."; }
      $("<small/>",{class:'font-weight-bold d-block', text:val.data}).appendTo(item);
      $("<small/>",{class:'d-block', html:nl2br(testo)}).appendTo(item);
      $("<small/>",{class:'font-weight-bold d-block', html:val.operatore}).appendTo(item);
      let diarioNavDiv = $("<div/>",{class:'d-flex justify-content-end'}).appendTo(item);
      let diarioView = $('<button/>',{class:'btn btn-sm btn-light bg-white pointer', name:'diarioView'}).appendTo(diarioNavDiv);
      $("<i/>", {class:'fas fa-eye'}).appendTo(diarioView);
      let diarioEdit = $('<button/>',{class:'btn btn-sm btn-light bg-white pointer', name:'diarioEdit'}).appendTo(diarioNavDiv);
      $("<i/>", {class:'fas fa-edit'}).appendTo(diarioEdit);
      diarioView.on('click', function(event) {
        $(".modal-title").html("<h4>Diario del: "+val.data+"</h4>");
        body = "<div>"+nl2br(val.descrizione)+"</div>";
        body += "<small class='font-weight-bold'>"+val.operatore+"</small>";
        $('.modal-body').html(body);
        $(".modal").modal();
      });
      diarioEdit.on('click', function(){
        $.redirectPost('addDiario.php',{id:work, diario:val.diario, data:val.data, testo:val.descrizione});
      });
    });
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
$(".wrapListFotopiani").hide();
postData("lavoro.php", {dati:{trigger:'getFotopiani',id:work}}, function(data){
  const daElaborareTot = data.da_elaborare.length;
  const elaboratiTot = data.elaborati.length;
  const totFotopiani = daElaborareTot + elaboratiTot;
  const daElaborarePerc = (daElaborareTot * 100) / totFotopiani;
  const elaboratiPerc = (elaboratiTot * 100) / totFotopiani;
  $(".noEl").css({"width":daElaborarePerc+"%"}).prop('aria-valuenow',daElaborarePerc);
  $(".el").css({"width":elaboratiPerc+"%"}).prop('aria-valuenow',elaboratiPerc);
  $("#totFotopiani").text(totFotopiani);
  $("#daElaborareTot").text(daElaborareTot);
  $("#elaboratiTot").text(elaboratiTot);

  buildFotopianiList(data.da_elaborare, '.list-fotopiani-daFare')
  buildFotopianiList(data.elaborati, '.list-fotopiani-fatti')

})

function buildFotopianiList(arr, list){
  $.each(arr, function(k, val) {
    item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo(list);
    num = $("<small/>",{class:'d-block font-weight-bold m-0 p-0', text:'fotopiano num. '+val.num_fotopiano}).appendTo(item);
    data = $("<span/>", {class:'float-right', text:'('+val.data+')'}).appendTo(num);
    us = $("<small/>", {class:'d-block', text:val.us}).appendTo(item)
    note = $("<small/>", {class:'d-block', text:val.note}).appendTo(item)
  });
}

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
    console.log(data);
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

      // let repertoView = $('<button/>',{class:'btn btn-sm btn-light bg-white pointer', name:'repertoView'}).appendTo(repertoNavDiv);
      // $("<i/>", {class:'fas fa-eye'}).appendTo(repertoView);
      //
      // let repertoEdit = $('<button/>',{class:'btn btn-sm btn-light bg-white pointer', name:'repertoView'}).appendTo(repertoNavDiv);
      // $("<i/>", {class:'fas fa-edit'}).appendTo(repertoEdit);

      let consActive = '';
      if (val.consegnato == true) {consActive = 'active';}
      let repertoConsegnato = $('<div/>',{class:'btn-group-toggle'}).attr("data-toggle","buttons").appendTo(repertoNavDiv);
      let repConsLabel = $("<label/>", {class:'btn btn-sm btn-light repConsegnato '+ consActive}).appendTo(repertoConsegnato);
      let repConsCheck = $("<input/>", {type:'checkbox'}).prop("checked", val.consegnato).appendTo(repConsLabel);
      $("<i/>",{class:'fas fa-handshake'}).appendTo(repConsLabel);
      repConsCheck.on('click', function(){
        let consegnato = $(this).is(':checked')
        postData("sacchetti.php", {dati:{trigger:'setConsegnato',scavo:work, reperto: val.id, stato:consegnato}}, function(data){
          let checkStato = consegnato == false ? 'non consegnato': 'consegnato';
          alert('Il reperto è stato contrassegnato come ' + checkStato)
        })
      })
    });
    $.each(data.campioni, function(index, val) {
      let item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo('.list-campioni');
      $("<small/>",{class:'font-weight-bold d-block', text:"campione num. "+val.numero+" in US"+val.us+" (inv."+val.inventario+")"}).appendTo(item);
      $("<small/>",{class:'d-block', text:val.descrizione}).appendTo(item);
    });
    $.each(data.sacchetti, function(index, val) {
      let item = $("<div/>",{class:'py-2 px-3 border-bottom'}).appendTo('.list-sacchetti');
      $("<small/>",{class:'font-weight-bold d-block', text:"sacchetto num. "+val.numero+" in US"+val.us+" (inv."+val.inventario+")"}).appendTo(item);
      $("<small/>",{class:'d-block', text:val.descrizione}).appendTo(item);
    });
  })
}
