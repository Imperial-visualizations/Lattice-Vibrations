<template>
  <div id="app">
    <iv-title-bar> Lattice Vibrations - One Dimensional </iv-title-bar>
    <iv-visualisation hotspotColumnHeight="100px">

      <template #hotspots>

        <iv-pane position="right" style="overflow-y: scroll" format="push">
          <div id="dispersion-graph" style="width: 30vw; height: 25vw; float: left;"></div>
        </iv-pane>
        <iv-pane position="left" style="overflow-y: scroll" format="push">
              We start with the one dimensional case: 
              imagine having a chain of identical atoms.
              We then approximate their interactions to only be with nearest neighbours.
              We do this by saying that neighbouring atoms are connected by springs, all of which are identical.
              <br><br>
              The solution to this model is most easily dealt with when the infinite lattice approximation is made.
              This is where we approximate the solid size as much larger than the maximum displacement of individual atoms.
              This is physically acceptable as in reality, atom movements in solids are much smaller than the size of the solids.
          
              The most general solution is
              <iv-equation-box :stylise="true" equation="u_n(t) = Re \sum_{k}\tilde{u}_k e^{i(nka-\omega_kt)}"/>.
          
              This is a sum of an arbitrary number of waves, each with their own wavevector.                
              <iv-equation-box :stylise="false" equation="u_n"/> is the displacement of the <iv-equation-box :stylise="false" equation="n^{th}"/> atom from its equilibrium position
              and
              <iv-equation-box :stylise="false" equation="k"/> is the wavevector of the incoming wave.
              (Derivation is available at the end of this suite under the 'Derivation' button.)
              <br><br>
              Here we simulate for a single <iv-equation-box :stylise="false" equation="k"/>:
              <iv-equation-box :stylise="false" equation="u_n(t) = u_k \cos(nka-\omega_kt)"/>
          
              For any given <iv-equation-box :stylise="false" equation="k"/>:
              <iv-equation-box :stylise="true" equation="\omega_k = 2 \omega_D \left| \sin \left( \frac{k a}{2} \right) \right|"/>
              where
              <iv-equation-box :stylise="false" equation="\omega_D = \sqrt{\frac{\kappa}{m}}"/>
              <iv-equation-box :stylise="false" equation="\kappa"/> is the spring constant,
              <iv-equation-box :stylise="false" equation="m"/> is the mass of a single atom,
              <iv-equation-box :stylise="false" equation="a"/> is the atomic spacing
              and
              <iv-equation-box :stylise="false" equation="\omega_D"/> is also known as the Debye frequency.
              Here, we assume <iv-equation-box :stylise="false" equation="a = \omega_D = 1"/> and <iv-equation-box :stylise="false" equation="\tilde{u}_k"/> has zero phase for simplicity.
              <br><br>
              In general, the energy of an acoustic wave of angular frequency <iv-equation-box :stylise="false" equation="\omega_k"/> is
              <iv-equation-box :stylise="false" equation="E(k) = \hbar \omega_k"/>.
              <br><br>
              <iv-equation-box :stylise="false" equation="u_k"/> is the amplitude of the response of the individual atoms to wave mode <iv-equation-box :stylise="false" equation="k"/>.
              Notice that the overall motion is unaffected if <iv-equation-box :stylise="false" equation="2n \pi"/> for any integer <iv-equation-box :stylise="false" equation="n"/> is added to <iv-equation-box :stylise="false" equation="k"/>.
              Mathematically, this is due to the factor <iv-equation-box :stylise="false" equation="e^{i2n\pi} = 1"/> in the general solution.
              Physically, it makes sense due to the given trigonometric dispersion relation for <iv-equation-box :stylise="false" equation="\omega_k"/> - 
              <iv-equation-box :stylise="false" equation="k + 2n\pi"/> has the same energy as <iv-equation-box :stylise="false" equation="k"/>. 
              (Try adding integer multiple of 2 to the <iv-equation-box :stylise="false" equation="d"/> value!)
              <br><br>
              For the upcoming visualisations, we will ignore this redundancy by taking 
              <iv-equation-box :stylise="false" equation="-\pi \lt ka \leqslant \pi"/>, known as the first Brillouin Zone. 
              This applies to components in the higher dimensions too.
              <br><br>                       
              Also notice that when <iv-equation-box :stylise="false" equation="k \to \pm \pi"/> (i.e. <iv-equation-box :stylise="false" equation="d \to \pm 1"/>), there are two standing waves. 
              Neighbouring atoms move in anti-phase.
              (Reduce <iv-equation-box :stylise="false" equation="u_k"/> to see this effect better.)

        </iv-pane>

        <iv-toggle-hotspot id="iv-toggle-hotspot-bottom" position="bottom" title="Sliders">
        <div class="overall-sliders-container" style="float: left;">
            <iv-equation-box :stylise="false" equation="k = \frac{\pi}{a} d"/>
            <div style="width: 100%;">                 
                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="d"/>:
                    <span id="d-display">0.1</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-10</span>
                    <input id="d-range" class="inputs" max="10" min="-10" name="d" step="0.01" type="range" value="0.5"/>
                    <span class="sliderMax">10</span>
                </label>
                <input id="d-box" type="text" value="0.1"/>
                <!--END Slider--> 
            </div>
            <div style="width: 100%;">                 
                <!--BEGIN Slider-->
                <label class="slider-label">
                    <iv-equation-box :stylise="false" equation="u_k"/>:
                    <span id="uk-display">0.5</span>
                </label>
                <label class="slider">
                    <span class="sliderMin">-1</span>
                    <input id="uk-range" class="inputs" max="1" min="-1" name="r" step="0.01" type="range" value="0.5"/>
                    <span class="sliderMax">1</span>
                </label>
                <!--END Slider--> 
            </div>

        </div>
        </iv-toggle-hotspot>

      </template> 

        <!--Main simulation-->
        <iv-legacy-wrapper :execute=execute></iv-legacy-wrapper>
        <div id="main-vis" style="width: 50vw; height: 50vw; float: left;"></div>
        <!--Display k in the First Brillouin Zone-->
        <div class="text section-body odd" style="float: left">        
            <span> <iv-equation-box :stylise="false" equation="k"/> in the first Brillouin Zone</span>
            <iv-legacy-wrapper :execute=execute id='interactive-Circle' style="width: 20vw; height: 5vw;"></iv-legacy-wrapper>
        </div>

    </iv-visualisation>
  </div>
</template>

<script>
import execute from './1D_d3canvas.js';

export default {
  data(){
    return {execute}
  }
}
</script>

<style>

</style>
