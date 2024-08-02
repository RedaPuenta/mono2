import { registerEnumType } from '@nestjs/graphql';

export enum ClaimReasonEnum {
  // Véhicule volé ou détruit
  NO_VEHICULE = 'NO-VEHICULE',
  // Pas le propriétaire du véhicule
  NOT_OWNER = 'NOT-OWNER',
  // Véhicule cédé ou vendu
  TRANSFERRED_VEHICULE = 'TRANSFERRED-VEHICULE',
  // Usurpation des plaques
  USURPATION = 'USURPATION',
  // Gratuité permanente valide
  USER_EXEMPTION = 'USER-EXEMPTION',
  // Gratuité temporaire valide
  PERIOD_EXEMPTION = 'PERIOD-EXEMPTION',
  // Ticket papier valide
  VALID_TICKET = 'VALID-TICKET',
  // Ticket dématérialisé valide
  VALID_ETICKET = 'VALID-ETICKET',
  // Montant du FPS incorrect
  WRONG_AMOUNT = 'WRONG-AMOUNT',
  // Déduction ticket incorrecte
  WRONG_DEDUCTION = 'WRONG-DEDUCTION',
  // Mauvais ticket déduit
  WRONG_TICKET = 'WRONG-TICKET',
  // FPS incomplet ou mal redigé
  INVALID_FPS = 'INVALID-FPS',
  // Précédent FPS valide
  VALID_PREVIOUS_FPS = 'VALID-PREVIOUS-FPS',
  // Précédent FPS avec date de validité mal calculé
  INVALID_PREVIOUS_FPS = 'INVALID-PREVIOUS-FPS',
  // Lieu de constatation erroné
  WRONG_LOCATION = 'WRONG-LOCATION',
  // Equipement de paiement hors service
  OUT_SERVICE_PAYMENT = 'OUT-SERVICE-PAYMENT',
  // Autres motif
  OTHER = 'OTHER',
}

registerEnumType(ClaimReasonEnum, {
  name: 'ClaimReasonEnum',
});
