<template>
  <div id="app">
    <iv-title-bar> Lattice Vibrations - Introduction </iv-title-bar>
    <iv-visualisation hotspotColumnHeight="100px">

      <template #hotspots>
        <iv-pane position="left" style="overflow-y: scroll" format="push">
          <p>
              Given some solid, how can we model sound waves moving through it?
          </p>
          <p>
              Let us assume that this is a simple solid, made of identical atoms spaced evenly.
              We know that atoms in a solid lattice are held together by binding forces, for example ionic, covalent and metallic bonds.
              The Mie potential shown on the right is generally a good model for binding forces in solids.
          </p>
          <p>
              Let us model the binding forces using springs. 
              We model all atoms as connected to only their nearest neighbours by identical springs.
              This model is accurate in the small displacement limit, that is the low temperature limit.
          </p>
          <p>
              Let's explore this model. 
              We will start considering the simple case of a one dimensional lattice, building up the theory. 
              Here we will develop the concept of the first Brillouin Zone and how energy moves through the solid in the form of waves.
              Then we will look at a two dimensional lattice and consider transverse and longitudinal waves passing through the solid.
              We will continue to three dimensional solids for completeness.
          </p>
        </iv-pane>

      </template> 

      <!--Main simulation-->
      <iv-legacy-wrapper :execute=execute id="Mie-graph" style="margin-left: 5%; width: 1000px; height: 500px;"></iv-legacy-wrapper>

    </iv-visualisation>
  </div>
</template>

<script>
import execute from './Mie_d3SVG.js';

export default {
  data(){
    return {execute}
  }
}
</script>

<style>

</style>
