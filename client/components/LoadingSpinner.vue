<template>
  <div class="loading">
    <img src="/icons/loading.png" />
  </div>
</template>

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rainbow {
  0% {
    background: #ff81a3;
  }
  50% {
    background: #6bcff9;
  }
  100% {
    background: #ff81a3;
  }
}

.loading {
  margin: 0 auto 25px auto;
  background: #f4f7fa;
  border-radius: 10px;
  display: block;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0.2rem 0.2rem 0.2rem rgba(153, 173, 198, 0.4);
}

.loading img {
  width: 24px;
  height: 24px;
  background: red;
  animation:
    spin 5s linear infinite,
    rainbow 20s linear infinite;
  transform-origin: 50% 50%;
  box-shadow: none;
  border: none;
}
</style>
