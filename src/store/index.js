import Vue from 'vue'
import Vuex from 'vuex'
import { getAdminInfo } from '@/api/getData'

import shop from "./shop"
import article from "./article"
Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'http://static.kuaimayoupin.com/16a17111a44.png',
		id: null
	},
}

const mutations = {
	saveAdminInfo(state, adminInfo) {
		state.adminInfo = adminInfo;
	}
}

const actions = {
	async getAdminData({ commit }) {
		try {
			const res = await getAdminInfo()
			if (res.status == 1) {
				commit('saveAdminInfo', res.data);
			} else {
				throw new Error(res.type)
			}
		} catch (err) {
			// console.log(err.message)
		}
	}
}

export default new Vuex.Store({
	modules: {
		shop,
		article
	},
	state,
	actions,
	mutations,
})
