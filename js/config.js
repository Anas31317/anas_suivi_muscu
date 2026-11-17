/**
 * Configuration Supabase.
 *
 * Ces deux valeurs sont PUBLIQUES par conception : elles sont visibles par
 * n'importe quel visiteur du site. La sécurité repose sur l'authentification
 * et les règles RLS de la base (voir supabase/schema.sql), pas sur leur secret.
 *
 * Ne JAMAIS mettre ici la clé "service_role" ou une clé "secret" : elles
 * contournent toutes les règles de sécurité.
 */

export const SUPABASE_URL = 'https://xkdsoqgqwhqnszbbpgen.supabase.co';

// Supabase > Project Settings > API Keys : clé "anon" (eyJ…) ou "publishable" (sb_publishable_…)
export const SUPABASE_ANON_KEY = 'sb_publishable_hlJbeCSEhyeuxzTlgV2-9w_zq4gZ-Zj';

/** Adresse à contacter pour demander un accès (email hors liste blanche). */
export const SUPPORT_EMAIL = 'anas.suivimuscu@gmail.com';

/** Longueur minimale des mots de passe (à régler aussi côté Supabase). */
export const PASSWORD_MIN_LENGTH = 10;

/**
 * Mode maintenance : quand il est à true, seul le compte ci-dessous entre
 * dans l'appli. Les autres comptes voient un écran « maintenance en cours ».
 *
 * Le mainteneur est reconnu à l'identifiant de son compte (Supabase >
 * Authentication > Users, colonne UID), pas à son email : l'identifiant ne
 * change pas quand on change d'email, et il ne dit rien de personnel dans un
 * dépôt public.
 *
 * C'est un garde-fou d'affichage, pas une sécurité : il tient les autres à
 * l'écart le temps d'un essai, il n'empêcherait pas quelqu'un de décidé. Ce
 * qui protège vraiment les données reste les règles RLS de la base.
 */
export const MAINTENANCE = false;
export const MAINTAINER_ID = 'ee064c0d-97e1-41c6-a397-b0257fe70402';
