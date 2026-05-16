<script>
export default {
  name: 'ContactUsSectionComponent',
  data() {
    return {
      nombre: '',
      correo: '',
      numero: ''
    };
  },
  methods: {
    enviarFormulario() {
      alert(`Gracias por contactarnos, ${this.nombre}!\nTe responderemos al correo: ${this.correo}.`);
    }
  }
}
</script>

<template>
  <section class="container my-5" id="contactanos">
    <h1 class="text-center mb-4">{{ $t('homePage.contact') }}</h1>
    <div class="row">
      <div class="col-md-6 mb-4 mb-md-0">
        <!-- Mapa -->
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.118283054894!2d-76.96548598909544!3d-12.104054188087764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c70ab77498c1%3A0xcce9f50642e7c684!2sUniversidad%20Peruana%20de%20Ciencias%20Aplicadas!5e0!3m2!1ses-419!2spe!4v1744761111521!5m2!1ses-419!2spe"
            width="100%"
            height="350"
            style="border: 0; border-radius: 12px"
            allowfullscreen=""
            loading="lazy"
        >
        </iframe>
      </div>

      <div class="col-md-6">
        <!-- Formulario -->
        <form @submit.prevent="enviarFormulario">
          <div class="mb-3">
            <label class="form-label">{{ $t('homePage.name') }}</label>
            <input v-model="nombre" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">{{ $t('homePage.email') }}</label>
            <input v-model="correo" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">{{ $t('homePage.phone') }}</label>
            <input v-model="numero" type="tel" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-outline-light rounded-pill w-100">
            {{ $t('homePage.contact') }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
