<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <!--  <header>-->
  <!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

  <!--    <div class="wrapper">-->
  <!--      <HelloWorld msg="You did it!" />-->

  <!--      <nav>-->
  <!--        <RouterLink to="/">Home</RouterLink>-->
  <!--        <RouterLink to="/about">About</RouterLink>-->
  <!--      </nav>-->
  <!--    </div>-->
  <!--  </header>-->
  <div class="box">
    <div class="row header">
      <TheHeader />
    </div>
    <div class="row content">
      <p>body</p>
      <RouterView />
    </div>
    <div class="row footer">
      <TheFooter />
    </div>
  </div>
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}

.box {
  width: 1140px;
  display: flex;
  flex-flow: column;
  height: 100%;
}

.box .row {
  border: 1px dotted grey;
}

.box .row.header {
  flex: 0 1 auto;
}

.box .row.content {
  flex: 1 1 auto;
}

.box .row.footer {
  flex: 0 1 50px;
}
</style>
