$(document).ready(function(){
  const toolTipOpt = {container: 'body', boundary: 'windows', selector: '[data-toggle=tooltip]', html: true}
  $("body").tooltip(toolTipOpt);

  $("[name=toggleNav]").on('click', function(){
    $("nav").toggleClass('open closed').toggleClass('shadow-lg');
  });

  if (screen.width < 1200) {
    btnListTxt = 'visualizza liste';
  }else {
    $("div.collapse").addClass('show')
    btnListTxt = 'nascondi liste';
  }

  $(".toggleList").text(btnListTxt).on('click', function(event) {
    target = $(this).data('target');
    if(!$(target).is(':visible')){
      $(this).text('nascondi liste');
    }else {
      $(this).text('visualizza liste');
    }
  })

  $(".collapseBtn").closest('button').click(function () {
    const $el = $(".collapseBtn");
    let testo = $el.text() == "visualizza" ? "nascondi": "visualizza"
    $el.text(testo);
  });
  activeLink();
});

function activeLink(){
  let active = window.location.pathname.split("/").pop().split(".")[0];
  $(".mainNav>a").removeClass('active');
  $(".mainNav>#"+active+"Link").addClass('active');
}
