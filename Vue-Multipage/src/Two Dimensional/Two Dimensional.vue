<template>
  <div id="app">
  <iv-visualisation hotspotColumnHeight="100px" title="Lattice Vibrations - Two Dimensional">

    <template #hotspots>

      <iv-pane position="left" format="push">
        <iv-sidebar-content>
          <iv-sidebar-section title="Introduction">
            <p>
                Now consider an infinitely wide sheet of identical atoms.
                The most general solution is
                <iv-equation-box :stylise="true" equation="\textbf{u}_n(t) = Re \sum_{\textbf{k}}\tilde{\textbf{u}}_\textbf{k} e^{i(\textbf{k} \cdot \textbf{R}_n - \omega_\textbf{k} t)}"/>
                where
                <iv-equation-box :stylise="false" equation="\textbf{u}_n"/> is the displacement of the <iv-equation-box :stylise="false" equation="n^{th}"/> atom and <iv-equation-box :stylise="false" equation="\textbf{R}_n"/> is the lattice site that atom,
                and
                <iv-equation-box :stylise="false" equation="\textbf{k}"/> is the wavevector of each incoming wave.
            </p>
          </iv-sidebar-section>
          <iv-sidebar-section title="Derivation" icon="calculator" theme="Purple">
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
          </iv-sidebar-section>
          <iv-sidebar-section title="Instructions" theme="Lime" highlight icon="question">
        <p>
            <iv-equation-box :stylise="false" equation="\textbf{u}_k"/> represents the response of the individual atoms to wave <iv-equation-box :stylise="false" equation="\textbf{k}"/>.
            Notice that <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k|"/> and <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k|"/>
            determine the type of wave: longitudinal, transverse or a combination of both. 
            Try making <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k| = 0"/> or <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k = 0|"/>.
            What are the types of wave you see in these respective cases?
        </p>   
          </iv-sidebar-section>
        </iv-sidebar-content>
      </iv-pane>

    </template> 

    <div style="display: block;">      
      <MainVis style="float:left; margin-right:10%;" :dx="dxSlider" :dy="dySlider" :ux="uxSlider" :uy="uySlider"></MainVis>
      <div style="display:grid;">
        <div style="display: block;"> 
          <div style="width: 33%; float: left;">
            <iv-equation-box :stylise="false" equation="\textbf{k} = \frac{\pi}{a} \begin{bmatrix} d_x \\ d_y \end{bmatrix}"/>
          </div>
          <div style="width: 33%; float: left;">
            <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k| = "/>
            <iv-equation-box :stylise="false" :equation=dotProduct />
          </div>
          <div style="width: 33%; float: left;">
            <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k| = "/>
            <iv-equation-box :stylise="false" :equation=crossProduct />
          </div>
        </div>
        <SVGSliders ref='SVGSliders' @SVGChanged="updateAll" :dx="dxSlider" :dy="dySlider" :ux="uxSlider" :uy="uySlider"></SVGSliders>
        <Dispersion ref='DispersionSlider' @SVGChanged="updateAll" :dx="dxSlider" :dy="dySlider" :ux="uxSlider" :uy="uySlider"></Dispersion>
      </div>
    </div>

  </iv-visualisation>
  </div>
</template>

<script>
import * as math from 'mathjs';
import MainVis from './2D_mainVis.vue';
import SVGSliders from './2D_SVGSliders.vue';
import Dispersion from './2D_dispersion.vue';

export default {
    name: 'TwoDimensional',
    components:{
        MainVis,
        SVGSliders,
        Dispersion
    },
    data(){
        return{
            dxSlider: this.init_d,
            dySlider: this.init_d,
            uxSlider: this.init_u,
            uySlider: this.init_u,
            dotProduct: this.init_dot,
            crossProduct: this.init_cross,
        }
    },
    props:{
        init_d: {
            default: 0.1,
        },
        init_u: {
            default: 0.1,
        },
        init_dot: {
            default: "0.31",
        },
        init_cross: {
          default: "0.00",
        }
    },
    methods:{
        updateAll(e){
          this.dxSlider = e[0],
          this.dySlider = e[1],
          this.uxSlider = e[2],
          this.uySlider = e[3],
          this.$refs.SVGSliders.refresh(e);
          this.$refs.DispersionSlider.refresh(e);
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
