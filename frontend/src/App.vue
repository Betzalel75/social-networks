<template>
    <div>
        <router-link :to="{ name: 'Home' }"></router-link>
        <router-view>
        </router-view>
    </div>
</template>


<script>
export default {
    computed: {
        isLog() {
            return this.$store.state.isLogin;
        },
    },
    methods: {
        initConnexion() {
            if (this.isLog) {
                if (this.Ws == null || this.Ws.readyState !== 1) {
                    this.$store.dispatch("initChat");
                }
                if (this.Socket == null || this.Socket.readyState !== 1) {
                    this.$store.dispatch("initWebsocket");
                } else {
                    this.updateStatus(this.listUsers);
                }
            }
        },
    },
    mounted() {
        this.initConnexion();
    },
}
</script>
