export interface Lot {
    id: number | null;
    lotName: string;
    customerCode: string;
    price: number | null;
    currencyCode: string;
    ndsRate: string;
    placeDelivery: string;
    dateDelivery: string; // «YYYY-MM-DD HH:mm»
  }
  
  export const emptyLot: Lot = {
    id: null,
    lotName: '',
    customerCode: '',
    price: null,
    currencyCode: '',
    ndsRate: '',
    placeDelivery: '',
    dateDelivery: '',
  };
  