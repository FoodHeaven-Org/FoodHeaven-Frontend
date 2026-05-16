<script setup>

</script>

<template>
  <section class="Sucripciones">
    <div class="logomastitulo">
      <svg width="62" height="60" viewBox="0 0 62 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.4741 2.53467C14.4053 4.22217 10.8209 6.75342 7.91469 9.94092C5.00844 13.1284 2.78031 16.8784 1.42406 20.9097C0.0678125 24.9409 -0.319687 29.2534 0.261562 33.5659C0.745937 37.7847 2.29594 41.9097 4.52406 45.5659C6.75219 49.2222 9.85219 52.3159 13.5334 54.7534C17.2147 57.1909 21.2834 58.7847 25.6428 59.5347C30.0022 60.2847 34.4584 60.0972 38.7209 59.0659C42.9834 58.0347 46.9553 56.0659 50.4428 53.3472L48.0209 50.4409C45.0178 52.7847 41.5303 54.4722 37.7522 55.4097C33.9741 56.3472 30.0991 56.5347 26.3209 55.8784C22.5428 55.2222 18.8616 53.8159 15.6647 51.6597C12.4678 49.5972 9.75531 46.7847 7.81781 43.5972C5.78344 40.4097 4.52406 36.8472 4.03969 33.1909C3.55531 29.4409 3.94281 25.6909 5.10531 22.1284C6.26781 18.5659 8.20531 15.2847 10.7241 12.4722C13.3397 9.65967 16.4397 7.50342 20.0241 6.00342L18.4741 2.53467Z" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M32.9102 38.9097C34.0727 38.2534 34.8477 37.0347 34.8477 35.6284C34.8477 33.5659 33.1039 31.8784 30.9727 31.8784C28.8414 31.8784 27.0977 33.5659 27.0977 35.6284C27.0977 37.0347 27.8727 38.2534 29.0352 38.9097V41.2534C29.0352 42.2847 29.907 43.1284 30.9727 43.1284C32.0383 43.1284 32.9102 42.2847 32.9102 41.2534V38.9097ZM43.5664 29.0659H18.3789V41.2534L30.9727 46.8784L43.5664 41.2534V29.0659Z" fill="black"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3477 30.9409C19.3477 30.3784 19.7352 30.0034 20.3164 30.0034H41.6289C42.2102 30.0034 42.5977 30.3784 42.5977 30.9409V33.7534C42.5977 39.2847 38.432 40.9722 32.9102 41.2534C32.9102 42.2847 32.0383 43.1284 30.9727 43.1284C29.907 43.1284 29.0352 42.2847 29.0352 41.2534C23.5133 40.9722 19.3477 39.3784 19.3477 33.7534V30.9409ZM20.3164 26.2534C17.6039 26.2534 15.4727 28.3159 15.4727 30.9409V33.7534C15.4727 42.0034 22.4477 48.7534 30.9727 48.7534C39.4977 48.7534 46.4727 42.0034 46.4727 33.7534V30.9409C46.4727 28.3159 44.3414 26.2534 41.6289 26.2534H20.3164Z" fill="black"/>
        <path d="M57.807 15.0035C61.8758 21.8472 63.0383 30.0972 60.907 37.7847C58.7758 45.4722 53.5445 52.0347 46.4727 55.9722L44.5352 52.691C50.7352 49.2222 55.2883 43.5035 57.1289 36.7535C58.9695 30.0035 58.0977 22.8785 54.4164 16.8785C50.832 10.8785 44.9227 6.47225 37.9477 4.691C31.0695 2.816 23.6102 3.7535 17.4102 7.316L15.4727 4.03475C22.5445 0.00349894 31.0695 -1.02775 39.0133 1.03475C46.957 3.09725 53.7383 8.15975 57.807 15.0035ZM38.7227 22.5035V30.0035H41.6289C42.2102 30.0035 42.5977 30.3785 42.5977 30.941V33.7535C42.5977 37.5972 40.6602 40.9722 37.657 43.0347L39.8852 46.1285C43.857 43.316 46.4727 38.816 46.4727 33.7535V30.941C46.4727 28.691 44.8258 26.816 42.5977 26.3472V22.5035C42.5977 16.316 37.3664 11.2535 30.9727 11.2535C24.5789 11.2535 19.3477 16.316 19.3477 22.5035V26.3472C19.6383 26.2535 20.0258 26.2535 20.3164 26.2535H23.2227V22.5035C23.2227 18.3785 26.7102 15.0035 30.9727 15.0035C35.2352 15.0035 38.7227 18.3785 38.7227 22.5035Z" fill="black"/>
      </svg>
      <h3>{{$t('sus.title')}}</h3>
    </div>
      <p class="left">{{ $t('sus.descripcion') }}</p>
    <div class="logotituloplan">
      <img src="https://i.imgur.com/r5tfrlF.png" alt="">
      <p><span class="verde">Food</span>Heaven</p>
      <Button class="Plan " label="Plan: Full"></Button>
    </div>

    <div class="Administrar">
      <p>{{$t('sus.administrar')}}</p>
      <div class="botones">
        <Button class= "boton" :label="$t('sus.verplan')"></Button>
        <Button class= "botona" :label="$t('sus.suscri')"></Button>
      </div>
      <p class="centro">{{$t('sus.last')}}</p>
    </div>
  </section>
</template>

<style scoped>
.Sucripciones{
  display: flex;
  flex-direction: column;
  max-width: 70rem;
  margin: 0 auto;
  font-family: Poppins;
  user-select: none;
}
.logomastitulo{
  display: flex;
  flex-direction: row;
  justify-content: left ;
}
.left{
  margin-left: 4rem;

}
.Administrar p{
  margin-left: 4rem;
}
.verde {
  color: limegreen;
}
.Plan{
  text-decoration: none;
  color: black;
  background-color: #ffc107;
  border-radius: 15px;
  padding: 5px 20px;

}
.logotituloplan{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 5rem;
  border: 1px solid #53C758;
  border-radius: 30px;
}
.logotituloplan img{
  height: 7rem;
  width: 7rem;
}

.botones{
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 3rem;
}
.boton{
  border: 1px solid limegreen;
  color: limegreen;
  border-radius: 5px;
  padding: 5px 80px;
}
.botona{
  background-color: orangered;
  color: white;
  border-radius: 5px;
  padding: 5px 20px;
}
.centro{
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
@media (max-width: 768px) {
  .logotituloplan{
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .botones{
    display: flex;
    flex-direction: column;

  }
}
</style>