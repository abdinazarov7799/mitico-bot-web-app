import {create} from "zustand";


const useStore = create((set) =>({
    orders: [],
    branchesIsOpen: true,
    setBranchesIsOpen: (branchesIsOpen) => set({ branchesIsOpen }),
    botWorked: true,
    setBotWorked: (botWorked) => set({ botWorked }),
    setOrders: (orders) => set(state => {
        return {...state, orders}
    }),
    addToOrder: (newOrder) => set((state) => {
        if (newOrder.count === 0 || newOrder.count === null) {
            const updatedOrders = state.orders.filter(order => order?.variationId !== newOrder?.variationId);
            return { ...state, orders: updatedOrders };
        } else {
            const existingOrderIndex = state.orders.findIndex(order => order?.variationId === newOrder?.variationId);
            if (existingOrderIndex !== -1) {
                const updatedOrders = [...state.orders];
                updatedOrders[existingOrderIndex] = newOrder;
                return { ...state, orders: updatedOrders };
            } else {
                return { ...state, orders: [...state.orders, newOrder] };
            }
        }
    }),
    increment: (item) =>
        set((state) => {
            const existingOrderIndex = state.orders.findIndex((order) => order?.variationId === item?.variationId);
            if (existingOrderIndex !== -1) {
                const updatedOrders = [...state.orders];
                updatedOrders[existingOrderIndex].count++;
                return { ...state, orders: updatedOrders };
            } else {
                const newItem = { ...item, count: 1};
                return { ...state, orders: [...state.orders, newItem] };
            }
        }),
    decrement: (variationId) =>
        set((state) => {
            const existingOrderIndex = state.orders.findIndex((order) => order?.variationId === variationId);
            if (existingOrderIndex !== -1 && state.orders[existingOrderIndex].count > 1) {
                const updatedOrders = [...state.orders];
                updatedOrders[existingOrderIndex].count--;
                return { ...state, orders: updatedOrders };
            }else {
                const updatedOrders = state.orders.filter(order => order?.variationId !== variationId);
                return { ...state, orders: updatedOrders };
            }
        }),
}))

export default useStore;
