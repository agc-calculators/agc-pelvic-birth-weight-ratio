/*! Built with http://stenciljs.com */
const { h } = window.AgcPelvicBirthWeightRatio;

const validate = (form, name) => {
    let el = form.querySelector(`[name="${name}"]`);
    let message = form.querySelector(`[data-validates="${name}"`);
    if (!el.checkValidity()) {
        if (el.className.indexOf('invalid') === -1) {
            el.className += " invalid";
        }
        message.style.display = 'block';
        return false;
    }
    else {
        el.className = el.className.replace(" invalid", "");
        message.style.display = 'none';
    }
    return true;
};
const round = (num, places) => {
    return +(Math.round(new Number(`${num}e+${places}`).valueOf()) + "e-" + places);
};

class AgcPelvicBirthWeightRatio {
    constructor() {
        this.socket = "";
        this.tract = "";
        this.units = { weight: 'lbs', pelvicArea: 'cm2' };
        this.mode = 'step';
        this.currentStep = 0;
        this.cache = {};
        this.submitted = false;
        this.results = {};
    }
    render() {
        return (h("div", null,
            h("form", { onSubmit: (e) => e.preventDefault(), ref: c => this.form = c, "data-wizard": "agc-pelvic-birth-weight-ratio", "data-wizard-mode": this.mode, class: "agc-wizard" },
                h("slot", null),
                h("section", { "data-wizard-section": "1" },
                    h("div", { class: "agc-wizard__field" },
                        h("label", { "data-i18n": "fields.heifer-weight" }, "Heifer Weight"),
                        h("select", { name: "heiferWeight" },
                            h("option", { value: "500", "data-i18n": "options.heifer-weight.500" }, "500"),
                            h("option", { value: "600", "data-i18n": "options.heifer-weight.600" }, "600"),
                            h("option", { value: "700", "data-i18n": "options.heifer-weight.700" }, "700"),
                            h("option", { value: "800", "data-i18n": "options.heifer-weight.800" }, "800"),
                            h("option", { value: "900", "data-i18n": "options.heifer-weight.900" }, "900"),
                            h("option", { value: "1000", "data-i18n": "options.heifer-weight.1000" }, "1000"),
                            h("option", { value: "1100", "data-i18n": "options.heifer-weight.1100" }, "1100")),
                        h("p", { "data-i18n": "hints.heifer-weight" }, "\u2BA4 Select the nearest weight of the heifer at the time of the measurement.")),
                    h("div", { class: "agc-wizard__actions" }, this.mode === 'step' && h("button", { class: "agc-wizard__actions-next", "data-i18n": "actions.next", onClick: this.nextPrev.bind(this, 1) }, "Next \uD83E\uDC16"))),
                h("section", { "data-wizard-section": "2" },
                    h("div", { class: "agc-wizard__field" },
                        h("label", { "data-i18n": "fields.heifer-age" }, "Heifer Age"),
                        h("select", { name: "heiferAge" },
                            h("option", { value: "8", "data-i18n": "options.heifer-age.8-months" }, "8 - 9 Months"),
                            h("option", { value: "12", "data-i18n": "options.heifer-age.12-months" }, "12 - 13 Months"),
                            h("option", { value: "18", "data-i18n": "options.heifer-age.18-months" }, "18 - 19 Months"),
                            h("option", { value: "22", "data-i18n": "options.heifer-age.22-months" }, "22 - 23 Months")),
                        h("p", { "data-i18n": "hints.heifer-age" }, "\u2BA4 Select the nearest age of the heifer at the time of the measurement.")),
                    h("div", { class: "agc-wizard__actions" }, this.mode === 'step' && [
                        h("button", { class: "agc-wizard__actions-prev", "data-i18n": "actions.prev", onClick: this.nextPrev.bind(this, -1) }, "\uD83E\uDC14 Back"),
                        h("button", { class: "agc-wizard__actions-next", "data-i18n": "actions.next", onClick: this.nextPrev.bind(this, 1) }, "Next \uD83E\uDC16")
                    ])),
                h("section", { "data-wizard-section": "3" },
                    h("div", { class: "agc-wizard__field" },
                        h("label", { "data-i18n": "fields.pelvic-area" }, "Pelvic Area Measurement"),
                        h("input", { name: "pelvicArea", type: "number", required: true, min: "1", step: ".01" }),
                        h("p", { class: "agc-wizard__validation-message", "data-i18n": "validation.pelvic-area.required", "data-validates": "pelvicArea" }, "Please enter a value."),
                        h("p", { "data-i18n": `hints.pelvic-area.${this.units['pelvicArea']}` },
                            "\u2BA4 Enter the actual pelvic area measurement in cm",
                            h("sup", null, "2"),
                            ".")),
                    h("div", { class: "agc-wizard__actions" },
                        this.mode === 'step' && h("button", { class: "agc-wizard__actions-prev", "data-i18n": "actions.prev", onClick: this.nextPrev.bind(this, -1) }, "\uD83E\uDC14 Back"),
                        h("button", { class: "agc-wizard__actions-next", "data-i18n": "actions.finish", onClick: this.nextPrev.bind(this, this.mode === 'step' ? 1 : 3) }, "Calculate \uD83E\uDC16"))),
                h("section", { "data-wizard-results": true },
                    h("slot", { name: "results" })))));
    }
    showTab(n) {
        // This function will display the specified section of the form... 
        if (this.mode === 'step') {
            this.cache['sections'][n].style.display = "block";
        }
        if (this.socket) {
            this.agcStepChanged.emit({ socket: this.socket, tract: this.tract, step: this.currentStep });
        }
    }
    reset() {
        this.currentStep = 0;
        this.submitted = false;
        this.showTab(0);
    }
    validateForm() {
        let valid = true;
        if (this.currentStep === 2 || this.mode === 'full') {
            if (!validate(this.form, 'pelvicArea')) {
                valid = false;
            }
        }
        return valid;
    }
    nextPrev(n, e) {
        e && e.preventDefault();
        if (this.mode === 'full') {
            if (!this.validateForm())
                return false;
        }
        else if (n == 1 && !this.validateForm())
            return false;
        // Hide the current tab:
        if (this.mode === 'step') {
            this.cache['sections'][this.currentStep].style.display = "none";
        }
        // Increase or decrease the current tab by 1:
        this.currentStep = this.currentStep + n;
        // if you have reached the end of the form...
        if (this.currentStep >= this.cache['sections'].length) {
            // ... the form gets submitted:
            this.submitted = true;
            this.showResults.call(this);
            return false;
        }
        // Otherwise, display the correct tab:
        this.showTab.call(this, this.currentStep);
    }
    showResults() {
        const ratios = {
            '500': { '8': 1.7, '12': 2.0, '18': 2.0, '22': 2.0 },
            '600': { '8': 1.8, '12': 2.1, '18': 2.1, '22': 2.1 },
            '700': { '8': 1.9, '12': 2.2, '18': 2.6, '22': 2.6 },
            '800': { '8': 2.3, '12': 2.3, '18': 2.7, '22': 3.1 },
            '900': { '8': 2.4, '12': 2.4, '18': 2.8, '22': 3.2 },
            '1000': { '8': 2.5, '12': 2.5, '18': 2.9, '22': 3.3 },
            '1100': { '8': 3.4, '12': 3.4, '18': 3.4, '22': 3.4 },
        };
        let heiferWeight = this.form.querySelector('[name="heiferWeight"').value;
        let heiferAge = this.form.querySelector('[name="heiferAge"]').value;
        let pelvicArea = round(this.form.querySelector('[name="pelvicArea"]').value, 2);
        let ratio = ratios[heiferWeight][heiferAge];
        let deliverableBirthWeight = round(pelvicArea / ratio, 0);
        let results = {
            socket: this.socket,
            tract: this.tract,
            units: this.units,
            heiferWeight,
            heiferAge,
            pelvicArea,
            ratio,
            deliverableBirthWeight
        };
        if (this.socket) {
            this.agcCalculated.emit({ socket: this.socket, tract: this.tract, results: Object.assign({}, results) });
        }
        this.results = Object.assign({}, results);
        this.cache['results'].forEach(result => {
            result.style.display = 'block';
        });
    }
    handleAction(e) {
        if (e.detail['action'] === 'reset') {
            this.reset();
        }
    }
    componentDidLoad() {
        var sections = Array.from(this.form.querySelectorAll('[data-wizard-section]')).map(c => c).map(c => c);
        var results = Array.from(this.form.querySelectorAll('[data-wizard-results]')).map(c => c).map(c => c);
        this.cache = Object.assign({}, this.cache, { sections: sections, results: results });
        window.document.addEventListener('agcAction', this.handleAction.bind(this));
        this.form.querySelector('[name="heiferWeight"]').options[0].defaultSelected = true;
        this.form.querySelector('[name="heiferAge"]').options[0].defaultSelected = true;
        this.showTab(0);
    }
    componentDidUnload() {
        window.document.removeEventListener('agcAction', this.handleAction);
    }
    static get is() { return "agc-pelvic-birth-weight-ratio"; }
    static get properties() { return {
        "cache": {
            "state": true
        },
        "currentStep": {
            "state": true
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "results": {
            "state": true
        },
        "socket": {
            "type": String,
            "attr": "socket"
        },
        "submitted": {
            "state": true
        },
        "tract": {
            "type": String,
            "attr": "tract"
        },
        "units": {
            "type": "Any",
            "attr": "units"
        }
    }; }
    static get events() { return [{
            "name": "agcCalculated",
            "method": "agcCalculated",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "agcStepChanged",
            "method": "agcStepChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
}

export { AgcPelvicBirthWeightRatio };
