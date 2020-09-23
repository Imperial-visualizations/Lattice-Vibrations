<template>
  <div id="app">
    <iv-visualisation hotspotColumnHeight="100px" title="Lattice Vibrations - Three Dimensional">

      <template #hotspots>

        <iv-pane position="left" format="push">
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

          <iv-dropdown-text-box buttonText="Derivation">
                <p>
                    <br>
                    We first consider the one dimensional case of an infinite chain of identical atoms.
                    Let us label the atoms by an integer index <iv-equation-box :stylise="false" equation="n"/>, with positions <iv-equation-box :stylise="false" equation="x_{n}(t)"/> at time <iv-equation-box :stylise="false" equation="t"/>.
                    Let the mass of the individual atoms be <iv-equation-box :stylise="false" equation="m"/> and the equilibrium spacing be <iv-equation-box :stylise="false" equation="a"/> so that 
                    their equilibrium positions are <iv-equation-box :stylise="false" equation="x^{eqm}_{n} = n a"/>.
                    Denote the displacement of the <iv-equation-box :stylise="false" equation="n^{th}"/> atom as <iv-equation-box :stylise="false" equation="u_{n}(t)"/> so that
                    <iv-equation-box :stylise="true" equation="u_{n}(t) = x_{n}(t) - n a"/>

                    There are two approximations that we are taking: <br>
                    1. Small oscillations that allows simple harmonic approximation for the potential <br>
                    2. Interactions with only the nearest neighbours
                    <br><br>
                    The potential is central so we can write the total potential energy in the system as
                    <iv-equation-box :stylise="true" equation="V_{tot} = \frac{\kappa}{2} \sum_{n} (u_{n+1} - u_{n})^{2}"/>
                    
                    This can be interpreted as a chain of balls connected by springs obeying Hooke's Law with spring constant <iv-equation-box :stylise="false" equation="\kappa"/>.
                    <br><br>
                    The net force on the <iv-equation-box :stylise="false" equation="n^{th}"/> atom is 
                    <iv-equation-box :stylise="true" equation="F_{n} = - \frac{\partial V_{tot}}{\partial x_{n}} = \kappa (u_{n+1} + u_{n-1} - 2u_n)"/>
                    since, by chain rule, <iv-equation-box :stylise="false" equation="\frac{\partial }{\partial x_{n}} = \frac{d u_n}{d x_n} \frac{\partial }{\partial u_{n}} = \frac{\partial }{\partial u_{n}}"/>.
                    <br><br>
                    By Newton's second law, we have the equation of motion in terms of the displacement <iv-equation-box :stylise="false" equation="u_n"/>:
                    <iv-equation-box :stylise="true" equation="m \frac{d^2 u_n}{d t^2} = \kappa (u_{n+1} + u_{n-1} - 2u_n)"/>
                    for each <iv-equation-box :stylise="false" equation="n"/>.
                    <br><br>
                    This equation of motion takes the form of eigenfunction so we can try the solution
                    <iv-equation-box :stylise="true" equation="u_n(t) = \tilde{u}_k e^{i(nka - \omega t)}"/>
                    with the wavevector <iv-equation-box :stylise="false" equation="k"/> and frequency <iv-equation-box :stylise="false" equation="\omega"/>.
                    We will later find out the relationship between <iv-equation-box :stylise="false" equation="k"/> and <iv-equation-box :stylise="false" equation="\omega"/> called the dispersion relation or frequency spectrum
                    and hence label <iv-equation-box :stylise="false" equation="\omega = \omega_k"/>.
                    <br><br>
                    Due to the linearity of the equation of motion, we can make use of the Principle of Superposition to give a trial general solution
                    <iv-equation-box :stylise="true" equation="u_n(t) = Re \sum_{k}\tilde{u}_k e^{i(nka-\omega_kt)} "/>.
                    
                    Substituting the trial solution into the equation of motion gives 
                    <iv-equation-box :stylise="true" equation="-m \omega^2 \tilde{u}_k e^{i(nka-\omega_kt)} = \kappa \tilde{u}_k e^{i(nka-\omega_kt)} (e^{ika} + e^{-ika} - 2)"/>.

                    This must hold for all atoms <iv-equation-box :stylise="false" equation="n"/> and at all times <iv-equation-box :stylise="false" equation="t"/> so we can take out the common factor of <iv-equation-box :stylise="false" equation="e^{i(nka-\omega_kt)}"/>.
                    Since <iv-equation-box :stylise="false" equation="\tilde{u}_k = 0"/> corresponds to no motion at all, we must have a non-zero <iv-equation-box :stylise="false" equation="\tilde{u}_k"/>, which we can divide out.
                    We arrive at the dispersion relation for monatomic chain:
                    <iv-equation-box :stylise="true" equation="\omega^2_k = \frac{2 \kappa}{m} (1-\cos ka) = 4 \omega^2_D \sin^2 \left( \frac{k a}{2} \right)"/>
                    with
                    <iv-equation-box :stylise="true" equation="\omega_D = \sqrt{\frac{\kappa}{m}}"/>.
                    The dispersion relation is more conventionally written as 
                    <iv-equation-box :stylise="true" equation="\omega_k = 2 \omega_D \left| \sin \left( \frac{k a}{2} \right) \right|"/>
                    This derivation can be extended to higher dimensions.
                </p>

          </iv-dropdown-text-box>
        </iv-pane>

        <iv-toggle-hotspot position="bottom" title="Sliders">
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

      <div style="display: block;">      
        <MainVis style="float:left; margin-right:10%;" :dx="dxSlider" :dy="dySlider" :ux="uxSlider" :uy="uySlider"></MainVis>
        <div style="display:grid;">
          <div style="display: block;"> 
            <div style="width: 50%; float: left;">
              <iv-equation-box :stylise="false" equation="|\textbf{k} \cdot \textbf{u}_k| = "/>
              <iv-equation-box :stylise="false" :equation=dotProduct />
            </div>
            <div style="width: 50%; float: left;">
              <iv-equation-box :stylise="false" equation="|\textbf{k} \times \textbf{u}_k| = "/>
              <iv-equation-box :stylise="false" :equation=crossProduct />
            </div>
          </div>
        </div>
      </div>

    </iv-visualisation>
  </div>
</template>

<script>
import * as math from 'mathjs';
import MainVis from './3D_mainVis.vue';

export default {
    name: 'Three Dimensional',
    components:{
        MainVis,
    },
    data(){
        return{
            dxSlider: this.init_d,
            dySlider: this.init_null,
            dzSlider: this.init_null,
            uxSlider: this.init_null,
            uySlider: this.init_null,
            uzSlider: this.init_u,
            dotProduct: this.init_dot,
            crossProduct: this.init_cross,
        }
    },
    props:{
        init_null: {
            default: 0.0,
        },
        init_d: {
            default: 0.5,
        },
        init_u: {
            default: 0.5,
        },
        init_dot: {
            default: "0.00",
        },
        init_cross: {
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
