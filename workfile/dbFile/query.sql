select scavo.id scavo, scavo.nome_lungo nome, scavo.sigla, us.us, sacchetto.inventario, sacchetto.numero, sacchetto.descrizione, reperto.materiale, reperto.tipologia
from scavo
inner join us on us.scavo = scavo.id
inner join sacchetto on sacchetto.us = us.id
inner join reperto on reperto.sacchetto = sacchetto.id
where scavo.id = 124
order by numero asc