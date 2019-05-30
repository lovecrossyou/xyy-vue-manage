import { detailArticle, listArticle } from '@/api/getData'

const state = {
        articlelist: [],
        article_id: null,
        articleInfo: {
                id: 0,
                title: "",
                sort_id: "",
                description: "",
                user_name: "猪猪侠",
                pic: "",
                read_type: 4,
                content: ""
        },

}

const actions = {
        async getDetail({ dispatch, commit, state }, article_id) {
                const articleInfo = await detailArticle(article_id);
                commit('save', articleInfo.data);
        },

        async list({ commit }) {
                const listInfo = await listArticle(article_id);
                commit('savelist', listInfo.data);
        }
}

const mutations = {
        save(state, payload) {
                state.articleInfo = payload;
        },
        saveid(state, payload) {
                state.article_id = payload;
        },
        savelist(state, payload) {
                state.articlelist = payload;
        }
}

export default {
        namespaced: true,
        state,
        mutations,
        actions
}
