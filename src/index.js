localStorage.clear();
$("[name=clearFilter]").hide();
$.ajax({
  type: "POST",
  url: API+'index.php',
  data: {api:'getFilter'},
  dataType: 'json',
  success: function(data){
    console.log(data.comune);
    $.each(data['anno'],function(index, v) {
      $("<option/>",{value:v.anno}).appendTo('datalist#anno');
    });
    $.each(data['comune'],function(index, v) {
      $("<option/>",{value:v.name}).appendTo('datalist#comuni');
    });
    $.each(data['sigla'], function(i,v){$("<option/>",{value:v.sigla}).appendTo('datalist#sigle');});
    $.each(data['scavo'], function(i,v){$("<option/>",{value:v.scavo}).appendTo('datalist#scavi');});
  }
});

function schedeScavi(){
  $(".card-columns").html('');
  postData("index.php", {dati}, function(data){
    $.each(data, function(i,v){
      let card = $("<div/>").addClass('card')
        .attr("data-anno", v.anno)
        .attr("data-osm_id", v.osm_id)
        .attr("data-nome_lungo", v.nome)
        .attr("data-sigla", v.sigla)
        .appendTo('.card-columns')
        .hide()
        .fadeIn('fast');
      let body = $("<div/>").addClass('card-body').appendTo(card);
      let title = $("<h5/>",{text:v.nome}).addClass('card-title border-bottom').appendTo(body);
      let subTitle = $("<h6/>", {html:"<span>"+v.comune+", "+v.sigla+ ", "+v.anno+"</span>"}).addClass('card-subtitle text-muted mb-2').appendTo(body);
      let text = $("<p/>",{text:v.descrizione}).addClass('card-text').appendTo(body);
      let footer = $("<div/>").addClass('card-footer text-right').appendTo(card);
      $("<button/>",{type: 'button', name:'link2work', value:v.id, class:'btn btn-sm btn-outline-info', text:'apri scavo'}).appendTo(footer).on('click', function(){
        $.redirectPost('workPage.php', {id: v.id});
      });
    });
  })
}
