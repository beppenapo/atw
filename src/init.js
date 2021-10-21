// API
// const API = "91.121.82.80/api/atw/";
const API = "api/atw/";
//-----------------------------------
// data in corso
const d = new Date();
const data = {anno:d.getFullYear(), mese: d.getUTCMonth()+1, giorno: d.getDate()};
//-----------------------------------
// metatag
const meta = '<meta charset="utf-8">'+
'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
'<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'+
'<meta name="author" content="Giuseppe Naponiello" >'+
'<meta name="robots" content="INDEX,FOLLOW" />'+
'<meta name="copyright" content="&copy;2017 - '+data.anno+' Arc-Team srl" />'+
'<link rel="shortcut icon" href="favicon.ico">'+
'<title>ArcTeam Manager</title>';
//-----------------------------------
// aggiungi i fogli di stile esterni
let css = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">';
css += '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">';
css += '<link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto&display=swap" rel="stylesheet">';
document.head.innerHTML= meta+css;
//-----------------------------------
// Per ogni nuova pagina creata aggiungi il suo foglio di stile specifico
let page = location.href.split('/').pop();
let file = page !== '' ? page.split('.')[0] : 'index';
var link = document.createElement('link');
link.rel = "stylesheet";
link.type = "text/css";
link.href = "css/"+file+".css";
document.head.appendChild(link);
//-----------------------------------
// carica le librerie esterne
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = resolve
    script.onerror = reject
    script.src = src
    document.body.append(script)
  })
}

loadScript('https://code.jquery.com/jquery-3.4.1.min.js')
  .then(() => loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js'))
  .then(() => loadScript('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min.js'))
  .then(() => loadScript('src/function.js'))
  .then(() => loadScript('src/'+file+'.js'))
  .catch(() => console.error('Something went wrong.'))
//-----------------------------------
// Aggiungi contenuto all'header delle pagine
const header = document.querySelector('#header');
header.innerHTML = '<h5>ArcTeam Manager</h5><button type="button" name="toggleNav" class="btn btn-dark text-white"><i class="fas fa-bars"></i></button>';
//-----------------------------------
// Crea il menù laterale
const nav = document.querySelector("#mainNav");
nav.innerHTML = '<div class="list-group list-group-flush mainNav"><a href="index.php" id="indexLink" class="list-group-item list-group-item-action" data-toggle="tooltip" data-placement="left" title="dashboard"><i class="fas fa-home fa-fw"></i><span class="animation fadeOut">dashboard</span></a>'+
'<a href="#" class="list-group-item disabled bg-dark text-white border-top linkSection animation"><span class="animation fadeOut">CREA</span></a>'+
'<a href="addWork.php" id="addWorkLink" class="list-group-item list-group-item-action" data-toggle="tooltip" data-placement="left" title="crea scavo"><i class="fas fa-code-branch fa-fw"></i><span class="animation fadeOut">scavo</span></a>'+
'<a href="#" class="list-group-item disabled bg-dark text-white linkSection animation"><span class="animation fadeOut">AGGIUNGI</span></a>'+
'<a href="#" id="incaricoLink" class="list-group-item list-group-item-action" data-toggle="tooltip" data-placement="left" title="aggiungi incarico"><i class="fas fa-euro-sign fa-fw"></i><span class="animation fadeOut">incarico</span></a>'+
'<a href="#" id="fatturaLink" class="list-group-item list-group-item-action" data-toggle="tooltip" data-placement="left" title="aggiungi fattura"><i class="fas fa-file-invoice fa-fw"></i><span class="animation fadeOut">fattura</span></a>'+
'<a href="#" id="operatoreLink" class="list-group-item list-group-item-action" data-toggle="tooltip" data-placement="left" title="crea operatore"><i class="fas fa-hard-hat fa-fw"></i><span class="animation fadeOut">operatore</span></a>'+
'<a href="addContatto.php" id="rubricaLink" class="list-group-item list-group-item-action" data-toggle="tooltip" data-placement="left" title="aggiungi un contatto in rubrica"><i class="fas fa-address-book fa-fw"></i><span class="animation fadeOut">contatto</span></a>'+
'<a href="#" class="list-group-item disabled bg-dark text-white linkSection animation"><span class="animation fadeOut">GESTISCI</span></a>'+
'<a href="#" id="accountLink" class="list-group-item list-group-item-action" data-toggle="tooltip" data-placement="left" title="gestisci account"><i class="fas fa-user-secret fa-fw"></i><span class="animation fadeOut">dati personali</span></a>'+
'<a href="#" id="utentiLink" class="list-group-item list-group-item-action" data-toggle="tooltip" data-placement="left" title="gestisci utenti"><i class="fas fa-users fa-fw"></i><span class="animation fadeOut">utenti</span></a></div>'+
'<div class="list-group list-group-flush logoutSec"><a href="logout.php" class="list-group-item list-group-item-action border-top bg-dark text-white" data-toggle="tooltip" data-placement="left" title="termina sessione di lavoro"><i class="fas fa-power-off fa-fw"></i><span class="animation fadeOut">logout</span></a></div>';
//-----------------------------------
