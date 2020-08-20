<template>
  <div id="app">
  <iv-title-bar> Lattice Vibrations - Two Dimensional </iv-title-bar>
    <iv-visualisation hotspotColumnHeight="100px">

      <template #hotspots>

        <iv-pane position="right" style="overflow-y: scroll" format="push">
          <div id="dispersion-graph" style="width: 30vw; height: 25vw; float: left; margin-right:10%; margin-top:3%"></div>
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

        <!--Buttons/Sliders-->
        <div>
            <div style="width: 100%; float: left;">                 
                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="d_x"/>:
                    <span id="dx-display">0.1</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="dx-range" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0.1"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->
                
                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="d_y"/>:
                    <span id="dy-display">0.1</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="dy-range" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0.1"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->
                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="\textbf{u}_{k_x}"/>:
                    <span id="ukx-display">0.5</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="ukx-range" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0.5"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->

                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="\textbf{u}_{k_y}"/>:
                    <span id="uky-display">0.5</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="uky-range" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0.5"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->
            </div>
        
        </div>
        </iv-toggle-hotspot>

      </template> 
      <template #main-stage>
        <!--Visualisation main canvas-->
        <div id="main-vis" style="width: 50vw; height: 50vw; float: left; margin-right:2%; margin-top:3%"></div>
        
        <!--Interactive arrow element-->
        <div id='interactive-arrow' style="width: 17.5vw; height: 17.5vw; float: left;  margin-right: 1%"></div> 

        <div class="text section-body odd" style="float: left"> 
          <div style="width: 100%; float: left;">
            <iv-equation-box :stylise="false" equation="\textbf{k} = \frac{\pi}{a} \begin{bmatrix} d_x \\ d_y \end{bmatrix} "/>
          </div>
          <div style="width: 50%; float: left;">
              <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k| = "/>
              <span id = "dotproduct"> 123 </span>
          </div>
          <div style="width: 50%; float: left;">
              <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k| = "/>
              <span id = "crossproduct"> 456 </span>
          </div>
        </div>

      </template>
    </iv-visualisation>
  </div>
</template>

<script>
import execute from './2D_d3canvas.js';

export default {
  mounted() {
    execute()
  }
}
</script>

<style>

</style>
