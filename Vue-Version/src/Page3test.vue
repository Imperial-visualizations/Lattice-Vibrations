<template>
  <div id="app">
  <iv-title-bar> Lattice Vibrations - Two Dimensional </iv-title-bar>
    <iv-visualisation hotspotColumnHeight="100px">

      <template #hotspots>

        <iv-pane position="right" style="overflow-y: scroll" format="push">
          <Dispersion v-bind:dx="dxSlider" v-bind:dy="dySlider"></Dispersion>
        </iv-pane>
        <iv-pane position="left" style="overflow-y: scroll" format="push">

          <p>
              Now consider an infinitely wide sheet of identical atoms.
              The most general solution is
              <iv-equation-box :stylise="true" equation="\textbf{u}_n(t) = Re \sum_{\textbf{k}}\tilde{\textbf{u}}_\textbf{k} e^{i(\textbf{k} \cdot \textbf{R}_n - \omega_\textbf{k} t)}"/>
              where
              <iv-equation-box :stylise="false" equation="\textbf{u}_n"/> is the displacement of the <iv-equation-box :stylise="false" equation="n^{th}"/> atom and <iv-equation-box :stylise="false" equation="\textbf{R}_n"/> is the lattice site that atom,
              and
              <iv-equation-box :stylise="false" equation="\textbf{k}"/> is the wavevector of each incoming wave.
          </p>
          <p>
              We simulate for a single <iv-equation-box :stylise="false" equation="\textbf{k}"/>:
              <iv-equation-box :stylise="true" equation="\textbf{u}_n(t) = \textbf{u}_\textbf{k} \cos(\textbf{k} \cdot \textbf{R}_n - \omega_k t)"/>

              For any given <iv-equation-box :stylise="false" equation="\textbf{k}"/>:
              <iv-equation-box :stylise="true" equation="\omega^2_{\mathbf{k}} = 4 \omega^2_D \left[ \sin^2 \left(\frac{k_x a}{2} \right) + \sin^2 \left(\frac{k_y a}{2} \right) \right]"/> 
              where
              <iv-equation-box :stylise="false" equation="\omega_D = \sqrt{\frac{\kappa}{m}}"/>,
              <iv-equation-box :stylise="false" equation="\kappa"/> is the spring constant,
              <iv-equation-box :stylise="false" equation="m"/> is the mass of a single atom,
              <iv-equation-box :stylise="false" equation="a"/> is the atomic spacing
              and
              <iv-equation-box :stylise="false" equation="\omega_D"/> is also known as the Debye frequency.
              We also assume <iv-equation-box :stylise="false" equation="a = \omega_D = 1"/> and <iv-equation-box :stylise="false" equation="\tilde{\textbf{u}}_\textbf{k}"/> has zero phase for simplicity.
          </p>
          <p>
              We also trace the wave, which travels at phase velocity <iv-equation-box :stylise="false" equation="\mathbf{v}=\frac{\mathbf{k}}{w}"/>.
          </p>
          <p>
              <iv-equation-box :stylise="false" equation="\textbf{u}_k"/> represents the response of the individual atoms to wave <iv-equation-box :stylise="false" equation="\textbf{k}"/>.
              Notice that <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k|"/> and <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k|"/>
              determine the type of wave: longitudinal, transverse or a combination of both. 
              Try making <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k| = 0"/> or <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k = 0|"/>.
              What are the types of wave you see in these respective cases?
          </p>   

        </iv-pane>

        <iv-toggle-hotspot id="iv-toggle-hotspot-bottom" position="bottom" title="Sliders">
          <iv-equation-box :stylise="false" equation="\textbf{k} = \frac{\pi}{a} \begin{bmatrix} d_x \\ d_y \end{bmatrix}"/>
          <iv-equation-box :stylise="false" equation="d_x"/>
          <iv-slider @sliderChanged="dxChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'dxSlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="d_y"/>
          <iv-slider @sliderChanged="dyChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'dySlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="u_{k_x}"/>
          <iv-slider @sliderChanged="uxChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'uxSlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="u_{k_y}"/>
          <iv-slider @sliderChanged="uyChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'uySlider'" :unit="'test unit'" :step="0.01" />
        </iv-toggle-hotspot>

      </template> 

      <!--Main simulation-->
      <MainVis v-bind:dx="dxSlider" v-bind:dy="dySlider" v-bind:ux="uxSlider" v-bind:uy="uySlider"></MainVis>
      <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k| = "/>
      <iv-equation-box :stylise="false" :equation=dotProduct />
      <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k| = "/>
      <iv-equation-box :stylise="false" :equation=crossProduct />

      <SVGSliders @SVGChanged="updateAll" v-bind:dx="dxSlider" v-bind:dy="dySlider" v-bind:ux="uxSlider" v-bind:uy="uySlider"></SVGSliders>

    </iv-visualisation>
  </div>
</template>

<script>
import * as math from 'mathjs';
import MainVis from './components/2D_mainVis.vue';
import SVGSliders from './components/2D_SVGSliders.vue';
import Dispersion from './components/2D_dispersion.vue';

export default {
    components:{
        MainVis,
        SVGSliders,
        Dispersion
    },
    props:{
        dxSlider: {
            default: 0.1,
        },
        dySlider: {
            default: 0.1,
        },
        uxSlider: {
            default: -0.5,
        },
        uySlider: {
            default: -0.5,
        },
        dotProduct: {
          default: "0.31",
        },
        crossProduct: {
          default: "0.00",
        }
    },
    methods:{
        updateAll(e){
          console.log(e);
        },
        dxChange(e){
            this.dxSlider = e;
            this.dotAndCrossProducts();
        },
        dyChange(e){
            this.dySlider = e;
            this.dotAndCrossProducts();
        },
        uxChange(e){
            this.uxSlider = e;
            this.dotAndCrossProducts();
        },
        uyChange(e){
            this.uySlider = e;
            this.dotAndCrossProducts();
        },
        dotAndCrossProducts(){
          let ukvec = [this.uxSlider, this.uySlider, 0];
          let kvec = [this.dxSlider*Math.PI, this.dySlider*Math.PI, 0];

          let dotproduct = Math.round(100*Math.abs(math.dot(kvec, ukvec)))/100;
          this.dotProduct = dotproduct.toString();

          let crossproduct = Math.round(Math.abs(100*Math.pow((Math.pow(math.cross(kvec, ukvec)[0], 2) + Math.pow(math.cross(kvec, ukvec)[1], 2) + Math.pow(math.cross(kvec, ukvec)[2], 2)), 0.5)))/100;
          this.crossProduct = crossproduct.toString();
        }
    }
}
</script>

<style>

</style>
