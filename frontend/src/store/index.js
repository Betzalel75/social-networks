import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import websocketService from '../mixins/websocket';
import webSocketWs from '../mixins/appSocket';
import { reactive } from 'vue';

const state = reactive({
    allPosts: [], // Liste de tous les posts du profile
    publications: [], // Liste de publications du forum
    isLogin: false,
    postImage: {},
    localID: "",
    idUser: "",
    avatar: "defautl.jpg",
    avatarInvite: "defautl.jpg",
    errors: {}, // Objet erreur
    nickName: "",
    nickNameProfile: "",
    sokectStore: null, // websocket du store
    ws: null,
    dataMessages: [], // Tableau des messages envoyer par le websocket
    listUsers: [], // Tableau des utilisateurs complet
    users_online: [], // Tableau des utilisateurs en ligne
    suggestions: [], // Tableau des utilisateurs suggeres
    messages_restant: {},
    commentTab: [],
    visible: 0,
    postsUsers: [],
    nbrFollowers:"", // Nombre de Followers
    isFollowing: false, // Initialisez avec false si l'utilisateur n'est pas suivi par défaut
    nickNameGroupe: "",
    idGroupe: "",
    listGroups: [],
    notifs:[],
    showJoinGroupPopup: false,
    showAllNotifications : false, // Show all notifications
    external : [],
    lock: false,
});

const mutations = {
    setError(state, erreur){
        state.errors = erreur;
    },
    setAllPosts(state, allPosts) {
        state.allPosts = allPosts;
    },
    setNumberFollowers(state, numberFollowers) {
        state.nbrFollowers = numberFollowers;
    },
    setIsFollowing(state, isFollowing){
        state.isFollowing = isFollowing;
    },
    setSuggestions(state, users) {
        if (!users) return;
        if (state.suggestions.length > 0) {
            state.suggestions = [];
        }
        // console.table(users);
        for (const user of users) {
            if (user.UserID === state.localID) continue; // Ignore l'utilisateur
            state.suggestions.push(user);
        }
    },
    addAllPost(state, post) {
        if (state.allPosts && state.allPosts.length > 0) {
            state.allPosts.unshift(post);
        } else {
            state.allPosts = [post];
        }
    },
    setIsLogin(state, isLogin) {
        state.isLogin = isLogin;
    },
    setPostImage(state, postImage) {
        state.postImage = postImage;
    },
    setLocalID(state, localID) {
        state.localID = localID;
    },
    setIdUser(state, idUser) {
        state.idUser = idUser;
    },
    setAvatar(state, avatar) {
        if (avatar) {
            state.avatar = avatar;
        }else{
            state.avatar = "defautl.jpg";
        }
    },
    setAvatarInvite(state, avatarInvite) {
        if (avatarInvite) {
            state.avatarInvite = avatarInvite;
        }else{
            state.avatarInvite = "defautl.jpg";
        }
    },
    setNickName(state, nickName) {
        state.nickName = nickName;
    },
    SetSocketStore(state, sokectStore) {
        state.sokectStore = sokectStore;
    },
    SetWs(state, ws) {
        state.ws = ws;
    },
    addMessage(state, message) {
        state.dataMessages = message; // Remplacer les messages
    },
    setUsersOnline(state, users_online) {
        if (state.users_online.length > 0) {
            state.users_online = [];
        }
        for (const user of users_online) {
            if (user.UserID === state.localID) continue; // Ignore l'utilisateur
            state.users_online.push(user);
        }
    },
    setListUsers(state, listUsers) {
        if (state.listUsers.length > 0) {
            state.listUsers = [];
        }
        for (const user of listUsers) {
            if (user.UserID === state.localID) continue; // Ignore l'utilisateur
            state.listUsers.push(user);
        }
    },
    setMessages_restant(state, { user_id_chat, messages }) {
        // Utilisez la clé user_id_chat pour ajouter ou mettre à jour les messages
        // Pour ajouter ou mettre à jour une propriété
        state.messages_restant[user_id_chat] = messages;
    },
    resetMessages_restant(state) {
        state.messages_restant = {};
    },
    setComment(state, comment) {
        state.comment = comment;
    },
    resetVisible(state) {
        state.visible = 0;
    },
    incrementVisible(state) {
        state.visible++;
    },
    decrementVisible(state) {
        if (state.visible > 0) {
            state.visible--;
        }
    },
    setPublications(state, publications) {
        if (publications == null || publications == undefined) {
            state.publications = [];
        }else{
            state.publications = publications;
        }
    },
    setPublicationsUsers(state, publications) {
        state.postsUsers = publications;
    },
    setNickNameProfil(state, name) {
        state.nickNameProfile = name;
    },
    setNickNameGroupe(state, name){
        state.nickNameGroupe = name;
    },
    setGroup(state, group) {
        state.listGroups = group;
    },
    addGroup(state, group) {
        state.listGroups.push(group)
    },
    setIdGroupe(state, id) {
        state.idGroupe = id;
    },
    setNotifs(state, notifs) {
        state.notifs = notifs;
    },
    showJoinGroupPopup(state,bool) {
        state.showJoinGroupPopup = bool;
    },
    setShowAllNotifications(state, showAllNotifications) {
        state.showAllNotifications = showAllNotifications;
    },
    setExternal(state, external) {
        state.external = external;
    },
    setLock(state, blockTracking) {
        state.lock = blockTracking;
    },
}

