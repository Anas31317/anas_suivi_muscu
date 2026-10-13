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
 * Mode maintenance : quand il est à true, seule l'adresse ci-dessous entre
 * dans l'appli. Les autres comptes voient un écran « maintenance en cours ».
 *
 * C'est un garde-fou d'affichage, pas une sécurité : il tient les autres à
 * l'écart le temps d'un essai, il n'empêcherait pas quelqu'un de décidé. Ce
 * qui protège vraiment les données reste les règles RLS de la base.
 */
export const MAINTENANCE = true;
export const MAINTAINER_EMAIL = 'anas.hadouche@2029.icam.fr';
