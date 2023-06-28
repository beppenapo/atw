const dataTableOpt = {
  paging: true,
  lengthMenu: [20, 50, 75, 100, 200],
  order: [],
  columnDefs: [{targets  : 'no-sort', orderable: false }],
  destroy:true,
  retrieve:true,
  responsive: true,
  html:true,
  language: { url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Italian.json' }
}

buildTable();

function buildTable(){
  postData("utenti.php", {dati:{trigger:'getRubrica'}}, function(data){
    console.log(data);
    $.each(data, function(i,v){
      let tr = $("<tr/>").appendTo("table.table>tbody");
      $("<td/>",{text:v.classe}).appendTo(tr)
      $("<td/>",{text:v.nome}).appendTo(tr)
      let mailTd = $("<td/>").appendTo(tr)
      $("<a/>",{href:"mailto:"+v.email, text:v.email, title:'scrivi mail'}).appendTo(mailTd)
      $("<td/>",{text:v.mobile}).appendTo(tr)
      $("<td/>",{text:v.telefono}).appendTo(tr)
      $("<td/>",{text:v.indirizzo}).appendTo(tr)
      $("<td/>",{text:v.cod_fisc}).appendTo(tr)
      $("<td/>",{text:v.piva}).appendTo(tr)
      let webTd = $("<td/>").appendTo(tr)
      let linkText = v.web ? 'link alla risorsa web' : '';
      $("<a/>",{href:v.web, text:linkText, title:'apri '+v.web+' in una nuova scheda', target: '_blank'}).appendTo(webTd)
      $("<td/>",{text:v.note}).appendTo(tr)
      let modUsrTd = $("<td/>", {class:'text-center'}).appendTo(tr)
      $("<button/>", {type:'button', class:'btn btn-secondary btn-sm', text:'modifica'}).appendTo(modUsrTd).on('click', () => {
        $.redirectPost('modContatto.php',{id:v.id})
      })
    });
    $('#dataTable').DataTable(dataTableOpt);
  })
}
