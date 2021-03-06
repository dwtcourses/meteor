<template>
    <div>
        <v-btn small @click="showNozzleDesignDialog = true">
            <v-icon left>mdi-ruler-square</v-icon>
            Nozzle design</v-btn>

        <v-dialog persistent ref="errorModal" width="470px" v-model="showNozzleDesignDialog">
            <v-app-bar dark color="primary">
                <v-toolbar-title>
                    Nozzle design tool
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark id="btnCloseNozzleDesign" @click="showNozzleDesignDialog = !formIsValid()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-app-bar>
            <v-card>

                <v-card-text>
                    <v-flex>
                        <v-alert
                            outlined
                            colored-border
                            border="left"
                            :value="!formIsValid()"
                            color="error"
                            icon="mdi-alert-box-outline">
                            The form should be valid to close the dialog
                        </v-alert>
                        <v-layout row>
                            <v-flex class="pl-5 pr-5 mt-5">
                                    <v-form ref="nozzleDesignForm">
                                        <v-text-field id="convergenceAngle" label="Convergence angle" suffix="°" v-model="value.convergenceAngle" :rules="rangeRules" step="0.01"></v-text-field>
                                        <v-text-field id="divergenceAngle" label="Divergence angle" suffix="°" v-model="value.divergenceAngle" :rules="rangeRules" step="0.01"></v-text-field>
                                    </v-form>
                                <div>
                                    <span class="label-nozzle-desing">Convergence length:&nbsp;</span>
                                    <span v-text="convergenceLenght"></span>
                                </div>
                                <div>
                                    <span class="label-nozzle-desing">Divergence length:&nbsp;</span>
                                    <span v-text="divergenceLenght"></span>
                                </div>
                                <div>
                                    <span class="label-nozzle-desing">Nozzle exit diameter:&nbsp;</span>
                                    <span v-text="`${performance.nozzleExitDiameter} ${units.lengthUnit}`">
                                    </span>
                                </div>
                                <h3 class="mt-5">Legend</h3>
                                <img src="../../assets/Nozzle_illustration.svg" width="100%"/>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { rangeRule } from '../../modules/formValidationRules'
import { computeNozzleLength } from '../../modules/computationUtils'

export default {
    name: 'NozzleDesign',
    data() {
        return {
            performance: { divergenceCrossSectionDiameter: 0, convergenceCrossSectionDiameter: 0, optimalDesign: true },
            showNozzleDesignDialog: false,
            rangeRules: rangeRule(1, 90)
        }
    },
    props: {
        value: { type: Object, default: () => { return { convergenceAngle: 60, divergenceAngle: 24 } } },
        units: Object
    },
    methods: {
        computeResult(sectionDiameter, angle) {
            const precision = this.units.lengthUnit === 'mm' ? 2 : 4
            return computeNozzleLength(sectionDiameter, angle).toFixed(precision) + ' ' + this.units.lengthUnit
        },
        formIsValid() {
            return this.$refs.nozzleDesignForm ? this.$refs.nozzleDesignForm.validate() : true
        }
    },
    computed: {
        divergenceLenght() {
            return this.computeResult(this.performance.divergenceCrossSectionDiameter, this.value.divergenceAngle)
        },
        convergenceLenght() {
            return this.computeResult(this.performance.convergenceCrossSectionDiameter, this.value.convergenceAngle)
        }
    }
}
</script>

<style lang="css">
    .label-nozzle-desing {
        font-weight: bold;
        width: 150px;
        display: inline-block;
    }
</style>
