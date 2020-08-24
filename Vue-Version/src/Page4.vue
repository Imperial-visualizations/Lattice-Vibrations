<template>
  <div id="app">
  <iv-title-bar> Lattice Vibrations - Three Dimensional </iv-title-bar>
    <iv-visualisation hotspotColumnHeight="100px">

      <template #hotspots>

        <iv-pane position="left" style="overflow-y: scroll" format="push">
          <p>
              Finally, we look at a three dimensional infinite crystal lattice.
              This simulation is meant for completeness. 
              The colour coding here is to track layers of atoms.
              If this looks confusing for you, you may wish to return to the two dimensional case as it encompasses all the essentials of physics involved.
          </p>
          <p>A reminder of the general solution:
              <iv-equation-box :stylise="true" equation="\textbf{u}_n(t) = Re \sum_{\textbf{k}}\tilde{\textbf{u}}_\textbf{k} e^{i(\textbf{k} \cdot \textbf{R}_n - \omega_\textbf{k} t)}"/>
              For a single <iv-equation-box :stylise="false" equation="\textbf{k}"/>:
              <iv-equation-box :stylise="true" equation="\textbf{u}_n(t) = \textbf{u}_k \cos(\textbf{k} \cdot \textbf{R}_n-\omega_k t)"/>

              For any given <iv-equation-box :stylise="false" equation="\textbf{k}"/>:
              <iv-equation-box :stylise="true" equation="\omega^2_{\mathbf{k}} = 4 \omega^2_D \left[ \sin^2 \left(\frac{k_x a}{2} \right) + \sin^2 \left(\frac{k_y a}{2} \right) + \sin^2 \left(\frac{k_z a}{2} \right) \right]"/>
              where all the symbols have the same meanings as before.
          </p>
          <p>
              The types of waves available are still longitudinal, transverse or a combination of both.
              This is indicated by <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k|"/> and <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k|"/>.
          </p>
        </iv-pane>

        <iv-toggle-hotspot id="iv-toggle-hotspot-bottom" position="bottom" title="Sliders">
          <iv-equation-box :stylise="false" equation="\textbf{k} = \frac{\pi}{a} \begin{bmatrix} d_x \\ d_y \\ d_z \end{bmatrix}"/>
          <iv-equation-box :stylise="false" equation="d_x"/>
          <iv-slider @sliderChanged="dxChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'dxSlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="d_y"/>
          <iv-slider @sliderChanged="dyChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'dySlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="d_z"/>
          <iv-slider @sliderChanged="dzChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'dzSlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="u_{k_x}"/>
          <iv-slider @sliderChanged="uxChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'uxSlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="u_{k_y}"/>
          <iv-slider @sliderChanged="uyChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'uySlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="u_{k_z}"/>
          <iv-slider @sliderChanged="uzChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'uzSlider'" :unit="'test unit'" :step="0.01" />
        </iv-toggle-hotspot>

      </template> 

      <!--Main simulation-->
      <MainVis v-bind:dx="dxSlider" v-bind:dy="dySlider" v-bind:dz="dzSlider" v-bind:ux="uxSlider" v-bind:uy="uySlider" v-bind:uz="uzSlider"></MainVis>
      <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k| = "/>
      <iv-equation-box :stylise="false" :equation=dotProduct />
      <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k| = "/>
      <iv-equation-box :stylise="false" :equation=crossProduct />

    </iv-visualisation>
  </div>
</template>

<script>
import * as math from 'mathjs';
import MainVis from './components/3D_mainVis.vue';

export default {
    components:{
        MainVis,
    },
    props:{
        dxSlider: {
            default: 0.5,
        },
        dySlider: {
            default: 0.0,
        },
        dzSlider: {
            default: 0.0,
        },
        uxSlider: {
            default: 0.0,
        },
        uySlider: {
            default: 0.0,
        },
        uzSlider: {
            default: 0.5,
        },
        dotProduct: {
          default: "0.00",
        },
        crossProduct: {
          default: "0.79",
        }
    },
    methods:{        
        dxChange(e){
            this.dxSlider = e;
            this.dotAndCrossProducts();
        },
        dyChange(e){
            this.dySlider = e;
            this.dotAndCrossProducts();
        },
        dzChange(e){
            this.dzSlider = e;
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
        uzChange(e){
            this.uzSlider = e;
            this.dotAndCrossProducts();
        },
        dotAndCrossProducts(){
          let ukvec = [this.uxSlider, this.uySlider, this.uzSlider];
          let kvec = [this.dxSlider*Math.PI, this.dySlider*Math.PI, this.dzSlider*Math.PI];

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
