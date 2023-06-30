select
      s.id
      , c.osm_id
      , c.name comune
      , s.nome_lungo nome
      , s.sigla
      , s.descrizione
      , extract('Y' from s.inizio) anno
      , max(ore.data) as last
    from scavo s
    LEFT JOIN localizzazione l ON l.scavo = s.id
    left join osm c on l.comune = c.osm_id
    left join ore on ore.scavo = s.id  WHERE osm_id = 47018 and extract('Y' from s.inizio) = 2023 group by s.id, c.osm_id, c.name, s.nome_lungo, s.sigla, s.descrizione
    order by last desc NULLS LAST, nome asc, anno desc;
