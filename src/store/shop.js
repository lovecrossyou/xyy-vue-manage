import { getResturants } from '@/api/getData'

const state = {
        shoplist: [],
        restaurant_id: null
}


const actions = {
        async getResturants({ dispatch, commit }, params) {
                const restaurants = await getResturants(params);
                let shoplist = [];
                restaurants.forEach(item => {
                        const tableData = {};
                        tableData.name = item.name;
                        tableData.address = item.address;
                        tableData.description = item.description;
                        tableData.id = item.id;
                        tableData.phone = item.phone;
                        tableData.rating = item.rating;
                        tableData.recent_order_num = item.recent_order_num;
                        tableData.category = item.category;
                        tableData.image_path = item.image_path;
                        shoplist.push(tableData);
                });
                commit('savelist', shoplist);
        },
}

const mutations = {
        savelist(state, payload) {
                state.shoplist = payload;
        },
        saveid(state, payload) {
                state.restaurant_id = payload;
        }
}

export default {
        namespaced: true,
        state,
        mutations,
        actions
}