const actions = {
    initWebsocket({ commit }) {
        const socket = new WebSocket("ws://localhost:8080/check");
        commit('SetSocketStore', socket);
        websocketService.methods.init();
    },

    initChat({ commit }) {
        const ws = new WebSocket("ws://localhost:8080/ws");
        commit("SetWs", ws);
        webSocketWs.methods.init();
    },
    sendMessage({ state }, data) {
        if (state.ws && state.ws.readyState === WebSocket.OPEN) {
            state.ws.send(JSON.stringify(data));
        } else {
            console.error("WebSocket is not open.");
        }
    },
    disconnect({ commit }) {
        commit('setAllPosts', []);
        commit('addMessage', []); // Corrected to 'addMessage'
        commit('setUsersOnline', []);
        commit('setListUsers', []);
        commit('setPublicationsUsers', []);
        commit('setIsLogin', false);
        commit('setPostImage', {});
        commit('setLocalID', "");
        commit('setIdUser', "");
        commit('setNickNameProfil', "");
        commit('setAvatarInvite', "defautl.jpg"); // set avatar to defautl.jpg for invited users
        commit('setAvatar', "defautl.jpg");
        commit('setNickName', "");
        commit('SetWs', null); // Réinitialiser la valeur du socket à null
        commit('SetSocketStore', null);
        commit('resetMessages_restant', {});
        commit('setComment', []);
        commit('resetVisible');
        commit('setPublications', []);
        commit('setError', {});
        commit('setSuggestions', []);
        commit('setNumberFollowers', "");
        commit('setIsFollowing', false);
        commit('setIdGroupe', "");
        commit('setGroup', []);
        commit('addGroup', []);
        commit('setNickNameGroupe', "");
        commit('setNotifs', []);
        commit('setShowAllNotifications', false);
        commit('setExternal', []);
    },
    addMessage({ commit }, message) {
        commit('addMessage', message);
    },
}

const getters = {
    allPosts: state => state.allPosts,
    isLogin: state => state.isLogin,
    postImage: state => state.postImage,
    localID: state => state.localID,
    idUser: state => state.idUser,
    avatar: state => state.avatar,
    avatarInvite: state => state.avatarInvite,
    nickName: state => state.nickName,
    nickNameProfile: state => state.nickNameProfile,
    postsUsers: state => state.postsUsers,
    sokectStore: state => state.sokectStore,
    dataMessages: state => state.dataMessages,
    users_online: state => state.users_online,
    listUsers: state => state.listUsers,
    suggestions: state => state.suggestions,
    messages_restant: state => state.messages_restant,
    commentTab: state => state.commentTab,
    ws: state => state.ws,
    visible: state => state.visible,
    publications: state => state.publications,
    errors: state => state.errors,
    nbrFollowers: state => state.nbrFollowers,
    isFollowing: state => state.isFollowing,
    nickNameGroupe: state => state.nickNameGroupe,
    listGroups: state => state.listGroups,
    idGroupe: state => state.idGroupe,
    notifs: state => state.notifs,
    showAllNotifications: state => state.showAllNotifications,
    external: state => state.external,
    lock: state => state.lock,
    showJoinGroupPopup: state => state.showJoinGroupPopup,
}



const store = createStore({
    state: state,
    mutations: mutations,
    getters: getters,
    actions: actions,
    // modules: {},
    plugins: [
        createPersistedState({
            paths: [
                // 'allPosts', // Persiste la liste de tous les posts du profile
                'isLogin', // Persiste l'état de connexion
                'localID', // Persiste l'ID de l'utilisateur
                'idUser', // Persiste l'ID de l'utilisateur indexe
                'nickName', // Persiste le pseudo de l'utilisateur
                'nickNameProfile', // Persiste le pseudo de l'utilisateur indexe
                'avatarInvite', // Persiste l'avatar de l'utilisateur indexe
                'avatar', // Persiste l'avatar de l'utilisateur
                // 'listGroups', // Persiste liste de groupe
                'idGroupe', // Persiste l'ID du groupe
                'nickNameGroupe', // Persiste le Nom du groupe
                // 'publications', // Persiste la liste de publications du forum
                // 'users_online', // Persiste les utilisateurs en ligne
            ]
        })
    ] // Utilisation de Vuex Persisted State comme plugin
});

export default store;