export interface Customer {
    customerCode: string;
    customerName: string;
    isOrganization: boolean | null;
    isPerson: boolean | null;
    customerInn: string;
    customerKpp: string;
    customerLegalAddress: string;
    customerPostalAddress: string;
    customerEmail: string;
    customerCodeMain: string;
  }
  
  export const emptyCustomer: Customer = {
    customerCode: '',
    customerName: '',
    isOrganization: false,
    isPerson: false,
    customerInn: '',
    customerKpp: '',
    customerLegalAddress: '',
    customerPostalAddress: '',
    customerEmail: '',
    customerCodeMain: '',
  };
  