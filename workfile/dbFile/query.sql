select 
  scavo.nome_lungo nome,
  scavo.sigla,
  us.us,
  initcap(tipo.value) tipo,
  us.compilazione,
  concat(users.cognome,' ',users.nome) compilatore,
  rubrica.nome direttore,
  us.definizione,
  area.area,
  area.saggio,
  area.settore,
  area.ambiente,
  area.quadrato, 
  regexp_replace(info.descrizione, E'(^[\\n\\r]+)|([\\n\\r]+$)', '', 'g' ) descrizione,
  initcap(info.criterio) criterio,
  initcap(info.formazione)formazione,
  initcap(affidabilita.value) affidabilita,
  initcap(consistenza.value) consistenza,
  initcap(info.colore) colore,
  initcap(conservazione.value) conservazione,
  info.interpretazione,
  info.osservazioni,
  info.elem_datanti "elementi datanti",
  info.periodo,
  info.dati_quantit "dati quantitativi reperti",
  info.modalita,
  info.datazione,
  array_to_string(array_agg(concat(rapporto.rapporto,' ',rapporti.us2) order by rapporto.rapporto), ',') rapporti 
  from us 
  inner join scavo on us.scavo = scavo.id 
  inner join list.tipo_us tipo on us.tipo = tipo.id 
  inner join users on us.compilatore = users.id 
  inner join rubrica on scavo.direttore = rubrica.id left join us_area area on area.us = us.id left join us_info info on info.us = us.id left join list.affidabilita_us affidabilita on affidabilita.id = info.affidabilita left join list.conservazione_us conservazione on conservazione.id = info.conservazione left join list.consistenza_us consistenza on consistenza.id = info.consistenza left join us_rapporti rapporti on rapporti.us = us.id left join list.rapporti_us rapporto on rapporti.rapporto = rapporto.id where us.scavo = 43 group by scavo.nome_lungo, scavo.sigla, us.us, tipo.value, us.compilazione, users.cognome,users.nome, rubrica.nome, us.definizione, area.area, area.saggio, area.settore, area.ambiente, area.quadrato, info.descrizione, info.criterio, info.formazione, affidabilita.value, consistenza.value, info.colore, conservazione.value, info.interpretazione, info.osservazioni, info.elem_datanti, info.periodo, info.dati_quantit, info.modalita, info.datazione order by us.us asc;