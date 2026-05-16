<script setup>

</script>

<template>
  <section class="contraseguri">
    <div class="logomascuenta">
      <svg width="50" height="50" viewBox="0 0 61 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M59.8525 25.3379L57.581 10.5759C57.4812 9.92683 57.1523 9.33489 56.654 8.90717C56.1557 8.47944 55.5207 8.24418 54.864 8.24393C39.8297 8.24393 32.1242 0.86293 32.0582 0.79968C31.543 0.28749 30.846 0 30.1195 0C29.393 0 28.696 0.28749 28.1807 0.79968C28.1037 0.86293 20.3982 8.24393 5.36397 8.24393C4.70724 8.24418 4.07229 8.47944 3.57395 8.90717C3.07561 9.33489 2.74679 9.92683 2.64697 10.5759L0.375467 25.3379C-0.643362 32.0437 0.423092 38.9006 3.43043 44.9802C6.43777 51.0599 11.2407 56.0685 17.189 59.3279L28.794 65.6529C29.198 65.8734 29.6509 65.9889 30.1112 65.9889C30.5715 65.9889 31.0244 65.8734 31.4285 65.6529L43.0335 59.3279C48.9827 56.0693 53.7868 51.061 56.7952 44.9813C59.8035 38.9016 60.8708 32.0443 59.8525 25.3379ZM40.4045 54.4879L30.114 60.1117L19.8235 54.4989C14.8645 51.7843 10.8595 47.6112 8.35091 42.5448C5.84232 37.4784 4.95128 31.7635 5.79847 26.1739L7.72347 13.6862C15.7526 13.5064 23.5468 10.9419 30.114 6.31893C36.6785 10.9413 44.4696 13.5067 52.4962 13.6889L54.4212 26.1739C55.2691 31.7626 54.3793 37.4769 51.8723 42.5432C49.3652 47.6095 45.362 51.7831 40.4045 54.4989V54.4879Z" fill="black"/>
      </svg>
      <h3>{{$t('pswsecu.title')}}</h3>
    </div>
    <p class="marginleft">{{$t('pswsecu.descripcion')}}</p>
    <div class="botones">
      <Button  class="button" :label="$t('pswsecu.cambiar')"></Button>
      <Button :label="$t('pswsecu.autenti')" class="button"></Button>
    </div>
  </section>
</template>
<style scoped>
  .logomascuenta{
    display: flex;
    flex-direction: row;
    justify-content: left ;
    align-items: center;
}
  .contraseguri{
    display: flex;
    flex-direction: column;
    max-width: 70rem;
    margin: 0 auto;
    font-family: Poppins;
    color: #000000;
  }
  .marginleft{
    margin-left: 3.1rem;
  }
  p{
    margin: 0;
  }
  h3{
    margin: 0;
  }
  .botones {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem auto;
    width: 100%;
    max-width: 60rem;
    padding: 0 1rem;
  }

  .button {
    color: #307D33;
    border: 1px solid #53C758;
    border-radius: 20px;
    padding: 1.25rem 1.5rem;
    width: 100%;
    font-size: 1rem;
    margin-bottom: 1rem;

  }
</style>