<script setup>

</script>

<template>

  <section class="Cuenta">
    <div class="logomascuenta">
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_471_3118)">
          <path d="M35.0006 5.83398C18.8861 5.83398 5.83398 18.8861 5.83398 35.0006C5.83398 51.1152 18.8861 64.1673 35.0006 64.1673C51.1152 64.1673 64.1673 51.1152 64.1673 35.0006C64.1673 18.8861 51.1152 5.83398 35.0006 5.83398ZM35.0006 14.584C39.8277 14.584 43.7506 18.5069 43.7506 23.334C43.7506 28.1756 39.8277 32.084 35.0006 32.084C30.1736 32.084 26.2507 28.1756 26.2507 23.334C26.2507 18.5069 30.1736 14.584 35.0006 14.584ZM35.0006 56.0007C27.6944 56.0007 21.2777 52.2673 17.5007 46.609C17.5736 40.8194 29.1819 37.6256 35.0006 37.6256C40.8194 37.6256 52.4131 40.8194 52.5006 46.609C48.7236 52.2673 42.3069 56.0007 35.0006 56.0007Z" fill="black"/>
        </g>
        <defs>
          <clipPath id="clip0_471_3118">
            <rect width="70" height="70" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      <h3>{{$t('cuenta.title')}}</h3>
    </div>
    <div class="cambiarfoto">
      <img src="https://elcomercio.pe/resizer/sXMn7piSRKXKUXgRptFvs-wfhk8=/980x528/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/KYL5BYZB6ZELTMJ45HCDBS4VII.jpg">
      <p>Gustavo Román</p>
      <Button class= "button" :label="$t('cuenta.foto')"></Button>
    </div>
    <div class="personaldata">
      <div class="titulomasparrafo">
        <h4>{{$t('cuenta.datos')}}</h4>
        <p>{{$t('cuenta.infodata')}}</p>
      </div>
      <div class="tabladatos">
        <div class="datos">
          <p>{{$t('cuenta.correo')}}</p>
          <p class="parrafo">thesanticrack@gmail.com</p>
          <hr>
        </div>
        <div class="datos">
          <p>{{$t('cuenta.numero')}}</p>
          <p class="parrafo">+51 987 654 321</p>
          <hr>
        </div>
        <div class="datos">
          <p>{{$t('cuenta.direccion')}}</p>
          <p class="parrafo">Jiron Condesuyos 136</p>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

.Cuenta{
  display: flex;
  flex-direction: column;

  max-width: 70rem;
  margin: 0 auto;
  font-family: Poppins;
}
.logomascuenta{
  display: flex;
  flex-direction: row;
  justify-content: left ;
}
.cambiarfoto img{
  height: 7rem;
  max-width: 7rem;
  border-radius: 50%;

}
.cambiarfoto{
  display: flex;
  border: 1px solid #53C758;
  border-radius: 15px;
  padding: 1rem;
  margin: 0 5rem;
  align-items: center;
  justify-content: space-between;
  max-width: 80rem;
}
.button{
  border: 1px solid #000000;
  border-radius: 40px;
  padding: 0.5rem 2rem;
}
.titulomasparrafo{

  margin: 2rem 50px;
}
.titulomasparrafo h4{
  font-size: 1.5rem;
}
.titulomasparrafo p{
  margin: 0;
}
p{
  margin: 0;
}
h4{
  margin: 0;
}
.tabladatos{
  display: flex;
  flex-direction: column;
  border: 1px solid #53C758;
  border-radius: 30px;
  padding: 1rem;
  max-width: calc(100% - 8rem);
  margin: 0 auto;


}
.datos hr{
  border: 1px solid #baf1ba;
}
.parrafo{
  text-align: center;
}
h3{
  font-family: Poppins;
}
@media (max-width: 768px) {
  .cambiarfoto{
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .logomascuenta{
    display: flex;
    justify-content: center;
  }
}
</style>