<script setup>
</script>

<template>
  <h2>{{ $t('welcome')}} Gustavo Román¡</h2>

  <div class="bottons">
    <Button class="yellow" :label="$t('plan.full')" />
    <Button class="cyan" :label="$t('plan.change')" />
  </div>

  <div class="imagen">
    <img src="https://elcomercio.pe/resizer/sXMn7piSRKXKUXgRptFvs-wfhk8=/980x528/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/KYL5BYZB6ZELTMJ45HCDBS4VII.jpg" alt="foto" />
    <a class="green">{{ $t('subscription.expires', { days: 41 }) }}</a>
  </div>

  <div class="DatosPersonales">
    <p>{{ $t('account.name') }}</p>
    <a>Gustavo Román</a>
    <p>{{ $t('account.email') }}</p>
    <a>thesanticrack@gmail.com</a>
    <p>{{ $t('account.phone') }}</p>
    <a>+51 978 216 476</a>
    <p>{{ $t('account.city') }}</p>
    <a>Lima Metropolitana</a>
    <p>{{ $t('account.district') }}</p>
    <a>La Victoria</a>
    <p>{{ $t('account.address') }}</p>
    <a>Jiron Codesuyos 136</a>
    <Button class="confi" :label="$t('account.config')" />
  </div>
</template>

<style scoped>
  h2{
    font-family: Poppins;
    text-align: center;
    margin-top: 2rem;
  }
  Button{
    border-radius: 10px;
    font-family: Poppins;
    color: #ffff;
    font-weight: bold;
    user-select: none;
  }
  .yellow{
    background: #ffc107;
    padding: 8px 4rem;
  }
  .cyan{
    background: #6BAFCF;
    padding: 10px 2.7rem;
  }
  .bottons{
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
  img{
    height: 10rem;
    width: 10rem;
    border-radius: 100px;

  }
  .imagen{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
    user-select: none;

  }
  .green{
    background: #53C758;
    padding: 8px 7rem;
    border-radius: 10px;
  }
  .imagen a{
    margin-top: 10px;
    color: #ffff;
    font-family: Poppins;
    font-weight: bold;

  }

  .DatosPersonales{
    max-width: 25rem;
    display: flex;
    flex-direction: column;
    font-family: Poppins;
    margin: 0 auto;
    user-select: none;
  }
  .DatosPersonales a{
    text-align: center;
    border-radius: 20px;
    width: 100%;
    padding: 10px 0;
    border: 1px solid #53C758;
  }
  .confi{
    background: #000000;
    padding: 10px;
    margin: 2rem auto;

  }
</style>