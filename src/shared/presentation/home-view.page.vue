<!-- src/shared/presentation/home-view.page.vue -->
<script setup>
import NavbarComponent from '@/shared/presentation/nav-bar.component.vue'
import HeroSectionComponent from "@/shared/presentation/hero-section.component.vue";
import AboutSectionComponent from "@/shared/presentation/about-section.component.vue";
import ServiceSectionComponent from "@/shared/presentation/service-section.component.vue";
import HowdoesitworkSection from "@/shared/presentation/howdoesitwork-section.component.vue";
import PriceSectionComponent from "@/shared/presentation/price-section.component.vue";
import ContactUsSectionComponent from "@/shared/presentation/contactus-section.component.vue";
import ReviewSectionComponent from "@/shared/presentation/review-section.component.vue";
import TheFooterComponent from "@/shared/presentation/the-footer.component.vue";
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
