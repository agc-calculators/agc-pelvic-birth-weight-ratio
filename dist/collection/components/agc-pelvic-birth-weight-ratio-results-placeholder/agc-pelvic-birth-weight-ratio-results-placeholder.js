export class AgcPelvicBirthWeightRatioResultsPlaceholder {
    render() {
        const placeholder = () => h("span", null,
            h("i", { class: "mark" }),
            " ",
            h("i", { class: "mark" }),
            " ",
            h("i", { class: "mark" }),
            " ",
            h("i", { class: "mark" }));
        return (h("section", null,
            h("ul", { class: "agc-results-placeholder" },
                h("li", null,
                    h("h2", { "data-i18n": "results.birth-weight" }, "Birth Weight"),
                    placeholder()))));
    }
    static get is() { return "agc-pelvic-birth-weight-ratio-results-placeholder"; }
}
