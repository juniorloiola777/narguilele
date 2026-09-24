-- Keep the original records recoverable while removing restricted merchandise
-- from the public catalog. New rows are unaffected by this historical cleanup.
update public.products
set is_active = false
where is_active = true
  and not (
    category_raw in ('REFRIGERANTE','APERITIVO','ENERGETICOS')
    or (category_raw = 'BEBIDAS' and name in ('AGUA COM GAS','AGUA DE COCO','AGUA SEM GAS','GELO SABORES'))
    or (category_raw = 'OUTROS' and name in ('BALA FINI','BOMBA TERERE','CHICLETE BUBBALOO','COPO TERERE','COUVERT ARTISTICO','CUIA','PULSEIRA PAGODINHO NO LELE','TAXA DE LIMPEZA'))
    or (category_raw = 'ACESSORIOS' and name in ('CORDAO NARGUILELE','INCENSO','PORTA INCENSO','PORTA INCENSO TORRE/BAU','TAPETES'))
  );
