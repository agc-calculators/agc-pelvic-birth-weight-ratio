import { Component, Prop, State } from '@stencil/core';


@Component({
    tag: 'agc-pelvic-birth-weight-ratio-summary'
})
export class AgcPelvicBirthWeightRatioSummary {
    @Prop() socket: string = ""
    @State() data: any
    @State() ready: boolean = false
    section: HTMLElement;

    render() {
        return (
            <section data-wizard-results ref={c => this.section = c as HTMLElement}>
                <div style={{display: this.ready ? 'none' : 'block'}}>
                    <slot name="empty"></slot>
                </div>

                <div style={{display: this.ready ? 'block' : 'none'}}>
                    {this.data && (<ul class="agc-results">
                            <li>
                                <h2 data-i18n="results.heifer-weight">Heifer Weight</h2>
                                <span class="agc-results__value">{this.data['heiferWeight']}</span>
                                <sub>{this.data['units']['weight']}</sub>
                            </li>
                            <li>
                                <h2 data-i18n="results.heifer-age">Heifer Age</h2>
                                <span class="agc-results__value">{this.data['heiferAge']}</span>
                                <sub data-i18n="results.months">months</sub>
                            </li>
                            <li>
                                <h2 data-i18n="results.pelvic-area">Pelvic Area Measurement</h2>
                                <span class="agc-results__value">{this.data['pelvicArea']}</span>
                                <sub>{this.data['units']['pelvicArea']}</sub>
                            </li>
                            <li class="agc-results__output">
                                <h2 data-i18n="results.deliverable-birth-weight">Deliverable Birth Weight</h2>
                                <span class="agc-results__value">{this.data['deliverableBirthWeight']}</span>
                                <sub>{this.data['units']['weight']}</sub>
                            </li>
                                                      
                        </ul>)}
                </div>
            </section>
        );
    }

    handleResults(e:CustomEvent) {
        if (e.detail['socket'] !== this.socket) { return; }
        this.data = {...e.detail['results']};
        this.ready = true;
    }

    componentDidLoad() {
        // Global events allow the control to be separated from the form...
        if (!this.socket) {
            return;
        }
        window.document.addEventListener('agcCalculated', this.handleResults.bind(this));
    }

    componentDidUnload() {
        window.document.removeEventListener('agcCalculated', this.handleResults);
    }
}
