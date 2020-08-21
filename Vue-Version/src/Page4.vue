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
        <div class="overall-sliders-container" style="float: left;">
        <!--Buttons/Sliders-->
        <div class="text section-body odd"> 
            <div style="width: 100%; float: left;">                 
                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="d_x"/>:
                    <span id="dx-display">0.5</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="dx" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0.5"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->
                
                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="d_y"/>:
                    <span id="dy-display">0</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="dy" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->

                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="d_z"/>:
                    <span id="dz-display">0</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="dz" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->         
                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="u_{k_x}"/>:
                    <span id="ukx-display">0</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="ukx" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->

                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="u_{k_y}"/>:
                    <span id="uky-display">0</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="uky" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->

                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="u_{k_z}"/>:
                    <span id="ukz-display">0.5</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="ukz" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0.5"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider-->
            </div>
    
        </div>

    </div>
        </iv-toggle-hotspot>

      </template> 

        <iv-legacy-wrapper :execute=execute id="main-vis" style="width: 50vw; height: 50vw; float: left; margin-right:2%; margin-top:3%">
            <canvas id="canvas-div"></canvas>
        </iv-legacy-wrapper>
        <div style="float: left;">
          <div style="width: 50%; float: left;">
            <iv-equation-box :stylise="false" equation="\textbf{k} = \frac{\pi}{a} \begin{bmatrix} d_x \\ d_y \\ d_z \end{bmatrix}"/>
          </div>
          <div style="width: 50%; float: left;">
            <iv-equation-box :stylise="false" equation="\textbf{k} \cdot \textbf{u}_\textbf{k} = "/>
              <span id = "dotproduct"> 123 </span>
          </div>
          <div style="width: 50%; float: left;">
            <iv-equation-box :stylise="false" equation="\textbf{k} \times \textbf{u}_\textbf{k} = "/>
              <span id = "crossproduct"> 456 </span>
          </div>
        </div>

    </iv-visualisation>
  </div>
</template>

<script>
import execute from './3D_d3canvas.js';

export default {
  data(){
    return {execute}
  }
}
</script>

<style>

</style>
