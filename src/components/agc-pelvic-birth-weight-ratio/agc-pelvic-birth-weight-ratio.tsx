
import { Component, State, Event, EventEmitter, Prop } from '@stencil/core';
import { round, validate } from '../../utils'

@Component({
    tag: 'agc-pelvic-birth-weight-ratio'
})
export class AgcPelvicBirthWeightRatio {

    @Prop() socket: string = ""
    @Prop() tract: string = ""
    @Prop() units: any = { weight: 'lbs', pelvicArea: 'cm2' }
    @Prop() mode: 'full' | 'step' = 'step'
    @State() currentStep = 0
    @State() cache = {}
    @State() submitted = false
    @State() results = {}
    @Event({
        eventName: 'agcCalculated'
      }) agcCalculated: EventEmitter;
    @Event({
        eventName: 'agcStepChanged'
    }) agcStepChanged: EventEmitter;

    form: HTMLFormElement

    render() {
        return (
            <div>
                <form onSubmit={(e) => e.preventDefault()} ref={c => this.form = c as HTMLFormElement} data-wizard="agc-pelvic-birth-weight-ratio" 
                    data-wizard-mode={this.mode}
                    class="agc-wizard">
                    <slot></slot>
                    <section data-wizard-section="1">
                        <div class="agc-wizard__field">
                            <label data-i18n="fields.heifer-weight">Heifer Weight</label>
                            <select name="heiferWeight">
                                <option value="500" data-i18n="options.heifer-weight.500">500</option>
                                <option value="600" data-i18n="options.heifer-weight.600">600</option>
                                <option value="700" data-i18n="options.heifer-weight.700">700</option>
                                <option value="800" data-i18n="options.heifer-weight.800">800</option>
                                <option value="900" data-i18n="options.heifer-weight.900">900</option>
                                <option value="1000" data-i18n="options.heifer-weight.1000">1000</option>
                                <option value="1100" data-i18n="options.heifer-weight.1100">1100</option>
                            </select>
                            <p data-i18n="hints.heifer-weight">⮤ Select the nearest weight of the heifer at the time of the measurement.</p>
                        </div>
                        <div class="agc-wizard__actions">
                            {this.mode === 'step' && <button class="agc-wizard__actions-next" data-i18n="actions.next" onClick={this.nextPrev.bind(this, 1)}>Next 🠖</button>}
                        </div>
                    </section>
                    <section data-wizard-section="2">
                        <div class="agc-wizard__field">
                            <label data-i18n="fields.heifer-age">Heifer Age</label>
                            <select name="heiferAge">
                                <option value="8" data-i18n="options.heifer-age.8-months">8 - 9 Months</option>
                                <option value="12" data-i18n="options.heifer-age.12-months">12 - 13 Months</option>
                                <option value="18" data-i18n="options.heifer-age.18-months">18 - 19 Months</option>
                                <option value="22" data-i18n="options.heifer-age.22-months">22 - 23 Months</option>
                            </select>
                            <p data-i18n="hints.heifer-age">⮤ Select the nearest age of the heifer at the time of the measurement.</p>
                        </div>
                        <div class="agc-wizard__actions">
                            {this.mode === 'step' && [
                                <button class="agc-wizard__actions-prev" data-i18n="actions.prev" onClick={this.nextPrev.bind(this, -1)}>🠔 Back</button>,
                                <button class="agc-wizard__actions-next" data-i18n="actions.next" onClick={this.nextPrev.bind(this, 1)}>Next 🠖</button>]}
                        </div>
                    </section>
                    <section data-wizard-section="3">
                    <div class="agc-wizard__field">
                            <label data-i18n="fields.pelvic-area">Pelvic Area Measurement</label>
                            <input name="pelvicArea" type="number" required min="1" step=".01" />
                            <p class="agc-wizard__validation-message" data-i18n="validation.pelvic-area.required" data-validates="pelvicArea">Please enter a value.</p>
                            <p data-i18n={`hints.pelvic-area.${this.units['pelvicArea']}`}>⮤ Enter the actual pelvic area measurement in cm<sup>2</sup>.</p>
                        </div>
                        <div class="agc-wizard__actions">
                            {this.mode === 'step' && <button class="agc-wizard__actions-prev" data-i18n="actions.prev" onClick={this.nextPrev.bind(this, -1)}>🠔 Back</button>}
                            <button class="agc-wizard__actions-next" data-i18n="actions.finish" onClick={this.nextPrev.bind(this, this.mode === 'step' ? 1 : 3)}>Calculate 🠖</button>
                        </div>
                    </section>
                    <section data-wizard-results>                        
                        <slot name="results"></slot>                     
                    </section>
                </form>
            </div>
        );
    }

