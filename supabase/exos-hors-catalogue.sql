-- Exercices qui ne viennent pas du catalogue, tous comptes confondus.
--
-- À quoi ça sert : savoir ce que les autres ont saisi à la main, pour ajouter
-- au catalogue ce qui y manque. Sans ça, personne ne peut le deviner : les
-- règles RLS font qu'un compte ne lit jamais les données d'un autre, et c'est
-- très bien ainsi.
--
-- Où l'exécuter : Supabase > SQL Editor, avec ton compte propriétaire du
-- projet. Le SQL Editor n'est pas soumis aux règles RLS — d'où la précaution
-- ci-dessous.
--
-- Ce que la requête sort, et rien d'autre : un nom d'exercice, d'où il vient
-- (programme ou historique) et le nombre de comptes concernés. Aucune charge,
-- aucune date, aucune note, aucun email, aucun identifiant de compte. C'est le
-- minimum nécessaire pour compléter le catalogue.
--
-- À lire avant de s'étonner : un compte qui n'a pas rouvert l'appli depuis la
-- version 1.15 n'a pas encore été rattaché au catalogue (le rattachement se
-- fait à l'ouverture, côté navigateur). Ses exercices sortiront ici sous leur
-- ancien nom — « Bench », « Rowing » — alors qu'ils sont déjà au catalogue.

with exos as (

  -- exercices du programme qui ne pointent sur aucune fiche
  select us.user_id,
         ex->>'name' as nom,
         'programme' as origine
  from public.user_state us,
       lateral jsonb_array_elements(coalesce(us.data->'sessions', '[]'::jsonb)) s,
       lateral jsonb_array_elements(coalesce(s->'exercises', '[]'::jsonb)) ex
  where coalesce(ex->>'libId', '') = ''

  union all

  -- exercices retirés du programme, qui n'existent plus que par l'historique
  select us.user_id,
         en->>'name' as nom,
         'historique' as origine
  from public.user_state us,
       lateral jsonb_array_elements(coalesce(us.data->'logs', '[]'::jsonb)) l,
       lateral jsonb_array_elements(coalesce(l->'entries', '[]'::jsonb)) en
  where not exists (
    select 1
    from jsonb_array_elements(coalesce(us.data->'sessions', '[]'::jsonb)) s2,
         jsonb_array_elements(coalesce(s2->'exercises', '[]'::jsonb)) ex2
    where ex2->>'id' = en->>'exerciseId'
  )
)
select nom,
       string_agg(distinct origine, ' + ') as origine,
       count(distinct user_id) as comptes
from exos
where coalesce(nom, '') <> ''
group by nom
order by comptes desc, nom;


-- ---------------------------------------------------------------------------
-- Si, et seulement si, un nom reste incompréhensible : savoir à qui demander.
--
-- Cette requête-là met un email en face d'un nom d'exercice. Elle sort du
-- principe « des noms, rien d'autre » : à n'utiliser que pour poser la
-- question à la personne, et rien de plus. Remplacer la liste de noms.
-- ---------------------------------------------------------------------------

-- select u.email, ex->>'name' as exercice
-- from public.user_state us
--      join auth.users u on u.id = us.user_id,
--      lateral jsonb_array_elements(coalesce(us.data->'sessions', '[]'::jsonb)) s,
--      lateral jsonb_array_elements(coalesce(s->'exercises', '[]'::jsonb)) ex
-- where ex->>'name' in ('Trapèze', 'Elevantion frontale');
