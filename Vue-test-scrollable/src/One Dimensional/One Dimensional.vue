<template>
  <div id="app">
    <iv-title-bar> Lattice Vibrations - One Dimensional </iv-title-bar>
    <iv-visualisation hotspotColumnHeight="100px">

      <template #hotspots>
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
          <iv-equation-box :stylise="false" equation="k = \frac{\pi}{a} d"/>
          <iv-equation-box :stylise="false" equation="d" />
          <iv-slider @sliderChanged="dChange" :colorBlock="green" :min="-10" :max="10" :init_val="0.1" :sliderName="'dSlider'" :unit="'test unit'" :step="0.01" />
          <iv-equation-box :stylise="false" equation="u_k"/>
          <iv-slider @sliderChanged="uChange" :colorBlock="green" :min="-1" :max="1" :init_val="0.1" :sliderName="'uSlider'" :unit="'test unit'" :step="0.01" />
        </iv-toggle-hotspot>

      </template> 

      <div style="display: block;">      
        <MainVis style="float:left; margin-right:10%;" :d="dSlider" :u="uSlider"></MainVis>
        <div style="display:grid;">
          <div style="display: block; height: 30%"> 
            <div style="float: left;">
              <iv-equation-box :stylise="false" equation="k" /> in the first Brillouin Zone
              <FBZ :d="dSlider"></FBZ>
            </div>
          </div>
          <Dispersion :d="dSlider"></Dispersion>
        </div>
      </div>



    </iv-visualisation>
  </div>
</template>

<script>
import MainVis from './1D_mainVis.vue';
import FBZ from './1D_FBZ.vue';
import Dispersion from './1D_dispersion.vue';

export default {
    name: 'One Dimensional',
    components:{
        MainVis,
        FBZ,
        Dispersion
    },
    data(){
        return{
            dSlider: this.init_d,
            uSlider: this.init_u
        }
    },
    props:{
        init_d: {
            default: 0.1,
        },
        init_u: {
            default: 0.1,
        }
    },
    methods:{
        dChange(e){
            this.dSlider = e;
        },
        uChange(e){
            this.uSlider = e;
        }
    }
}
</script>

<style>

</style>
