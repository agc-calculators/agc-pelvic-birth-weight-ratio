/*! Built with http://stenciljs.com */
const { h } = window.AgcPelvicBirthWeightRatio;

class AgcPelvicBirthWeightRatioSummary {
    constructor() {
        this.socket = "";
        this.ready = false;
    }
    render() {
        return (h("section", { "data-wizard-results": true, ref: c => this.section = c },
            h("div", { style: { display: this.ready ? 'none' : 'block' } },
                h("slot", { name: "empty" })),
            h("div", { style: { display: this.ready ? 'block' : 'none' } }, this.data && (h("ul", { class: "agc-results" },
                h("li", null,
                    h("h2", { "data-i18n": "results.heifer-weight" }, "Heifer Weight"),
                    h("span", { class: "agc-results__value" }, this.data['heiferWeight']),
                    h("sub", null, this.data['units']['weight'])),
                h("li", null,
                    h("h2", { "data-i18n": "results.heifer-age" }, "Heifer Age"),
                    h("span", { class: "agc-results__value" }, this.data['heiferAge']),
                    h("sub", { "data-i18n": "results.months" }, "months")),
                h("li", null,
                    h("h2", { "data-i18n": "results.pelvic-area" }, "Pelvic Area Measurement"),
                    h("span", { class: "agc-results__value" }, this.data['pelvicArea']),
                    h("sub", null, this.data['units']['pelvicArea'])),
                h("li", { class: "agc-results__output" },
                    h("h2", { "data-i18n": "results.deliverable-birth-weight" }, "Deliverable Birth Weight"),
                    h("span", { class: "agc-results__value" }, this.data['deliverableBirthWeight']),
                    h("sub", null, this.data['units']['weight'])))))));
    }
    handleResults(e) {
        if (e.detail['socket'] !== this.socket) {
            return;
        }
        this.data = Object.assign({}, e.detail['results']);
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
    static get is() { return "agc-pelvic-birth-weight-ratio-summary"; }
    static get properties() { return {
        "data": {
            "state": true
        },
        "ready": {
            "state": true
        },
        "socket": {
            "type": String,
            "attr": "socket"
        }
    }; }
}

export { AgcPelvicBirthWeightRatioSummary };
