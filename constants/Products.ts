// troforteProducts.ts

export interface TroforteProduct {
  category: 'CRF' | 'M' | 'Liquid';
  name: string;
  imageUrl: string;
  price: number;
}

export const troforteProducts: TroforteProduct[] = [
  // Troforte CRF products
  { category: 'CRF', name: 'Troforte CRF Pots and Plants', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/pots-plants.jpg', price: 14.99 },
  { category: 'CRF', name: 'Troforte CRF Fruits, Vegetables and Herbs', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/fruits-veg-herbs.jpg', price: 16.49 },
  { category: 'CRF', name: 'Troforte CRF Superfeeder', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/superfeeder.jpg', price: 18.99 },
  { category: 'CRF', name: 'Troforte Plant Tablets', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/plant-tablets.jpg', price: 12.99 },

  // Troforte M products
  { category: 'M', name: 'Troforte M All Purpose', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/m-all-purpose.jpg', price: 15.49 },
  { category: 'M', name: 'Troforte M Native', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/m-native.jpg', price: 17.99 },
  { category: 'M', name: 'Troforte Fert-O-Lawn', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/fert-o-lawn.jpg', price: 19.99 },
  { category: 'M', name: 'Troforte M Fruit and Citrus', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/m-fruit-citrus.jpg', price: 16.99 },
  { category: 'M', name: 'Troforte M Roses, Azaleas and Camellias', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/m-roses-azaleas-camellias.jpg', price: 18.49 },
  { category: 'M', name: 'Troforte M Vegetable and Herb', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/m-vegetable-herb.jpg', price: 15.99 },
  { category: 'M', name: 'Troforte M Rejuven8tor', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/rejuven8tor.jpg', price: 21.49 },
  { category: 'M', name: 'Troforte M Indoor & Patio', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/m-indoor-patio.jpg', price: 14.49 },

  // Troforte Liquid products
  { category: 'Liquid', name: 'Troforte Liquid All Purpose Fertiliser', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/liquid-all-purpose.jpg', price: 13.99 },
  { category: 'Liquid', name: 'Troforte Liquid Lawn Food', imageUrl: 'https://troforte.com.au/wp-content/uploads/2021/05/liquid-lawn-food.jpg', price: 14.99 },
];
