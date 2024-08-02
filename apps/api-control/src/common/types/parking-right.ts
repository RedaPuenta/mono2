export type TariffType = 'SHORT_TERM' | 'SUBSCRIPTION' | 'FINE' | 'OFFSTREET';

export type ParkingRight = {
  id: string;
  externalParkingRightId: string;
  startDate: string;
  endDate: string;
  tariffType: TariffType;
  pointOfSaleId: string;
  clientId: number;
  customerName: string;
  usedMeansOfPayment: string;
  vehicleRegistrationPlateIdentifier: string;
  countryCode: string;
  parkingPermits: string[];
  duration: number;
  totalFreeDuration: number;
  includeFreeParking: boolean;
  chargePaid: number;
  chargeCurrency: string;
  urbanParkingSiteId: string[];
};

export type ParkingRightMin = {
  legacyId: string[];
  upsId: string;
  usedMeansOfPayment: string;
  tariffType: TariffType;
  startDate: string;
  endDate: string;
  status?: string;
};
