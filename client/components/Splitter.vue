<template>
  <img src="/img/splitter.png" class="splitter" />
</template>

<style scoped>
.splitter {
  margin: -50px auto 30px auto;
  width: 450px;
  display: block;
}

@media (max-width: 600px) {
  .splitter {
    width: 100%;
    margin-top: -35px;
  }
}
</style>
