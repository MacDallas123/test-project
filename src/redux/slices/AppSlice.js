import { createSlice } from '@reduxjs/toolkit';

const fakeData = {
    users: [
    {
        id: 1,
        name: "Alice Dupont",
        email: "alice.dupont@email.com",
        phone: "+33612345678",
        type: "particulier",
        address: "12 Rue de la Paix, 75002 Paris, France"
    },
    {
        id: 2,
        name: "Jean Mbaye",
        email: "jean.mbaye@email.com",
        phone: "+221771234567",
        type: "candidat",
        address: "Rue Blaise Diagne, Dakar, Sénégal"
    },
    {
        id: 3,
        name: "Sophie Martin",
        email: "sophie.martin@email.com",
        phone: "+33698765432",
        type: "partenaire",
        address: "18 Avenue Victor Hugo, 69002 Lyon, France"
    },
    {
        id: 4,
        name: "Pierre Diallo",
        email: "pierre.diallo@email.com",
        phone: "+221781112233",
        type: "professionnel",
        address: "Avenue Cheikh Anta Diop, Dakar, Sénégal"
    }
    ],
    foods: [
    {
        id: 1,
        name: "Pizza Margherita",
        description: "Une pizza italienne classique avec sauce tomate, mozzarella et basilic frais.",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        restaurant: "Bella Italia",
        category: "Pizza",
        available: true,
        currency: "EUR"
    },
    {
        id: 2,
        name: "Poulet Yassa",
        description: "Poulet mariné dans le citron, les oignons et les épices, servi avec du riz.",
        price: 8.5,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        restaurant: "Saveurs du Sénégal",
        category: "Africain",
        available: true,
        currency: "XOF"
    },
    {
        id: 3,
        name: "Sushi Assorti",
        description: "Assortiment de sushis, nigiri et maki variés et frais.",
        price: 14.5,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
        restaurant: "Sakura",
        category: "Sushi",
        available: true,
        currency: "JPY"
    },
    {
        id: 4,
        name: "Burger Fromager",
        description: "Burger gourmet avec steak de boeuf, cheddar affiné, salade et tomate dans un pain brioché.",
        price: 12.0,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        restaurant: "Le Bistrot Burger",
        category: "Burger",
        available: true,
        currency: "EUR"
    },
    {
        id: 5,
        name: "Tacos Végétarien",
        description: "Tortilla garnie de légumes grillés, haricots noirs, salsa maison et guacamole.",
        price: 7.5,
        image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
        restaurant: "El Taco Loco",
        category: "Tacos",
        available: false,
        currency: "USD"
    }

    ]
}

const initialState = {
    user: null,
    cart: []
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cart.push(action.payload);
        },
        removeFromCart: (state, action) => {
            const newCart = state.cart.filter((elt) => elt.id !== action.payload);
            state.cart = newCart;
        },
        login: (state, action) => {

        },
        register: (state, action) => {

        }
    }
});

export const {
    addToCart,
    removeFromCart,
    login,
    register
} = appSlice.actions;

export default appSlice.reducer;
