<!-- src/shared/presentation/home-view.page.vue -->
<script setup>
import NavbarComponent from '@/shared/interfaces/presentation/nav-bar.component.vue'
import HeroSectionComponent from "@/shared/interfaces/presentation/hero-section.component.vue";
import AboutSectionComponent from "@/shared/interfaces/presentation/about-section.component.vue";
import ServiceSectionComponent from "@/shared/interfaces/presentation/service-section.component.vue";
import HowdoesitworkSection from "@/shared/interfaces/presentation/howdoesitwork-section.component.vue";
import PriceSectionComponent from "@/shared/interfaces/presentation/price-section.component.vue";
import ContactUsSectionComponent from "@/shared/interfaces/presentation/contactus-section.component.vue";
import ReviewSectionComponent from "@/shared/interfaces/presentation/review-section.component.vue";
import TheFooterComponent from "@/shared/interfaces/presentation/the-footer.component.vue";
</script>

<template>
  <NavbarComponent></NavbarComponent>
  <HeroSectionComponent></HeroSectionComponent>
  <AboutSectionComponent></AboutSectionComponent>
  <ServiceSectionComponent></ServiceSectionComponent>
  <HowdoesitworkSection></HowdoesitworkSection>
  <PriceSectionComponent></PriceSectionComponent>
  <ReviewSectionComponent></ReviewSectionComponent>
  <ContactUsSectionComponent></ContactUsSectionComponent>
  <TheFooterComponent></TheFooterComponent>
</template>

<style scoped>
/* Estilos opcionales */
</style>
