export interface ShopItem {
  id: number;
  name: string;
  description: string;
  image: string; // Path to image in /public
  price: number;
}

export const shopItems: ShopItem[] = [
  {
    id: 1,
    name: "Nintendo Switch",
    description: "Nintendo Switch Console, Extended Battery Life, Grey",
    image: "/images/shop/nintendo.jpg",
    price: 3000,
  },
  {
    id: 2,
    name: "Sudio Earpieces",
    description: "Sudio N2 White | True Wireless Earphones",
    image: "/images/shop/sudio_earphone.png",
    price: 1500,
  },
  {
    id: 3,
    name: "Grab food voucher",
    description: "S$15 off on your next GrabFood order",
    image: "/images/shop/grab_voucher.png",
    price: 200,
  },
  {
    id: 4,
    name: "Spotify Premium",
    description: "Spotify Premium 1 Month Subscription",
    image: "/images/shop/spotify.png",
    price: 200,
  },
]; 