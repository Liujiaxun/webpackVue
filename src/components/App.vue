<template>
    <div class='app'>
        {{ num }}
    <br />
    <button @click='buttonClick'>点击</button>
    <br>
        <img src="../assets/25.gif" alt="">
    </div> 
</template>

<script>
    export default {
        name:'App',
        data(){
            return {
                num:1
            }
        },
        methods:{
            buttonClick(){
                this.num+=1;
            }
        }
    }
</script>

<style scoped>

</style>