    showTab(n) {
        // This function will display the specified section of the form... 
        if (this.mode === 'step') {       
            this.cache['sections'][n].style.display = "block";
        }

        if (this.socket) {
            this.agcStepChanged.emit({socket: this.socket, tract: this.tract, step: this.currentStep})
        }
    }

    reset() {
        this.currentStep = 0
        this.submitted = false
        this.showTab(0)
    }

    validateForm () {
        let valid = true;

        if (this.currentStep === 2 || this.mode === 'full') {
           if (!validate(this.form, 'pelvicArea')) {
               valid = false
           }
        }

        return valid;
    }

    nextPrev(n, e) {
        e && e.preventDefault()
        if (this.mode === 'full') {
            if (!this.validateForm()) return false
        } else if (n == 1 && !this.validateForm()) return false

        // Hide the current tab:
        if (this.mode === 'step') {
            this.cache['sections'][this.currentStep].style.display = "none"
        }
        // Increase or decrease the current tab by 1:
        this.currentStep = this.currentStep + n
        // if you have reached the end of the form...
        if (this.currentStep >= this.cache['sections'].length) {
            // ... the form gets submitted:
            this.submitted = true
            this.showResults.call(this);
            return false;
        }
        // Otherwise, display the correct tab:
        this.showTab.call(this, this.currentStep);
    }

    showResults() {
        const ratios = {
            '500' : { '8': 1.7, '12': 2.0, '18': 2.0, '22': 2.0 }, 
            '600' : { '8': 1.8, '12': 2.1, '18': 2.1, '22': 2.1 }, 
            '700' : { '8': 1.9, '12': 2.2, '18': 2.6, '22': 2.6 }, 
            '800' : { '8': 2.3, '12': 2.3, '18': 2.7, '22': 3.1 }, 
            '900' : { '8': 2.4, '12': 2.4, '18': 2.8, '22': 3.2 }, 
            '1000' : { '8': 2.5, '12': 2.5, '18': 2.9, '22': 3.3 }, 
            '1100' : { '8': 3.4, '12': 3.4, '18': 3.4, '22': 3.4 }, 
        }

        let heiferWeight =  (this.form.querySelector('[name="heiferWeight"') as HTMLSelectElement).value;
        let heiferAge = (this.form.querySelector('[name="heiferAge"]') as HTMLSelectElement).value;
        let pelvicArea = round((this.form.querySelector('[name="pelvicArea"]') as HTMLInputElement).value, 2);
        let ratio = ratios[heiferWeight][heiferAge]
        let deliverableBirthWeight = round(pelvicArea / ratio, 0)

        let results = {
            socket: this.socket,
            tract: this.tract,
            units: this.units,
            heiferWeight,
            heiferAge,
            pelvicArea,
            ratio,
            deliverableBirthWeight
        }


        if (this.socket) {
            this.agcCalculated.emit({socket: this.socket, tract: this.tract, results: {...results}})
        }

        this.results = {...results}
        
        this.cache['results'].forEach(result => {
            result.style.display = 'block'
        })
    }

    handleAction(e:CustomEvent) {
        if (e.detail['action'] === 'reset') {
            this.reset();
        }
    }

    componentDidLoad() {
        var sections = Array.from(this.form.querySelectorAll('[data-wizard-section]')).map(c => c as any).map(c => c as HTMLElement)
        var results = Array.from(this.form.querySelectorAll('[data-wizard-results]')).map(c => c as any).map(c => c as HTMLElement)
        this.cache = {...this.cache, sections: sections, results: results}

        window.document.addEventListener('agcAction', this.handleAction.bind(this));

        (this.form.querySelector('[name="heiferWeight"]') as HTMLSelectElement).options[0].defaultSelected = true;
        (this.form.querySelector('[name="heiferAge"]') as HTMLSelectElement).options[0].defaultSelected = true;

        this.showTab(0)
    }

    componentDidUnload() {
        window.document.removeEventListener('agcAction', this.handleAction);
    }
}