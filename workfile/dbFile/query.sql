select
  r.id,
  c.id as id_classe,
  c.value as classe,
  r.nome,
  r.email,
  r.indirizzo,
  r.cod_fisc,
  r.piva,
  r.telefono,
  r.mobile,
  r.web,
  r.note
from rubrica r, list.soggetto_rubrica c
where r.classe = c.id
order by nome, email, id asc;
