
import { Component } from '@stencil/core';


@Component({
    tag: 'agc-pelvic-birth-weight-ratio-results-placeholder'
})
export class AgcPelvicBirthWeightRatioResultsPlaceholder {

    

    render() {
        const placeholder = () => <span><i class="mark"></i> <i class="mark"></i> <i class="mark"></i> <i class="mark"></i></span>

        return (
            <section>
                <ul class="agc-results-placeholder">
                    <li>
                        <h2 data-i18n="results.birth-weight">Birth Weight</h2>
                        {placeholder()}
                    </li>                                      
                </ul>
            </section>
        );
    }
}